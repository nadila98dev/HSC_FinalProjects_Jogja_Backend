const express = require("express");
const router = express.Router();
const { createOrder, getAllOrders, getOrderDetails } = require("./controller");

router.post("/orders", createOrder);
router.get("/orders", getAllOrders);
router.get("/orders/:orderId", getOrderDetails);

module.exports = router;
