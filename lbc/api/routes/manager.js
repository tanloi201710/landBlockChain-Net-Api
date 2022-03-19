const homeController = require('../controller/homeController')
const { verifyTokenAndManager } = require('../middlewares/verifyToken')

const router = require('express').Router()


// home page data
router.get('/', verifyTokenAndManager, homeController().index)

module.exports = router