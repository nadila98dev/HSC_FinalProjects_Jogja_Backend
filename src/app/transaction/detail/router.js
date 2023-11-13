const express = require("express");
const router = express.Router();
const { getOrderDetailsByOrderId } = require("./controller");

router.get("/transaction/:id", getOrderDetailsByOrderId);

module.exports = router;
