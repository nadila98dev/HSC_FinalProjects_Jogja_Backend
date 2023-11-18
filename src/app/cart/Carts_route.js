const express = require('express');
const { getCarts, createCarts, deleteCarts } = require('./CartController');
const { authenticateAdmin, authenticateUser } = require('../../middlewares/auth');

const router = express.Router();

router.get('/', authenticateUser, getCarts);

router.post('/', authenticateUser, createCarts);

router.delete('/:id',authenticateUser, deleteCarts);

module.exports = router;
