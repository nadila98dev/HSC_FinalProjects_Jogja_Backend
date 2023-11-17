const express = require('express')
const { signup, signin, detailUser } = require('./controller');
const { authenticateUser } = require('../../middlewares/auth');
const router =  express.Router();


router.post('/signin', signin)
router.post('/signup', signup)
router.get('/detail', authenticateUser, detailUser)

module.exports = router