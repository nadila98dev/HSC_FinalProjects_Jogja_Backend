const express = require("express");
const router = express.Router();
const { createOrder, getAllOrders, getOrderDetails } = require("./controller");

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/:orderId", getOrderDetails);

module.exports = router;
