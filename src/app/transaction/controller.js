const { PrismaClient } = require("@prisma/client");
const { STATUS_CODES } = require("http");
const prisma = new PrismaClient();
const { StatusCodes } = require("http-status-codes");

const createOrder = async (req, res) => {
  const { cartId } = req.body;
  const { userId } = req.user.id;

  try {
    if (!cartId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, 
          error: "cartId is required" });
    }

    if (!userId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ 
          success: false, 
          error: "cartId is required" });
    }

    const existingCart = await prisma.cart.findUnique({
      where: { id: userId },
      include: {
        cart: {
          include: {
            orderCart: {
              items: true,
            },
          },
        },
      },
    });

    if (!existingCart) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        error: "Cart not found" });
    }

    const newOrder = await prisma.orderCart.create({
      data: {
        cartId: existingCart.id,
        statusOrder: "Process",
      },
    });

    // buat ngubah status dlm 5 menit (optional)
    setTimeout(async () => {
      await prisma.orderCart.update({
        where: { id: newOrder.id },
        data: { statusOrder: "Delivered" },
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
  const { userId } = req.user.id;

  try {
    const orders = await prisma.orderCart.findMany({
      where: {
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
  const { userId } = req.user.id;

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
