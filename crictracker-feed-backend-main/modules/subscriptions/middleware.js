const ClientModel = require('../clients/model')
const SubscriptionModel = require('../subscriptions/model')
const { ArticleServices } = require('../articles')
const { _ } = require('../../global')
const { redis: { redisFeedDb } } = require('../../utils')

const isFeedSubscriptionAccessible = async (req, res, next) => {
  try {
    const query = _.pick(req.query, ['token'])
    const headers = _.pick(req.headers, ['token'])
    let { path: sSlug } = req

    // LEET: remove 1st and last slash

    const token = query.token || headers.token
    if (sSlug[0] === '/') sSlug = sSlug.substring(1)
    if (sSlug[sSlug.length - 1] === '/') sSlug = sSlug.substring(0, sSlug.length - 1)
    req.sSlug = sSlug

    if (!token) return res.status(400).send({ message: 'Hey Hey Hey!!! api key is required.' })
    // Get Admin
    const clientData = await ClientModel.findOne({ 'aToken.sToken': token })
    const subscription = await SubscriptionModel.findOne({ iClientId: clientData._id, eStatus: 'a' }).lean()

    if (!clientData) return res.status(401).send({ message: 'Token Invalid' })

    req.client = clientData

    // Check status of the token
    const tokenIndex = clientData?.aToken?.findIndex((ele) => ele?.sToken === token)
    if (clientData?.aToken[tokenIndex]?.eStatus !== 'a') return res.status(401).send({ message: 'Token Invalid' })
    if (new Date().getTime() >= new Date(clientData?.aToken[tokenIndex]?.dValidTill)?.getTime()) return res.status(401).send({ message: 'Token Expired' })

    // Check Subscription Status
    if (!subscription) return res.status(404).send({ message: 'No active subscription Found' })

    req.subscription = subscription

    if (subscription.eStatus !== 'a' || new Date().getTime() >= new Date(subscription.dSubscriptionEnd).getTime()) return res.status(404).send({ message: 'Subscription expired or inactive' })

    const seoData = await ArticleServices.getSeoBySlug({ sSlug })
    if (!seoData) return res.status(404).send({ message: 'No category found' })

    // LEET: Should be check for common API limit - Done
    const getApiCount = await redisFeedDb.hget('generalApiCount', `${clientData._id}:${subscription._id}`)

    if (subscription?.oStats?.nApiTotal < subscription?.oStats?.nApiUsed + (+req.query.nLimit ?? 0) || subscription?.oStats?.nApiTotal < +getApiCount + (+req.query.nLimit ?? 0)) return res.status(400).send({ message: 'Api quota exceeded' })

    // LEET: is URL type is exclusive - Done
    if (subscription.aSubscriptionType.includes('exclusive') && seoData.eType === 'exclusive') {
      if (subscription?.oStats?.nExclusiveTotal < subscription?.oStats?.nExclusiveUsed + (+req.query.nLimit ?? 0)) return res.status(400).send({ message: 'Article quota exceeded' })
      req.eSubType = 'exclusive'
    }

    // LEET: is URL type is Category, Should check is req.eSubType = exclusive set or not -> yes then do not worry about category - Done
    if (subscription.aSubscriptionType.includes('category') && seoData.eType === 'ct' && req.eSubType !== 'exclusive') {
      // Check the subscription type is valid or not.
      if (!subscription?.aCategoryIds?.length) return res.status(400).send({ sMessage: 'Category not subscribed' })
      if (subscription?.aCategoryIds?.length) {
        // LEET: use array.some - Done
        if (!(subscription.aCategoryIds.some((ele) => ele._id.toString() === seoData.iId.toString()))) return res.status(401).send({ message: 'Not authorized to access this category' })
      }
      req.eSubType = 'category'
    }

    // LEET: Should check is req.eSubType = exclusive set or not -> yes then do not worry about article - Done
    if (subscription.aSubscriptionType.includes('article') && req.eSubType !== 'exclusive') {
      const getArticleCount = await redisFeedDb.hget('articleCount', `${clientData._id}:${subscription._id}`)

      if (subscription?.oStats?.nArticleTotal < subscription?.oStats?.nArticleUsed + (+req.query.nLimit ?? 0) || subscription?.oStats?.nArticleTotal < +getArticleCount + (+req.query.nLimit ?? 0)) return res.status(400).send({ message: 'Article quota exceeded' })
      req.eSubType = 'article'
      // Article api quota exceeded
    }

    // Should check req.eSubType is assigned or not -> If yes then it is increase count as per that type, Should check is req.eSubType = exclusive set or not -> yes then do not worry about api - Done
    if (!req.eSubType && subscription.aSubscriptionType.includes('api') && req.eSubType !== 'exclusive') {
      req.eSubType = 'api'
    }
    console.log(req.eSubType)
    if (!req.eSubType) res.status(404).send({ message: 'Server denied you to access this URL!' })
    // LEET: Update API usage count at last
    next()
  } catch (error) {
    console.log(error)
    return res.status(500).send({ message: 'Something Went Wrong' })
  }
}

module.exports = {
  isFeedSubscriptionAccessible
}
