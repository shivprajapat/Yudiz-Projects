const privateContestFeeCalculation = require('../privateLeague/common')
const { getTotalPayoutForLeague } = require('../league/common')
const { convertToDecimal } = require('../../helper/utilities.services')

const getUpdatedPrizeBreakupData = async (data) => {
  const result = []
  if (Array.isArray(data) && data.length) {
    for (const league of data) {
      const { nJoined, nMin, nPrice, nDeductPercent, nMax, eMatchStatus = 'U' } = league
      // If leagues are pool leagues
      if (league.bPoolPrize && Array.isArray(league.aLeaguePrize) && league.aLeaguePrize.length) {
        if (league.bPrivateLeague) {
          // for private +  pool prize
          const newTotalPayout = await privateContestFeeCalculation(nMax, 0, league, true)
          if (['L', 'I'].includes(eMatchStatus) && !league.bPrizeDone) league.nTotalPayout = newTotalPayout

          league.aLeaguePrize.map(
            ({ nPrize, nRankTo, nRankFrom }, i) => {
              league.aLeaguePrize[i].nPrize = Number((((league.nTotalPayout * nPrize) / 100) / (nRankTo - nRankFrom + 1)).toFixed(2))
            })
        } else {
          // for public +  pool prize
          const nTotalPayout = getTotalPayoutForLeague(nJoined, nMin, nPrice, nDeductPercent, nMax, eMatchStatus)
          league.nTotalPayout = convertToDecimal(nTotalPayout)
          league.aLeaguePrize.map(
            ({ nPrize, nRankTo, nRankFrom }, i) => {
              league.aLeaguePrize[i].nPrize = Number((((league.nTotalPayout * nPrize) / 100) / (nRankTo - nRankFrom + 1)).toFixed(2))
            })
        }
      }
      result.push(league)
    }
  }
  return result
}

module.exports = getUpdatedPrizeBreakupData
