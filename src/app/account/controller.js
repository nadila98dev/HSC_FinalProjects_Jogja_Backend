const { StatusCodes } = require("http-status-codes");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Update user's address
const updateAddress = async (req, res, next) => {
  try {
    const { address } = req.body;
    const userId = req.user.id;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { address },
    });

    res
      .status(StatusCodes.OK)
      .json({ message: "Address updated successfully", user: updatedUser });
  } catch (error) {
    next(error);
  }
};

// Update user's phone number
const updatePhoneNumber = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const userId = req.user.id;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { phone },
    });

    res.status(StatusCodes.OK).json({
      message: "Phone number updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// Upload avatar image
const uploadAvatar = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: true, message: "Please provide an image" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatar: req.file.path },
    });

    res
      .status(StatusCodes.OK)
      .json({ message: "Avatar updated successfully", user: updatedUser });
  } catch (error) {
    next(error);
  }
};

// Get account data
const getAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: true, message: "User not found" });
    }

    res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    next(error);
  }
};

module.exports = { updateAddress, updatePhoneNumber, uploadAvatar, getAccount };
