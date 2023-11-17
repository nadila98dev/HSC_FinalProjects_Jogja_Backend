const express = require('express');
const { getCarts, createCarts, deleteCarts } = require('./CartController');

const router = express.Router();

router.get('/api/v1/carts', getCarts);

router.post('/api/v1/create', createCarts);

router.delete('/api/v1/delete/:id', deleteCarts);

module.exports = router;
