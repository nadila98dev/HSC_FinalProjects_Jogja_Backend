const cron = require("node-cron");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

cron.schedule("0 * * * *", async () => {
  try {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const ordersToUpdate = await prisma.orderCart.findMany({
      where: {
        shipment_status: "preparing your order",
        createdAt: { lte: oneHourAgo },
      },
    });

    await Promise.all(
      ordersToUpdate.map(async (order) => {
        await prisma.orderCart.update({
          where: { id: order.id },
          data: { shipment_status: "delivered" },
        });
      })
    );

    console.log("Shipment status updated successfully.");
  } catch (error) {
    console.error("Error updating shipment status:", error);
  }
});
