const { queuePush } = require('../../helper/redis')

function getPrice(aLeaguePrize, rank, count) {
  let nTotalRealMoney = 0
  let nTotalBonus = 0
  const aTotalExtraWin = []

  for (const leaguePrice of aLeaguePrize) {
    const p = leaguePrice

    for (let i = rank; i < (rank + count); i++) {
      if (i >= p.nRankFrom && i <= p.nRankTo) {
        if (p.eRankType === 'E') {
          aTotalExtraWin.push({ sImage: p.sImage, sInfo: p.sInfo })
        } else if (p.eRankType === 'R') {
          nTotalRealMoney = nTotalRealMoney + Number(p.nPrize)
        } else if (p.eRankType === 'B') {
          nTotalBonus = nTotalBonus + Number(p.nPrize)
        }
      }
    }
  }

  return { nTotalRealMoney: Number(nTotalRealMoney.toFixed(2)), nTotalBonus: Number(nTotalBonus.toFixed(2)), aTotalExtraWin }
}
async function autoCreateAndRewardQueue(matchLeague, user) {
  console.log({ max: matchLeague.nMax, nJoined: matchLeague.nJoined })
  if (Number(matchLeague.nMax) === Number(matchLeague.nJoined) && matchLeague.bAutoCreate && matchLeague.bUnlimitedJoin === false) {
    console.log('Am I pushed')
    await queuePush('autoCreateLeague', matchLeague)
  }
  // Assign referral on first league join
  const { sReferrerRewardsOn = '', iReferredBy = '' } = user
  if (iReferredBy && sReferrerRewardsOn && (sReferrerRewardsOn === 'FIRST_LEAGUE_JOIN' || (sReferrerRewardsOn === 'FIRST_PAID_LEAGUE_JOIN' && matchLeague.nPrice > 0))) {
    await queuePush('processReferReward', { sReferral: 'LB', iUserId: user._id, sReferrerRewardsOn, iReferredBy, nJoinSuccess: matchLeague.nJoined })
  }
}
module.exports = {
  getPrice,
  autoCreateAndRewardQueue
}
