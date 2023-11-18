const express = require('express')
const { getallCategory, getCategorybyId, createCategory, updateCategory, deleteCategory } = require('./controller')
const upload = require('../../middlewares/multer')
const { authenticateAdmin } = require('../../middlewares/auth')

const router = express.Router()

router.get('/', getallCategory)

router.get('/:id', getCategorybyId)

router.post('/',  upload.single('image'), authenticateAdmin, createCategory)

router.put('/:id', upload.single('image'), authenticateAdmin, updateCategory)

router.delete('/:id', authenticateAdmin, deleteCategory)



module.exports = router 