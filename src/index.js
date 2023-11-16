const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()


const port = process.env.SERVER_PORT || 3000

// Router
const authRouter = require('./app/auth/router')
// const userRouter = require('./app/users/router')

app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: false }));

// Version
const version = '/api/v1'




app.use(`${version}/auth`, authRouter)
// app.use(`${version}/users`, userRouter)



app.listen(port, () => {
  console.log(`Server running in http://localhost:${port}`)
})