const cancleTransferFromUser = require('./cancleTransferFromUser')
const checkLandOwner = require('./checkLandOwner')
const checkLandOwnerCo = require('./checkLandOwnerCo')
const confirmTransferLand = require('./confirmTransferLand')
const enrollAdmin = require('./enrollAdmin')
const inkvode_token = require('./inkvode_token')
const inkvode_token_delete = require('./inkvode_token_delete')
const inkvode_token_detention = require('./inkvode_token_detention')
const inkvode_token_getAccountId = require('./inkvode_token_getAccountId')
const inkvode_token_getBalance = require('./inkvode_token_getBalance')
const inkvode_token_transfer = require('./inkvode_token_transfer')
const inkvode_transfer_CoToCo = require('./inkvode_transfer_CoToCo')
const inkvode_transfer_CoToOne = require('./inkvode_transfer_CoToOne')
const inkvode_transfer_OneToCo = require('./inkvode_transfer_OneToCo')
const inkvode_transfer_OneToOne = require('./inkvode_transfer_OneToOne')
const invoke_land_Co = require('./invoke_land_Co')
const invoke_land_One = require('./invoke_land_One')
const modifyLand = require('./modifyLand')
const queryAllLands = require('./queryAllLands')
const queryAllLandsCo = require('./queryAllLandsCo')
const queryAllLandsCoUserAndAdmin = require('./queryAllLandsCoUserAndAdmin')
const queryAllTransfer = require('./queryAllTransfer')
const queryAllTransferReceiver = require('./queryAllTransferReceiver')
const queryLand = require('./queryLand')
const queryTransfer = require('./queryTransfer')
const queryTransferOne = require('./queryTransferOne')
const queryTransferOwner = require('./queryTransferOwner')
const queryTransferOwnerCo = require('./queryTransferOwnerCo')
const { register } = require('./register')
const searchWithCondition = require('./searchWithCondition')
const transferLand = require('./transferLand')
const updateLand = require('./updateLand')
const updateTransfer = require('./updateTransfer')
const updateTransferCo = require('./updateTransferCo')
const inkvode_split_One = require('./inkvode_split_One')
const inkvode_split_Co = require('./inkvode_split_Co')
const queryAllSplitRequest = require('./queryAllSplitRequest')
const queryOneSplitRequest = require('./queryOneSplitRequest')
const queryOwnerSplitRequest = require('./queryOwnerSplitRequest')
const updateSplitRequest = require('./updateSplitRequest')
const updateSplitRequestFromCo = require('./updateSplitRequestFromCo')
const confirmSplitLand = require('./confirmSplitLand')


module.exports = {
    cancleTransferFromUser, checkLandOwner, checkLandOwnerCo,
    confirmTransferLand, enrollAdmin, inkvode_token,
    inkvode_token_delete, inkvode_token_detention,
    inkvode_token_getAccountId, inkvode_token_getBalance,
    inkvode_token_transfer, inkvode_transfer_CoToCo,
    inkvode_transfer_CoToOne, inkvode_transfer_OneToCo,
    inkvode_transfer_OneToOne, invoke_land_Co, invoke_land_One,
    modifyLand, queryAllLands, queryAllLandsCo, queryAllLandsCoUserAndAdmin,
    queryAllTransfer, queryAllTransferReceiver, queryLand, queryTransfer,
    queryTransferOne, queryTransferOwner, queryTransferOwnerCo, register,
    searchWithCondition, transferLand, updateLand, updateTransfer, updateTransferCo,
    inkvode_split_One, inkvode_split_Co, queryAllSplitRequest, queryOneSplitRequest,
    queryOwnerSplitRequest, updateSplitRequest, updateSplitRequestFromCo,
    confirmSplitLand
}