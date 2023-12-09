const { PrismaClient } = require("@prisma/client")
const { response } = require("express")
const { StatusCodes } = require("http-status-codes");
const { default: slugify } = require("slugify");
const fs = require('fs');

const prisma = new PrismaClient()


// GET METHOD
 // GET METHOD
const getAllItems = async (req, res) => {
  try {
    let { limit, pageNumber, keyword, categoryId } = req.query;
    limit = limit ? parseInt(limit) : undefined;
    pageNumber = pageNumber ? parseInt(pageNumber) : 1;

    let skip;
    if (limit && pageNumber) {
      skip = (pageNumber - 1) * limit;
    }

    const totalItems = await prisma.items.count();
    const totalPages = limit ? Math.ceil(totalItems / limit) : 1;

    const itemLength = await prisma.items.findMany({
      where: {
        name: {
          contains: keyword,
        },
        categoryId: categoryId ? parseInt(categoryId) : undefined,
      },
    });

    const resLength = itemLength.length;

    const response = await prisma.items.findMany({
      skip,
      take: limit,
      where: {
        name: {
          contains: keyword,
        },
        categoryId: categoryId ? parseInt(categoryId) : undefined,
      },
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Items retrieved successfully",
      data: response,
      totalItems: totalItems,
      limit,
      totalPages,
      currentPage: parseInt(pageNumber),
      currentItems: resLength,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: `Failed to retrieve items: ${err.message}`,
    });
  }
};


// GET METHOD (SPECIFIC BY ID)
 const getItembyId = async (req, res) => {
    const itemId = req.params.id
    try{
        const response = await prisma.items.findUnique({
            where:{
                id: itemId
            }
        })

        if(!response) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Item ID is not found"})
            
        }


        res.status(StatusCodes.OK).json({
            success: true, 
            message:"Item by ID is retrieve sucessfully", 
            data: response})
    }catch(err){
        res.status(StatusCodes.NOT_FOUND).json({
            success: false, 
            message: `Failed to retrieve item: ${err.message}`})
    }

}

// GET METHOD SPECIFIC for Detail or Slug

// const detailItems = async  (req, res) => {
//   try {
//     const { slug } = req.query;

//     if (!slug) {
//       return res.status(StatusCodes.BAD_REQUEST).json({
//         success: false,
//         message: "Slug is required",
//       });
//     }

//     const response = await prisma.items.findUnique({
//       where: {
//         slug: slug,
//       },
//     });

//     if (!response) {
//       return res.status(StatusCodes.NOT_FOUND).json({
//         success: false,
//         message: "Item not found with the provided slug",
//       });
//     }

//     res.status(StatusCodes.OK).json({
//       success: true,
//       message: "Item retrieved successfully",
//       data: response,
//     });
//   } catch (err) {
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: `Failed to retrieve item: ${err.message}`,
//     });
//   }
// };

// POST METHOD
const createItem = async (req, res) => {
   
    try {
        const body = req.body;
        const image = req.file
        ? `images/${req.file.filename}`
        : "images/avatar/default.jpg";

        const createdItem = await prisma.items.create({
            data: {
                categoryId: parseInt(body.categoryId, 10),
                name: body.name,
                slug: slugify(body.name).toLowerCase(),
                image: image, 
                price: parseInt(body.price, 10),
                address: body.address,
                positionlat: parseFloat(body.positionlat),
                positionlng: parseFloat(body.positionlng),
                description: body.description,
            },
        })

            res.status(201).json({
            success: true, 
            message: "Item has been created sucessfully", 
            data: createdItem})
    } catch (err) {
        res.status(StatusCodes.UNAUTHORIZED).json({ 
            success: false, 
            message: `Failed to create item: ${err.message}` })
    }
}


// PUT METHOD
const updateItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const body = req.body;

    const existingItem = await prisma.items.findUnique({
      where: {
        id: itemId,
      },
    });

    if (!existingItem) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Item Not Found",
      });
    }

    let updatedImage = existingItem.image;

    // Check if a new file is uploaded
    if (req.file) {
      updatedImage = `images/${req.file.filename}`;

      // Delete the old image file if it's not the default one
      if (existingItem.image !== "avatar/default.jpg") {
        const oldImage = "public/" + existingItem.image;

        fs.unlink(oldImage, (err) => {
          if (err) {
            console.error("Failed to delete old image:", err);
          } else {
            console.log("Old image deleted successfully");
          }
        });
      }
    }

    const updatedItem = await prisma.items.update({
      where: {
        id: itemId,
      },
      data: {
        ...body,
        image: updatedImage,
      },
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Item has been successfully updated",
      data: updatedItem,
    });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: `Failed to update item: ${err.message}`,
    });
  }
};

  


// DELETE METHOD
const deleteItem = async (req, res) => {
    const itemId = req.params.id
    try {

        const exisitingItem = await prisma.items.findUnique({
            where: {
                id: itemId
            },
        })

        if(!exisitingItem) {
            return res.status(StatusCodes.NOT_FOUND).json({ 
                success: false, 
                message: "Item not found" })
        }

        const deletedItem = await prisma.items.delete({
            where: {
                id: itemId,
            },
        })
        

        res.status(StatusCodes.OK).json({
            success: true, 
            message: "Item has been deleted", 
            data: deletedItem})
    } catch (err) {
        res.status(StatusCodes.BAD_REQUEST).json({ 
            success: false, 
            message: `Failed to delete item: ${err.message}` })
    }
}





module.exports = {getAllItems, 
    getItembyId, 
    createItem, 
    updateItem, 
    deleteItem,
    // detailItems
}