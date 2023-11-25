const { PrismaClient, StatusPayment } = require("@prisma/client");
const { STATUS_CODES } = require("http");
const prisma = new PrismaClient();
const { StatusCodes } = require("http-status-codes");
const { PaymentGateway } = require("../../utils/midtrans");
const midtransClient = require("midtrans-client");
const crypto = require("crypto");
const config = require("../../config");
const moment = require('moment-timezone');

const createOrder = async (req, res) => {
  const userId = req.user.id;

  try {
    const existingCart = await prisma.cart.findMany({
      where: { userId: userId },
      select: {
        quantity: true,
        totalprice: true,
        itemsId: true,
        item: {
          select: {
            id: true,
            id_category: true,
            name: true,
            slug: true,
            price: true,
            address: true,
            description: true,
          },
        },
      },
    });

    const itemDetails = existingCart.map((cartItem) => {
      const item = {
        id: cartItem.item.id, // Sesuaikan dengan cara Anda ingin menghasilkan ID
        price: cartItem.item.price,
        quantity: cartItem.quantity,
        name: cartItem.item.name, // Sesuaikan sesuai kebutuhan
      };
      return item;
    });

    const user = await prisma.user.findUnique({
      where: {
        email: req.user.email,
      },
    });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User Not Found",
      });
    }

    const payloadString = JSON.stringify(existingCart);

    if (!existingCart || existingCart.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: "Cart not found",
      });
    }

    // Menjumlahkan totalPrice untuk setiap cart
    const totalCartPrice = existingCart.reduce((acc, cart) => {
      return acc + cart.totalprice;
    }, 0);

    const trxId = "INV-" + Math.floor(Math.random() * 99999);

    const paymentGateway = await PaymentGateway(
      totalCartPrice,
      trxId,
      itemDetails,
      user
    );

    const newOrder = await prisma.orderCart.create({
      data: {
        userId,
        trxId: trxId,
        items: {
          connect: existingCart.map((cart) => ({ id: cart.itemsId })),
        },
        totalCartPrice: totalCartPrice,
        linkPayment: paymentGateway.res,
        cartData: payloadString,
        created_at: new Date(),
      },
      select: {
        trxId: true,
        linkPayment: true,
        statusPayment: true,
        cartData: true,
      },
    });

    await prisma.cart.deleteMany({
      where: {
        userId,
      },
    });


    // Comvert String To Json
    const payloadJson = JSON.parse(newOrder.cartData);

    res.status(StatusCodes.CREATED).json({
      success: true,
      trxId: newOrder.trxId,
      linkPayment: newOrder.linkPayment,
      data: payloadJson,
      stasutPayment: newOrder.statusPayment,
    });
  } catch (error) {
    console.error("Error creating an order:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

const getAllOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await prisma.orderCart.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        trxId: true,
        totalCartPrice: true,
        linkPayment: true,
        paymentType: true,
        detetimePayment: true,
        statusPayment: true,
        statusOrder: true,
        cartData: true
      }
    });
    
    const resOrders = orders.map((order) => {
      const convertDate = moment(order.detetimePayment).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
      return {
        id: order.id,
      userId: order.userId,
      trxId: order.trxId,
      totalCartPrice: order.totalCartPrice,
      linkPayment: order.linkPayment,
      paymentType: order.paymentType,
      detetimePayment: convertDate,
      statusPayment: order.statusPayment,
      statusOrder: order.statusOrder,
      cartData: JSON.parse(order.cartData),
      }
    });
  

    res.status(StatusCodes.OK).json({ success: true, data: resOrders });
  } catch (err) {
    console.error("Error getting orders:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: err.message || "Internal Server Error",
    });
  }
};

const updateStatusOrder = async(req, res) => {
  const {id} = req.params
  const {statusOrder} = req.body 
  try {
    const orders = await prisma.orderCart.update({
      where:{
        id,
        userId: req.user.id
      },
      data:{
        statusOrder: statusOrder
      }
    })

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Update Status Order Success'
    })

  } catch (err) {
    return  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: err.message || "Internal Server Error",
    });
  }
}

const getOrderDetails = async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id;

  try {
    const orderDetails = await prisma.orderCart.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!orderDetails) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        error: "Order not found",
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      orderDetails,
    });
  } catch (error) {
    console.error("Error getting order details:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

const webhook = async (req, res) => {
  let body = req.body;
  try {
    let apiClient = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    apiClient.transaction
      .notification(body)
      .then(async (response) => {
        let orderId = response.order_id;
        let transactionStatus = response.transaction_status;
        let fraudStatus = response.fraud_status;
        const statusCode = response.status_code;
        const grossAmount = response.gross_amount;

        console.log(
          `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
        );

        // Create Signature
        const signature = crypto
          .createHash("sha512")
          .update(orderId + statusCode + grossAmount + config.MidtransServerKey)
          .digest("hex");

        // Check Signature
        if (signature !== response.signature_key) {
          return res.status(StatusCodes.NOT_FOUND).json({
            error: true,
            message: "Invalid Credentials",
          });
        }

        // check the existing trxId and Payment status = SUCCESS
        const checkStatus = await prisma.orderCart.findFirst({
          where: {
            trxId: orderId,
            statusPayment: "SUCCESS",
          },
        });
        if (checkStatus) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "trxId already exists",
          });
        }

        const checkId = await prisma.orderCart.findFirst({
          where: { trxId: orderId },
        });
        if (checkId.trxId !== orderId) {
          res.status(StatusCodes.NOT_FOUND).json({
            error: true,
            message: "trxId Not Found",
          });
        }
        // // Sample transactionStatus handling logic

        let statusPayment;
        let statusOrder = "PENDING";

        if (transactionStatus == "capture") {
          // capture only applies to card transaction, which you need to check for the fraudStatus
          if (fraudStatus == "challenge") {
            // TODO set transaction status on your databaase to 'challenge'
            statusPayment = "PENDING";
          } else if (fraudStatus == "accept") {
            // TODO set transaction status on your databaase to 'success'
            statusPayment = "SUCCESS";
            statusOrder = "PROCESS";
          }
        } else if (transactionStatus == "settlement") {
          // TODO set transaction status on your databaase to 'success'
          statusPayment = "SUCCESS";
          statusOrder = "PROCESS";
        } else if (transactionStatus == "deny") {
          // TODO you can ignore 'deny', because most of the time it allows payment retries
          // and later can become success
          statusPayment = "FAILED";
          statusOrder = "FAILED";
        } else if (
          transactionStatus == "cancel" ||
          transactionStatus == "expire"
        ) {
          // TODO set transaction status on your databaase to 'failure'
          statusPayment = "FAILED";
          statusOrder = "FAILED";
        } else if (transactionStatus == "pending") {
          // TODO set transaction status on your databaase to 'pending' / waiting payment
          statusPayment = "PENDING";
        }

        // Ubah format Date
        const date = new Date(response.settlement_time);
        const formatDate = date.toISOString();

        await prisma.orderCart.update({
          where: { id: checkId.id },
          data: {
            statusPayment: statusPayment,
            statusOrder: statusOrder,
            detetimePayment: formatDate,
            paymentType: response.payment_type,
          },
        });

        return res.status(StatusCodes.OK).json("ok");
      })
      .catch((err) => {
        return res.status(404).json({
          success: false,
          message: err.message,
        });
      });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderDetails,
  webhook,
  updateStatusOrder
};
