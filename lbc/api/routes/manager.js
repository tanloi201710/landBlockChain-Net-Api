const homeController = require('../controller/homeController')
const { verifyTokenAndManager } = require('../middlewares/verifyToken')

const router = require('express').Router()


// home page data
router.get('/', verifyTokenAndManager, homeController().index)

// Get all transfer
router.get('/transfers', verifyTokenAndManager, homeController().getTransferAdmin)

// update status land
router.post('/updateStatusLand', verifyTokenAndManager, homeController().updateStatusLandAdmin)

// Confirm transfer
router.post('/confirmTransfer', verifyTokenAndManager, homeController().confirmTransferAdmin)


module.exports = router