const async = require('async')
const article = {}
const { articles } = require('../../model')
const { articleViews } = require('../../../global/lib/article-view')
const { LiveBlogContentModel } = require('../../model')
const grpcController = require('../../grpc/client')
const _ = require('../../../global')
const config = require('../../../config')

article.setListicle = async (req, res) => {
  try {
    const allArticle = await articles.countDocuments()
    for (let index = 0; index < allArticle / 1000; index++) {
      const allArticle = await articles.find({}).skip(index * 1000).limit(1000).lean()
      async.each(allArticle, async (article, cb) => {
        const isListicle = article.sContent.includes('<!--nextpage-->')
        if (isListicle) {
          const figure = article.sContent.split(/<!-- pagebreak -->/i)
          const pagingCount = figure.length
          const ampFigure = article.sAmpContent.split(/<!-- pagebreak -->/i)

          const articlePaging = {
            nTotal: pagingCount,
            oAmpPageContent: ampFigure,
            oPageContent: figure
          }
          Object.assign(article, { oListicleArticle: articlePaging, bIsListicleArticle: true })
          await articles.updateOne({ _id: article._id }, { oListicleArticle: articlePaging, bIsListicleArticle: true })
        } else {
          await articles.updateOne({ _id: article._id }, { bIsListicleArticle: false })
        }
        Promise.resolve(cb)
      }, (err, res) => {
        if (err) console.log(err)
      })
    }
    return res.json({ message: 'done' })
  } catch (error) {
    console.log(error)
    return res.json({ error })
  }
}

article.updateNewsArticleViewsCount = async (req, res) => {
  try {
    const { _id } = req.query
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    articleViews({ _id }, ip)

    return res.json({ message: 'done' })
  } catch (error) {
    console.log(error)
    return res.json({ error })
  }
}

article.listLiveBlogContent = async (req, res) => {
  try {
    const { iEventId, sEventId, nLimit } = req.query

    if (!iEventId && !nLimit) return res.status(messages.english.statusBadRequest).jsonp({ status: messages.english.statusBadRequest, message: 'Please fill Required fields' })

    let blogContent = await LiveBlogContentModel.find({ iEventId: _.mongify(iEventId), sEventId: { $lt: sEventId } }).sort({ sEventId: -1 }).collation({ locale: 'en_US', numericOrdering: true }).limit(nLimit).populate([{ path: 'oPoll' }]).lean()
    const nTotal = await LiveBlogContentModel.countDocuments({ iEventId: _.mongify(iEventId), sEventId: { $lt: sEventId } })

    blogContent = await Promise.all(blogContent.map(async (content) => {
      if (content?.eType === 'poll' && content?.oPoll.nTotalVote) {
        content.oPoll.aField = content?.oPoll?.aField?.map(ele => {
          ele.nVote = ((ele.nVote * 100) / content?.oPoll?.nTotalVote).toFixed(2)
          return ele
        })
      }
      const oAuthor = await grpcController.getAdmin({ iAdminId: content?.iDisplayAuthorId })
      Object.assign(content, { oAuthor: { sFName: oAuthor?.sFName } })
      return content
    }))

    let next = ''
    let lastsEventId

    if (blogContent.length && nLimit < nTotal) {
      lastsEventId = blogContent[blogContent?.length - 1].sEventId
      next = `${config.ARTICLE_BACKEND}/api/listLiveBlogContent?sEventId=${lastsEventId}&iEventId=${iEventId}&nLimit=${nLimit}`
    }

    return res.status(messages.status.statusOk).jsonp({ status: messages.status.statusOk, message: 'Blog content fetch successfully', items: blogContent, next })
  } catch (error) {
    return res.status(messages.status.statusInternalError).jsonp({ status: messages.status.statusInternalError, error })
  }
}

module.exports = article
