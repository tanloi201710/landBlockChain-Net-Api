const homeController = require('../controller/homeController')

const router = require('express').Router()

// home page data
router.get('/', homeController().index)

module.exports = router