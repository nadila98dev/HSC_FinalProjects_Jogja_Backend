const express = require('express')
const app = express()
require('dotenv').config()
const itemRoute = require('./routes/Items_route')


const port = process.env.SERVER_PORT || 3000

// Router
const authRouter = require('./app/auth/router')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(itemRoute);
// Version
const version = '/api/v1'

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.use(`${version}/auth`, authRouter)

app.listen(port, () => {
  console.log(`Server running in http://localhost:${port}`)
})