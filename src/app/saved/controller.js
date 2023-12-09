const { PrismaClient } = require("@prisma/client");
const { StatusCodes } = require("http-status-codes");

const prisma = new PrismaClient();

const saveItemAsFavorite = async (req, res) => {
  const { itemId } = req.body;
  const userId = req.user.id;

  try {
    const existingSavedItem = await prisma.saved.findFirst({
      where: {
        userId,
        itemsId: itemId,
      },
    });

    if (existingSavedItem) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Item already saved as favorite",
      });
    }

    const itemData = await prisma.items.findUnique({
      where: {
        id: itemId,
      },
      select: {
        image: true,
        name: true,
        description: true,
      },
    });

    if (!itemData) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Item not found",
      });
    }

    const savedItem = await prisma.saved.create({
      data: {
        userId,
        itemsId: itemId,
      },
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: {
        item: itemData,
        savedItem,
      },
    });
  } catch (error) {
    console.error("Error saving item as favorite:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to save item as favorite",
    });
  }
};

const getSavedItemsByUserId = async (req, res) => {
  const userId = req.user.id;

  try {
    const savedItems = await prisma.saved.findMany({
      where: {
        userId,
      },
      select: {
        item: {
          select: {
            id: true,
            image: true,
            name: true,
            description: true,
          },
        },
      },
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: savedItems,
    });
  } catch (error) {
    console.error("Error getting saved items:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to get saved items",
    });
  }
};

const deleteSavedItem = async (req, res) => {
  const { itemId } = req.body;
  const userId = req.user.id;

  try {
    const deletedItem = await prisma.saved.deleteMany({
      where: {
        userId,
        itemsId: itemId,
      },
    });

    if (!deletedItem) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Saved item not found",
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Saved item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting saved item:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to delete saved item",
    });
  }
};

module.exports = {
  saveItemAsFavorite,
  getSavedItemsByUserId,
  deleteSavedItem,
};
