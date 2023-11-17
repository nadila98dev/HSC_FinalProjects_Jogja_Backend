const { PrismaClient } = require("@prisma/client")
const { response } = require("express")
const { StatusCodes } = require("http-status-codes");
const { default: slugify } = require("slugify");
const fs = require('fs');

const prisma = new PrismaClient()


// GET METHOD
 const getAllItems = async (req, res) => {
    try{
        const response = await prisma.items.findMany()
        res.status(Status).json({success: true, message: "Items retrieved sucessfully", data: response})
    }catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false, message: `Failed to retrieve items: ${err.message}`})
    }

}

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


// POST METHOD
const createItem = async (req, res) => {
   
    try {
        const body = req.body
        const src = req.file
        ? `images/${req.file.filename}`
      : "images/avatar/default.jpg"
            const createdItem = await prisma.items.create({
                data: {
                    id_category: body.id_category,
                    name: body.name,
                    slug: slugify(body.name).toLowerCase(),
                    src: src,
                    price: body.price,
                    address: body.address,
                    positionlat: body.positionlat,
                    positionlng: body.positionlng,
                    description: body.description
                }
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
    
    try{
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

        let updatedSrc = existingItem.src;

        // Check if a new file is uploaded
        if (req.file) {
           
            updatedSrc = `/images/${req.file.filename}`

         
            if (existingItem.src !== "/images/avatar/default.jpg") {
                const oldSrc = "public" + existingItem.src;

                fs.unlink(oldSrc, (err) => {
                    if (err) {
                        console.error("Failed to delete old source:", err);
                    } else {
                        console.log("Old source deleted successfully");
                    }
                })
            }
        }

        const updatedItem = await prisma.items.update({
            where: {
                id: itemId,
            },
            data: {
                ...body,
                src: updatedSrc,
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
        })
    }

} 


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
    deleteItem
}