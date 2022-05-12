const homeController = require('../controller/homeController')
const userController = require('../controller/userController')
const { verifyTokenAndManager } = require('../middlewares/verifyToken')

const router = require('express').Router()


// home page data
router.get('/', verifyTokenAndManager, homeController().index)

// Get all transfer
router.get('/transfers', verifyTokenAndManager, homeController().getTransferAdmin)

// Get all split request
router.get('/split', verifyTokenAndManager, homeController().getSplitRequestAdmin)

// update status land
router.post('/updateStatusLand', verifyTokenAndManager, homeController().updateStatusLandAdmin)

// Confirm transfer
router.post('/confirmTransfer', verifyTokenAndManager, homeController().confirmTransferAdmin)

// Confirm split land
router.post('/confirmSplit', verifyTokenAndManager, homeController().AdminConfirmSplit)

// Recharge to user's wallet
router.post('/recharge', verifyTokenAndManager, userController().handleAddToken)


module.exports = router