const express = require('express')
const { getallCategory, getCategorybyId, createCategory, updateCategory, deleteCategory } = require('./controller')
const upload = require('../../middlewares/multer')
const { authenticateAdmin } = require('../../middlewares/auth')

const router = express.Router()

router.get('/', getallCategory)

router.get('/:id', getCategorybyId)

router.post('/',  upload.single('image'),  createCategory)

router.put('/:id', upload.single('image'),  updateCategory)

router.delete('/:id', deleteCategory)



module.exports = router 