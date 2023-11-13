const express = require("express");
const router = express.Router();
const { createOrder, getAllOrders } = require("./controller");

router.post("/transaction", createOrder);
router.get("/transactions", getAllOrders);

module.exports = router;
