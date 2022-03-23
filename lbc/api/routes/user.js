const homeController = require('../controller/homeController')
const { verifyTokenAndAuthorization } = require('../middlewares/verifyToken')

const router = require('express').Router()

// home page data
router.get('/', verifyTokenAndAuthorization, homeController().index)

// Confirm transfer from receiver(one)
router.post('/confirmReceiveOne', verifyTokenAndAuthorization, homeController().handleConfirmFromReceiver)

// Confirm transfer from receiver(group)
router.post('/confirmReceiveGroup', verifyTokenAndAuthorization, homeController().handleConfirmFromReceiverCo)

// Confirm transfer from transfer group
router.post('/confirmTransfer', verifyTokenAndAuthorization, homeController().handleConfirmFromTransferCo)

module.exports = router