
const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path');
require('dotenv').config()


const port = process.env.SERVER_PORT || 3000;

// Router


const authRouter = require("./app/auth/router");
const categoryRouter = require("./app/category/router")
const itemRoute = require("./app/items/Items_route");
const orderRouter = require("./app/transaction/order/router");
const orderDetailRouter = require("./app/transaction/detailOrder/router");

app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Version
const version = "/api/v1";

// User / Auth
app.use(`${version}/auth`, authRouter);

// category
app.use(`${version}/categories`, categoryRouter)

// items
app.use("/items", itemRoute);

//transaction
app.use(version, orderRouter);
app.use(version, orderDetailRouter);


app.listen(port, () => {
  console.log(`Server running in http://localhost:${port}`);
});
