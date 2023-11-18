const { PrismaClient } = require("@prisma/client");
const { STATUS_CODES } = require("http");
const prisma = new PrismaClient();
const { StatusCodes } = require("http-status-codes");

const createOrder = async (req, res) => {
  // const { cartId } = req.body;
  const  userId  = req.user.id;
  console.log(userId)

  try {

    const existingCart = await prisma.cart.findMany({
      where: { userId: userId },
      include:{
        item: true
      }
    });
    console.log(existingCart)


    if (!existingCart || existingCart.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        error: "Cart not found" });
    }

    const totalCartPrice = existingCart.reduce((acc, cart) => {
      return acc + cart.totalprice;
    }, 0);

    const newOrder = await prisma.orderCart.create({
      data: {
        userId,
        shipment_status: "Process",
       items: {
          create: existingCart.flatMap((cart) =>
            ({
              id_category: cart.item.id_category,
              name: cart.item.name,
              slug: cart.item.slug,
              image: cart.item.image,
              price: cart.item.price,
              address: cart.item.address,
              positionlat: cart.item.positionlat,
              positionlng: cart.item.positionlng,
              description: cart.item.description,
            })
          ),
        },
        createdAt: new Date(),
        totalCartPrice: totalCartPrice,
        
      },
      select: {
        items: {
          select: {
            id: true,
            name: true,
            image: true,
            price: true
          }
        },
        shipment_status: true,
        totalCartPrice: true,
        createdAt: true
      }
    });

    await prisma.cart.deleteMany({
      where: {
        userId
      }
    })

    // buat ngubah status dlm 5 menit (optional)
    setTimeout(async () => {
      await prisma.orderCart.update({
        where: { id: newOrder.id },
        data: { shipment_status: "Delivered" },
      });
    }, 5 * 60 * 1000);

    res.status(StatusCodes.CREATED).json({ success: true, order: newOrder });
  } catch (error) {
    console.error("Error creating an order:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      error: "Internal Server Error" });
  }
};

const getAllOrders = async (req, res) => {
  const userId  = req.user.id;

  try {
    const orders = await prisma.orderCart.findMany({
      where: {
        userId
      },
      include: {
        items: true 
      },
    });

    res.status(StatusCodes.OK).json({ success: true, orders });
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      error: "Internal Server Error" });
  }
};

const getOrderDetails = async (req, res) => {
  const { orderId } = req.params;
  const userId  = req.user.id;

  try {
    const orderDetails = await prisma.orderCart.findUnique({
      where: {
        id: orderId,
        cart: {
          userId: userId,
        },
      },
      include: {
        cart: {
          include: {
            items: true,
          },
        },
      },
    });

    if (!orderDetails) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        error: "Order not found" });
    }

    res.status(StatusCodes.OK).json({ 
      success: true, 
      orderDetails });
  } catch (error) {
    console.error("Error getting order details:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      error: "Internal Server Error" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderDetails,
};
