const UsersModel = require('../user/model')
const { convertToDecimal } = require('../../helper/utilities.services')

const generateRank = async (userLeagues, series, id) => {
  let r = 1
  if (userLeagues.length === 1) {
    const user = await UsersModel.findById(userLeagues[0]._id, { sUsername: 1, sProPic: 1 }).lean()
    const { sUsername, sProPic = '' } = user
    return { sName: series.sName, iSeriesId: id, iCategoryId: series._id, iUserId: userLeagues[0]._id, sUsername, sProPic, nUserRank: 1, nUserScore: convertToDecimal(userLeagues[0].nUserScore, 2) }
  } else if (userLeagues.length === 2) {
    const user1 = await UsersModel.findById(userLeagues[0]._id, { sUsername: 1, sProPic: 1, _id: 0 }).lean()
    const user2 = await UsersModel.findById(userLeagues[1]._id, { sUsername: 1, sProPic: 1, _id: 0 }).lean()
    userLeagues[0].sUserName = user1.sUsername
    userLeagues[0].sProPic = user1.sProPic
    userLeagues[1].sUserName = user2.sUsername
    userLeagues[1].sProPic = user2.sProPic
    if (convertToDecimal(userLeagues[0].nUserScore, 2) === convertToDecimal(userLeagues[1].nUserScore, 2)) {
      return [
        { sName: series.sName, iSeriesId: id, iCategoryId: series._id, iUserId: userLeagues[0]._id, sUsername: userLeagues[0].sUserName, sProPic: userLeagues[0].sProPic, nUserRank: 1, nUserScore: convertToDecimal(userLeagues[0].nUserScore, 2) },
        { sName: series.sName, iSeriesId: id, iCategoryId: series._id, iUserId: userLeagues[1]._id, sUsername: userLeagues[1].sUserName, sProPic: userLeagues[1].sProPic, nUserRank: 1, nUserScore: convertToDecimal(userLeagues[1].nUserScore, 2) }
      ]
    } else if (convertToDecimal(userLeagues[0].nUserScore, 2) > convertToDecimal(userLeagues[1].nUserScore, 2)) {
      return [
        { sName: series.sName, iSeriesId: id, iCategoryId: series._id, iUserId: userLeagues[0]._id, sUsername: userLeagues[0].sUserName, sProPic: userLeagues[0].sProPic, nUserRank: 1, nUserScore: convertToDecimal(userLeagues[0].nUserScore, 2) },
        { sName: series.sName, iSeriesId: id, iCategoryId: series._id, iUserId: userLeagues[1]._id, sUsername: userLeagues[1].sUserName, sProPic: userLeagues[1].sProPic, nUserRank: 2, nUserScore: convertToDecimal(userLeagues[1].nUserScore, 2) }
      ]
    } else {
      return [
        { sName: series.sName, iSeriesId: id, iCategoryId: series._id, iUserId: userLeagues[0]._id, sUsername: userLeagues[0].sUserName, sProPic: userLeagues[0].sProPic, nUserRank: 2, nUserScore: convertToDecimal(userLeagues[0].nUserScore, 2) },
        { sName: series.sName, iSeriesId: id, iCategoryId: series._id, iUserId: userLeagues[1]._id, sUsername: userLeagues[1].sUserName, sProPic: userLeagues[1].sProPic, nUserRank: 1, nUserScore: convertToDecimal(userLeagues[1].nUserScore, 2) }
      ]
    }
  } else {
    const aUserRanks = []
    const aUserIds = userLeagues.map((e) => e._id)
    const usersInfo = await UsersModel.find({ _id: { $in: aUserIds } }, { sUsername: 1, sProPic: 1 })
    for (let i = 0; i < userLeagues.length; i++) {
      const userLeague = userLeagues[i]
      userLeague.nUserRank = r
      if (i + 1 >= userLeagues.length) {
        userLeagues[userLeagues.length - 1].nUserRank = convertToDecimal(userLeagues[userLeagues.length - 1].nUserScore, 2) === convertToDecimal(userLeagues[userLeagues.length - 2].nUserScore, 2) ? userLeagues[userLeagues.length - 1].nUserRank : r++
      } else if (convertToDecimal(userLeagues[i + 1].nUserScore, 2) !== convertToDecimal(userLeague.nUserScore, 2)) {
        r = i + 2
      }
      // const user = await UsersModel.findById(userLeague._id, { sUsername: 1, sProPic: 1 }).lean()
      const { sUsername, sProPic = '' } = usersInfo[usersInfo.findIndex(user => user._id === userLeague._id)]
      aUserRanks.push({ sName: series.sName, iSeriesId: id, iCategoryId: series._id, iUserId: userLeague._id, sUsername, sProPic, nUserRank: userLeague.nUserRank, nUserScore: convertToDecimal(userLeague.nUserScore, 2) })
    }
    return aUserRanks
  }
}

module.exports = {
  generateRank
}
