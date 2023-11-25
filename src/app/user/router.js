const express = require('express');
const { getOneUser, getAllUser, create, update, destroy } = require('./controller');
const router =  express.Router();


router.get('/', getAllUser)
router.post('/', create)
router.put('/:id', update)
router.delete('/:id', destroy)
router.get('/:id', getOneUser)
module.exports = router