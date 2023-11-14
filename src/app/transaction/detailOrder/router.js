const express = require("express");
const router = express.Router();
const { getOrderDetailsByOrderId } = require("./controller");

router.get("/order-details/:id", getOrderDetailsByOrderId);

module.exports = router;
