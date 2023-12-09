const { PrismaClient } = require("@prisma/client");
const { StatusCodes } = require("http-status-codes");

const prisma = new PrismaClient();

const getCarts = async (req, res) => {
  try {
    const response = await prisma.cart.findMany({
      where: { userId: req.user.id },
      select: {
        id: true,
        quantity: true,
        totalprice: true,
        item: {
          select:{
            id: true,
            name: true,
            price: true,
            image: true
          }
        }
      },
    });
    const totalCartPrice = response.reduce((acc, cart) => {
      return acc + cart.totalprice;
    }, 0);

    res.status(StatusCodes.OK).json({
      status: true,
      data: response,
      totalCartPrice,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: error.message,
    });
  }
};

const createCarts = async (req, res) => {
  const { itemsId, quantity } = req.body;
  const userId = req.user.id

  try {
    const findCartItem = await prisma.cart.findFirst({
      where: {
        itemsId: itemsId,
        userId: req.user.id
      },
      select: {
        id: true,
        quantity: true,
      }
    });
  const findItem = await prisma.items.findFirst({
    where: {
      id: itemsId
    }
  })
  // console.log(findItem.price)
  if( findItem === null || !findItem.price ){
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Request Not Valid'
    })
  }
    const sumPrice = quantity * findItem.price

    if (findCartItem) {

        const update = await prisma.cart.update({
          where: {
            id: findCartItem.id,
          },
          data: {
            quantity,
            totalprice: sumPrice
          },
          select: {
            item: {
              select: {
                price: true
              }
            }
          }
        });

        return res.status(StatusCodes.OK).json({
          success: true,
          data: update,
        });
      
    }
      const cart = await prisma.cart.create({
        data: {
          userId,
          itemsId,
          quantity,
          totalprice: sumPrice,
        },
        select: {
          id: true,
          quantity: true,
          item: {
            select: {
              price: true
            }
          }
        }
      });

      res.status(StatusCodes.CREATED).json(cart);
    
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      msg: error.message,
    });
  }
};

const deleteCarts = async (req, res) => {
  try {
    const cartId = req.params.id;

    const checkCart = await prisma.cart.findUnique({
      where:{
        id: cartId
      }
    })

    if(!checkCart){
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        msg: 'Cart Not Found'
      })
    }

    const cart = await prisma.cart.delete({
      where: {
        id: cartId,
      },
    });

    res.status(StatusCodes.OK).json({
      success: true,
      msg: 'Success Deleted'
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message });
  }
};

module.exports = { getCarts, createCarts, deleteCarts };
