const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { StatusCodes } = require("http-status-codes");


module.exports = {
    update: async(req, res) => {
        try {
            
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: err.message
            })
        }
    },
    updateImage: async(req, res) => {
        try {
            
        } catch (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: err.message
            })
        }
    }
}