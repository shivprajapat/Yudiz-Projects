const { redisclient } = require('./redis')
const { sitemap: SiteMapModel, seo: SeoModel } = require('../../../models-routes-services/models')
const config = require('../../../config.js')
const _ = require('../../../global/lib/helpers')

const queuePush = (queueName, data) => {
  return redisclient.rpush(queueName, JSON.stringify(data))
}

const queuePop = (queueName) => {
  return redisclient.lpop(queueName)
}

const removeDeleteElemetOfSitemap = async () => {
  try {
    let data = await queuePop('updateSiteMap')
    if (!data) {
      setTimeout(() => removeDeleteElemetOfSitemap(), 10000)
      return
    }

    data = JSON.parse(data)

    const { _id, eType, dPublishDate } = data

    switch (eType) {
      case 'ar': {
        const sKey = `${config.POST_SITEMAP}-${new Date(dPublishDate).getFullYear()}-${String(new Date(dPublishDate).getMonth() + 1).padStart(2, '0')}.xml`
        const articleArchiveMap = await SiteMapModel.findOne({ sKey })

        if (articleArchiveMap) {
          const seo = await SeoModel.findOne({ iId: _.mongify(_id), eType }, { sSlug: 1 }).lean()
          const articleLoc = `${seo?.sSlug}/`

          const updateUrls = articleArchiveMap?.url?.filter(ele => ele.loc !== articleLoc)

          await SiteMapModel.findByIdAndUpdate(articleArchiveMap._id, { url: updateUrls })
        }
        break
      }
      case 'fa': {
        const sKey = `${config.POST_SITEMAP}-${new Date(dPublishDate).getFullYear()}-${String(new Date(dPublishDate).getMonth() + 1).padStart(2, '0')}.xml`
        const articleArchiveMap = await SiteMapModel.findOne({ sKey })

        if (articleArchiveMap) {
          const seo = await SeoModel.findOne({ iId: _.mongify(_id), eType }, { sSlug: 1 }).lean()
          const articleLoc = `${seo?.sSlug}/`

          const updateUrls = articleArchiveMap?.url?.filter(ele => ele.loc !== articleLoc)

          await SiteMapModel.findByIdAndUpdate(articleArchiveMap._id, { url: updateUrls })
        }
        break
      }
      case 'gt': {
        const tagSiteMap = await SiteMapModel.findOne({ sKey: config.POST_TAG_SITEMAP + '.xml' })

        if (tagSiteMap) {
          const seo = await SeoModel.findOne({ iId: _.mongify(_id), eType }, { sSlug: 1 }).lean()
          const tagLoc = `${seo?.sSlug}/`
          const updatedUrls = tagSiteMap?.url?.filter(ele => ele.loc !== tagLoc)
          await SiteMapModel.findByIdAndUpdate(tagSiteMap._id, { url: updatedUrls })
        }

        break
      }
      case 'ct': {
        const categorySitemap = await SiteMapModel.findOne({ sKey: config.CATEGORY_SITEMAP + '.xml' })

        if (categorySitemap) {
          const seo = await SeoModel.findOne({ iId: _.mongify(_id), eType }, { sSlug: 1 }).lean()
          const tagLoc = `${seo?.sSlug}/`
          const updatedUrls = categorySitemap?.url?.filter(ele => ele.loc !== tagLoc)
          await SiteMapModel.findByIdAndUpdate(categorySitemap._id, { url: updatedUrls })
        }

        break
      }
      case 'ad': {
        const adminSitemap = await SiteMapModel.findOne({ sKey: config.AUTHOR_SITEMAP + '.xml' })

        if (adminSitemap) {
          const seo = await SeoModel.findOne({ iId: _.mongify(_id), eType }, { sSlug: 1 }).lean()
          const adminLoc = `author/${seo?.sSlug}/`

          const updatedUrls = adminSitemap?.url?.filter(ele => ele.loc !== adminLoc)
          await SiteMapModel.findByIdAndUpdate(adminSitemap._id, { url: updatedUrls })
        }
        break
      }
      case 'jo': {
        const jobSiteMap = await SiteMapModel.findOne({ sKey: config.CAREER_SITEMAP + '.xml' })

        if (jobSiteMap) {
          const seo = await SeoModel.findOne({ iId: _.mongify(_id), eType }, { sSlug: 1 }).lean()
          const jobLoc = `${seo?.sSlug}/`

          const updatedUrls = jobSiteMap?.url?.filter(ele => ele.loc !== jobLoc)
          await SiteMapModel.findByIdAndUpdate(jobSiteMap._id, { url: updatedUrls })
        }
        break
      }

      default:
        break
    }

    return removeDeleteElemetOfSitemap()
  } catch (error) {
    console.log(error)
    return removeDeleteElemetOfSitemap()
  }
}

setTimeout(() => {
  removeDeleteElemetOfSitemap()
}, 2000)

module.exports = { queuePush, queuePop }
