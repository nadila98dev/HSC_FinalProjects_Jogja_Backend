const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const port = process.env.SERVER_PORT || 3000;

// Router

const authRouter = require('./app/auth/router');
const userRouter = require('./app/user/router');
const accountRouter = require('./app/account/router');
const categoryRouter = require('./app/category/router');
const itemRoute = require('./app/items/Items_route');
const orderRouter = require('./app/transaction/router');
const cartRoute = require('./app/cart/Carts_route');


// app.use(cors({
//   origin: 'http://localhost:5173', // Sesuaikan dengan domain frontend Anda
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
// }));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Version
const version = '/api/v1';



// User / Auth
app.use(`${version}/auth`, authRouter);

// User / Admin
app.use(`${version}/admin`, userRouter);

// User Account
app.use(`${version}/account`, accountRouter)

// category

app.use(`${version}/categories`, categoryRouter);

// items
app.use(`${version}/items`, itemRoute);

//cart
app.use(`${version}/cart`, cartRoute);

//transaction
app.use(`${version}/orders`, orderRouter);

app.listen(port, () => {
  console.log(`Server running in http://localhost:${port}`);
});
