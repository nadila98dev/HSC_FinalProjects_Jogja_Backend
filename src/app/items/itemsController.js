const { PrismaClient } = require("@prisma/client")
const { response } = require("express")

const prisma = new PrismaClient()


// GET METHOD
 const getAllItems = async (req, res) => {
    try{
        const response = await prisma.items.findMany()
        res.status(200).json({success: true, message: "Items retrieved sucessfully", data: response})
    }catch(err){
        res.status(500).json({success: false, message: `Failed to retrieve items: ${err.message}`})
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
            res.status(404).json({message: "Item ID is not found"})
            return
        }


        res.status(200).json({success: true, message:"Item by ID is retrieve sucessfully", data: response})
    }catch(err){
        res.status(404).json({success: false, message: `Failed to retrieve item: ${err.message}`})
    }

}


// POST METHOD
const createItem = async (req, res) => {
    const body = req.body
    try {
            const createdItem = await prisma.items.create({
                data: {
                    id_category: body.id_category,
                    name: body.name,
                    slug: body.slug,
                    src: body.src,
                    price: body.price,
                    address: body.address,
                    positionlat: body.positionlat,
                    positionlng: body.positionlng,
                    description: body.description
                }
            })
        res.status(201).json({success: true, message: "Item has been created sucessfully", data: createdItem})
    } catch (err) {
        res.status(401).json({ success: false, message: `Failed to create item: ${err.message}` })
    }
}


// PUT METHOD
 const updateItem = async (req, res) => {
    const body = req.body
    const itemId = req.params.id
    try{
        const existingItem = await prisma.items.findUnique({
            where: {
                id: itemId,
            },
        })

        if(!existingItem) {
            return res.status(404).json({ success: false, message: "Item not found" })
        }

        const updatedItem = await prisma.items.update({
            where: {
                id: itemId,
            },
            data: body,
        })
        
        res.status(200).json({success: true, message: "Item has been successfully updated", data: updatedItem})

    }catch(err){
        res.status(400).json({success: false, message: `Failed to update item: ${err.message}`})

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
            return res.status(404).json({ success: false, message: "Item not found" })
        }

        const deletedItem = await prisma.items.delete({
            where: {
                id: itemId,
            },
        })
        

        res.status(200).json({success: true, message: "Item has been deleted", data: deletedItem})
    } catch (err) {
        res.status(400).json({ success: false, message: `Failed to delete item: ${err.message}` })
    }
}





module.exports = {getAllItems, getItembyId, createItem, updateItem, deleteItem}