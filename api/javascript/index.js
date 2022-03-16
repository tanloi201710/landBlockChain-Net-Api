
const express = require('express')
const cors = require('cors')
// const homeController = require('./controller/homeController')

// const userController = require('./controller/userController');
// const transferController = require('./controller/transferController');

// const authMiddleware = require('./middlewares/auth.middleware')

const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// routers
const adminRoute = require('./routes/admin')
const userRoute = require('./routes/user')
const authRoute = require('./routes/auth')
const landRoute = require('./routes/land')
const managerRoute = require('./routes/manager')

// CORS 
const whitelist = [
  'http://localhost:3000',
]
const corsOptions = {
  origin: whitelist
}
app.use(cors(corsOptions))

app.use('/api/admin', adminRoute)
app.use('/api/manager', managerRoute)
app.use('/api/user', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/land', landRoute)



// app.get('/detail/:key', authMiddleware.requireAuth, homeController().detail)
// app.get('/', authMiddleware.requireAuth, homeController().index)
// app.post('/handleAddAsset', authMiddleware.requireAuth, homeController().handleAddAsset)
// app.post('/handleAddAssetCo', authMiddleware.requireAuth, homeController().handleAddAssetCo)

// app.get('/addAsset', authMiddleware.requireAuth, homeController().addAsset)


// app.get('/login', userController().login)
// app.get('/register', userController().register)
// app.post('/handleRegister', userController().handleRegister)
// app.post('/handleLogin', userController().handleLogin)


// app.get('/transferLand/:key', authMiddleware.requireAuth, homeController().transferLand)
// app.post('/handleTransferLand', authMiddleware.requireAuth, homeController().handleTransferLand)
// app.post('/handleTransferLandCo', authMiddleware.requireAuth, homeController().handleTransferLandCoToCo)

// app.post('/processTransfer', authMiddleware.requireAuth, homeController().processTransfer)


// app.get('/receiveLand', authMiddleware.requireAuth, homeController().receiveLand);
// app.get('/transferLandOwner', authMiddleware.requireAuth, homeController().transferLandOwner);

// app.get('/requestAllTransferLand', authMiddleware.requireAuth, homeController().transferAdmin)
// app.post('/handleConfirmFromReceiver', authMiddleware.requireAuth, homeController().handleConfirmFromReceiver);
// app.post('/handleConfirmFromTransferCo', authMiddleware.requireAuth, homeController().handleConfirmFromTransferCo);
// app.post('/handleConfirmFromReceiverCo', authMiddleware.requireAuth, homeController().handleConfirmFromReceiverCo);

// app.post('/detailReceive', authMiddleware.requireAuth, homeController().detailReceive)

// app.post('/updateStatusLandAdmin', authMiddleware.requireAuth, homeController().updateStatusLandAdmin)


// app.post('/confirmTransferAdmin', authMiddleware.requireAuth, homeController().confirmTransferAdmin)

// app.post('/cancelTransferLane', authMiddleware.requireAuth, homeController().cancelTransferLane)

// app.get('/addAssetOne', authMiddleware.requireAuth, homeController().addAssetOne)

// app.get('/addAssetCo', authMiddleware.requireAuth, homeController().addAssetCo)


// app.get('/blank', authMiddleware.requireAuth, homeController().blank)


// app.post('/addAssetFormOwner', authMiddleware.requireAuth, homeController().addAssetFormOwner)
// app.post('/checkUserExistAndReturnInfo', authMiddleware.requireAuth, transferController().checkUserExistAndReturnInfo)

// // add coordinates
// app.post('/addCoordinatesForm', authMiddleware.requireAuth, homeController().addCoordinatesForm)

// //add lengths
// app.post('/addLength', authMiddleware.requireAuth, homeController().addLength)
// //add parcels
// app.post('/addParcels', authMiddleware.requireAuth, homeController().addParcels)


// app.get('/transferLandOne/:key', authMiddleware.requireAuth, transferController().transferLandOne)
// app.get('/transferLandCo/:key', authMiddleware.requireAuth, transferController().transferLandCo)

// app.post('/logout', homeController().logoutUser)
// app.get('/fast', userController().fast)

// //error
// app.post('/returnError', authMiddleware.requireAuth, transferController().returnError)


// //admin
// app.get('/admin', userController().uiAdmin)
// app.get('/adminAddManager', authMiddleware.requireAuth, userController().adminAddManager)
// app.get('/adminDeleteManager', authMiddleware.requireAuth, userController().adminDeleteManager)

// app.post('/handleAddManager', authMiddleware.requireAuth, userController().handleAddManager)
// app.post('/adminDeleteManager', authMiddleware.requireAuth, userController().adminDeleteManager)


// //search

// app.post('/searchWithCondition', authMiddleware.requireAuth, userController().searchWithCondition)

// app.post('/typeOfSearch', authMiddleware.requireAuth, userController().typeOfSearch)


// //info

// app.get('/info', authMiddleware.requireAuth, userController().infomation)
// app.post('/handleSaveInfo', authMiddleware.requireAuth, userController().handleSaveInfo)


// //add token
// app.get('/addToken', authMiddleware.checkManager, userController().addToken)
// app.post('/handleAddToken', authMiddleware.checkManager, userController().handleAddToken)

// //wallet user
// app.get('/walletUser', authMiddleware.requireAuth, userController().walletUser)

// //modify
// app.get('/modifyUI/:key', authMiddleware.requireAuth, homeController().modifyUI)
// app.post('/handleModifyLand', authMiddleware.requireAuth, homeController().handleModifyLand)

// // transfer token
// app.post('/handleTransferToken', authMiddleware.requireAuth, userController().handleTransferToken)

// //statistical
// app.get('/statistical', authMiddleware.requireAuth, userController().statistical)
// app.post('/detailStatistical', authMiddleware.requireAuth, userController().detailStatistical)
// app.post('/dataDetailStatistical', authMiddleware.requireAuth, userController().dataDetailStatistical)



app.listen(3000, () => console.log("Server started with port 3000"));











