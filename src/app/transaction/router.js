const express = require("express");
const router = express.Router();
const { createOrder, getAllOrders, getOrderDetails, webhook, updateStatusOrder } = require("./controller");
const { authenticateUser } = require("../../middlewares/auth");

router.post("/", authenticateUser, createOrder);
router.get("/", authenticateUser, getAllOrders);
router.get("/:orderId", authenticateUser, getOrderDetails);
router.put('/update-order/:id', authenticateUser, updateStatusOrder)
router.post('/webhook', webhook)

module.exports = router;
