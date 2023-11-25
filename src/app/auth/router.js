const express = require('express')
const { signup, signin, detailUser, signinAdmin } = require('./controller');
const { authenticateUser } = require('../../middlewares/auth');
const router =  express.Router();


router.post('/signin', signin)
router.post('/admin/signin', signinAdmin)
router.post('/signup', signup)
router.get('/detail', authenticateUser, detailUser)

module.exports = router