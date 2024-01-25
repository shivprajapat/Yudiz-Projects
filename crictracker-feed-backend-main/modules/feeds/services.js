/* eslint-disable no-case-declarations */
const Rss = require('rss-generator')
const etag = require('etag')
const xmlParser = require('xml-js')
const momentTz = require('moment-timezone')
const { redis: { redisFeedDb } } = require('../../utils')

const config = require('../../config')
const { _ } = require('../../global')

const { ArticleServices } = require('../articles')
const { CategoriesService } = require('../categories')
const { RssServices } = require('../rss')
const { TagsServices } = require('../tags')
const { ApiLogsModel } = require('../api-logs')

class FeedsService {
  constructor() {
    this.getRssFeedApi = this.getRssFeedApi.bind(this) // <- Add this
    this.filterUniqueArticle = this.filterUniqueArticle.bind(this) // <- Add this
  }

  async filterUniqueArticle(req, arr) {
    try {
      const { client, subscription, sSlug } = req

      const arrLog = []
      const alreadyFetchedArticlesRedisSet = await redisFeedDb.smembers(`logs:${client._id}:${subscription._id}`)
      const alreadyFetchedArticlesRedisArr = []
      if (alreadyFetchedArticlesRedisSet.length) for (const alreadyFetchedArticleRedis of alreadyFetchedArticlesRedisSet) alreadyFetchedArticlesRedisArr.push(...JSON.parse(alreadyFetchedArticleRedis))

      const alreadyFetchedArticleMongo = await ApiLogsModel.find({ iArticleId: { $in: arr.map((ele) => sSlug === 'fantasy-cricket-tips' ? ele.iId : ele._id) }, iClientId: _.mongify(client._id), iSubscriptionId: _.mongify(subscription._id) }).lean()

      arr.forEach((ele) => {
        if ([...alreadyFetchedArticlesRedisArr, ...alreadyFetchedArticleMongo].findIndex((elem) => sSlug === 'fantasy-cricket-tips' ? ele.iId.toString() : ele._id.toString() === elem.iArticleId.toString()) === -1) {
          const logObj = {
            iSubscriptionId: subscription._id,
            iClientId: client._id,
            sIp: req.ip,
            oSeo: req.oSeo,
            iArticleId: sSlug === 'fantasy-cricket-tips' ? ele.iId : ele._id,
            oArticle: { sTitle: ele.sTitle },
            eType: req.eSubType,
            dFetchedOn: momentTz().tz(client.sTz ?? 'Asia/Kolkata')
          }

          arrLog.push(logObj)
        }
      })

      this.countManagement(req, arrLog)
    } catch (redisError) {
      console.log({ redisError })
      return redisError
    }
  }

  async countManagement(req, logObj) {
    try {
      const { client, subscription, sSlug } = req

      if (req.eSubType === 'article') {
        await redisFeedDb.hincrby('articleCount', `${client._id}:${subscription._id}`, 1)
      }

      if (req.eSubType === 'exclusive') {
        await redisFeedDb.hincrby('exclusiveArticleCount', `${client._id}:${subscription._id}`, 1)
      }

      if (req.eSubType === 'category') {
        await redisFeedDb.hincrby('categoryCount', `${client._id}:${subscription._id}`, 1)
      }

      if (req.eSubType === 'api') await redisFeedDb.hincrby(`generalDayCount:${client._id}:${subscription._id}:${client.sTz ?? 'Asia/Kolkata'}:${momentTz().tz(client.sTz ?? 'Asia/Kolkata').format('YYYY-MM-DD')}`, sSlug ?? 'home', 1)
      await redisFeedDb.hincrby('generalApiCount', `${client._id}:${subscription._id}`, 1)
      if (logObj.length) await redisFeedDb.sadd(`logs:${client._id}:${subscription._id}`, JSON.stringify(logObj))
    } catch (countError) {
      console.log({ countError })
      return countError
    }
  }

  async getRssFeedApi(req, res) {
    try {
      const { sSlug } = req
      const { nOffset, nLimit } = req.query

      if (!sSlug || sSlug === 'smart-news-custom') {
        // const getRssFromRedis = await redis.redisclient.get('feed')
        // if (getRssFromRedis) return getRssFromRedis
        const feedOptions = {
          title: config.FEED_TITLE,
          description: config.FEED_DESCRIPTION,
          site_url: config.FRONTEND_URL,
          language: 'en-US',
          custom_elements: [
            {
              image: [
                { url: 'https://media.crictracker.com/apple-touch-icon-150x150+(1).webp' },
                { title: 'CricTracker' },
                { link: config.FRONTEND_URL },
                { width: 32 },
                { height: 32 }
              ]
            },
            {
              'atom:link': {
                _attr: {
                  href: `${config.FRONTEND_URL}/feed`,
                  rel: 'self',
                  type: 'application/rss+xml'
                }
              }
            }
          ]
        }

        if (sSlug === 'smart-news-custom') {
          feedOptions.custom_elements.push({ 'snf:logo': { _cdata: `${config.S3_CDN_URL}logo-color.svg` } })
          feedOptions.custom_elements.push({ 'snf:darkModeLogo': { _cdata: `${config.S3_CDN_URL}logo-color.svg` } })
        }

        const rss = new Rss(feedOptions)

        const article = await ArticleServices.getArticlesByQuery({ eState: 'pub' }, [{ path: 'iCategoryId' }, { path: 'aSeries' }], { dPublishDate: -1 }, nOffset ?? 0, nLimit ?? 20)
        if (!article.length) return _.response(req, res, 'notFound', 'statusNotfound', {}, 'article')

        for (let index = 0; index < article.length; index++) {
          const categories = []
          const ele = article[index]

          if (ele.iCategoryId) {
            categories.push(ele.iCategoryId.sName)
          }

          if (ele.aSeries) {
            categories.push(...ele.aSeries.map((ele) => ele.sName))
          }

          const author = await ArticleServices.getAdmin({ iAdminId: ele.iAuthorDId })
          // axios.get(`${config.AUTH_SUBGRAPH_URL}/api/fetch-name/${ele.iAuthorDId}`)

          const seoData = await ArticleServices.getSeoData({ iId: ele._id })

          // axios.get(`${config.SEO_SUBGRAPH_URL}/api/seo/${ele._id}`)
          const itemOptions = {
            title: ele.sTitle,
            description: ele.sSubtitle,
            url: `${config.FRONTEND_URL}/${seoData?.sSlug}/`,
            guid: `${config.FRONTEND_URL}/?p=${ele.id ?? ele._id}`,
            categories,
            author: author.sUName,
            content: ele.sContent,
            date: ele.dPublishDate,
            custom_elements: [
              {
                'content:encoded': {
                  _cdata: `<figure>
                    <img src="${config.S3_CDN_URL}${ele?.oImg?.sUrl}" width="${ele?.oImg?.oMeta?.nWidth ?? 600}" height="${ele?.oImg?.oMeta?.nHeight ?? 400}" alt="${ele?.oImg?.sText}"/>
                <figcaption>${ele?.oImg?.sCaption}</figcaption>
                </figure><br>${ele.sContent}`
                }
              }
            ]
          }

          const ETag = etag(JSON.stringify(itemOptions))

          itemOptions.custom_elements.push({ ETag: { _cdata: ETag } })

          if (sSlug === 'smart-news-custom') {
            itemOptions.custom_elements.push({ 'media:thumbnail': { _cdata: `${config.S3_CDN_URL}${ele?.oImg?.sUrl}` } })
            itemOptions.custom_elements.push({
              'snf:analytics': { _cdata: `<script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');ga('create', 'UA-49665093-1', 'crictracker');ga('require', 'displayfeatures');ga('set', 'referrer', 'http://www.smartnews.com/');ga('send', 'pageview', '${seoData?.sSlug}/');</script>` }
            })
          }

          rss.item(itemOptions)
        }

        this.filterUniqueArticle(req, article)

        // ({ sSlug: 'feed' }, { sRss: rss.xml({ indent: true }) })
        const xmlJson = xmlParser.xml2js(rss.xml({ indent: true }), { compact: true, spaces: 4 })
        if (sSlug === 'smart-news-custom') Object.assign(xmlJson.rss._attributes, { 'xmlns:media': 'http://search.yahoo.com/mrss/', 'xmlns:snf': 'http://www.smartnews.be/snf' })
        return sSlug === 'smart-news-custom' ? res.status(200).header([{ 'Content-Type': 'text/xml' }]).send(xmlParser.json2xml(xmlJson, { compact: true, spaces: 4 })) : res.status(200).header([{ 'Content-Type': 'text/xml' }]).send(rss.xml({ indent: true }))
      }

      const seoData = await ArticleServices.getSeoBySlug({ sSlug })

      if (!seoData?.iId) return _.response(req, res, 'notFound', 'statusNotfound', {}, 'seo')

      // const getRssFromRedis = await redis.redisclient.get(sSlug)

      // if (getRssFromRedis) return getRssFromRedis

      const feedOptions = {
        title: seoData.sTitle,
        description: seoData.sDescription,
        site_url: config.FRONTEND_URL,
        language: 'en-US',
        custom_elements: [
          {
            image: [
              { url: 'https://media.crictracker.com/apple-touch-icon-150x150+(1).webp' },
              { title: 'CricTracker' },
              { link: config.FRONTEND_URL },
              { width: 32 },
              { height: 32 }
            ]
          },
          {
            'atom:link': {
              _attr: {
                href: `${config.FRONTEND_URL}/${sSlug}/feed/`,
                rel: 'self',
                type: 'application/rss+xml'
              }
            }
          }
        ]
      }
      const rss = new Rss(feedOptions)
      let article
      let categories = []
      let author

      switch (seoData.eType) {
        case 'ar':
          article = await ArticleServices.getArticleByQuery({ _id: _.mongify(seoData.iId), eState: 'pub' }, [{ path: 'iCategoryId' }, { path: 'aSeries' }])
          // cache(config.CACHE_7, `articleData:${data.data.iId}`)
          author = await ArticleServices.getAdmin({ iAdminId: article.iAuthorDId })

          if (!article) return _.response(req, res, 'notFound', 'statusNotfound', {}, 'article')
          // _.throwError('notFound', context, 'article')

          if (article.iCategoryId) {
            categories.push(article.iCategoryId.sName)
          }
          if (article.aSeries) {
            categories.push(...article.aSeries.map((ele) => ele.sName))
          }

          const itemOptions = {
            title: article.sTitle,
            description: article.sSubtitle,
            url: `${config.FRONTEND_URL}/${sSlug}/`,
            guid: `${config.FRONTEND_URL}/?p=${article.id ?? article._id}`,
            categories,
            author: author.sUName,
            date: article.dPublishDate,
            custom_elements: [
              {
                'content:encoded': {
                  _cdata: `<figure>
                    <img src="${config.S3_CDN_URL}${article?.oImg?.sUrl}" width="${article?.oImg?.oMeta?.nWidth ?? 600}" height="${article?.oImg?.oMeta?.nHeight ?? 400}" alt="${article?.oImg?.sText}"/>
                  <figcaption>${article?.oImg?.sCaption}</figcaption>
                  </figure><br>${article.sContent}`
                }
              }
            ]
          }

          const ETag = etag(JSON.stringify(itemOptions))

          itemOptions.custom_elements.push({ ETag: { _cdata: ETag } })
          req.oSeo = { iId: seoData.iId, sSlug: seoData.sSlug, eType: seoData.eType }

          this.filterUniqueArticle(req, [article])

          rss.item(itemOptions)
          return _.response(req, res, 'fetchSuccess', 'statusOk', rss.xml({ indent: true }), 'feed')
        case 'ct':
          const category = await CategoriesService.getCategoryByQuery({ _id: _.mongify(seoData.iId), eStatus: 'a' })

          // .cache(CACHE_7, `categoryData:${data.data.iId}`)
          const query = { eState: 'pub' }
          if (!category) return _.response(req, res, 'notFound', 'statusNotfound', {}, 'category')
          // _.throwError('notFound', context, 'category')
          if (seoData.sSlug === 'fantasy-cricket-tips') {
            const items = await RssServices.getRssesByQuery({}, [], { dPublishDate: -1 })

            for (const ele of items) {
              if (ele?.oRss?.custom_elements[1]?.['content:encoded']) {
                const ETag = etag(JSON.stringify(ele?.oRss))
                ele.oRss.custom_elements.push({ ETag: { _cdata: ETag } })
              }
              rss.item(ele.oRss)
            }

            req.oSeo = { iId: seoData.iId, sSlug: seoData.sSlug, eType: seoData.eType }

            this.filterUniqueArticle(req, items)
          } else {
            if (category.eType === 'as' || category.bFutureSeries) Object.assign(query, { aSeries: category._id })
            else Object.assign(query, { iCategoryId: _.mongify(category._id) })
            article = await ArticleServices.getArticlesByQuery(query, [{ path: 'iCategoryId' }, { path: 'aSeries' }], { dPublishDate: -1 }, nOffset || 0, nLimit || 10)

            if (!article.length) return _.response(req, res, 'notFound', 'statusNotfound', {}, 'article')
            // _.throwError('notFound', context, 'article')
            for (let index = 0; index < article.length; index++) {
              categories = []
              const ele = article[index]

              if (ele.iCategoryId) {
                categories.push(ele.iCategoryId.sName)
              }

              if (ele.aSeries) {
                categories.push(...ele.aSeries.map((ele) => ele.sName))
              }

              author = await ArticleServices.getAdmin({ iAdminId: ele.iAuthorDId })
              const seoData = await ArticleServices.getSeoData({ iId: ele._id })

              const itemOptions = {
                title: ele.sTitle,
                description: ele.sSubtitle,
                url: `${config.FRONTEND_URL}/${seoData?.sSlug}/`,
                guid: `${config.FRONTEND_URL}/?p=${ele.id ?? ele._id}`,
                categories,
                author: author.sUName,
                date: ele.dPublishDate,
                custom_elements: [
                  {
                    'content:encoded': {
                      _cdata: `<figure>
                      <img src="${config.S3_CDN_URL}${ele?.oImg?.sUrl}" width="${ele?.oImg?.oMeta?.nWidth ?? 600}" height="${ele?.oImg?.oMeta?.nHeight ?? 400}" alt="${ele?.oImg?.sText}"/>
                <figcaption>${ele?.oImg?.sCaption}</figcaption>
                    </figure><br>${ele.sContent}`
                    }
                  }
                ]
              }

              const ETag = etag(JSON.stringify(itemOptions))

              itemOptions.custom_elements.push({ ETag: { _cdata: ETag } })

              rss.item(itemOptions)
            }

            req.oSeo = { iId: seoData.iId, sSlug: seoData.sSlug, eType: seoData.eType }

            this.filterUniqueArticle(req, article)
          }
          // ({ sSlug }, { sRss: rss.xml({ indent: true }) })
          return res.status(200).header([{ 'Content-Type': 'text/xml' }]).send(rss.xml({ indent: true }))
        case 'gt':
          const generalTag = await TagsServices.getTagByQuery({ _id: _.mongify(seoData.iId), eStatus: 'a' })
          if (!generalTag) return _.response(req, res, 'notFound', 'statusNotfound', {}, 'tag')
          // _.throwError('notFound', context, 'tag')
          article = await ArticleServices.getArticlesByQuery({ aTags: _.mongify(generalTag._id), eState: 'pub' }, [{ path: 'iCategoryId' }, { path: 'aSeries' }], { dPublishDate: -1 }, nOffset || 0, nLimit || 10)

          if (!article.length) return _.response(req, res, 'notFound', 'statusNotfound', {}, 'tag')
          // _.throwError('notFound', context, 'tag')
          for (let index = 0; index < article.length; index++) {
            categories = []
            const ele = article[index]

            if (ele.iCategoryId) {
              categories.push(ele.iCategoryId.sName)
            }

            if (ele.aSeries) {
              categories.push(...ele.aSeries.map((ele) => ele.sName))
            }

            author = await ArticleServices.getAdmin({ iAdminId: ele.iAuthorDId })
            const seoData = await ArticleServices.getSeoData({ iId: ele._id })

            const itemOptions = {
              title: ele.sTitle,
              description: ele.sSubtitle,
              url: `${config.FRONTEND_URL}/${seoData?.sSlug}/`,
              guid: `${config.FRONTEND_URL}/?p=${ele.id ?? ele._id}`,
              categories,
              author: author.sUName,
              date: ele.dPublishDate,
              custom_elements: [
                {
                  'content:encoded': {
                    _cdata: `<figure>
                  <img src="${config.S3_CDN_URL}${ele?.oImg?.sUrl}" width="${ele?.oImg?.oMeta?.nWidth ?? 600}" height="${ele?.oImg?.oMeta?.nHeight ?? 400}" alt="${ele?.oImg?.sText}"/>
                  <figcaption>${ele?.oImg?.sCaption}</figcaption>
              </figure><br>${ele.sContent}`
                  }
                }
              ]
            }

            const ETag = etag(JSON.stringify(itemOptions))

            itemOptions.custom_elements.push({ ETag: { _cdata: ETag } })
            rss.item(itemOptions)
          }

          req.oSeo = { iId: seoData.iId, sSlug: seoData.sSlug, eType: seoData.eType }

          this.filterUniqueArticle(req, article)

          // ({ sSlug }, { sRss: rss.xml({ indent: true }) }, { upsert: true })

          return res.status(200).header([{ 'Content-Type': 'text/xml' }]).send(rss.xml({ indent: true }))
        case 'p':
          const playerTag = await TagsServices.getTagByQuery({ iId: _.mongify(seoData.iId), eStatus: 'a' })

          if (!playerTag) return _.response(req, res, 'notFound', 'statusNotfound', {}, 'tag')

          article = await ArticleServices.getArticlesByQuery({ aPlayer: _.mongify(playerTag._id), eState: 'pub' }, [{ path: 'iCategoryId' }, { path: 'aSeries' }], { dPublishDate: -1 }, nOffset || 0, nLimit || 10)
          if (!article.length) return _.response(req, res, 'notFound', 'statusNotfound', {}, 'article')
          for (let index = 0; index < article.length; index++) {
            categories = []
            const ele = article[index]

            if (ele.iCategoryId) {
              categories.push(ele.iCategoryId.sName)
            }

            if (ele.aSeries) {
              categories.push(...ele.aSeries.map((ele) => ele.sName))
            }

            author = await ArticleServices.getAdmin({ iAdminId: ele.iAuthorDId })

            const seoData = await ArticleServices.getSeoData({ iId: ele._id })

            const itemOptions = {
              title: ele.sTitle,
              description: ele.sSubtitle,
              url: `${config.FRONTEND_URL}/${seoData?.sSlug}/`,
              guid: `${config.FRONTEND_URL}/?p=${ele.id ?? ele._id}`,
              categories,
              author: author.sUName,
              date: ele.dPublishDate,
              custom_elements: [
                {
                  'content:encoded': {
                    _cdata: `<figure>
                  <img src="${config.S3_CDN_URL}${ele?.oImg?.sUrl}" width="${ele?.oImg?.oMeta?.nWidth ?? 600}" height="${ele?.oImg?.oMeta?.nHeight ?? 400}" alt="${ele?.oImg?.sText}"/>
                  <figcaption>${ele?.oImg?.sCaption}</figcaption>
              </figure><br>${ele.sContent}`
                  }
                }
              ]
            }

            const ETag = etag(JSON.stringify(itemOptions))

            itemOptions.custom_elements.push({ ETag: { _cdata: ETag } })

            rss.item(itemOptions)
          }

          req.oSeo = { iId: seoData.iId, sSlug: seoData.sSlug, eType: seoData.eType }

          this.filterUniqueArticle(req, article)

          // ({ sSlug }, { sRss: rss.xml({ indent: true }) }, { upsert: true })

          return res.status(200).header([{ 'Content-Type': 'text/xml' }]).send(rss.xml({ indent: true }))
        case 't':
          const teamTag = await TagsServices.getTagByQuery({ iId: _.mongify(seoData.iId), eStatus: 'a' })
          if (!teamTag) return _.response(req, res, 'notFound', 'statusNotfound', {}, 'tag')
          article = await ArticleServices.getArticlesByQuery({ aTeam: _.mongify(teamTag._id), eState: 'pub' }, [{ path: 'iCategoryId' }, { path: 'aSeries' }], { dPublishDate: -1 }, nOffset || 0, nLimit || 10)

          if (!article.length) return _.response(req, res, 'notFound', 'statusNotfound', {}, 'article')
          // _.throwError('notFound', context, 'article')
          for (let index = 0; index < article.length; index++) {
            categories = []
            const ele = article[index]

            if (ele.iCategoryId) {
              categories.push(ele.iCategoryId.sName)
            }

            if (ele.aSeries) {
              categories.push(...ele.aSeries.map((ele) => ele.sName))
            }

            author = await ArticleServices.getAdmin({ iAdminId: ele.iAuthorDId })

            const seoData = await ArticleServices.getSeoData({ iId: ele._id })

            const itemOptions = {
              title: ele.sTitle,
              description: ele.sSubtitle,
              url: `${config.FRONTEND_URL}/${seoData?.sSlug}/`,
              guid: `${config.FRONTEND_URL}/?p=${ele.id ?? ele._id}`,
              categories,
              author: author.sUName,
              date: ele.dPublishDate,
              custom_elements: [
                {
                  'content:encoded': {
                    _cdata: `<figure>
                  <img src="${config.S3_CDN_URL}${ele?.oImg?.sUrl}" width="${ele?.oImg?.oMeta?.nWidth ?? 600}" height="${ele?.oImg?.oMeta?.nHeight ?? 400}" alt="${ele?.oImg?.sText}"/>
                  <figcaption>${ele?.oImg?.sCaption}</figcaption>
              </figure><br>${ele.sContent}`
                  }
                }
              ]
            }

            const ETag = etag(JSON.stringify(itemOptions))

            itemOptions.custom_elements.push({ ETag: { _cdata: ETag } })

            rss.item(itemOptions)
          }

          req.oSeo = { iId: seoData.iId, sSlug: seoData.sSlug, eType: seoData.eType }

          this.filterUniqueArticle(req, article)

          // ({ sSlug }, { sRss: rss.xml({ indent: true }) }, { upsert: true })

          return res.status(200).header([{ 'Content-Type': 'text/xml' }]).send(rss.xml({ indent: true }))
        case 'v':
          const venueTag = await TagsServices.getTagByQuery({ iId: _.mongify(seoData.iId), eStatus: 'a' })

          if (!venueTag) return _.response(req, res, 'notFound', 'statusNotfound', {}, 'tag')

          article = await ArticleServices.getArticlesByQuery({ aVenue: _.mongify(venueTag._id), eState: 'pub' }, [{ path: 'iCategoryId' }, { path: 'aSeries' }], { dPublishDate: -1 }, nOffset || 0, nLimit || 10)

          if (!article.length) return _.response(req, res, 'notFound', 'statusNotfound', {}, 'article')
          // _.throwError('notFound', context, 'article')
          for (let index = 0; index < article.length; index++) {
            categories = []
            const ele = article[index]

            if (ele.iCategoryId) {
              categories.push(ele.iCategoryId.sName)
            }

            if (ele.aSeries) {
              categories.push(...ele.aSeries.map((ele) => ele.sName))
            }

            author = await ArticleServices.getAdmin({ iAdminId: ele.iAuthorDId })

            const seoData = await ArticleServices.getSeoData({ iId: ele._id })

            const itemOptions = {
              title: ele.sTitle,
              description: ele.sSubtitle,
              url: `${config.FRONTEND_URL}/${seoData?.sSlug}/`,
              guid: `${config.FRONTEND_URL}/?p=${ele.id ?? ele._id}`,
              categories,
              author: author.sUName,
              date: ele.dPublishDate,
              custom_elements: [
                {
                  'content:encoded': {
                    _cdata: `<figure>
                  <img src="${config.S3_CDN_URL}${ele?.oImg?.sUrl}" width="${ele?.oImg?.oMeta?.nWidth ?? 600}" height="${ele?.oImg?.oMeta?.nHeight ?? 400}" alt="${ele?.oImg?.sText}"/>
                  <figcaption>${ele?.oImg?.sCaption}</figcaption>
              </figure><br>${ele.sContent}`
                  }
                }
              ]
            }

            const ETag = etag(JSON.stringify(itemOptions))

            itemOptions.custom_elements.push({ ETag: { _cdata: ETag } })

            rss.item(itemOptions)
          }

          req.oSeo = { iId: seoData.iId, sSlug: seoData.sSlug, eType: seoData.eType }

          this.filterUniqueArticle(req, article)

          // ({ sSlug }, { sRss: rss.xml({ indent: true }) }, { upsert: true })

          return res.status(200).header([{ 'Content-Type': 'text/xml' }]).send(rss.xml({ indent: true }))

        default:
          return res.status(200).header([{ 'Content-Type': 'text/xml' }]).send(rss.xml({ indent: true }))
      }
    } catch (error) {
      return error
    }
  }
}

module.exports = new FeedsService()
