const { StatusCodes } = require("http-status-codes");
const { jwtVerify } = require("../utils/jwt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const authenticateUser = async (req, res, next) =>{
    try {
        let token;

        const authHeader = req.headers.authorization
        if(authHeader && authHeader.startsWith("Bearer")){
            token = authHeader.split(" ")[1]
        }

        if(!token){
            return res.status(StatusCodes.UNAUTHORIZED).json({
                error: true,
                message: 'Authenticated Failed'
            })
        }

        const payload = jwtVerify({token})

        const checkUser =  await prisma.user.findUnique({
            where:{
                email: payload.email
            }
        })
        if(!checkUser){
            return res.status(StatusCodes.UNAUTHORIZED).json({
                error: true,
                message: 'UNAUTHORIZED'
            })
        }

       

        req.user = {
            email: payload.email,
            id: payload.id,
            role: payload.role,
        }

        next()

    } catch (err) {
        next(err)
    }
}

const authenticateAdmin = async(req, res, next) =>{
    try {
        let token;

        const authHeader = req.headers.authorization
        if(authHeader && authHeader.startsWith("Bearer")){
            token = authHeader.split(" ")[1]
        }

        if(!token){
            return res.status(StatusCodes.UNAUTHORIZED).json({
                error: true,
                message: 'Authenticated Failed'
            })
        }

        const payload = jwtVerify({token})

        const checkUser =  await prisma.user.findUnique({
            where:{
                email: payload.email
            }
        })
        if(!checkUser){
            return res.status(StatusCodes.UNAUTHORIZED).json({
                error: true,
                message: 'UNAUTHORIZED'
            })
        }

        if(payload.role !== 'ADMIN'){
            return res.status(StatusCodes.FORBIDDEN).json({
                error: true,
                message: 'FORBIDDEN'
            })
        }

       

        req.user = {
            email: payload.email,
            id: payload.id,
            role: payload.role,
        }

        next()

    } catch (err) {
        next(err)
    }
}


module.exports = { authenticateUser, authenticateAdmin }