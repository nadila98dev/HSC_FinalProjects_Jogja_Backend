const express = require('express')
const { getallCategory, getCategorybyId, createCategory, updateCategory, deleteCategory } = require('./controller')

const router = express.Router()

router.get('/api/v1/all', getallCategory)

router.get('/api/v1/getCategorybyId/:id', getCategorybyId)

router.post('/api/v1/create', createCategory)

router.put('/api/v1/update/:id', updateCategory)

router.delete('/api/v1/delete/:id', deleteCategory)



module.exports = router