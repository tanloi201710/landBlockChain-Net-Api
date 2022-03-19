const homeController = require('../controller/homeController')
const { verifyTokenAndAuthorization } = require('../middlewares/verifyToken')

const router = require('express').Router()

// home page data
router.get('/', verifyTokenAndAuthorization, homeController().index)

module.exports = router