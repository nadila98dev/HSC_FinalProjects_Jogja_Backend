const { PrismaClient } = require("@prisma/client");
const { response } = require("express");
const { StatusCodes } = require("http-status-codes");
const { default: slugify } = require("slugify");
const fs = require('fs');

const prisma = new PrismaClient();

// GET METHOD
const getallCategory = async (req, res) => {
  try {
    const response = await prisma.category.findMany();
    res
      .status(StatusCodes.OK)
      .json({
        success: true,
        message: "All categories successfully retrieved",
        data: response,
      });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        success: false,
        message: `Failed to retrieve categories: ${err.message}`,
      });
  }
};

// GET METHOD (SPECIFIC BY ID)
const getCategorybyId = async (req, res) => {
  const categoryId = Number(req.params.id);
  try {
    const response = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!response) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        message: "Category id IS NOT FOUND" });
    }

    res
      .status(StatusCodes.OK)
      .json({
        success: true,
        message: "Item by ID is retrieve sucessfully",
        data: response,
      });
  } catch (err) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({
        success: false,
        message: `Failed to retrieve category: ${err.message}`,
      });
  }
};

// POST METHOD
const createCategory = async (req, res) => {
  try {
    const body = req.body;
    const images = req.file
      ? `images/${req.file.filename}`
      : "images/avatar/default.jpg";
    const createdCategory = await prisma.category.create({
      data: {
        name: body.name,
        slug: slugify(body.name).toLowerCase(),
        image: images,
      },
    });
    console.log(createCategory);
    res
      .status(StatusCodes.CREATED)
      .json({
        success: true,
        message: "Category has been created successfully",
        data: createdCategory,
      });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        success: false,
        message: `Failed to create category: ${err.message}`,
      });
  }
};

// PUT METHOD
const updateCategory = async (req, res) => {
  const body = req.body;
  try {
    const categoryId = Number(req.params.id);

    const images = req.file ? `/images/${req.file.filename}` : body.image;

    const findCategory = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!findCategory) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Category Not Found",
      });
    }

    if (req.file && findCategory.image && findCategory.image !== "/images/avatar/default.jpg") {
      const oldImage = "public" + findCategory.image;

      fs.unlink(oldImage, (err) => {
        if (err) {
          console.error("Failed to delete the old image:", err);
        } else {
          console.log("Old image deleted successfully");
        }
      });
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name: body.name,
        slug: typeof body.name === 'string' ? slugify(body.name).toLowerCase() : undefined,
        image: images,
      },
      include: {
        items: true,
      },
    });
    res.status(StatusCodes.OK)
      .json({
        success: true,
        message: "Categories have been successfully updated",
        data: updatedCategory,
      });
  } catch (err) {
    console.log(err);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({
        success: false,
        message: `Failed to update categories: ${err.message}`,
      });
  }
};


const deleteCategory = async (req, res) => {
  const body = req.body;
  try {
    const categoryId = Number(req.params.id);
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
      include: {
        items: true,
      },
    });

    if (!category) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "Category not found" });
    }

    const deletedCategory = await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });

    res
      .status(StatusCodes.OK)
      .json({
        success: true,
        message: "Category has been deleted",
        data: deletedCategory,
      });
  } catch (err) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({
        success: false,
        message: `Failed to delete categories: ${err.message}`,
      });
  }
};

module.exports = {
  getallCategory,
  getCategorybyId,
  createCategory,
  updateCategory,
  deleteCategory,
};
