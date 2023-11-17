const { PrismaClient } = require('@prisma/client');
const { response } = require('express');
const { StatusCodes } = require('http-status-codes');

const prisma = new PrismaClient();

const getCarts = async (req, res) => {
  try {
    const response = await prisma.cart.findMany({
      where: { userId: req.user.id },
      include: {
        item: true,
        user: true,
      },
    });
    res.status(StatusCodes.OK).json(response);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: error.message,
    });
  }
};

const createCarts = async (req, res) => {
  try {
    const { userId, itemsId, quantity, totalprice } = req.body;

    const cart = await prisma.cart.create({
      data: {
        userId,
        itemsId,
        quantity,
        totalprice,
      },
      select: {
        quantity: true,
        totalprice: true,
        item: {
          select: {
            price: true,
            address: true,
          },
        },
      },
    });

    res.json(cart).status(StatusCodes.CREATED);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      msg: error.message,
    });
  }
};

const deleteCarts = async (req, res) => {
  try {
    const cartId = parseInt(req.params.id);

    const cart = await prisma.cart.delete({
      where: {
        id: cartId,
      },
    });

    res.status(StatusCodes.OK).json(cart);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message });
  }
};

module.exports = { getCarts, createCarts, deleteCarts };
