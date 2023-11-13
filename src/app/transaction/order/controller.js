const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createOrder = async (req, res) => {
  const { cartId } = req.body;

  try {
    if (!cartId) {
      return res
        .status(400)
        .json({ success: false, error: "cartId is required" });
    }

    const newOrder = await prisma.$transaction(async (tx) => {
      const existingCart = await tx.cart.findUnique({
        where: { id: cartId },
      });

      if (!existingCart) {
        return res
          .status(404)
          .json({ success: false, error: "Cart not found" });
      }

      return tx.order.create({
        data: {
          cart: { connect: { id: cartId } },
          status: "Pending",
        },
      });
    });

    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error("Error creating an order:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.OrderCart.findMany({
      include: {
        cart: {
          include: {
            product: true,
          },
        },
        order: true,
      },
    });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
};
