const homeController = require('../controller/homeController')
const { verifyTokenAndAuthorization } = require('../middlewares/verifyToken')

const router = require('express').Router()

// Add land for one
router.post('/add', verifyTokenAndAuthorization, homeController().handleAddAsset)

module.exports = router