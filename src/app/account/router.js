const express = require('express')
const { update, updateImage } = require('./controller');
const { authenticateUser } = require('../../middlewares/auth');
const router =  express.Router();


router.put('/update', authenticateUser, update)
router.put('/update-image', authenticateUser, updateImage)

module.exports = router