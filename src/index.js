const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const port = process.env.SERVER_PORT || 3000;

// Router

const authRouter = require('./app/auth/router');
const categoryRouter = require('./app/category/router');
const itemRoute = require('./app/items/Items_route');
const orderRouter = require('./app/transaction/router');
const cartRoute = require('./app/cart/Carts_route');

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Version
const version = '/api/v1';

// User / Auth
app.use(`${version}/auth`, authRouter);

// category

app.use(`${version}/categories`, categoryRouter);

// items
app.use('/items', itemRoute);

//cart
app.use('/cart', cartRoute);

//transaction
app.use(`${version}/orders`, orderRouter);

app.listen(port, () => {
  console.log(`Server running in http://localhost:${port}`);
});
