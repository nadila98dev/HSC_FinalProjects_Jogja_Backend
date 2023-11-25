require('dotenv').config()
module.exports = {
    JwtSecret: process.env.JWT_SECRET,
    JwtExpired: process.env.JWT_EXPIRED,
    MidtransClientKey: process.env.MIDTRANS_CLIENT_KEY,
    MidtransServerKey: process.env.MIDTRANS_SERVER_KEY,

}