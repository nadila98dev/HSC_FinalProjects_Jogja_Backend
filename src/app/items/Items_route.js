const express = require('express')
const { getAllItems, getItembyId, createItem, updateItem, deleteItem } = require('./itemsController')
const upload = require('../../middlewares/multer')
const { authenticateAdmin } = require('../../middlewares/auth')

const router = express.Router()

router.get('/', getAllItems)

// router.get('/:slug', detailItems);

router.get('/:id', getItembyId)


router.post('/', upload.single('image'),authenticateAdmin, createItem)

router.put('/:id', upload.single('image'), authenticateAdmin, updateItem)

router.delete('/:id', authenticateAdmin, deleteItem);

module.exports = router