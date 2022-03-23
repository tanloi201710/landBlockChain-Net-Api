const homeController = require('../controller/homeController')
const { verifyTokenAndAuthorization } = require('../middlewares/verifyToken')

const router = require('express').Router()

// Get all receive transfer
router.get('/receive', verifyTokenAndAuthorization, homeController().getReceiveLand)

// Add land for one
router.post('/add', verifyTokenAndAuthorization, homeController().handleAddAsset)

// Add land for group
router.post('/addCo', verifyTokenAndAuthorization, homeController().handleAddAssetCo)

// Transfer land for one
router.post('/transferOne', verifyTokenAndAuthorization, homeController().handleTransferLand)

// Transfer land for group
router.post('/transferGroup', verifyTokenAndAuthorization, homeController().handleTransferLandCo)

module.exports = router