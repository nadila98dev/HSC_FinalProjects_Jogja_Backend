const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getOrderDetailsByOrderId = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ success: false, error: "id is required" });
    }

    const orderDetails = await prisma.orderDetail.findMany({
      where: { orderId: parseInt(id) },
      include: {
        cart: {
          include: {
            items: true,
          },
        },
        orders: true,
        account: true,
      },
    });

    res.status(200).json({ success: true, orderDetails });
  } catch (error) {
    console.error("Error getting order details:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = {
  getOrderDetailsByOrderId,
};
