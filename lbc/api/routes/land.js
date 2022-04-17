const homeController = require('../controller/homeController')
const { verifyTokenAndAuthorization } = require('../middlewares/verifyToken')

const router = require('express').Router()

// Get all receive transfer
router.get('/receive', verifyTokenAndAuthorization, homeController().getReceiveLand)

// Get all send transfer
router.get('/send', verifyTokenAndAuthorization, homeController().getSendLand)

// Add land for one
router.post('/add', verifyTokenAndAuthorization, homeController().handleAddAsset)

// Add land for group
router.post('/addCo', verifyTokenAndAuthorization, homeController().handleAddAssetCo)

// Transfer land for one
router.post('/transferOne', verifyTokenAndAuthorization, homeController().handleTransferLand)

// Transfer land for group
router.post('/transferGroup', verifyTokenAndAuthorization, homeController().handleTransferLandCo)

// Split land 
router.post('/split', verifyTokenAndAuthorization, homeController().handleSplitLand)

module.exports = router