
const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()


const port = process.env.SERVER_PORT || 3000;

// Router


const authRouter = require("./app/auth/router");
const categoryRouter = require("./app/category/router");
const itemRoute = require("./app/items/Items_route");
const orderRouter = require("./app/transaction/router");

app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: false }));

// Version
const version = "/api/v1";


// User / Auth
app.use(`${version}/auth`, authRouter);

// category
app.use("/categories", categoryRouter);
// items
app.use("/items", itemRoute);
//transaction
app.use(`${version}/orders`, orderRouter);


app.listen(port, () => {
  console.log(`Server running in http://localhost:${port}`);
});
