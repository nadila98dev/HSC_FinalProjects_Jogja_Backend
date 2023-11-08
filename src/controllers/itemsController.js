const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient();

export const getAllItems = async (req, res) => {
    try{
        const response = await prisma.items.findMany()
        res.status(200).json(response)
    }catch(er){
        res.status(500).json({message: err.message})
    }

}

export const getItembyId = async (req, res) => {
    try{
        const response = await prisma.items.findUnique({
            where:{
                id: req.params.id
            }
        })
        res.status(200).json(response)
    }catch(err){
        res.status(404).json({message: err.message})
    }

}

export const createItem = async (req, res) => {
    const body = req.body
    try{
        const items = await prisma.items.create({
            name: body.name,
            slug: body.slug,
            src: body.src,
            price: body.price,
            address: body.address,
            description: body.description
        })
        res.status(201).json(response)
    }catch(er){
        res.status(400).json({message: err.message})

    }

}

export const updateItem = async (req, res) => {
    const body = req/body
    try{
        const items = await prisma.items.update({
            where:{
                id: req.params.id
            },
            data:{
                name: body.name,
                slug: body.slug,
                src: body.src,
                price: body.price,
                address: body.address,
                description: body.description
            }
        })
        res.status(200).json(response)

    }catch(er){
        res.status(400).json({message: err.message})

    }

} 

export const deleteItem = async (req, res) => {
    try{
        const items = await prisma.items.delete({
            where:{
                id: req.params.id
            }
        })
        res.status(200).json(response)

    }catch(er){
        res.status(400).json({message: err.message})

    }

}

module.exports = {getAllItems, getItembyId, createItem, updateItem, deleteItem}