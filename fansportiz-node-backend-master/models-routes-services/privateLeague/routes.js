const router = require('express').Router()
const privateLeagueServices = require('./services')
const validators = require('./validators')
const { isUserAuthenticated, isBlockedByAdmin } = require('../../middlewares/middleware')

router.post('/user/private-league/v2', validators.addPrivateLeagueV2, isUserAuthenticated, isBlockedByAdmin, privateLeagueServices.addV2)
router.post('/user/private-league/v3', validators.addPrivateLeagueV3, isUserAuthenticated, isBlockedByAdmin, privateLeagueServices.addV3) // user create private league using Entry fee
router.post('/user/private-league/calculate-fee/v2', validators.calculateEntryFee, isUserAuthenticated, privateLeagueServices.calculateEntryFeeV2) // calculate entry fee using totalPayout
router.post('/user/private-league/calculate-total-payout/v1', validators.calculateTotalPayout, isUserAuthenticated, privateLeagueServices.calculateTotalPayoutV1) // calculate totalPayout using entry fee
router.post('/user/private-league/verify-code/v1', validators.verifyContestCode, isUserAuthenticated, privateLeagueServices.verifyContestCode)
router.post('/user/private-league/prize-breakup/v2', validators.generatePrizeBreakup, isUserAuthenticated, privateLeagueServices.generatePrizeBreakupV2)

module.exports = router
