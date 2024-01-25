const settingServices = require('../setting/services')
const commonRuleServices = require('../commonRules/services')
const { convertToDecimal } = require('../../helper/utilities.services')

// eslint-disable-next-line max-params
async function privateContestFeeCalculation(nMax, nTotalPayout, league, bAdmin) {
  if (!bAdmin && !league) {
    // User -> Private League creator bonus calculation
    let [plc, lcc, lcg, pcf, pcs] = await Promise.all([
      commonRuleServices.findRule('PLC'),
      commonRuleServices.findRule('LCC'),
      commonRuleServices.findRule('LCG'),
      settingServices.findSetting('PCF'),
      settingServices.findSetting('PCS')
    ])
    plc = !plc ? { nAmount: 0 } : plc
    lcc = !lcc ? { nAmount: 0 } : lcc
    lcg = !lcg ? { nAmount: 0 } : lcg
    let nPrice = (((parseFloat(nTotalPayout) * plc.nAmount) / 100) + parseFloat(nTotalPayout)) / parseInt(nMax)
    const nReminder = nPrice % 0.5
    if (nReminder > 0) {
      nPrice = nPrice - nReminder + 0.5
    }
    let nCreatorBonus = convertToDecimal(((nPrice * nMax) - nTotalPayout) * lcc.nAmount / 100)
    const nLeagueCreatorGst = lcg.nAmount
    const nCreatorBonusGST = convertToDecimal((nCreatorBonus * 100) / (100 + nLeagueCreatorGst))
    const nCreatorDeductedGST = convertToDecimal(nCreatorBonus - nCreatorBonusGST)
    const nPreGstDeduction = nCreatorBonus
    nCreatorBonus = parseFloat(nCreatorBonus - nCreatorDeductedGST)

    return { nCreatorBonus, nPrice, nCreatorDeductedGST, plc, lcc, lcg, pcf, pcs, nPreGstDeduction }
  }
  // Admin Commision calculation
  if (bAdmin && league.bPoolPrize && Array.isArray(league.aLeaguePrize) && league.aLeaguePrize.length && league.bPrivateLeague) {
    let { nJoined, nAdminCommission, nCreatorBonusGst: nCreatorBonus, nPrice } = league
    const nACommission = ((nJoined * nAdminCommission) / nMax).toFixed(2)
    nAdminCommission = Number(nACommission)
    const nCBonus = ((nJoined * nCreatorBonus) / nMax).toFixed(2)
    nCreatorBonus = Number(nCBonus)
    const newTotalPayout = (nPrice * nJoined) - nAdminCommission - nCreatorBonus
    return newTotalPayout
  }
}

module.exports = privateContestFeeCalculation
