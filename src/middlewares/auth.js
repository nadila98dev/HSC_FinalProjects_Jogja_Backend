const { StatusCodes } = require("http-status-codes");
const { jwtVerify } = require("../utils/jwt");

const authenticateUser = (req, res, next) =>{
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

        console.log(payload)
       

        req.user = {
            email: payload.email,
            id: payload.id,
            role: payload.role,
        }
        console.log(req.user)

        next()

    } catch (err) {
        next(err)
    }
}

const authenticateAdmin = (req, res, next) =>{
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

        if(payload.role !== 'ADMIN'){
            return res.status(StatusCodes.FORBIDDEN).json({
                error: true,
                message: 'FORBIDDEN'
            })
        }

        console.log(payload)
       

        req.user = {
            email: payload.email,
            id: payload.id,
            role: payload.role,
        }
        console.log(req.user)

        next()

    } catch (err) {
        next(err)
    }
}


module.exports = { authenticateUser, authenticateAdmin }