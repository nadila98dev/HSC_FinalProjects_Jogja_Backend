const express = require('express')
const { getAllItems, getItembyId, createItem, updateItem, deleteItem } = require('../controllers/ItemsController')

const router = express.Router()

router.get('/api/v1/items', getAllItems)

router.get('/api/v1/items/:id', getItembyId)

router.post('/api/v1/items', createItem)

router.put('/api/v1/items/:id', updateItem)

router.delete('/api/v1/items/:id', deleteItem)

module.exports = router