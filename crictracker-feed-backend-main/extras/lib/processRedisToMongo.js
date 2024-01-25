const moment = require('moment')
const { _ } = require('../../global')
const { redis: { redisFeedDb } } = require('../../utils')
const { SubscriptionModel } = require('../../modules/subscriptions')
const { ApiLogsModel } = require('../../modules/api-logs')

module.exports = async function () {
  try {
    function prepareBulkWriteQuery(key, updateField) {
      const updateArr = []
      const subscriptionArrUpdate = []
      for (const keys of Object.keys(key)) {
        // clientId:subscriptionId
        const ids = keys.split(':')
        const count = key[keys]
        const updateQuery = { updateOne: { filter: { iClientId: _.mongify(ids[0]), iSubscriptionId: _.mongify(ids[1]) }, update: { $set: { [updateField]: count } } } }
        updateArr.push(updateQuery)
        subscriptionArrUpdate.push(ids[1])
      }
      return { updateArr, subscriptionArrUpdate }
    }

    // Store logs
    const getLogs = await redisFeedDb.keys('logs:*:*')
    const generalApiCounts = await redisFeedDb.hgetall('generalApiCount')
    const articleCounts = await redisFeedDb.hgetall('articleCount')
    const exclusiveArticleCounts = await redisFeedDb.hgetall('exclusiveArticleCount')

    const logsArr = []
    for (const getLog of getLogs) {
      const logMembers = await redisFeedDb.smembers(getLog)
      logMembers.forEach((logMember) => logsArr.push(...JSON.parse(logMember)))
      await redisFeedDb.del(getLog)
    }

    const updateArr = []
    let subscriptionArrUpdate = []
    if (generalApiCounts) {
      const bulkWriteQuery = prepareBulkWriteQuery(generalApiCounts, 'oStats.nApiUsed')
      updateArr.push(...bulkWriteQuery.updateArr)
      subscriptionArrUpdate.push(...bulkWriteQuery.subscriptionArrUpdate)
    }

    if (articleCounts) {
      const bulkWriteQuery = prepareBulkWriteQuery(articleCounts, 'oStats.nArticleUsed')
      updateArr.push(...bulkWriteQuery.updateArr)
      subscriptionArrUpdate.push(...bulkWriteQuery.subscriptionArrUpdate)
    }

    if (exclusiveArticleCounts) {
      const bulkWriteQuery = prepareBulkWriteQuery(exclusiveArticleCounts, 'oStats.nExclusiveUsed')
      updateArr.push(...bulkWriteQuery.updateArr)
      subscriptionArrUpdate.push(...bulkWriteQuery.subscriptionArrUpdate)
    }

    subscriptionArrUpdate = [...new Set(subscriptionArrUpdate)]
    const allSubscriptions = await SubscriptionModel.find({ _id: subscriptionArrUpdate.map((ele) => _.mongify(ele)) }).lean()
    const filteredNotActiveSubscriptions = allSubscriptions.filter((ele) => ele.eStatus !== 'a').map((filteredSubscription) => `${filteredSubscription.iClientId}:${filteredSubscription._id}`)

    const getDayWiseCounts = await redisFeedDb.keys('generalDayCount:*:*:*:*')
    const deleteBefore8Days = []

    for (const getDayWiseCount of getDayWiseCounts) {
      const date = getDayWiseCount.split(':')[getDayWiseCount.split(':').length - 1]
      const difference = moment().diff(moment(date), 'days')
      if (difference >= 8) deleteBefore8Days.push(getDayWiseCount)
    }

    if (filteredNotActiveSubscriptions.length) await redisFeedDb.hdel('generalApiCount', ...filteredNotActiveSubscriptions)
    if (filteredNotActiveSubscriptions.length) await redisFeedDb.hdel('exclusiveArticleCount', ...filteredNotActiveSubscriptions)
    if (filteredNotActiveSubscriptions.length) await redisFeedDb.hdel('articleCount', ...filteredNotActiveSubscriptions)
    const filteredNotActiveSubscriptionsGeneral = allSubscriptions.filter((ele) => ele.eStatus !== 'a').map((filteredSubscription) => `generalDayCount:${filteredSubscription.iClientId}:${filteredSubscription._id}:*:*`)
    if (filteredNotActiveSubscriptionsGeneral.length) await redisFeedDb.del(...filteredNotActiveSubscriptionsGeneral)
    if (deleteBefore8Days.length) await redisFeedDb.del(...deleteBefore8Days)
    await SubscriptionModel.bulkWrite(updateArr)
    await ApiLogsModel.insertMany(logsArr)
  } catch (error) {
    console.log(error)
    return error
  }
}
