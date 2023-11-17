const express = require('express')
const { update, updateImage } = require('./controller');
const { authenticateUser } = require('../../middlewares/auth');
const router =  express.Router();


router.put('/update', update)
router.put('/update-image', updateImage)

module.exports = router