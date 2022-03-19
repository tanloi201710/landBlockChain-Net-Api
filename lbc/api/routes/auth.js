const userController = require('../controller/userController')

const router = require('express').Router()

// Login
router.post('/login', userController().handleLogin)

// Register
router.post('/register', userController().handleRegister)

module.exports = router