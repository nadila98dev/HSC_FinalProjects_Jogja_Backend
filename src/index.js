const express = require("express");
const app = express();
require("dotenv").config();
require("./app/transaction/order/orderScheduler"); // orderScheduler.js

const port = process.env.SERVER_PORT || 3000;

// Router
const authRouter = require("./app/auth/router");
const orderRouter = require("./app/transaction/order/router"); // order transaction
const orderDetailRouter = require("./app/transaction/detail/router"); // order detail

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Version
const version = "/api/v1";

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.use(`${version}/auth`, authRouter);
app.use(`${version}/order`, orderRouter);
app.use(`${version}/order-details`, orderDetailRouter);

app.listen(port, () => {
  console.log(`Server running in http://localhost:${port}`);
});
