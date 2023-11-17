const express = require('express')
const { getAllItems, getItembyId, createItem, updateItem, deleteItem } = require('./itemsController')

const router = express.Router()

router.get('/api/v1/all', getAllItems)

router.get('/api/v1/itembyid/:id', getItembyId)

router.post('/api/v1/create', createItem)

router.put('/api/v1/update/:id', updateItem)

router.delete('/api/v1/delete/:id', deleteItem);

module.exports = router