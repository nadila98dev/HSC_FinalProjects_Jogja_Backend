const express = require('express');
const { getCarts, createCarts, deleteCarts } = require('./CartController');

const router = express.Router();

router.get('/', getCarts);

router.post('/', createCarts);

router.delete('/:id', deleteCarts);

module.exports = router;
