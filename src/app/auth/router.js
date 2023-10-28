const express = require('express')
const { signup, signin } = require('./controller')
const router =  express.Router();

router.get('/signup', (req, res) => {
    res.send('APa Kabar')
})
router.post('/signin', signin)
router.post('/signup', signup)

module.exports = router