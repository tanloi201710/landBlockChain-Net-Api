const homeController = require('../controller/homeController')
const userController = require('../controller/userController')
const { verifyTokenAndAuthorization } = require('../middlewares/verifyToken')

const router = require('express').Router()

// home page data
router.get('/', verifyTokenAndAuthorization, homeController().index)

// Get split request
router.get('/split', verifyTokenAndAuthorization, homeController().getSplitRequestOwner)

// Confirm transfer from receiver(one)
router.post('/confirmReceiveOne', verifyTokenAndAuthorization, homeController().handleConfirmFromReceiver)

// Confirm transfer from receiver(group)
router.post('/confirmReceiveGroup', verifyTokenAndAuthorization, homeController().handleConfirmFromReceiverCo)

// Confirm transfer from transfer group
router.post('/confirmTransfer', verifyTokenAndAuthorization, homeController().handleConfirmFromTransferCo)

// Cancel transfer
router.post('/cancelTransfer', verifyTokenAndAuthorization, homeController().cancelTransferLand)

// Confirm split land
router.post('/confirmSplit', verifyTokenAndAuthorization, homeController().handleConfirmSplit)

// Read the Notifications
router.put('/readNotifications', verifyTokenAndAuthorization, userController().handleReadMessages)

module.exports = router