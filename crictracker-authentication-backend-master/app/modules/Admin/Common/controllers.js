const { s3 } = require('../../../utils')
const _ = require('../../../../global')
const config = require('../../../../config')
const controllers = {}

controllers.generatePreSignedUrl = async (parent, { input }, context) => {
  try {
    const data = []
    for (const ele of input) {
      const { sFileName, sContentType, sType, bAdd = true } = ele
      let url
      switch (sType) {
        case 'profile':
          url = await s3.generatePreSignedUrl(sFileName, sContentType, config.S3_BUCKET_PROFILE_PATH, bAdd)
          break
        case 'pan':
          url = await s3.generatePreSignedUrl(sFileName, sContentType, config.S3_BUCKET_KYC_PATH, bAdd)
          break
        case 'bank':
          url = await s3.generatePreSignedUrl(sFileName, sContentType, config.S3_BUCKET_BANK_PATH, bAdd)
          break
        case 'fb':
          url = await s3.generatePreSignedUrl(sFileName, sContentType, config.S3_BUCKET_FB_PATH, bAdd)
          break
        case 'twitter':
          url = await s3.generatePreSignedUrl(sFileName, sContentType, config.S3_BUCKET_TWITTER_PATH, bAdd)
          break
        case 'articleFtImg':
          url = await s3.generatePreSignedUrl(sFileName, sContentType, config.S3_BUCKET_ARTICLE_FEATUREIMAGE_PATH, bAdd)
          break
        case 'articleThumbImg':
          url = await s3.generatePreSignedUrl(sFileName, sContentType, config.S3_BUCKET_ARTICLE_THUMBIMAGE_PATH, bAdd)
          break
        case 'articleChatMedia':
          url = await s3.generatePreSignedUrl(sFileName, sContentType, config.S3_BUCKET_ARTICLE_CHAT_MEDIA_PATH, bAdd)
          break
        case 'articleEditorMedia':
          url = await s3.generatePreSignedUrl(sFileName, sContentType, config.S3_BUCKET_ARTICLE_ATTACHMENTIMAGE_PATH, bAdd)
          break
        case 'team':
          url = await s3.generatePreSignedUrl(sFileName, sContentType, config.S3_BUCKET_TEAM_PATH, bAdd)
          break
        case 'player':
          url = await s3.generatePreSignedUrl(sFileName, sContentType, config.S3_BUCKET_PLAYER_PATH, bAdd)
          break
        case 'category':
          url = await s3.generatePreSignedUrl(sFileName, sContentType, config.S3_BUCKET_CATEGORY_PATH, bAdd)
          break
        case 'sidemenu':
          url = await s3.generatePreSignedUrl(sFileName, sContentType, config.S3_BUCKET_SIDEMENU_PATH, bAdd)
          break
        default:
          _.throwError('invalid', context, 'type')
          break
      }
      data.push({ sType, sUploadUrl: url.url, sS3Url: url.key })
    }

    return data
  } catch (error) {
    console.log(error)
    return error
  }
}

module.exports = controllers
