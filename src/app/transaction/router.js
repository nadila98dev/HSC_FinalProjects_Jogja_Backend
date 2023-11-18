const express = require("express");
const router = express.Router();
const { createOrder, getAllOrders, getOrderDetails } = require("./controller");
const { authenticateUser } = require("../../middlewares/auth");

router.post("/", authenticateUser, createOrder);
router.get("/", authenticateUser, getAllOrders);
router.get("/:orderId", getOrderDetails);

module.exports = router;
