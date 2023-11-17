const { PrismaClient } = require('@prisma/client');
const { response } = require('express');

const prisma = new PrismaClient();

export const getCarts = async (req, res) => {
  try {
    const response = await prisma.cart.findMany({
      where: { userId: req.user.id },
      include: {
        item: true,
        user: true,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createCarts = async (req, res) => {
  try {
    const { userId, itemsId, quantity, totalprice } = req.body;

    const cart = await prisma.cart.create({
      data: {
        userId,
        itemsId,
        quantity,
        totalprice,
      },
      include: {
        item: true,
        user: true,
        quantity: true,
        totalprice: true,
      },
    });

    res.json(cart).status(201);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteCarts = async (req, res) => {
  try {
    const cartId = parseInt(req.params.id);

    const cart = await prisma.cart.delete({
      where: {
        id: cartId,
      },
      include: {
        item: true,
        user: true,
      },
    });

    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
