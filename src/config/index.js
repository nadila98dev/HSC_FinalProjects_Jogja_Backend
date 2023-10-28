require('dotenv').config()
module.exports = {
    JwtSecret: process.env.JWT_SECRET,
    JwtExpired: process.env.JWT_EXPIRED
}