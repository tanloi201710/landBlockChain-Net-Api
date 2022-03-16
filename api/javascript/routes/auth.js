const userController = require('../controller/userController')

const router = require('express').Router()

// Login
router.post('/login', userController().handleLogin)

module.exports = router