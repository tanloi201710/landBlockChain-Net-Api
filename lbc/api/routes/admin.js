
const homeController = require('../controller/homeController')
const userController = require('../controller/userController')

const router = require('express').Router()

// Add manager
router.post('/addManager', userController().handleAddManager)

module.exports = router