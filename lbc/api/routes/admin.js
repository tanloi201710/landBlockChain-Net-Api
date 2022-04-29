
const homeController = require('../controller/homeController')
const userController = require('../controller/userController')
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken')

const router = require('express').Router()

// Add manager
router.post('/addManager', userController().handleAddManager)

// Init users
router.get('/init', userController().initUsers)

// Get managers
router.get('/managers', verifyTokenAndAdmin, userController().adminGetManager)

// Delete manager
router.delete('/:userId', verifyTokenAndAdmin, userController().adminDeleteManager)

module.exports = router