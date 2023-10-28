const jwt = require('jsonwebtoken')
const { JwtSecret, JwtExpired } = require('../config')

const createJWT = ({payload}) => {
    const token = jwt.sign(payload, JwtSecret, {
        expiresIn: JwtExpired
    })

    return token
}

const jwtVerify = ({token}) => jwt.verify(token, JwtSecret)

module.exports = { createJWT, jwtVerify }