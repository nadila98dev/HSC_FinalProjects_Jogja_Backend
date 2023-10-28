const {
    PrismaClient
} = require('@prisma/client');
const prisma = new PrismaClient();
const { StatusCodes } = require("http-status-codes")
const bcrypt = require('bcrypt');
const { createJWT, createToken, jwtVerify } = require('../../utils');

module.exports = {
    signup: async(req, res) => {
        try {
            const {email, name, password} = req.body

            if(!email || !name || !password){
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: true,
                    message: 'Field has been requeired'
                })
            }

            const hashPassword = bcrypt.hashSync(password, 10)

            const result = await prisma.user.create({
                data: {
                    email,
                    name,
                    password: hashPassword
                }
            })

            if(!result){
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR),json({
                    error: true,
                    message: 'Signup Failed'
                })
            }

            return res.status(StatusCodes.CREATED).json({
                error: false,
                message: 'Signup Succesfully'
            })
        } catch (err) {
            console.log(err)
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: false,
                message: err.code = "P2002" ? 'User is registred' : err || 'internal server error'
            })
        }
    },
    signin: async(req, res) => {
      try {
        const {email, password} = req.body

        if(!email || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: true,
                message: 'Field has been provided'
            })
        }

    const user = await prisma.user.findUnique({
        where:{
            email
        }
    })
    if(!user){
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: true,
            message: 'Invalid Credentials'
        })
    }

    const comparePassword = bcrypt.compareSync(password, user.password)

    if(!comparePassword){
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: true,
            message: 'Invalid Credentials'
        })
    }

    const token = createJWT({payload: createToken(user)})

    return res.status(StatusCodes.OK).json({
        error: false,
        message: 'Login Succesfull',
        token: token
    })
          
      } catch (err) {
        return res.status(500).json({
            error: true,
            message: err.message || 'Internal Server Error'
        })
      }  
    }
}