const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient();

 const getAllItems = async (req, res) => {
    try{
        const response = await prisma.items.findMany()
        res.status(200).json(response)
    }catch(er){
        res.status(500).json({message: err.message})
    }

}

 const getItembyId = async (req, res) => {
    const itemId = Number(req.params.id)
    try{
        const response = await prisma.items.findUnique({
            where:{
                id: itemId
            }
        })

        if(!response) {
            res.status(404).json({message: "Item ID is not found"})
            return;
        }


        res.status(200).json(response)
    }catch(err){
        res.status(404).json({message: err.message})
    }

}

const createItem = async (req, res) => {
    const body = req.body;
    try {
        const items = await prisma.items.create({
            data: {
                id_category: body.id_category,
                name: body.name,
                slug: body.slug,
                src: body.src,
                price: body.price,
                address: body.address,
                description: body.description,
                position: {
                    create: {
                        lat: body.position.lat,
                        lng: body.position.lng,
                    },
                },
            },
        });
        res.status(201).json(items);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
}


 const updateItem = async (req, res) => {
    const body = req.body
    const itemId = Number(req.params.id)
    try{
        const updatedItem = await prisma.items.update({
            where: {
                id: itemId,
            },
            data: body,
            include: {
                position: true
            },
        })
        res.status(200).json(updatedItem)

    }catch(er){
        res.status(400).json({message: err.message})

    }

} 

const deleteItem = async (req, res) => {
    try {
        const itemId = Number(req.params.id);

        // Fetch the item to get its associated position
        const item = await prisma.items.findUnique({
            where: {
                id: itemId,
            },
            include: {
                position: true,
            },
        });

        if (!item) {
            throw new Error("Item not found");
        }

        // Delete the item
        const deletedItem = await prisma.items.delete({
            where: {
                id: itemId,
            },
        });

        // Delete the associated position if it exists
        if (item.position) {
            await prisma.position.delete({
                where: {
                    id: item.position.id,
                },
            });
        }

        res.status(200).json(deletedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}





module.exports = {getAllItems, getItembyId, createItem, updateItem, deleteItem}