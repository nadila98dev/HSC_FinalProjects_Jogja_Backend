const express = require("express");
const router = express.Router();
const { createOrder, getAllOrders, getOrderDetails, webhook, updateStatusOrder, getAllOrdersAdmin } = require("./controller");
const { authenticateUser, authenticateAdmin } = require("../../middlewares/auth");

router.post("/", authenticateUser, createOrder);
router.get("/", authenticateUser, getAllOrders);
router.get("/all", authenticateAdmin, getAllOrdersAdmin);
router.get("/:orderId", authenticateUser, getOrderDetails);
router.put('/update-order/:id', authenticateAdmin, updateStatusOrder)
router.post('/webhook', webhook)

module.exports = router;
