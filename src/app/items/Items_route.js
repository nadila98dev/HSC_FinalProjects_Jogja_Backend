const express = require('express')
const multer = require('multer')
const { getAllItems, getItembyId, createItem, updateItem, deleteItem } = require('./itemsController')

const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage})

router.get('/api/v1/all', getAllItems)

router.get('/api/v1/itembyid/:id', getItembyId)

router.post('/api/v1/create', upload.single('src'), createItem)

router.put('/api/v1/update/:id', updateItem)

router.delete('/api/v1/delete/:id', deleteItem);

module.exports = router