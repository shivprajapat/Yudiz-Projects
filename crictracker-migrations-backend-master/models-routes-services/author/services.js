/* eslint-disable camelcase */
const async = require('async')
const axios = require('axios')
const { Sequelize } = require('sequelize')
const sequelize = require('../../db_services/sqlConnect')
const { seo: SeoModel, admins: AdminModel, adminroles: AdminRoleModel } = require('../models')
const { getAuthorRole, getAuthorArticle, getAuthorFantasyArticle } = require('../common')
const _ = require('../../global')
const { getS3ImageURL } = require('../../app/utils')

// class Authors {
//   async migrateAuthors(req, res) {
//     try {
//       const designation = {
//         Author: 'a',
//         Editor: 'e',
//         'Sr. Statistician': 'ss',
//         'Sub-Editor': 'se',
//         'Featured Writer': 'fw',
//         'Sr. Staff Writer': 'ssw',
//         'Freelance Correspondent': 'fc',
//         'Freelance Writer': 'frw',
//         'Jr. Statistician': 'js',
//         'Jr. Staff Writer': 'jsw',
//         'Jr. Correspondent': 'jc',
//         'Guest Writer': 'gw',
//         Columnist: 'c'
//       }
//       const oRole = await getAuthorRole('Migration Authors')

//       // const data = await sequelize.query('SELECT * FROM wp_users;', { raw: true, replacements: {}, type: Sequelize.QueryTypes.SELECT })
//       const authors = await AdminModel.find({})

//       // async.eachSeries(data, async (s, cb) => {
//       //   const sEmail = s.user_email
//       //   AdminModel.findOne({ sEmail }).lean().then(async (checkAdmin) => {
//       //     // check already Author available or not
//       //     if (!checkAdmin) {
//       //       // Use for get Author images and slug
//       //       try {
//       //         const authorData = await axios.get(`https://www.crictracker.com/wp-json/wp/v2/users/${s.ID}`)
//       //         if (authorData) {
//       //           const getAuthorData = authorData.data
//       //           const metaDataArray = await getAuthorMeta(s)
//       //           const metaData = []

//       //           for (let index = 0; index < metaDataArray.length; index++) {
//       //             const { meta_key } = metaDataArray[index]
//       //             const { meta_value } = metaDataArray[index]
//       //             metaData[meta_key] = meta_value
//       //           }
//       //           const sPassword = 'Admin@1234'
//       //           const authorDesignation = metaData.designation

//       //           /** For upload profile image in s3 */
//       //           let sUrl = ''
//       //           if (getAuthorData.avatar_urls) {
//       //             const { avatar_urls } = getAuthorData
//       //             // get 96px size image
//       //             if (avatar_urls['96']) {
//       //               const imageURL = avatar_urls['96'] // image URL which you want to upload
//       //               const imagePath = process.env.S3_BUCKET_PROFILE_PATH || 'profile-pic' // S3 bucket path where you want to upload file
//       //               const response = await getS3ImageURL(imageURL, imagePath) // service function for upload image in S3
//       //               if (response.success) {
//       //                 sUrl = response.path
//       //               }
//       //             }
//       //           }

//       //           /** For social links */
//       //           const aSLinks = []
//       //           let oFB = {}
//       //           let oTwitter = {}
//       //           if (metaData.facebook) {
//       //             aSLinks.push({
//       //               eSocialNetworkType: 'f',
//       //               sDisplayName: 'FB',
//       //               sLink: metaData.facebook
//       //             })
//       //             oFB = {
//       //               sTitle: metaData.fb_link,
//       //               sDescription: '',
//       //               sUrl: metaData.facebook
//       //             }
//       //           }
//       //           if (metaData.twitter) {
//       //             aSLinks.push({
//       //               eSocialNetworkType: 't',
//       //               sDisplayName: 'twitter',
//       //               sLink: metaData.twitter
//       //             })
//       //             oTwitter = {
//       //               sTitle: metaData.twitter_link,
//       //               sDescription: '',
//       //               sUrl: metaData.facebook
//       //             }
//       //           }

//       //           if (metaData.linkedin) {
//       //             aSLinks.push({
//       //               eSocialNetworkType: 'l',
//       //               sDisplayName: 'linkedin',
//       //               sLink: metaData.linkedin
//       //             })
//       //           }

//       //           if (metaData.instagram) {
//       //             aSLinks.push({
//       //               eSocialNetworkType: 'i',
//       //               sDisplayName: 'instagram',
//       //               sLink: metaData.instagram
//       //             })
//       //           }

//       //           const authorArray = {
//       //             sFName: getAuthorData.name,
//       //             sEmail,
//       //             sUName: s.user_login,
//       //             sDisplayName: s.display_name,
//       //             eDesignation: designation[authorDesignation],
//       //             sPassword: _.encryptPassword(sPassword),
//       //             eType: 'sub',
//       //             sBio: metaData.description,
//       //             sUrl,
//       //             aSLinks,
//       //             sNumber: '0123456789',
//       //             eStatus: 'a'
//       //           }
//       //           const admin = await AdminModel.create(authorArray)
//       //           await AdminModel.updateOne({ _id: admin._id }, { sNumber: '', sPassword: '' }, { strict: false })

//       //           /** For SEO Data */
//       //           const seoObject = {
//       //             iId: admin._id,
//       //             sSlug: getAuthorData.slug,
//       //             oFB,
//       //             oTwitter,
//       //             eType: 'ad',
//       //             sCUrl: getAuthorData.slug
//       //           }
//       //           await SeoModel.create(seoObject)

//       //           /** For Roles and permissions */
//       //           const { aRoleId, aPermissions } = oRole.data
//       //           await AdminRoleModel.create([{ iAdminId: admin._id, aRoleId, aPermissions }])
//       //         }
//       //         Promise.resolve(cb)
//       //       } catch (error) {
//       //         Promise.resolve(cb)
//       //       }
//       //     }
//       //   })
//       //   // return res.send('Done')
//       //   Promise.resolve(cb)
//       // }, (error) => {
//       //   return res.status(500).jsonp({ data: error })
//       // })

//       const { aRoleId, aPermissions } = oRole.data
//       for (let i = 0; i < authors.length; i++) {
//         await AdminRoleModel.findOneAndUpdate({ iAdminId: authors[i]._id }, { aRoleId, aPermissions })
//       }
//       return res.status(200).jsonp({ data: 'Author migrate successfully' })
//     } catch (error) {
//       return res.send({ error, message: 'Something went wrong' })
//     }
//   }
// }
const Authors = {}

Authors.migrateAuthors = async (req, res) => {
  try {
    const data = await sequelize.query('SELECT * FROM wp_users;', { raw: true, replacements: {}, type: Sequelize.QueryTypes.SELECT })

    async.eachSeries(data, async (s, cb) => {
      await migrateAuthor(s)
      // return res.send('Done')
      Promise.resolve(cb)
    }, (error) => {
      return res.status(500).jsonp({ data: error })
    })
    // return res.status(200).jsonp({ data: 'Author migrate successfully' })
  } catch (error) {
    return res.send({ error, message: 'Something went wrong' })
  }
}

Authors.updateArticleViewCount = async (req, res) => {
  try {
    const query = {
      eType: { $ne: 'su' }
    }
    const authors = await AdminModel.find(query, { _id: 1, sFName: 1 }).lean()

    async.eachSeries(authors, async (author, cb) => {
      let nArticleCount = 0
      let nViewCount = 0
      /** For Author Articles */
      const authorArticles = await getAuthorArticle(author)

      if (authorArticles) {
        const { totalArticle, totalViewCount } = authorArticles
        nArticleCount = totalArticle
        nViewCount = totalViewCount
      }

      /** For Author Fantsay Articles */
      const authorFantasyArticles = await getAuthorFantasyArticle(author)
      if (authorFantasyArticles) {
        const { totalArticle, totalViewCount } = authorFantasyArticles
        nArticleCount = nArticleCount + totalArticle
        nViewCount = nViewCount + totalViewCount
      }
      await AdminModel.updateOne({ _id: author._id }, { nArticleCount, nViewCount }, { new: true })
      // console.log({ nArticleCount, nViewCount })
      Promise.resolve(cb)
    }, (error) => {
      console.log(error)
    })
    res.send('author/update/counts Done')
  } catch (error) {
    return res.send('author/update/counts Error')
  }
}

const getAuthorMeta = (author) => {
  return new Promise((resolve, reject) => {
    try {
      const authorId = author.id

      const data = sequelize.query('SELECT * FROM wp_usermeta WHERE user_id = :user_id;', { raw: true, replacements: { user_id: parseInt(authorId) }, type: Sequelize.QueryTypes.SELECT })
      resolve(data)
    } catch (error) {
      console.log({ error })
      reject(error)
    }
  })
}

const migrateAuthor = async (s) => {
  try {
    const designation = {
      Author: 'a',
      Editor: 'e',
      'Sr. Statistician': 'ss',
      'Sub-Editor': 'se',
      'Featured Writer': 'fw',
      'Sr. Staff Writer': 'ssw',
      'Freelance Correspondent': 'fc',
      'Freelance Writer': 'frw',
      'Jr. Statistician': 'js',
      'Jr. Staff Writer': 'jsw',
      'Jr. Correspondent': 'jc',
      'Guest Writer': 'gw',
      Columnist: 'c'
    }
    const oRole = await getAuthorRole('Migration Authors')
    const sEmail = s.user_email
    const checkAdmin = await AdminModel.findOne({ sEmail }).lean()
    // check already Author available or not
    if (!checkAdmin) {
      console.log({ x: s })
      // Use for get Author images and slug
      const authorData = await axios.get(`https://awesome.crictracker.com/wp-json/wp/v2/users/${s.id}`)
      if (authorData?.data?.data?.status === 401) {
        console.log(`${s.ID} is not available`)
        return
      }
      if (authorData) {
        const getAuthorData = authorData.data
        const metaDataArray = await getAuthorMeta(s)
        const metaData = []

        for (let index = 0; index < metaDataArray.length; index++) {
          const { meta_key } = metaDataArray[index]
          const { meta_value } = metaDataArray[index]
          metaData[meta_key] = meta_value
        }
        const sPassword = 'Admin@1234'
        const authorDesignation = metaData.designation

        /** For upload profile image in s3 */
        let sUrl = ''
        if (getAuthorData.avatar_urls) {
          const { avatar_urls } = getAuthorData
          // get 96px size image
          if (avatar_urls['96']) {
            const imageURL = avatar_urls['96'] // image URL which you want to upload
            const imagePath = process.env.S3_BUCKET_PROFILE_PATH || 'profile-pic' // S3 bucket path where you want to upload file
            const response = await getS3ImageURL(imageURL, imagePath) // service function for upload image in S3
            if (response.success) {
              sUrl = response.path
            }
          }
        }

        /** For social links */
        const aSLinks = []
        let oFB = {}
        let oTwitter = {}
        if (metaData.facebook) {
          aSLinks.push({
            eSocialNetworkType: 'f',
            sDisplayName: 'FB',
            sLink: metaData.facebook
          })
          oFB = {
            sTitle: metaData.fb_link,
            sDescription: '',
            sUrl: metaData.facebook
          }
        }
        if (metaData.twitter) {
          aSLinks.push({
            eSocialNetworkType: 't',
            sDisplayName: 'twitter',
            sLink: metaData.twitter
          })
          oTwitter = {
            sTitle: metaData.twitter_link,
            sDescription: '',
            sUrl: metaData.facebook
          }
        }

        if (metaData.linkedin) {
          aSLinks.push({
            eSocialNetworkType: 'l',
            sDisplayName: 'linkedin',
            sLink: metaData.linkedin
          })
        }

        if (metaData.instagram) {
          aSLinks.push({
            eSocialNetworkType: 'i',
            sDisplayName: 'instagram',
            sLink: metaData.instagram
          })
        }

        const authorArray = {
          sFName: getAuthorData.name,
          sEmail,
          sUName: s.user_login,
          sDisplayName: s.display_name,
          eDesignation: designation[authorDesignation],
          sPassword: _.encryptPassword(sPassword),
          eType: 'sub',
          sBio: metaData.description,
          sUrl,
          aSLinks,
          sNumber: '0123456789',
          eStatus: 'a'
        }
        const admin = await AdminModel.create(authorArray)
        await AdminModel.updateOne({ _id: admin._id }, { sNumber: '', sPassword: '' }, { strict: false })

        /** For SEO Data */
        const seoObject = {
          iId: admin._id,
          sSlug: getAuthorData.slug,
          oFB,
          oTwitter,
          eType: 'ad',
          sCUrl: getAuthorData.slug
        }
        const seo = await SeoModel.create(seoObject)

        /** For Roles and permissions */
        const { aRoleId, aPermissions } = oRole.data
        await AdminRoleModel.create([{ iAdminId: admin._id, aRoleId, aPermissions }])
        return seo
      }
    }
  } catch (error) {
    return error
  }
}

const migrateBlogAuthor = async (s) => {
  try {
    const designation = {
      Author: 'a',
      Editor: 'e',
      'Sr. Statistician': 'ss',
      'Sub-Editor': 'se',
      'Featured Writer': 'fw',
      'Sr. Staff Writer': 'ssw',
      'Freelance Correspondent': 'fc',
      'Freelance Writer': 'frw',
      'Jr. Statistician': 'js',
      'Jr. Staff Writer': 'jsw',
      'Jr. Correspondent': 'jc',
      'Guest Writer': 'gw',
      Columnist: 'c'
    }
    const oRole = await getAuthorRole('Migration Authors')
    const sEmail = s.user_email
    const checkAdmin = await AdminModel.findOne({ sEmail }).lean()

    // check already Author available or not
    if (!checkAdmin) {
      console.log({ x: s.id })
      // Use for get Author images and slug
      const authorData = await axios.get(`https://awesome.crictracker.com/blog/wp-json/wp/v2/users/${s.id}`)

      if (authorData?.data?.data?.status === 401) {
        console.log(`${s.ID} is not available`)
        return
      }

      if (authorData) {
        const getAuthorData = authorData.data
        const metaDataArray = await getAuthorMeta(s)
        const metaData = []

        for (let index = 0; index < metaDataArray.length; index++) {
          const { meta_key } = metaDataArray[index]
          const { meta_value } = metaDataArray[index]
          metaData[meta_key] = meta_value
        }
        const sPassword = 'Admin@1234'
        const authorDesignation = metaData.designation

        /** For upload profile image in s3 */
        let sUrl = ''
        if (getAuthorData.avatar_urls) {
          const { avatar_urls } = getAuthorData
          // get 96px size image
          if (avatar_urls['96']) {
            const imageURL = avatar_urls['96'] // image URL which you want to upload
            const imagePath = process.env.S3_BUCKET_PROFILE_PATH || 'profile-pic' // S3 bucket path where you want to upload file
            const response = await getS3ImageURL(imageURL, imagePath) // service function for upload image in S3
            if (response.success) {
              sUrl = response.path
            }
          }
        }

        /** For social links */
        const aSLinks = []
        let oFB = {}
        let oTwitter = {}
        if (metaData.facebook) {
          aSLinks.push({
            eSocialNetworkType: 'f',
            sDisplayName: 'FB',
            sLink: metaData.facebook
          })
          oFB = {
            sTitle: metaData.fb_link,
            sDescription: '',
            sUrl: metaData.facebook
          }
        }
        if (metaData.twitter) {
          aSLinks.push({
            eSocialNetworkType: 't',
            sDisplayName: 'twitter',
            sLink: metaData.twitter
          })
          oTwitter = {
            sTitle: metaData.twitter_link,
            sDescription: '',
            sUrl: metaData.facebook
          }
        }

        if (metaData.linkedin) {
          aSLinks.push({
            eSocialNetworkType: 'l',
            sDisplayName: 'linkedin',
            sLink: metaData.linkedin
          })
        }

        if (metaData.instagram) {
          aSLinks.push({
            eSocialNetworkType: 'i',
            sDisplayName: 'instagram',
            sLink: metaData.instagram
          })
        }

        const authorArray = {
          sFName: getAuthorData.name,
          sEmail,
          sUName: s.user_login,
          sDisplayName: s.display_name,
          eDesignation: designation[authorDesignation],
          sPassword: _.encryptPassword(sPassword),
          eType: 'sub',
          sBio: metaData.description,
          sUrl,
          aSLinks,
          sNumber: '0123456789',
          eStatus: 'a'
        }
        const admin = await AdminModel.create(authorArray)
        await AdminModel.updateOne({ _id: admin._id }, { sNumber: '', sPassword: '' }, { strict: false })

        /** For Roles and permissions */
        const { aRoleId, aPermissions } = oRole.data
        await AdminRoleModel.create([{ iAdminId: admin._id, aRoleId, aPermissions }])

        let seo
        const seoAuthor = await SeoModel.findOne({ iId: _.mongify(checkAdmin._id) })
        if (!seoAuthor) {
          /** For SEO Data */
          const seoObject = {
            iId: admin._id,
            sSlug: getAuthorData.slug,
            oFB,
            oTwitter,
            eType: 'ad',
            sCUrl: getAuthorData.slug
          }
          seo = await SeoModel.create(seoObject)
        }
        return seo
      }
    } else {
      const seo = await SeoModel.findOne({ iId: _.mongify(checkAdmin._id) })
      return seo
    }
  } catch (error) {
    return error
  }
}

module.exports = { Authors, migrateAuthor, migrateBlogAuthor }
