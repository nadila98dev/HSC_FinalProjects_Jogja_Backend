const express = require('express')
const { signup, signin, detailUser, signinAdmin, count } = require('./controller');
const { authenticateUser, authenticateAdmin } = require('../../middlewares/auth');
const router =  express.Router();


router.post('/signin', signin)
router.post('/admin/signin', signinAdmin)
router.get('/count', authenticateAdmin, count)
router.post('/signup', signup)
router.get('/detail', authenticateUser, detailUser)

module.exports = router