/* eslint-disable prefer-regex-literals */
/* eslint-disable camelcase */
/* eslint-disable no-useless-escape */
const { categories: CategoriesModel, fantasyarticles: FantasyArticleModel, tags: TagsModel, seo: SeoModel, posts, articles: ArticlesModel, admins: AdminModel, terms, termTaxonomy, postsMeta, sitemap: SiteMapModel, wpuser, matches: MatchesModel, jobPosts: JobPostsModel, gallery, players: PlayersModel, teams: TeamsModel, wptags, cms: CmsModel } = require('../models')
const axios = require('axios')
const config = require('../../config')
const { Sequelize, Op } = require('sequelize')
const sequelize = require('../../db_services/sqlConnect')
const { parse } = require('node-html-parser')
const _ = require('../../global')
const async = require('async')
const Amperize = require('amperize')
const amperize = new Amperize()
const { redis, readTime, s3 } = require('../../app/utils')
const { migrateAuthor, migrateBlogAuthor } = require('../author/services')
const size = require('s3-image-size')
const moment = require('moment')

const article = {}

const mergeSort = (array1, array2) => {
  const sortedArray = []
  const lengthArr1 = array1.length
  const lengthArr2 = array2.length
  let arrPoint1 = 0
  let arrPoint2 = 0
  while (arrPoint1 < lengthArr1 && arrPoint2 < lengthArr2) {
    if (new Date(array1[arrPoint1].dPublishDate).getTime() >= new Date(array2[arrPoint2].dPublishDate).getTime()) {
      sortedArray.push(array1[arrPoint1])
      arrPoint1 += 1
    } else {
      sortedArray.push(array2[arrPoint2])
      arrPoint2 += 1
    }
  }

  while (arrPoint1 < lengthArr1) {
    sortedArray.push(array1[arrPoint1])
    arrPoint1 += 1
  }

  while (arrPoint2 < lengthArr2) {
    sortedArray.push(array2[arrPoint2])
    arrPoint2 += 1
  }
  return sortedArray
}

async function createTag(tag, tagCreation = 0) {
  const ele = tag
  const generalTag = []
  const playerTag = []
  const teamTag = []
  const venueTag = []
  const term = await terms.findOne({ where: { term_id: ele } })
  console.log(term.getDataValue('slug'))
  const mongoTag = await wptags.findOne({ term_id: Number(term?.getDataValue('term_id')), eStatus: 'a' })

  // const termtaxonomy = await termTaxonomy.findOne({ where: { term_id: ele } })
  // if tag doesnt exist then don't create tag, unless and until if tag length is 1 or none of the tags exists.
  // if (!tagsSlug) {
  //   const tagFound = await TagsModel.findOne({ sName: term.getDataValue('name') })
  //   let insertTag = {}
  //   if (!tagFound && tagCreation) {
  //     const tagObj = {
  //       sName: term.getDataValue('name'),
  //       sContent: term.getDataValue('description'),
  //       nCount: termtaxonomy.getDataValue('count'),
  //       eType: 'gt',
  //       eStatus: 'a'
  //     }

  //     insertTag = await TagsModel.create(tagObj)
  //   } else {
  //     insertTag = tagFound
  //   }
  //   if (tagCreation || tagFound) {
  //     const seoObject = {
  //       oFB: {
  //         sUrl: '',
  //         sTitle: '',
  //         sDescription: ''
  //       },
  //       oTwitter: {
  //         sUrl: '',
  //         sTitle: '',
  //         sDescription: ''
  //       },
  //       sTitle: term.getDataValue('name'),
  //       sSlug: term.getDataValue('slug'),
  //       sDescription: term.getDataValue('description'),
  //       aKeywords: [],
  //       sRobots: 'Follow, Index',
  //       eType: 'gt',
  //       iId: insertTag._id
  //     }
  //     await SeoModel.create(seoObject)
  //     generalTag.push(insertTag._id)
  //   }
  // } else {

  if (mongoTag) {
    console.log('tag found')
    // if (tagsSlug.eType === 'gt') Model = TagsModel
    // if (!tagFound) {
    //   const tagObj = {
    //     _id: tagsSlug.iId,
    //     sName: term.getDataValue('name'),
    //     sContent: term.getDataValue('description'),
    //     nCount: termtaxonomy.getDataValue('count'),
    //     eType: 'gt',
    //     eStatus: 'a'
    //   }
    //   await TagsModel.create(tagObj)
    // }
    if (mongoTag.eType === 'player') playerTag.push(mongoTag._id)
    if (mongoTag.eType === 'team') teamTag.push(mongoTag._id)
    if (mongoTag.eType === 'venue') venueTag.push(mongoTag._id)
    if (mongoTag.eType === 'simple') {
      const genTag = await SeoModel.findOne({ sSlug: mongoTag.slug })
      if (genTag) generalTag.push(genTag._id)
    }
  }
  // }
  return { generalTag, playerTag, teamTag, venueTag }
}

async function articleTagManagement(tags) {
  try {
    let tagObj = {}
    const generalTag = []
    const playerTag = []
    const teamTag = []
    const venueTag = []
    if (tags.length === 1) {
      tagObj = await createTag(tags[0], 1)
      if (tagObj.playerTag.length) playerTag.push(...tagObj.playerTag)
      if (tagObj.teamTag.length) teamTag.push(...tagObj.teamTag)
      if (tagObj.venueTag.length) venueTag.push(...tagObj.venueTag)
      if (tagObj.generalTag.length) generalTag.push(...tagObj.generalTag)
    } else {
      for (let index = 0; index < tags.length; index++) {
        const ele = tags[index]
        // if (index === tags.length - 1 && !generalTag.length && !playerTag.length && !venueTag.length && !teamTag.length) await createTag(ele, 1)
        tagObj = await createTag(ele, 1)
        if (tagObj.playerTag.length) playerTag.push(...tagObj.playerTag)
        if (tagObj.teamTag.length) teamTag.push(...tagObj.teamTag)
        if (tagObj.venueTag.length) venueTag.push(...tagObj.venueTag)
        if (tagObj.generalTag.length) generalTag.push(...tagObj.generalTag)
      }
    }

    return { generalTag, playerTag, teamTag, venueTag }
  } catch (error) {
    return error
  }
}

async function articleCategoryManagement(categories, postId) {
  try {
    const category = []
    const aSeries = []
    for (let index = 0; index < categories.length; index++) {
      const ele = categories[index]
      const [data] = await sequelize.query('SELECT * FROM wp_yoast_primary_term WHERE post_id = :post_id;', { raw: true, replacements: { post_id: parseInt(postId) }, type: Sequelize.QueryTypes.SELECT })
      const term = await terms.findOne({ where: { term_id: ele } })
      const termtaxonomy = await termTaxonomy.findOne({ where: { term_id: ele } })
      const categorySlug = await SeoModel.findOne({ sSlug: term.getDataValue('slug'), eType: 'ct' })
      console.log(categorySlug && categorySlug.eStatus !== 'a')
      if (categorySlug && categorySlug.eStatus !== 'a') continue
      if (!categorySlug) {
        console.log('category not found')
        const catFound = await CategoriesModel.findOne({ sName: term.getDataValue('name') })
        let temp = {}
        if (!catFound) {
          const cateObj = {
            sName: term.getDataValue('name'),
            sContent: term.getDataValue('description'),
            nCount: termtaxonomy.getDataValue('count'),
            eType: 's',
            eStatus: 'a'
          }
          temp = await CategoriesModel.create(cateObj)
        } else {
          if (catFound.eStatus !== 'a') return
          temp = catFound
        }
        const findSeo = await SeoModel.findOne({ iId: _.mongify(temp._id) })
        if (!findSeo) {
          const seoObject = {
            oFB: {
              sUrl: '',
              sTitle: '',
              sDescription: ''
            },
            oTwitter: {
              sUrl: '',
              sTitle: '',
              sDescription: ''
            },
            sTitle: term.getDataValue('name'),
            sSlug: term.getDataValue('slug'),
            sDescription: term.getDataValue('description'),
            aKeywords: [],
            sRobots: 'Follow, Index',
            eType: 'ct',
            iId: temp._id
          }
          await SeoModel.create(seoObject)
        }
        if (data?.term_id === ele) category.unshift(temp._id)
        else category.push(temp._id)
      } else {
        console.log('category found')
        const categoryMongo = await CategoriesModel.findOne({ _id: categorySlug.iId })
        if (categoryMongo.eStatus !== 'a') continue
        if (data?.term_id === ele) category.unshift(categorySlug.iId)
        else {
          if (categoryMongo.eType === 'as') aSeries.push(categorySlug.iId)
          else category.push(categorySlug.iId)
        }
      }
    }
    return { category, aSeries }
  } catch (error) {
    return error
  }
}

async function getS3URLImage(imageURL, imagePath) {
  try {
    if (!imageURL) return
    const image = await s3.UploadFromUrlToS3(encodeURI(imageURL), imagePath)
    return image
  } catch (error) {
    return ''
  }
}

async function updateArticleReadTime(id) {
  try {
    const article = await ArticlesModel.findOne({ _id: id })

    if (article) {
      const string = article.sContent
      let imageCount = 0
      if (article.oImg) {
        imageCount = 1
      }
      // string: content, customWordTime : 275, customImageTime: 12, imageNumberCount: 5, customTableRowTime: 10, chineseKoreanReadTime: 500
      const {
        duration // 0.23272727272727273
      } = readTime(string, 275, 12, imageCount, 10, 500)

      await ArticlesModel.updateOne({ _id: id }, { nDuration: duration })
    }
    return
  } catch (error) {
    return error
  }
}

async function getImagesFromContent(content, postAttachments = []) {
  try {
    let parseContent = parse(content, { comment: true })
    if (parseContent.toString().search(/<!--nextpage-->/i) === -1) parseContent?.querySelector('figure')?.remove()
    if (parse(parseContent.toString().split('<!--nextpage-->')[0]).querySelectorAll('figure').length > 1) {
      parseContent = parse(parseContent.toString().split('<!--nextpage-->').join('<!-- pagebreak -->'), { comment: true })
      parseContent?.querySelector('figure')?.remove()
    }

    parseContent.querySelectorAll('script')?.map((ele) => {
      if (ele.getAttribute('type')) ele.remove()
      return ele
    })

    parseContent.querySelectorAll('.also-read-title').map((ele) => ele.remove())
    parseContent.querySelectorAll('.similar-posts').map((ele) => ele.remove())
    parseContent.querySelectorAll('em').forEach((ele) => {
      if (ele.innerText.toLocaleLowerCase().trim() === 'also read:') {
        ele.parentNode.parentNode.removeChild(ele.parentNode)
      }
    })

    parseContent.querySelector('#between-content-div1')?.replaceWith(parse('<gt-ads>&nbsp;&nbsp;</gt-ads>'))

    for (let index = 0; index < parseContent.querySelectorAll('img').length; index++) {
      const ele = parseContent.querySelectorAll('img')[index]
      ele.removeAttribute('srcset')
      const oMeta = {}
      ele.setAttribute('src', ele?.getAttribute('src').replaceAll('https://www.crictracker.com', 'https://awesome.crictracker.com'))
      const fileName = ele?.getAttribute('src')?.includes('crictracker.com') ? `${config.S3_BUCKET_ARTICLE_ATTACHMENTIMAGE_PATH}/${ele?.getAttribute('src')?.replaceAll('https://awesome.crictracker.com/wp-content/uploads/', '')?.replaceAll('https://image.crictracker.com/wp-content/uploads/', '')}` : ele?.getAttribute('src').split('/').pop()
      const nSize = await s3.getSize(fileName)
      if (!nSize) {
        getS3URLImage(ele?.getAttribute('src'), fileName).then((responseImage) => {
          console.log({ responseImage })
          if (responseImage) {
            size(s3.s3, config.S3_BUCKET_NAME, fileName, async (err, dimensions, bytesRead) => {
              if (err) {
                console.log({ err }, 'size')
              }
              Object.assign(oMeta, {
                nWidth: dimensions?.width,
                nHeight: dimensions?.height,
                nSize: bytesRead
              })
            })
          }
        })
      }

      const sText = ele.querySelector('img')?.getAttribute('alt')
      const postAuthor = await posts.findOne({ where: { guid: ele?.getAttribute('src').replaceAll('https://awesome.crictracker.com', 'https://www.crictracker.com') } })
      let authorMongo

      if (postAuthor) {
        const author = await wpuser.findOne({ where: { ID: postAuthor.getDataValue('post_author') } })
        authorMongo = await SeoModel.findOne({ sSlug: author.getDataValue('user_nicename') })
      }

      postAttachments.push({ sUrl: fileName, oMeta, sText, iAuthorId: authorMongo?.iId })
      ele?.setAttribute('src', `${config.S3_CDN_URL}${fileName}`)
    }

    return { parseContent, postAttachments }
  } catch (error) {
    console.log({ error })
  }
}

async function getImagesFromBlogContent(content, postAttachments = []) {
  try {
    const parseContent = parse(content, { comment: true })

    parseContent.querySelectorAll('script')?.map((ele) => {
      if (ele.getAttribute('type')) ele.remove()
      return ele
    })

    for (let index = 0; index < parseContent.querySelectorAll('img').length; index++) {
      const ele = parseContent.querySelectorAll('img')[index]
      ele.removeAttribute('srcset')
      const oMeta = {}
      ele.setAttribute('src', ele?.getAttribute('src').replaceAll('https://www.crictracker.com', 'https://awesome.crictracker.com'))
      const fileName = ele?.getAttribute('src')?.includes('crictracker.com') ? `${config.S3_BUCKET_ARTICLE_ATTACHMENTIMAGE_PATH}/${ele?.getAttribute('src')?.replaceAll('https://awesome.crictracker.com/blog/wp-content/uploads/', '')?.replaceAll('https://image.crictracker.com/blog/wp-content/uploads/', '')}` : ele?.getAttribute('src').split('/').pop()
      const nSize = await s3.getSize(fileName)
      if (!nSize) {
        getS3URLImage(ele?.getAttribute('src'), fileName).then((responseImage) => {
          console.log({ responseImage })
          if (responseImage) {
            size(s3.s3, config.S3_BUCKET_NAME, fileName, async (err, dimensions, bytesRead) => {
              if (err) {
                console.log({ err }, 'size')
              }
              Object.assign(oMeta, {
                nWidth: dimensions?.width,
                nHeight: dimensions?.height,
                nSize: bytesRead
              })
            })
          }
        })
      }

      const sText = ele.querySelector('img')?.getAttribute('alt')
      const postAuthor = await posts.findOne({ where: { guid: ele?.getAttribute('src').replaceAll('https://awesome.crictracker.com', 'https://www.crictracker.com') } })
      let authorMongo

      if (postAuthor) {
        const author = await wpuser.findOne({ where: { ID: postAuthor.getDataValue('post_author') } })
        authorMongo = await SeoModel.findOne({ sSlug: author.getDataValue('user_nicename') })
      }

      postAttachments.push({ sUrl: fileName, oMeta, sText, iAuthorId: authorMongo?.iId })
      ele?.setAttribute('src', `${config.S3_CDN_URL}${fileName}`)
    }

    return { parseContent, postAttachments }
  } catch (error) {
    console.log({ error })
  }
}

const getAmpTweeter = (node) => {
  const patternTweet = 'https?\:\/\/twitter.com\/.*\/status\/([0-9a-z]+)'
  const regexTweet = new RegExp(patternTweet)
  const strTweet = node?.toString()
  if (!strTweet?.match(regexTweet)) return parse('')
  const tweetId = strTweet?.match(regexTweet)[1]
  return parse(`<amp-twitter width="375" height="472" layout="responsive" data-tweetid=${tweetId}>`)
}

const getAmpInsta = (node) => {
  const patternInsta = 'instagram.com\/(p|tv|reel)\/([0-9a-zA-Z_\-]+)'
  const regexInsta = new RegExp(patternInsta)
  const strInsta = node?.toString()
  if (!strInsta?.match(regexInsta)) return parse('')
  const InstaId = strInsta?.match(regexInsta)[2]

  return parse(`<amp-instagram data-shortcode="${InstaId}" data-captioned width="400" height="400" layout="responsive"></amp-instagram>`)
}

const getAmpAds = (node, position) => {
  if (position === 0) {
    return parse('<amp-ad width=300 height=250 type="doubleclick" data-slot="/138639789/Crictracker2022_AMP_MID_300x250"></amp-ad>')
  } else {
    return parse('<amp-ad width=300 height=250 type="doubleclick" data-slot="/138639789/Crictracker2022_AMP_MID2_300x250"></amp-ad>')
  }
}

function validURL(str) {
  const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i') // fragment locator
  return !!pattern.test(str)
}

async function convertAmp(sContent) {
  return new Promise((resolve, reject) => {
    try {
      amperize.parse(sContent, function (error, result) {
        if (error) {
          console.log({ error }, 'amp error')
          return resolve('')
        } else {
          let htmlParsed = parse(result, { comment: true })

          htmlParsed.querySelectorAll('amp-iframe')?.map(s => {
            s.removeAttribute('scrolling')
            s.removeAttribute('loading')
            s.removeAttribute('marginheight')
            s.removeAttribute('marginwidth')
            s.removeAttribute('border')
            s.removeAttribute('security')
            return s
          })
          htmlParsed.querySelectorAll('amp-img')?.map(s => s.removeAttribute('loading'))
          htmlParsed.querySelectorAll('amp-youtube')?.map(s => {
            s.removeAttribute('loading')
            s.removeAttribute('gesture')
            return s
          })
          htmlParsed.querySelectorAll('amp-anim')?.map(s => s.removeAttribute('loading'))
          htmlParsed.querySelectorAll('col')?.map(s => s.removeAttribute('width'))
          htmlParsed.querySelectorAll('colgroup')?.map(s => s.removeAttribute('width'))
          htmlParsed.querySelectorAll('th')?.map(s => s.removeAttribute('nowrap'))
          htmlParsed.querySelectorAll('td')?.map(s => s.removeAttribute('nowrap'))
          htmlParsed.querySelectorAll('tr')?.map(s => s.removeAttribute('aria-rowindex'))
          htmlParsed.querySelectorAll('li')?.map(s => s.removeAttribute('align'))
          htmlParsed.querySelectorAll('div')?.map(s => s.removeAttribute('_affcodeself'))
          htmlParsed.querySelectorAll('span')?.map(s => s.removeAttribute('contenteditable'))

          htmlParsed.querySelectorAll('.twitter-tweet')?.map(s => s.replaceWith(getAmpTweeter(s)))
          htmlParsed.querySelectorAll('.instagram-media')?.map(s => s.replaceWith(getAmpInsta(s)))
          htmlParsed.querySelectorAll('gt-ads')?.map((s, i) => i < 2 ? s.replaceWith(getAmpAds(s, i)) : s.remove())

          htmlParsed.querySelectorAll('.also-read-title').map((ele) => ele.remove())
          htmlParsed.querySelectorAll('.similar-posts').map((ele) => ele.remove())
          htmlParsed.querySelectorAll('em').forEach((ele) => {
            if (ele.innerText.toLocaleLowerCase().trim() === 'also read:') {
              ele.parentNode.parentNode.removeChild(ele.parentNode)
            }
          })

          htmlParsed?.querySelectorAll('figure')?.map((ele) => {
            ele.setAttribute('style', 'max-width: 100%; margin: 0;')
            ele.querySelectorAll('amp-img').map((elem) => {
              elem.setAttribute('style', 'max-width: 100%; margin: 0;')
              elem.removeAttribute('sizes')
              return elem
            })
            return ele
          })
          htmlParsed.querySelectorAll('amp-img').map((elem) => {
            elem.setAttribute('style', 'max-width: 100%; margin: 0;')
            elem.removeAttribute('sizes')
            return elem
          })

          htmlParsed.querySelectorAll('span')?.map((elem) => {
            elem.removeAttribute('xml:lang')
            elem.removeAttribute('contenteditable')
            const styleImpAtt = elem.getAttribute('style')
            if (styleImpAtt?.includes('!important')) {
              elem.setAttribute('style', styleImpAtt.replace(' !important', ''))
            }
            return elem
          })

          htmlParsed.querySelectorAll('table').map((s) => {
            s.removeAttribute('height')
            s.removeAttribute('aria-rowcount')
            // s.setAttribute('style', 'width: 100%; border-spacing: 0 4px; border-collapse: separate; border: none; white-space: nowrap;')
            s.removeAttribute('style')
            const classArr = s.parentNode?.classList?.value
            if (s.parentNode.rawTagName === 'div' && (classArr.includes('table-responsive') || classArr.includes('table-scroller'))) {
              // s.parentNode.setAttribute('style', 'overflow-x: auto;')
              s.parentNode.removeAttribute('style')
            } else if (s.parentNode.rawTagName !== 'div') {
              s.replaceWith(`<div class='table-responsive'>${s.toString()}</div>`)
            }
            const children = s.querySelectorAll('tr')
            for (let j = 0; j < children.length; j++) {
              if (children[j].rawTagName === 'tr') {
                if (j === 0) {
                  // s.querySelectorAll('tr')[j].querySelectorAll('td').map(el => el.setAttribute('style', 'padding: 12px 14px; background: #045de9; color: #fff; text-transform: capitalize;'))
                  s.querySelectorAll('tr')[j].querySelectorAll('td').map(el => el.removeAttribute('style'))
                  // s.querySelectorAll('tr')[j].querySelectorAll('th').map(el => el.setAttribute('style', 'padding: 12px 14px; background: #045de9; color: #fff; text-transform: capitalize;'))
                  s.querySelectorAll('tr')[j].querySelectorAll('th').map(el => el.removeAttribute('style'))
                } else {
                  // s.querySelectorAll('tr')[j].querySelectorAll('td').map(el => el.setAttribute('style', 'padding: 12px 14px; background: #f2f4f7;'))
                  s.querySelectorAll('tr')[j].querySelectorAll('td').map(el => el.removeAttribute('style'))
                }
              }
            }

            return s
          })

          htmlParsed.querySelectorAll('a').map((e) => {
            const link = e.getAttribute('href')
            if (!validURL(link)) e.removeAttribute('href')
            return e
          })

          htmlParsed.querySelectorAll('script').map(s => s.remove())
          htmlParsed = htmlParsed?.toString().replaceAll(' !important', '')

          return resolve(htmlParsed)
        }
      })
    } catch (error) {
      reject(error)
    }
  })
}

async function dumpArticle(post) {
  try {
    const postAttachments = []

    console.log(post.getDataValue('id'))
    const data = await axios.get(`https://awesome.crictracker.com/wp-json/wp/v2/posts/${post.getDataValue('id')}`)
    if (data?.data) {
      const { rendered } = data.data.content

      const sContent = await getImagesFromContent(rendered, postAttachments)

      const { categories, amp_enabled, featured_media, author, tags } = data.data
      const wpAuthor = await wpuser.findOne({ where: { id: author }, raw: true })

      let authorSlug = await SeoModel.findOne({ sSlug: wpAuthor.user_nicename })
      if (!authorSlug) {
        authorSlug = await migrateAuthor(wpAuthor)
        console.log({ wpAuthor })
      }

      const oDisplayAuthor = await AdminModel.findOne({ _id: authorSlug.iId }).lean()
      console.log({ authorSlug })
      Object.assign(oDisplayAuthor, { oSeo: authorSlug })

      let image, altText, caption, postAuthor
      if (featured_media === 0) {
        if (parse(rendered).querySelector('figure') && sContent.parseContent.toString().search(/<!-- pagebreak -->/i) === -1) {
          image = parse(rendered).querySelector('figure').querySelector('img').getAttribute('src')
          altText = parse(rendered).querySelector('figure').querySelector('img').getAttribute('alt')
          caption = parse(rendered).querySelector('figure').querySelector('figcaption').innerHTML
          const getAuthor = await posts.findOne({ where: { id: featured_media } })
          if (postAuthor) {
            const author = await wpuser.findOne({ where: { ID: getAuthor.getDataValue('post_author') } })
            SeoModel.findOne({ sSlug: author.getDataValue('user_nicename') }).then((seoResponse) => {
              postAuthor = seoResponse.iId
            })
          }
        } else image = ''
      } else {
        const media = await axios.get(`https://awesome.crictracker.com/wp-json/wp/v2/media/?p=${featured_media}`)
        if (parse(rendered).querySelector('figure') && sContent.parseContent.toString().search(/<!-- pagebreak -->/i) === -1) {
          image = parse(rendered).querySelector('figure').querySelector('img').getAttribute('src')
          altText = parse(rendered).querySelector('figure').querySelector('img').getAttribute('alt')
          caption = parse(rendered).querySelector('figure').querySelector('figcaption').innerHTML
          const getAuthor = await posts.findOne({ where: { id: featured_media } })
          if (postAuthor) {
            const author = await wpuser.findOne({ where: { ID: getAuthor.getDataValue('post_author') } })
            SeoModel.findOne({ sSlug: author.getDataValue('user_nicename') }).then((seoResponse) => {
              postAuthor = seoResponse.iId
            })
          }
        } else {
          image = media?.data?.guid?.rendered
          altText = media?.data?.alt_text ?? media?.data?.title?.rendered
          caption = media?.data?.caption?.rendered
          if (image) {
            const getAuthor = await posts.findOne({ where: { guid: image } })
            if (postAuthor) {
              const author = await wpuser.findOne({ where: { ID: getAuthor.getDataValue('post_author') } })
              SeoModel.findOne({ sSlug: author.getDataValue('user_nicename') }).then((seoResponse) => {
                postAuthor = seoResponse.iId
              })
            }
          }
        }
      }

      const postMetaDetails = await postsMeta.findAll({ where: { post_id: post.getDataValue('id') }, raw: true })
      const [seoPostData] = await sequelize.query('SELECT * FROM wp_yoast_indexable WHERE object_id = :object_id AND object_sub_type="post";', { raw: true, replacements: { object_id: parseInt(post.getDataValue('id')) }, type: Sequelize.QueryTypes.SELECT })

      const category = await articleCategoryManagement(categories, post.getDataValue('id'))

      const { aSeries } = category
      const [iCategoryId] = category?.category

      const oMeta = {}

      image = image?.replaceAll('https://www.crictracker.com', 'https://awesome.crictracker.com')
      const sUrl = image?.includes('crictracker.com') ? `${config.S3_BUCKET_ARTICLE_FEATUREIMAGE_PATH}/${image?.replaceAll('https://awesome.crictracker.com/wp-content/uploads/', '')?.replaceAll('https://image.crictracker.com/wp-content/uploads/', '')?.replaceAll('https://crictracker.com/wp-content/uploads/', '')}` : image?.split('/')?.pop()
      getS3URLImage(image, sUrl).then((responseImage) => {
        if (responseImage) {
          size(s3.s3, config.S3_BUCKET_NAME, sUrl, async (err, dimensions, bytesRead) => {
            if (err) {
              console.log({ err }, 'size')
            }

            Object.assign(oMeta, {
              nWidth: dimensions?.width,
              nHeight: dimensions?.height,
              nSize: bytesRead
            })
          })
        }
      }).catch((err) => {
        console.log({ err })
      })

      const articleObject = {
        id: post.getDataValue('id'),
        iAuthorId: authorSlug?.iId,
        iAuthorDId: authorSlug?.iId,
        eVisibility: 'pb',
        sTitle: post.getDataValue('post_title'),
        sSubtitle: post.getDataValue('post_excerpt') ?? postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === 'meta_key_yoast_wpseo_metadesc')]?.meta_value ?? seoPostData?.description ?? postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === 'ct-meta-short-title')]?.meta_value,
        sSrtTitle: post.getDataValue('post_excerpt') ?? postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === 'ct-meta-short-title')]?.meta_value ?? post.getDataValue('post_title'),
        sContent: sContent?.parseContent.toString(),
        eState: 'pub',
        eStatus: 'a',
        bPriority: false,
        oImg: {
          sUrl,
          sText: altText,
          sCaption: caption,
          oMeta
        },
        iCategoryId,
        aSeries,
        sEditorNotes: '',
        oAdvanceFeature: {
          bAllowComments: post.getDataValue('comment_status') !== 'closed',
          bRequireAdminApproval: false,
          bAmp: amp_enabled,
          bFBEnable: false,
          bBrandedContent: false,
          bExclusiveArticle: false,
          bEditorsPick: false
        },
        nDuration: !isNaN(Number(postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === '_yoast_wpseo_estimated-reading-time-minutes')]?.meta_value)) ? Number(postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === '_yoast_wpseo_estimated-reading-time-minutes')]?.meta_value) : 0,
        nViewCount: !isNaN(Number(postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === 'views')]?.meta_value)) ? Number(postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === 'views')]?.meta_value) : 0,
        nOViews: !isNaN(Number(postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === 'views')]?.meta_value)) ? Number(postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === 'views')]?.meta_value) : 0,
        dCreated: post.getDataValue('post_date_gmt'),
        dPublishDate: post.getDataValue('post_date_gmt'),
        dModifiedDate: post.getDataValue('post_modified_gmt'),
        dUpdated: post.getDataValue('post_modified_gmt'),
        bOld: true
      }

      if (Number(config.CREATE_TAG_ARTICLE)) {
        const tag = await articleTagManagement(tags)
        Object.assign(articleObject, {
          aTeam: tag?.teamTag,
          aPlayer: tag?.playerTag,
          aVenue: tag?.venueTag,
          aTags: tag?.generalTag
        })
      }

      if (amp_enabled) articleObject.sAmpContent = await convertAmp(articleObject.sContent)

      const figure = articleObject.sContent.split('<!-- pagebreak -->')
      if (figure.length > 1) {
        const pagingCount = figure.length

        const ampFigure = articleObject.sAmpContent.split(/<!-- pagebreak -->/i)

        const articlePaging = {
          nTotal: pagingCount,
          oAmpPageContent: ampFigure,
          oPageContent: figure
        }
        Object.assign(articleObject, { oListicleArticle: articlePaging, bIsListicleArticle: true })
      }

      const insertedArticle = await ArticlesModel.create(articleObject)
      if (!insertedArticle?.nDuration) await updateArticleReadTime(insertedArticle._id)
      const seoObject = {
        oFB: {
          sUrl: '',
          sTitle: seoPostData?.open_graph_title ?? post.getDataValue('post_title'),
          sDescription: seoPostData?.open_graph_description ?? articleObject.sSrtTitle
        },
        oTwitter: {
          sUrl: '',
          sTitle: seoPostData?.twitter_title ?? post.getDataValue('post_title'),
          sDescription: seoPostData?.twitter_title ?? articleObject.sSrtTitle
        },
        sTitle: postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === '_yoast_wpseo_title')]?.meta_value ?? post.getDataValue('post_title'),
        sSlug: post.getDataValue('post_name'),
        sDescription: postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === '_yoast_wpseo_metadesc')]?.meta_value ?? postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === 'meta_key_yoast_wpseo_metadesc')]?.meta_value ?? seoPostData?.description ?? articleObject.sSrtTitle,
        aKeywords: postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === '_yoast_wpseo_keywordsynonyms')]?.meta_value?.slice(1, -1)?.split(',') ?? postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === '_yoast_wpseo_metakeywords')]?.meta_value?.split(',') ?? seoPostData?.primary_focus_keyword,
        sRobots: 'Follow, Index',
        eType: 'ar',
        dCreated: post.getDataValue('post_date_gmt'),
        dUpdated: post.getDataValue('post_modified_gmt'),
        sCUrl: post.getDataValue('post_name'),
        iId: insertedArticle._id
      }

      const sCategoryName = await CategoriesModel.findOne({ _id: insertedArticle.iCategoryId })
      Object.assign(insertedArticle, { oDisplayAuthor, sCategoryName, oSeo: seoObject })
      const sInsContent = _.convertToInstantArticle(insertedArticle)

      await ArticlesModel.updateOne({ _id: insertedArticle._id }, { sInsContent, 'oAdvanceFeature.bFBEnable': true })

      if (seoPostData?.open_graph_image?.replaceAll('https://www.crictracker.com', 'https://awesome.crictracker.com') !== image) {
        getS3URLImage(seoPostData?.open_graph_image?.replaceAll('https://www.crictracker.com', 'https://awesome.crictracker.com'), `${config.S3_BUCKET_FB_PATH}/${seoPostData?.open_graph_image?.includes('crictracker.com') ? seoPostData?.open_graph_image?.replaceAll('https://awesome.crictracker.com/wp-content/uploads/', '')?.replaceAll('https://image.crictracker.com/wp-content/uploads/', '') : seoPostData?.open_graph_image?.split('/')?.pop()}`).then(async (responseImage) => {
          seoObject.oFB.sUrl = `${config.S3_BUCKET_FB_PATH}/${seoPostData?.open_graph_image?.includes('crictracker.com') ? seoPostData?.open_graph_image?.replaceAll('https://awesome.crictracker.com/wp-content/uploads/', '')?.replaceAll('https://image.crictracker.com/wp-content/uploads/', '')?.replaceAll('https://crictracker.com/wp-content/uploads/', '') : seoPostData?.open_graph_image?.split('/')?.pop()}`
          if (responseImage) {
            size(s3.s3, config.S3_BUCKET_NAME, seoObject.oFB.sUrl, async (err, dimensions, bytesRead) => {
              if (err) {
                console.log({ err }, 'size')
              }
              Object.assign(seoObject.oFB, {
                oMeta: {
                  nWidth: dimensions?.width,
                  nHeight: dimensions?.height,
                  nSize: bytesRead
                }
              })
            })
          }
        })
      } else seoObject.oFB.sUrl = articleObject.oImg.sUrl

      if (seoPostData?.twitter_image?.replaceAll('https://www.crictracker.com', 'https://awesome.crictracker.com') !== image) {
        getS3URLImage(seoPostData?.twitter_image?.replaceAll('https://www.crictracker.com', 'https://awesome.crictracker.com'), `${config.S3_BUCKET_TWITTER_PATH}/${seoPostData?.twitter_image?.includes('crictracker.com') ? seoPostData?.twitter_image?.replaceAll('https://awesome.crictracker.com/wp-content/uploads/', '')?.replaceAll('https://image.crictracker.com/wp-content/uploads/', '') : seoPostData?.twitter_image?.split('/')?.pop()}`).then(async (responseImage) => {
          seoObject.oTwitter.sUrl = `${config.S3_BUCKET_TWITTER_PATH}/${seoPostData?.twitter_image?.includes('crictracker.com') ? seoPostData?.twitter_image?.replaceAll('https://awesome.crictracker.com/wp-content/uploads/', '')?.replaceAll('https://image.crictracker.com/wp-content/uploads/', '')?.replaceAll('https://crictracker.com/wp-content/uploads/', '') : seoPostData?.twitter_image?.split('/')?.pop()}`
          if (responseImage) {
            size(s3.s3, config.S3_BUCKET_NAME, seoObject.oTwitter.sUrl, async (err, dimensions, bytesRead) => {
              if (err) {
                console.log({ err }, 'size')
              }
              Object.assign(seoObject.oTwitter, {
                oMeta: {
                  nWidth: dimensions?.width,
                  nHeight: dimensions?.height,
                  nSize: bytesRead
                }
              })
            })
          }
        })
      } else seoObject.oTwitter.sUrl = articleObject.oImg.sUrl
      await SeoModel.create(seoObject)
      sContent?.postAttachments.push({ ...articleObject?.oImg, iAuthorId: postAuthor })
      // If required then add fb and twitter images.

      if (seoObject.oFB.sUrl) sContent?.postAttachments.push(seoObject.oFB)
      if (seoObject.oTwitter.sUrl) sContent?.postAttachments.push(seoObject.oTwitter)

      sContent?.postAttachments?.map((ele) => {
        Object.assign(ele, { aArticleIds: [insertedArticle._id] })
        return ele
      })

      for await (const attachment of sContent?.postAttachments) {
        const image = await gallery.findOne({ sUrl: attachment.sUrl?.replace(config.S3_BUCKET_URL) })
        if (!image) await gallery.create({ aArticleIds: [insertedArticle._id], ...attachment, eStatus: 'a' })
        else {
          if (!image?.aArticleIds?.includes(_.mongify(insertedArticle._id))) await gallery.updateOne({ _id: image._id }, { $push: { aArticleIds: insertedArticle._id } })
        }
      }

      console.log('-----------------------done------------------------')
    }
  } catch (error) {
    console.log({ error, id: post.getDataValue('id') })
    return error
  }
}

async function dumpBlog(post) {
  try {
    const postAttachments = []
    console.log(post.getDataValue('id'))
    const data = await axios.get(`https://awesome.crictracker.com/blog/wp-json/wp/v2/posts/${post.getDataValue('id')}`)
    if (data?.data) {
      const { rendered } = data.data.content

      const sContent = await getImagesFromBlogContent(rendered, postAttachments)

      const { amp_enabled, featured_media, author } = data.data
      const wpAuthor = await wpuser.findOne({ where: { id: author }, raw: true })

      let authorSlug = await SeoModel.findOne({ sSlug: wpAuthor.user_nicename })
      if (!authorSlug) authorSlug = await migrateBlogAuthor(wpAuthor)

      const oDisplayAuthor = await AdminModel.findOne({ _id: authorSlug.iId }).lean()
      Object.assign(oDisplayAuthor, { oSeo: authorSlug })

      let image, altText, caption, postAuthor

      if (featured_media === 0) {
        image = ''
      } else {
        const media = await axios.get(`https://awesome.crictracker.com/blog/wp-json/wp/v2/media/${featured_media}`)
        image = media?.data?.guid?.rendered
        altText = media?.data?.alt_text ?? media?.data?.title?.rendered
        caption = media?.data?.caption?.rendered
        postAuthor = media?.data?.author

        if (postAuthor) {
          const author = await wpuser.findOne({ where: { id: postAuthor } })
          SeoModel.findOne({ sSlug: author.getDataValue('user_nicename') }).then(async (seoResponse) => {
            if (seoResponse) {
              postAuthor = seoResponse.iId
            } else {
              const author = await migrateBlogAuthor(wpAuthor)
              postAuthor = author.iId
            }
          })
        }
      }

      const postMetaDetails = await postsMeta.findAll({ where: { post_id: post.getDataValue('id') }, raw: true })
      const [seoPostData] = await sequelize.query('SELECT * FROM wp_yoast_indexable WHERE object_id = :object_id AND object_sub_type="post";', { raw: true, replacements: { object_id: parseInt(post.getDataValue('id')) }, type: Sequelize.QueryTypes.SELECT })

      const iCategoryId = '632d7a5c26d925c83009aa76'

      const oMeta = {}

      image = image?.replaceAll('https://www.crictracker.com', 'https://awesome.crictracker.com')
      const sUrl = image?.includes('crictracker.com') ? `${config.S3_BUCKET_ARTICLE_FEATUREIMAGE_PATH}/${image?.replaceAll('https://awesome.crictracker.com/blog/wp-content/uploads/', '')?.replaceAll('https://image.crictracker.com/blog/wp-content/uploads/', '')}` : image?.split('/')?.pop()
      getS3URLImage(image, sUrl).then((responseImage) => {
        if (responseImage) {
          size(s3.s3, config.S3_BUCKET_NAME, sUrl, async (err, dimensions, bytesRead) => {
            if (err) {
              console.log({ err }, 'size')
            }

            Object.assign(oMeta, {
              nWidth: dimensions?.width,
              nHeight: dimensions?.height,
              nSize: bytesRead
            })
          })
        }
      }).catch((err) => {
        console.log({ err })
      })

      const articleObject = {
        id: post.getDataValue('id'),
        iAuthorId: authorSlug?.iId,
        iAuthorDId: authorSlug?.iId,
        eVisibility: 'pb',
        sTitle: post.getDataValue('post_title'),
        sSubtitle: post.getDataValue('post_excerpt') ?? postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === 'meta_key_yoast_wpseo_metadesc')]?.meta_value ?? seoPostData?.description ?? postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === 'ct-meta-short-title')]?.meta_value,
        sSrtTitle: post.getDataValue('post_excerpt') ?? postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === 'ct-meta-short-title')]?.meta_value ?? post.getDataValue('post_title'),
        sContent: sContent?.parseContent.toString(),
        eState: 'pub',
        eStatus: 'a',
        bPriority: false,
        oImg: {
          sUrl,
          sText: altText,
          sCaption: caption,
          oMeta
        },
        iCategoryId,
        sEditorNotes: '',
        oAdvanceFeature: {
          bAllowComments: post.getDataValue('comment_status') !== 'closed',
          bRequireAdminApproval: false,
          bAmp: amp_enabled,
          bFBEnable: false,
          bBrandedContent: false,
          bExclusiveArticle: false,
          bEditorsPick: false
        },
        nDuration: !isNaN(Number(postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === '_yoast_wpseo_estimated-reading-time-minutes')]?.meta_value)) ? Number(postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === '_yoast_wpseo_estimated-reading-time-minutes')]?.meta_value) : 0,
        nViewCount: !isNaN(Number(postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === 'views')]?.meta_value)) ? Number(postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === 'views')]?.meta_value) : 0,
        nOViews: !isNaN(Number(postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === 'views')]?.meta_value)) ? Number(postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === 'views')]?.meta_value) : 0,
        dCreated: post.getDataValue('post_date_gmt'),
        dPublishDate: post.getDataValue('post_date_gmt'),
        dModifiedDate: post.getDataValue('post_modified_gmt'),
        dUpdated: post.getDataValue('post_modified_gmt'),
        bOld: true
      }

      if (amp_enabled) articleObject.sAmpContent = await convertAmp(articleObject.sContent)

      const figure = articleObject.sContent.split('<!-- pagebreak -->')
      if (figure.length > 1) {
        const pagingCount = figure.length

        const ampFigure = articleObject.sAmpContent.split(/<!-- pagebreak -->/i)

        const articlePaging = {
          nTotal: pagingCount,
          oAmpPageContent: ampFigure,
          oPageContent: figure
        }
        Object.assign(articleObject, { oListicleArticle: articlePaging, bIsListicleArticle: true })
      }

      const insertedArticle = await ArticlesModel.create(articleObject)
      if (!insertedArticle?.nDuration) await updateArticleReadTime(insertedArticle._id)
      const seoObject = {
        oFB: {
          sUrl: '',
          sTitle: seoPostData?.open_graph_title ?? post.getDataValue('post_title'),
          sDescription: seoPostData?.open_graph_description ?? articleObject.sSrtTitle
        },
        oTwitter: {
          sUrl: '',
          sTitle: seoPostData?.twitter_title ?? post.getDataValue('post_title'),
          sDescription: seoPostData?.twitter_title ?? articleObject.sSrtTitle
        },
        sTitle: postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === '_yoast_wpseo_title')]?.meta_value ?? post.getDataValue('post_title'),
        sSlug: `blog/${post.getDataValue('post_name')}`,
        sDescription: postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === '_yoast_wpseo_metadesc')]?.meta_value ?? postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === 'meta_key_yoast_wpseo_metadesc')]?.meta_value ?? seoPostData?.description ?? articleObject.sSrtTitle,
        aKeywords: postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === '_yoast_wpseo_keywordsynonyms')]?.meta_value?.slice(1, -1)?.split(',') ?? postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === '_yoast_wpseo_metakeywords')]?.meta_value?.split(',') ?? seoPostData?.primary_focus_keyword,
        sRobots: 'Follow, Index',
        eType: 'ar',
        dCreated: post.getDataValue('post_date_gmt'),
        dUpdated: post.getDataValue('post_modified_gmt'),
        sCUrl: `blog/${post.getDataValue('post_name')}`,
        iId: insertedArticle._id
      }

      if (seoPostData?.open_graph_image?.replaceAll('https://www.crictracker.com', 'https://awesome.crictracker.com') !== image) {
        getS3URLImage(seoPostData?.open_graph_image?.replaceAll('https://www.crictracker.com', 'https://awesome.crictracker.com'), `${config.S3_BUCKET_FB_PATH}/${seoPostData?.open_graph_image?.includes('crictracker.com') ? seoPostData?.open_graph_image?.replaceAll('https://awesome.crictracker.com/wp-content/uploads/', '')?.replaceAll('https://image.crictracker.com/wp-content/uploads/', '') : seoPostData?.open_graph_image?.split('/')?.pop()}`).then(async (responseImage) => {
          seoObject.oFB.sUrl = `${config.S3_BUCKET_FB_PATH}/${seoPostData?.open_graph_image?.includes('crictracker.com') ? seoPostData?.open_graph_image?.replaceAll('https://awesome.crictracker.com/wp-content/uploads/', '')?.replaceAll('https://image.crictracker.com/wp-content/uploads/', '') : seoPostData?.open_graph_image?.split('/')?.pop()}`
          if (responseImage) {
            size(s3.s3, config.S3_BUCKET_NAME, seoObject.oFB.sUrl, async (err, dimensions, bytesRead) => {
              if (err) {
                console.log({ err }, 'size')
              }
              Object.assign(seoObject.oFB, {
                oMeta: {
                  nWidth: dimensions?.width,
                  nHeight: dimensions?.height,
                  nSize: bytesRead
                }
              })
            })
          }
        })
      } else seoObject.oFB.sUrl = articleObject.oImg.sUrl

      if (seoPostData?.twitter_image?.replaceAll('https://www.crictracker.com', 'https://awesome.crictracker.com') !== image) {
        getS3URLImage(seoPostData?.twitter_image?.replaceAll('https://www.crictracker.com', 'https://awesome.crictracker.com'), `${config.S3_BUCKET_TWITTER_PATH}/${seoPostData?.twitter_image?.includes('crictracker.com') ? seoPostData?.twitter_image?.replaceAll('https://awesome.crictracker.com/wp-content/uploads/', '')?.replaceAll('https://image.crictracker.com/wp-content/uploads/', '') : seoPostData?.twitter_image?.split('/')?.pop()}`).then(async (responseImage) => {
          seoObject.oTwitter.sUrl = `${config.S3_BUCKET_TWITTER_PATH}/${seoPostData?.twitter_image?.includes('crictracker.com') ? seoPostData?.twitter_image?.replaceAll('https://awesome.crictracker.com/wp-content/uploads/', '')?.replaceAll('https://image.crictracker.com/wp-content/uploads/', '') : seoPostData?.twitter_image?.split('/')?.pop()}`
          if (responseImage) {
            size(s3.s3, config.S3_BUCKET_NAME, seoObject.oTwitter.sUrl, async (err, dimensions, bytesRead) => {
              if (err) {
                console.log({ err }, 'size')
              }
              Object.assign(seoObject.oTwitter, {
                oMeta: {
                  nWidth: dimensions?.width,
                  nHeight: dimensions?.height,
                  nSize: bytesRead
                }
              })
            })
          }
        })
      } else seoObject.oTwitter.sUrl = articleObject.oImg.sUrl
      await SeoModel.create(seoObject)
      sContent?.postAttachments.push({ ...articleObject?.oImg, iAuthorId: postAuthor })
      // If required then add fb and twitter images.

      if (seoObject.oFB.sUrl) sContent?.postAttachments.push(seoObject.oFB)
      if (seoObject.oTwitter.sUrl) sContent?.postAttachments.push(seoObject.oTwitter)

      sContent?.postAttachments?.map((ele) => {
        Object.assign(ele, { aArticleIds: [insertedArticle._id] })
        return ele
      })

      for await (const attachment of sContent?.postAttachments) {
        const image = await gallery.findOne({ sUrl: attachment.sUrl?.replace(config.S3_BUCKET_URL) })
        if (!image) await gallery.create({ aArticleIds: [insertedArticle._id], ...attachment, eStatus: 'a' })
        else {
          if (!image?.aArticleIds?.includes(_.mongify(insertedArticle._id))) await gallery.updateOne({ _id: image._id }, { $push: { aArticleIds: insertedArticle._id } })
        }
      }

      console.log('-----------------------done------------------------')
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

article.dumpBlogDataToMongo = async (req, res) => {
  try {
    const post = await posts.findAll({ where: { post_status: 'publish', post_type: 'post' } })

    for (const article of post) {
      try {
        // const mongoArticle = await ArticlesModel.findOne({ sTitle: article.getDataValue('post_title') })
        const mongoSeoArticle = await SeoModel.findOne({ sSlug: `blog/${article.getDataValue('post_name')}` })

        // if (mongoArticle || mongoSeoArticle) {
        //   // console.log({ mongoArticle }, { mongoSeoArticle })
        //   console.log(article.getDataValue('post_name'))
        //   await SeoModel.deleteMany({ sSlug: 'blog/' + article.getDataValue('post_name') })
        //   await ArticlesModel.deleteMany({ sTitle: article.getDataValue('post_title') })
        //   // await ArticlesModel.updateOne({ sTitle: article.getDataValue('post_title') }, { $rename: { isOld: 'bOld' } }, { strict: false })
        //   console.log({ mongoArticle: mongoArticle?._id }, { mongoSeoArticle: mongoSeoArticle?._id })
        // }
        if (!mongoSeoArticle) dumpBlog(article)
        // else console.log('Article already exists')
      } catch (error) {
        console.log(error)
      }
    }
    return res.send('Done')
  } catch (error) {
    return error
  }
}

article.dumpArticleDataSqlToMongo = async (req, res) => {
  try {
    let { sSlug } = req.query
    sSlug = sSlug.endsWith('/') ? sSlug.substr(0, sSlug.length - 1) : sSlug
    if (!sSlug) return res.send({ message: 'Slug is required' })
    const post = await posts.findOne({ where: { post_name: sSlug } })

    if (!post) return res.send({ message: 'please provide slug for posts before date 10 august' })

    const mongoArticle = await ArticlesModel.findOne({ id: post.getDataValue('id') })
    const mongoSeoArticle = await SeoModel.findOne({ sSlug: post.getDataValue('post_name') })
    // if (mongoArticle || mongoSeoArticle) {
    //   // console.log({ mongoArticle }, { mongoSeoArticle })
    //   await SeoModel.deleteOne({ sSlug: article.getDataValue('post_name') })
    //   await ArticlesModel.deleteOne({ sTitle: article.getDataValue('post_title') })
    //   // await ArticlesModel.updateOne({ sTitle: article.getDataValue('post_title') }, { $rename: { isOld: 'bOld' } }, { strict: false })
    //   console.log({ mongoArticle: mongoArticle?._id }, { mongoSeoArticle: mongoSeoArticle?._id })
    // }
    if (!mongoArticle && !mongoSeoArticle) {
      await dumpArticle(post)
      res.send('done')
    } else {
      await ArticlesModel.deleteOne({ id: post.getDataValue('id') })
      await SeoModel.deleteOne({ sSlug: post.getDataValue('post_name') })
      console.log(post.getDataValue('id'))
      await dumpArticle(post)
      res.send({ message: 'Article already exists' })
    }
  } catch (error) {
    console.log(error)
    return res.send({ error, message: 'Something went wrong' })
  }
}

article.dumpAllArticle = async (req, res) => {
  const count = await posts.count({ where: { post_status: 'publish', post_type: 'post' } })
  for (let index = 0; index < count / 1000; index++) {
    const post = await posts.findAll({ where: { post_status: 'publish', post_type: 'post' }, order: [['post_date', 'DESC']], offset: index * 1000, limit: 1000 })
    async.eachSeries(post, async (article, cb) => {
      try {
        const mongoArticle = await ArticlesModel.findOne({ id: article.getDataValue('id') }).lean()
        // const mongoArticle = await ArticlesModel.findOne({ sTitle: article.getDataValue('post_title') })
        // const mongoSeoArticle = await SeoModel.findOne({ sSlug: article.getDataValue('post_name') })
        // if (mongoArticle || mongoSeoArticle) {
        //   // console.log({ mongoArticle }, { mongoSeoArticle })
        //   await SeoModel.deleteOne({ sSlug: article.getDataValue('post_name') })
        //   await ArticlesModel.deleteOne({ sTitle: article.getDataValue('post_title') })
        //   // await ArticlesModel.updateOne({ sTitle: article.getDataValue('post_title') }, { $rename: { isOld: 'bOld' } }, { strict: false })
        //   console.log({ mongoArticle: mongoArticle?._id }, { mongoSeoArticle: mongoSeoArticle?._id })
        // }
        if (!mongoArticle) await dumpArticle(article)
        // else console.log('Article already exists')
        Promise.resolve(cb)
      } catch (error) {
        console.log(error)
      }
      Promise.resolve(cb)
    })
  }
  return res.send('Done')
}

article.generateSiteMap = async (req, res) => {
  try {
    await SiteMapModel.deleteMany({})
    await SiteMapModel.create({
      sKey: config.BASE_SITEMAP + '.xml'
    })

    const allCategories = await CategoriesModel.find({ eStatus: 'a' }, { _id: 1 })
    const allPlayers = await PlayersModel.find({ bTagEnabled: true, eTagStatus: 'a' }, { _id: 1 })
    const allTeams = await TeamsModel.find({ bTagEnabled: true, eTagStatus: 'a' }, { _id: 1 })
    // const allVenues = await VenuesModel.find({ bTagEnabled: true, eTagStatus: 'a' }, { _id: 1 })
    const allTags = await TagsModel.find({ eStatus: 'a', eType: 'gt' }, { _id: 1 })
    const allAdmins = await AdminModel.find({ eDisplayStatus: 'a', eType: { $ne: 'su' }, nArticleCount: { $gt: 0 } }, { _id: 1 })

    const allJobs = await JobPostsModel.find({ eStatus: 'a' })

    const allNewsArticles = await ArticlesModel.find({ eState: 'pub', eStatus: 'a', eVisibility: 'pb' }, { _id: 1, dPublishDate: 1, sContent: 1, oImg: 1, oTImg: 1, sTitle: 1 }).sort({ dPublishDate: -1 }).limit(50)

    const allNewsFantasyArticles = await FantasyArticleModel.find({ eStatus: 'a', eVisibility: 'pb', eState: 'pub' }, { _id: 1, dPublishDate: 1, oImg: 1, oTImg: 1, sTitle: 1 }).sort({ dPublishDate: -1 }).limit(50)

    const totalArticles = [...allNewsArticles, ...allNewsFantasyArticles]

    totalArticles.sort((a, b) => new Date(b.date) - new Date(a.date))

    const allPages = ['about-us/',
      'authors/',
      'careers/',
      'contact-us/',
      'cricket-schedule/',
      'cricket-series/',
      'cricket-series-archive/',
      'cricket-videos/',
      'fantasy-cricket-tips/',
      'icc-rankings/',
      'live-scores/',
      'live-scores/recent/',
      'live-scores/upcoming/',
      'playlist/']

    console.log('sitemap migrations starated')

    const adminsUrl = []

    async.eachSeries(allAdmins, async (admins, cb) => {
      let tempObj = {}

      const seo = await SeoModel.findOne({ iId: _.mongify(admins._id) }).select('sSlug')

      if (seo?.sSlug) {
        const imgTmpObj = {}

        if (admins?.sUrl) Object.assign(imgTmpObj, { 'image:loc': `${config.S3_CDN_URL}${admins?.sUrl}` })

        tempObj = {
          _id: admins._id,
          loc: `author/${seo?.sSlug}/`,
          lastmod: moment.tz(admins?.dUpdated, 'Asia/Kolkata'),
          changefreq: 'daily',
          priority: 0.8
        }

        if (imgTmpObj) Object.assign(tempObj, { 'image:image': [imgTmpObj] })

        adminsUrl.push(tempObj)
      }
      Promise.resolve(cb)
    }, async (err) => {
      if (err) console.log({ err })
      else {
        const baseSitemap = await SiteMapModel.findOneAndUpdate({ sKey: config.BASE_SITEMAP + '.xml' }, { $push: { sitemap: { loc: config.AUTHOR_SITEMAP + '.xml', lastmod: new Date() } } }, { new: true })
        await SiteMapModel.create({ sKey: config.AUTHOR_SITEMAP + '.xml', url: adminsUrl })
        await redis.redisclient.set(config.AUTHOR_SITEMAP + '.xml', _.stringify({ sitemap: adminsUrl }))
        await redis.redisclient.set(config.BASE_SITEMAP + '.xml', _.stringify({ sitemap: baseSitemap }))
        console.log('admin sitemap compelted')
      }
    })

    const categoriesUrl = []

    async.eachSeries(allCategories, async (categories, cb) => {
      let tempObj = {}

      const seo = await SeoModel.findOne({ iId: _.mongify(categories._id) }).lean()

      const imgTempObj = {}

      if (categories?.sUrl) Object.assign(imgTempObj, { 'image:loc': `${config.S3_CDN_URL}${categories?.sUrl}` })
      if (categories?.sTitle) Object.assign(imgTempObj, { 'image:title': categories?.sTitle })
      if (categories?.sCaption) Object.assign(imgTempObj, { 'image:caption': categories?.sCaption })

      tempObj = {
        _id: categories._id,
        loc: `${seo?.sSlug}/`,
        lastmod: moment.tz(categories.dUpdated, 'Asia/Kolkata'),
        changefreq: 'daily',
        priority: 0.9
      }

      if (imgTempObj) Object.assign(tempObj, { 'image:image': [imgTempObj] })
      categoriesUrl.push(tempObj)

      Promise.resolve(cb)
    }, async (err) => {
      if (err) console.log({ err })
      else {
        console.log('categories sitemap completed')
        const baseSitemap = await SiteMapModel.findOneAndUpdate({ sKey: config.BASE_SITEMAP + '.xml' }, { $push: { sitemap: { loc: config.CATEGORY_SITEMAP + '.xml', lastmod: new Date() } } }, { new: true })
        await SiteMapModel.create({ sKey: config.CATEGORY_SITEMAP + '.xml', url: categoriesUrl })
        await redis.redisclient.set(config.CATEGORY_SITEMAP + '.xml', _.stringify({ sitemap: categoriesUrl }))
        await redis.redisclient.set(config.BASE_SITEMAP + '.xml', _.stringify({ sitemap: baseSitemap }))
      }
    })

    const tagsUrl = []

    async.eachSeries(allTags, async (tags, cb) => {
      let tempObj = {}

      const seo = await SeoModel.findOne({ iId: _.mongify(tags._id) }).select('sSlug')

      tempObj = {
        _id: tags._id,
        loc: `${seo?.sSlug}/`,
        lastmod: moment.tz(tags?.dUpdated, 'Asia/Kolkata'),
        changefreq: 'daily',
        priority: 0.8
      }
      tagsUrl.push(tempObj)

      Promise.resolve(cb)
    }, async (err) => {
      if (err) console.log({ err })
      else {
        console.log('tags sitemap completed')
        const baseSitemap = await SiteMapModel.findOneAndUpdate({ sKey: config.BASE_SITEMAP + '.xml' }, { $push: { sitemap: { loc: config.POST_TAG_SITEMAP + '.xml', lastmod: new Date() } } }, { new: true })
        await SiteMapModel.create({ sKey: config.POST_TAG_SITEMAP + '.xml', url: tagsUrl })
        await redis.redisclient.set(config.POST_TAG_SITEMAP + '.xml', _.stringify({ sitemap: tagsUrl }))
        await redis.redisclient.set(config.BASE_SITEMAP + '.xml', _.stringify({ sitemap: baseSitemap }))
      }
    })

    const playersUrl = []

    async.eachSeries(allPlayers, async (player, cb) => {
      let tempObj = {}

      const imgTempObj = {}

      const seo = await SeoModel.findOne({ iId: _.mongify(player._id) }).select('sSlug')

      if (player?.oImg?.sUrl) Object.assign(imgTempObj, { 'image:loc': `${config.S3_CDN_URL}${player?.oImg?.sUrl}` })
      if (imgTempObj) Object.assign(tempObj, { 'image:image': [imgTempObj] })

      tempObj = {
        _id: player._id,
        loc: `${seo?.sSlug}/`,
        lastmod: moment.tz(player?.dUpdated, 'Asia/Kolkata'),
        changefreq: 'daily',
        priority: 0.8
      }
      playersUrl.push(tempObj)

      Promise.resolve(cb)
    }, async (err) => {
      if (err) console.log({ err })
      else {
        console.log('Players sitemap completed')
        const baseSitemap = await SiteMapModel.findOneAndUpdate({ sKey: config.BASE_SITEMAP + '.xml' }, { $push: { sitemap: { loc: config.PLAYER_SITEMAP + '.xml', lastmod: new Date() } } }, { new: true })
        await SiteMapModel.create({ sKey: config.PLAYER_SITEMAP + '.xml', url: playersUrl })
        await redis.redisclient.set(config.PLAYER_SITEMAP + '.xml', _.stringify({ sitemap: playersUrl }))
        await redis.redisclient.set(config.BASE_SITEMAP + '.xml', _.stringify({ sitemap: baseSitemap }))
      }
    })

    const teamsUrl = []

    async.eachSeries(allTeams, async (team, cb) => {
      let tempObj = {}

      const imgTempObj = {}

      const seo = await SeoModel.findOne({ iId: _.mongify(team._id) }).select('sSlug')

      if (team?.oImg?.sUrl) Object.assign(imgTempObj, { 'image:loc': `${config.S3_CDN_URL}${team?.oImg?.sUrl}` })
      if (imgTempObj) Object.assign(tempObj, { 'image:image': [imgTempObj] })

      tempObj = {
        _id: team._id,
        loc: `${seo?.sSlug}/`,
        lastmod: moment.tz(team?.dUpdated, 'Asia/Kolkata'),
        changefreq: 'daily',
        priority: 0.8
      }

      teamsUrl.push(tempObj)

      Promise.resolve(cb)
    }, async (err) => {
      if (err) console.log({ err })
      else {
        console.log('Team sitemap completed')
        const baseSitemap = await SiteMapModel.findOneAndUpdate({ sKey: config.BASE_SITEMAP + '.xml' }, { $push: { sitemap: { loc: config.TEAM_SITEMAP + '.xml', lastmod: new Date() } } })
        await SiteMapModel.create({ sKey: config.TEAM_SITEMAP + '.xml', url: teamsUrl })
        await redis.redisclient.set(config.TEAM_SITEMAP + '.xml', _.stringify({ sitemap: teamsUrl }))
        await redis.redisclient.set(config.BASE_SITEMAP + '.xml', _.stringify({ sitemap: baseSitemap }))
      }
    })

    const pagesUrl = []

    async.eachSeries(allPages, async (pages, cb) => {
      let tempObj = {}

      tempObj = {
        loc: pages,
        lastmod: moment.tz(pages?.dUpdated, 'Asia/Kolkata'),
        changefreq: 'daily',
        priority: 0.7
      }
      pagesUrl.push(tempObj)

      Promise.resolve(cb)
    }, async (err) => {
      if (err) console.log({ err })
      else {
        console.log('pages sitemap completed')
        const baseSitemap = await SiteMapModel.findOneAndUpdate({ sKey: config.BASE_SITEMAP + '.xml' }, { $push: { sitemap: { loc: `${config.PAGE_SITEMAP}.xml`, lastmod: new Date() } } })
        await SiteMapModel.create({ sKey: `${config.PAGE_SITEMAP}.xml`, url: pagesUrl })
        await redis.redisclient.set(config.PAGE_SITEMAP + '.xml', _.stringify({ sitemap: pagesUrl }))
        await redis.redisclient.set(config.BASE_SITEMAP + '.xml', _.stringify({ sitemap: baseSitemap }))
      }
    })

    const careerUrl = []

    async.eachSeries(allJobs, async (jobs, cb) => {
      let tempObj = {}

      const seo = await SeoModel.findOne({ iId: _.mongify(jobs._id) }).select('sSlug')

      tempObj = {
        _id: jobs._id,
        loc: `${seo?.sSlug}/`,
        lastmod: moment.tz(jobs?.dUpdated, 'Asia/Kolkata'),
        changefreq: 'daily',
        priority: 0.7
      }

      careerUrl.push(tempObj)

      Promise.resolve(cb)
    }, async (err) => {
      if (err) console.log({ err })
      else {
        console.log('carrer sitemap completed')
        const baseSitemap = await SiteMapModel.findOneAndUpdate({ sKey: config.BASE_SITEMAP + '.xml' }, { $push: { sitemap: { loc: config.CAREER_SITEMAP + '.xml', lastmod: new Date() } } })
        await SiteMapModel.create({ sKey: config.CAREER_SITEMAP + '.xml', url: careerUrl })
        await redis.redisclient.set(config.CAREER_SITEMAP + '.xml', _.stringify({ sitemap: careerUrl }))
        await redis.redisclient.set(config.BASE_SITEMAP + '.xml', _.stringify({ sitemap: baseSitemap }))
      }
    })

    const newsSitemap = []

    let image = []

    async.eachSeries(totalArticles, async (articles, cb) => {
      let tempObj = {}
      const imgTempObj = {}

      const seo = await SeoModel.findOne({ iId: _.mongify(articles._id) }).select('sSlug aKeywords')

      if (articles?.oImg?.sUrl) {
        if (articles.oImg?.sUrl || articles.oImg?.sTitle || articles.oImg?.sCaption) {
          if (articles.oImg.sUrl) Object.assign(imgTempObj, { 'image:loc': `${config.S3_CDN_URL}${articles.oImg?.sUrl}` })
          if (articles.oImg.sTitle) Object.assign(imgTempObj, { 'image:title': articles.oImg?.sTitle })
          if (articles.oImg.sCaption) Object.assign(imgTempObj, { 'image:caption': articles.oImg?.sCaption })
          if (imgTempObj) image.push(imgTempObj)
        }
      }

      if (articles?.oTImg?.sUrl) {
        if (articles.oTImg?.sUrl || articles.oTImg?.sTitle || articles.oTImg?.sCaption) {
          if (articles.oTImg.sUrl) Object.assign(imgTempObj, { 'image:loc': `${config.S3_CDN_URL}${articles.oTImg?.sUrl}` })
          if (articles.oTImg.sTitle) Object.assign(imgTempObj, { 'image:title': articles.oTImg?.sTitle })
          if (articles.oTImg.sCaption) Object.assign(imgTempObj, { 'image:caption': articles.oTImg?.sCaption })
          if (imgTempObj) image.push(imgTempObj)
        }
      }

      if (articles?.sContent || articles?.sMatchPreview) {
        const parsedContent = articles?.sContent ? parse(articles.sContent) : parse(articles.sMatchPreview)

        for (let index = 0; index < parsedContent.querySelectorAll('img')?.length; index++) {
          const ele = parsedContent.querySelectorAll('img')[index]
          if (ele.getAttribute('src')) {
            const image = await gallery.findOne({ sUrl: ele.getAttribute('src').replaceAll(config.S3_CDN_URL) })
            if (image?.sUrl || image?.sTitle || image?.sCaption) {
              if (image.sUrl) Object.assign(imgTempObj, { 'image:loc': `${config.S3_CDN_URL}${image?.sUrl}` })
              if (image.sTitle) Object.assign(imgTempObj, { 'image:title': image?.sTitle })
              if (image.sCaption) Object.assign(imgTempObj, { 'image:caption': image?.sCaption })
              if (imgTempObj) image.push(imgTempObj)
            }
          }
        }
      }

      tempObj = {
        _id: articles._id,
        loc: `${seo?.sSlug}/`,
        'news:news': [{
          'news:publication': [{
            'news:name': 'Crictracker',
            'news:language': 'en'
          }],
          'news:publication_date': articles.dPublishDate,
          'news:title': articles.sTitle,
          'news:keywords': seo?.aKeywords?.join(',')
        }]
      }

      if (image.length) Object.assign(tempObj, { 'image:image': image })

      newsSitemap.push(tempObj)

      image = []
      Promise.resolve(cb)
    }, async (err) => {
      if (err) console.log({ err })
      else {
        console.log('article news sitemap completed')
        const baseSitemap = await SiteMapModel.findOneAndUpdate({ sKey: config.BASE_SITEMAP + '.xml' }, { $push: { sitemap: { loc: config.NEWS_SITEMAP + '.xml', lastmod: new Date() } } })
        await SiteMapModel.create({ sKey: config.NEWS_SITEMAP + '.xml', url: newsSitemap })
        await redis.redisclient.set(config.NEWS_SITEMAP + '.xml', _.stringify({ sitemap: newsSitemap }))
        await redis.redisclient.set(config.BASE_SITEMAP + '.xml', _.stringify({ sitemap: baseSitemap }))
      }
    })

    res.send('done')

    const newsArchive = {}
    image = []

    // const allArticles = await ArticlesModel.find({ eState: 'pub', eStatus: 'a', eVisibility: 'pb' }, { _id: 1, dPublishDate: 1, sContent: 1, oImg: 1, oTImg: 1, sTitle: 1 }).lean()
    // const allFantasyArticles = await FantasyArticleModel.find({ eStatus: 'a', eVisibility: 'pb', eState: 'pub' }, { _id: 1, dPublishDate: 1, oImg: 1, oTImg: 1, sTitle: 1 }).lean()
    // const totalAllArticles = [...allArticles, ...allFantasyArticles]

    const allArticlesCount = await ArticlesModel.countDocuments({ eState: 'pub', eStatus: 'a', eVisibility: 'pb' }, { _id: 1, dPublishDate: 1, sContent: 1, oImg: 1, oTImg: 1, sTitle: 1 })

    const allFantasyArticlesCount = await FantasyArticleModel.countDocuments({ eStatus: 'a', eVisibility: 'pb', eState: 'pub' }, { _id: 1, dPublishDate: 1, oImg: 1, oTImg: 1, sTitle: 1 })

    const totalAllArticlesCount = allArticlesCount + allFantasyArticlesCount

    for (let i = 0; i <= totalAllArticlesCount / 10000; i++) {
      const allArticles = await ArticlesModel.find({ eState: 'pub', eStatus: 'a', eVisibility: 'pb' }, { _id: 1, dPublishDate: 1, sContent: 1, oImg: 1, oTImg: 1, sTitle: 1 }).skip(i * 10000).limit(10000).lean()
      const allFantasyArticles = await FantasyArticleModel.find({ eStatus: 'a', eVisibility: 'pb', eState: 'pub' }, { _id: 1, dPublishDate: 1, oImg: 1, oTImg: 1, sTitle: 1 }).skip(i * 10000).limit(10000).lean()
      const totalAllArticles = [...allArticles, ...allFantasyArticles]
      for (const articles of totalAllArticles) {
        if (articles) {
          let tempObj = {}
          const imgTempObj = {}
          console.log(articles.id)
          if (!newsArchive[`${config.POST_SITEMAP}-${new Date(articles.dPublishDate).getFullYear()}-${String(new Date(articles.dPublishDate).getMonth() + 1).padStart(2, '0')}`]) {
            Object.assign(newsArchive, { [`${config.POST_SITEMAP}-${new Date(articles.dPublishDate).getFullYear()}-${String(new Date(articles.dPublishDate).getMonth() + 1).padStart(2, '0')}`]: [] })
          }
          const seo = await SeoModel.findOne({ iId: _.mongify(articles._id) }).select('sSlug')

          if (articles?.oImg?.sUrl) {
            if (articles.oImg?.sUrl || articles.oImg?.sTitle || articles.oImg?.sCaption) {
              if (articles.oImg.sUrl) Object.assign(imgTempObj, { 'image:loc': `${config.S3_CDN_URL}${articles.oImg?.sUrl}` })
              if (articles.oImg.sTitle) Object.assign(imgTempObj, { 'image:title': articles.oImg?.sTitle })
              if (articles.oImg.sCaption) Object.assign(imgTempObj, { 'image:caption': articles.oImg?.sCaption })
              if (imgTempObj) image.push(imgTempObj)
            }
          }

          if (articles?.oTImg?.sUrl) {
            if (articles.oTImg?.sUrl || articles.oTImg?.sTitle || articles.oTImg?.sCaption) {
              if (articles.oTImg.sUrl) Object.assign(imgTempObj, { 'image:loc': `${config.S3_CDN_URL}${articles.oTImg?.sUrl}` })
              if (articles.oTImg.sTitle) Object.assign(imgTempObj, { 'image:title': articles.oTImg?.sTitle })
              if (articles.oTImg.sCaption) Object.assign(imgTempObj, { 'image:caption': articles.oTImg?.sCaption })
              if (imgTempObj) image.push(imgTempObj)
            }
          }

          if (articles?.sContent || articles?.sMatchPreview) {
            const parseContent = articles?.sContent ? parse(articles.sContent) : parse(articles.sMatchPreview)

            for (let index = 0; index < parseContent.querySelectorAll('img')?.length; index++) {
              const ele = parseContent.querySelectorAll('img')[index]
              if (ele.getAttribute('src')) {
                const images = await gallery.findOne({ sUrl: ele.getAttribute('src').replaceAll(config.S3_CDN_URL) })
                if (images?.sUrl || images?.sTitle || images?.sCaption) {
                  if (images.sUrl) Object.assign(imgTempObj, { 'image:loc': `${config.S3_CDN_URL}${images?.sUrl}` })
                  if (images.sTitle) Object.assign(imgTempObj, { 'image:title': images?.sTitle })
                  if (images.sCaption) Object.assign(imgTempObj, { 'image:caption': images?.sCaption })
                  if (imgTempObj) image.push(imgTempObj)
                }
              }
            }
          }

          tempObj = {
            _id: articles._id,
            loc: `${seo?.sSlug}/`,
            lastmod: moment.tz(articles?.dModifiedDate, 'Asia/Kolkata'),
            changefreq: 'daily',
            priority: 0.9
          }

          if (image.length) Object.assign(tempObj, { 'image:image': image })
          console.log({ article: tempObj })
          newsArchive[[`${config.POST_SITEMAP}-${new Date(articles.dPublishDate).getFullYear()}-${String(new Date(articles.dPublishDate).getMonth() + 1).padStart(2, '0')}`]].push(tempObj)

          image = []
          if (totalAllArticles.indexOf((ele) => ele._id.toString() === articles._id.toString()) === totalAllArticles.length - 1) {
            for await (const a of Object.keys(newsArchive)) {
              const newsArchiveObj = newsArchive[a]
              console.log(newsArchiveObj.length)
              const baseSitemap = await SiteMapModel.findOne({ sKey: config.BASE_SITEMAP + '.xml' })
              if (!baseSitemap?.sitemap?.some((ele) => ele.loc === a + '.xml')) {
                await SiteMapModel.updateOne({ _id: baseSitemap?._id }, { $push: { sitemap: { loc: a + '.xml', lastmod: new Date() } } })
              }
              await SiteMapModel.updateOne({ sKey: a + '.xml' }, { $push: { url: newsArchiveObj } }, { upsert: true })
              await redis.redisclient.set(a + '.xml', _.stringify({ sitemap: newsArchiveObj }))
              await redis.redisclient.set(config.BASE_SITEMAP + '.xml', _.stringify({ sitemap: baseSitemap }))
            }
            console.log('article sitemap completed')
          }
        }
      }
    }

    // async.eachSeries(totalAllArticles, async (articles, cb) => {
    //   if (articles) {
    //     let tempObj = {}
    //     const imgTempObj = {}
    //     console.log(articles.id)
    //     if (!newsArchive[`${config.POST_SITEMAP}-${new Date(articles.dPublishDate).getFullYear()}-${String(new Date(articles.dPublishDate).getMonth() + 1).padStart(2, '0')}`]) {
    //       Object.assign(newsArchive, { [`${config.POST_SITEMAP}-${new Date(articles.dPublishDate).getFullYear()}-${String(new Date(articles.dPublishDate).getMonth() + 1).padStart(2, '0')}`]: [] })
    //     }
    //     const seo = await SeoModel.findOne({ iId: _.mongify(articles._id) }).select('sSlug')

    //     if (articles?.oImg?.sUrl) {
    //       if (articles.oImg?.sUrl || articles.oImg?.sTitle || articles.oImg?.sCaption) {
    //         if (articles.oImg.sUrl) Object.assign(imgTempObj, { 'image:loc': `${config.S3_CDN_URL}${articles.oImg?.sUrl}` })
    //         if (articles.oImg.sTitle) Object.assign(imgTempObj, { 'image:title': articles.oImg?.sTitle })
    //         if (articles.oImg.sCaption) Object.assign(imgTempObj, { 'image:caption': articles.oImg?.sCaption })
    //         if (imgTempObj) image.push(imgTempObj)
    //       }
    //     }

    //     if (articles?.oTImg?.sUrl) {
    //       if (articles.oTImg?.sUrl || articles.oTImg?.sTitle || articles.oTImg?.sCaption) {
    //         if (articles.oTImg.sUrl) Object.assign(imgTempObj, { 'image:loc': `${config.S3_CDN_URL}${articles.oTImg?.sUrl}` })
    //         if (articles.oTImg.sTitle) Object.assign(imgTempObj, { 'image:title': articles.oTImg?.sTitle })
    //         if (articles.oTImg.sCaption) Object.assign(imgTempObj, { 'image:caption': articles.oTImg?.sCaption })
    //         if (imgTempObj) image.push(imgTempObj)
    //       }
    //     }

    //     if (articles?.sContent || articles?.sMatchPreview) {
    //       const parseContent = articles?.sContent ? parse(articles.sContent) : parse(articles.sMatchPreview)

    //       for (let index = 0; index < parseContent.querySelectorAll('img')?.length; index++) {
    //         const ele = parseContent.querySelectorAll('img')[index]
    //         if (ele.getAttribute('src')) {
    //           const images = await gallery.findOne({ sUrl: ele.getAttribute('src').replaceAll(config.S3_CDN_URL) })
    //           if (images?.sUrl || images?.sTitle || images?.sCaption) {
    //             if (images.sUrl) Object.assign(imgTempObj, { 'image:loc': `${config.S3_CDN_URL}${images?.sUrl}` })
    //             if (images.sTitle) Object.assign(imgTempObj, { 'image:title': images?.sTitle })
    //             if (images.sCaption) Object.assign(imgTempObj, { 'image:caption': images?.sCaption })
    //             if (imgTempObj) image.push(imgTempObj)
    //           }
    //         }
    //       }
    //     }

    //     tempObj = {
    //       _id: articles._id,
    //       loc: `${seo?.sSlug}/`,
    //       lastmod: moment.tz(articles?.dModifiedDate, 'Asia/Kolkata'),
    //       changefreq: 'daily',
    //       priority: 0.9
    //     }

    //     if (image.length) Object.assign(tempObj, { 'image:image': image })
    //     console.log({ article: tempObj })
    //     newsArchive[[`${config.POST_SITEMAP}-${new Date(articles.dPublishDate).getFullYear()}-${String(new Date(articles.dPublishDate).getMonth() + 1).padStart(2, '0')}`]].push(tempObj)

    //     image = []
    //   }
    // }, async (err) => {
    //   if (err) console.log({ err })
    //   else {
    //     for await (const a of Object.keys(newsArchive)) {
    //       const newsArchiveObj = newsArchive[a]
    //       console.log(newsArchiveObj.length)
    //       const baseSitemap = await SiteMapModel.findOne({ sKey: config.BASE_SITEMAP + '.xml' })
    //       if (!baseSitemap?.sitemap?.some((ele) => ele.loc === a + '.xml')) {
    //         await SiteMapModel.updateOne({ _id: baseSitemap?._id }, { $push: { sitemap: { loc: a + '.xml', lastmod: new Date() } } })
    //         await SiteMapModel.create({ sKey: a + '.xml', url: newsArchiveObj })
    //       } else await SiteMapModel.updateOne({ sKey: a + '.xml' }, { $push: { url: newsArchiveObj } })
    //       await redis.redisclient.set(a + '.xml', _.stringify({ sitemap: newsArchiveObj }))
    //       await redis.redisclient.set(config.BASE_SITEMAP + '.xml', _.stringify({ sitemap: baseSitemap }))
    //     }
    //     console.log('article sitemap completed')
    //   }
    // })

    const liveMatches = {}
    // eslint-disable-next-line prefer-regex-literals
    const allMatches = await MatchesModel.find({ sTitle: { $not: new RegExp('^.* tba.*', 'i') } }).select('_id').select('dStartDate').lean()
    async.eachSeries(allMatches, async (matches, cb) => {
      let quarter
      const month = new Date(matches.dStartDate).getMonth() + 1
      if (!matches.dStartDate) console.log(matches._id)
      if (month / 4 >= 0 && month / 4 <= 1) quarter = 'Q1'
      if (month / 4 >= 1 && month / 4 <= 2) quarter = 'Q2'
      if (month / 4 >= 2 && month / 4 <= 3) quarter = 'Q3'

      if (!liveMatches[`${config.MATCH_SITEMAP}-${new Date(matches.dStartDate).getFullYear()}-${quarter}`]) {
        Object.assign(liveMatches, { [`${config.MATCH_SITEMAP}-${new Date(matches.dStartDate).getFullYear()}-${quarter}`]: [] })
      }
      let tempObj = {}

      const seo = await SeoModel.findOne({ iId: _.mongify(matches._id) }).select('sSlug')

      tempObj = {
        _id: matches._id,
        loc: `${seo?.sSlug}/`,
        lastmod: moment.tz(matches?.dUpdated, 'Asia/Kolkata'),
        changefreq: 'daily',
        priority: 0.8
      }

      liveMatches[`${config.MATCH_SITEMAP}-${new Date(matches.dStartDate).getFullYear()}-${quarter}`].push(tempObj)
    }, async (err) => {
      if (err) console.log({ err })
      else {
        console.log('matches sitemap completed')
        for await (const a of Object.keys(liveMatches)) {
          const liveMatchesObj = liveMatches[a]
          const baseSitemap = await SiteMapModel.findOne({ sKey: config.BASE_SITEMAP + '.xml' })
          if (!baseSitemap?.sitemap?.some((ele) => ele.loc === a + '.xml')) {
            await SiteMapModel.updateOne({ _id: baseSitemap?._id }, { $push: { sitemap: { loc: a + '.xml', lastmod: new Date() } } })
            await SiteMapModel.create({ sKey: a + '.xml', url: liveMatchesObj })
          } else await SiteMapModel.updateOne({ sKey: a + '.xml' }, { $push: { url: liveMatchesObj } })
          await redis.redisclient.set(a + '.xml', _.stringify({ sitemap: liveMatchesObj }))
          await redis.redisclient.set(config.BASE_SITEMAP + '.xml', _.stringify({ sitemap: baseSitemap }))
        }
      }
    })
  } catch (error) {
    console.log(error)
    return error
  }
}

article.updateSitemap = async (req, res) => {
  try {
    const allCategories = await CategoriesModel.find({ eStatus: 'a' }, { _id: 1, oImg: 1 }).sort({ dUpdated: -1 }).lean()
    const allPlayers = await TagsModel.find({ eStatus: 'a', eType: 'p' }, { _id: 1, iId: 1 }).sort({ dUpdated: -1 }).lean()
    const allTeams = await TagsModel.find({ eStatus: 'a', eType: 't' }, { _id: 1, iId: 1 }).sort({ dUpdated: -1 }).lean()
    // const allVenues = await VenuesModel.find({ bTagEnabled: true, eTagStatus: 'a' }, { _id: 1 })
    const allTags = await TagsModel.find({ eStatus: 'a', eType: 'gt' }, { _id: 1, sUrl: 1 }).sort({ dUpdated: -1 }).lean()
    const allAdmins = await AdminModel.find({ eDisplayStatus: 'a', eType: { $ne: 'su' }, nArticleCount: { $gt: 0 } }, { _id: 1, sUrl: 1 }).sort({ dUpdated: -1 }).lean()

    const allJobs = await JobPostsModel.find({ eStatus: 'a' }).sort({ dUpdated: -1 }).lean()

    const allPages = ['about-us/',
      'authors/',
      'careers/',
      'contact-us/',
      'cricket-schedule/',
      'cricket-series/',
      'cricket-series-archive/',
      'cricket-videos/',
      'fantasy-cricket-tips/',
      'icc-rankings/',
      'live-scores/',
      'live-scores/recent/',
      'live-scores/upcoming/',
      'playlist/'
    ]

    const cmsPages = await CmsModel.find({ eStatus: 'a' }).lean().sort({ dUpdated: -1 }).lean()

    for await (const cmsPage of cmsPages) {
      const seo = await SeoModel.findOne({ iId: _.mongify(cmsPage._id) }).select('sSlug')
      allPages.push(`${seo.sSlug}/`)
    }

    console.log('sitemap migrations starated')

    const adminsUrl = []

    async.each(allAdmins, async (admins, cb) => {
      let tempObj = {}

      const seo = await SeoModel.findOne({ iId: _.mongify(admins._id) }).select('sSlug')

      if (seo?.sSlug) {
        const authorSitemap = await SiteMapModel.findOne({ sKey: config.AUTHOR_SITEMAP + '.xml' })
        if (!authorSitemap || authorSitemap?.url?.findIndex((ele) => ele.loc === `author/${seo?.sSlug}/`) === -1) {
          const imgTmpObj = {}

          if (admins?.sUrl) Object.assign(imgTmpObj, { 'image:loc': `${config.S3_CDN_URL}${admins?.sUrl}` })
          else Object.assign(imgTmpObj, { 'image:loc': `${config.S3_CDN_URL}114988_default_profile.jpeg` })
          tempObj = {
            _id: admins._id,
            loc: `author/${seo?.sSlug}/`,
            lastmod: moment.tz(admins?.dUpdated, 'Asia/Kolkata'),
            changefreq: 'daily',
            priority: 0.8
          }

          if (imgTmpObj) Object.assign(tempObj, { 'image:image': [imgTmpObj] })

          adminsUrl.push(tempObj)
        }
      }
      Promise.resolve(cb)
    }, async (err) => {
      if (err) console.log({ err })
      else {
        if (adminsUrl.length) {
          const isAuthorSitemap = await SiteMapModel.findOne({ sKey: config.BASE_SITEMAP + '.xml' })
          if (isAuthorSitemap.sitemap.findIndex((ele) => ele.loc === config.AUTHOR_SITEMAP + '.xml') === -1) {
            await SiteMapModel.updateOne({ sKey: config.BASE_SITEMAP + '.xml' }, { $push: { sitemap: { loc: config.AUTHOR_SITEMAP + '.xml', lastmod: new Date() } } })
          } else {
            isAuthorSitemap.sitemap[isAuthorSitemap.sitemap.findIndex((ele) => ele.loc === config.AUTHOR_SITEMAP + '.xml')].lastmod = new Date()
            await SiteMapModel.updateOne({ sKey: config.BASE_SITEMAP + '.xml' }, { sitemap: isAuthorSitemap.sitemap })
          }
          const isSitemap = await SiteMapModel.findOne({ sKey: config.AUTHOR_SITEMAP + '.xml' })
          if (isSitemap) {
            isSitemap.url.push(...adminsUrl)
            await SiteMapModel.updateOne({ sKey: config.AUTHOR_SITEMAP + '.xml' }, { url: isSitemap.url })
          } else {
            await SiteMapModel.create({ sKey: config.AUTHOR_SITEMAP + '.xml', url: adminsUrl })
          }
          console.log('admin sitemap compelted')
        }
      }
    })

    const pagesUrl = []

    async.eachSeries(allPages, async (pages, cb) => {
      let tempObj = {}

      const pagesSitemap = await SiteMapModel.findOne({ sKey: config.PAGE_SITEMAP + '.xml' })
      if (!pagesSitemap || pagesSitemap?.url?.findIndex((ele) => ele.loc === `${pages}`) === -1) {
        tempObj = {
          loc: pages,
          lastmod: moment.tz(pages?.dUpdated, 'Asia/Kolkata'),
          changefreq: 'daily',
          priority: 0.7
        }

        pagesUrl.push(tempObj)
      }

      Promise.resolve(cb)
    }, async (err) => {
      if (err) console.log({ err })
      else {
        if (pagesUrl.length) {
          const isPageSitemap = await SiteMapModel.findOne({ sKey: config.BASE_SITEMAP + '.xml' }).lean()
          if (isPageSitemap.sitemap.findIndex((ele) => ele.loc === config.PAGE_SITEMAP + '.xml') === -1) {
            await SiteMapModel.updateOne({ sKey: config.BASE_SITEMAP + '.xml' }, { $push: { sitemap: { loc: config.PAGE_SITEMAP + '.xml', lastmod: new Date() } } })
          } else {
            isPageSitemap.sitemap[isPageSitemap.sitemap.findIndex((ele) => ele.loc === config.PAGE_SITEMAP + '.xml')].lastmod = new Date()
            await SiteMapModel.updateOne({ sKey: config.BASE_SITEMAP + '.xml' }, { sitemap: isPageSitemap.sitemap })
          }
          const isSitemap = await SiteMapModel.findOne({ sKey: config.PAGE_SITEMAP + '.xml' })
          if (isSitemap) {
            isSitemap.url.push(...pagesUrl)
            await SiteMapModel.updateOne({ sKey: config.PAGE_SITEMAP + '.xml' }, { url: isSitemap.url })
          } else {
            await SiteMapModel.create({ sKey: config.PAGE_SITEMAP + '.xml', url: pagesUrl })
          }
          console.log('pages sitemap compelted')
        }
      }
    })

    const categoriesUrl = []

    async.eachSeries(allCategories, async (categories, cb) => {
      let tempObj = {}

      const seo = await SeoModel.findOne({ iId: _.mongify(categories._id) }).select('sSlug').lean()
      if (seo?.sSlug) {
        const categorySitemap = await SiteMapModel.findOne({ sKey: config.CATEGORY_SITEMAP + '.xml' })
        const imgTempObj = {}
        if (!categorySitemap || categorySitemap?.url?.findIndex((ele) => ele.loc === `${seo?.sSlug}/`) === -1) {
          if (categories?.sUrl) Object.assign(imgTempObj, { 'image:loc': `${config.S3_CDN_URL}${categories?.sUrl}` })
          else Object.assign(imgTempObj, { 'image:loc': `${config.S3_CDN_URL}article-placeholder.jpg` })
          if (categories?.sTitle) Object.assign(imgTempObj, { 'image:title': categories?.sTitle })
          if (categories?.sCaption) Object.assign(imgTempObj, { 'image:caption': categories?.sCaption })

          tempObj = {
            _id: categories._id,
            loc: `${seo?.sSlug}/`,
            lastmod: moment.tz(categories.dUpdated, 'Asia/Kolkata'),
            changefreq: 'daily',
            priority: 0.9
          }

          if (imgTempObj) Object.assign(tempObj, { 'image:image': [imgTempObj] })
          categoriesUrl.push(tempObj)
        }
      }

      Promise.resolve(cb)
    }, async (err) => {
      if (err) console.log({ err })
      else {
        if (categoriesUrl.length) {
          const isCategorySitemap = await SiteMapModel.findOne({ sKey: config.BASE_SITEMAP + '.xml' })
          if (!isCategorySitemap || isCategorySitemap?.sitemap.findIndex((ele) => ele.loc === config.CATEGORY_SITEMAP + '.xml') === -1) {
            await SiteMapModel.updateOne({ sKey: config.BASE_SITEMAP + '.xml' }, { $push: { sitemap: { loc: config.CATEGORY_SITEMAP + '.xml', lastmod: new Date() } } })
          } else {
            isCategorySitemap.sitemap[isCategorySitemap.sitemap.findIndex((ele) => ele.loc === config.CATEGORY_SITEMAP + '.xml')].lastmod = new Date()
            await SiteMapModel.updateOne({ sKey: config.BASE_SITEMAP + '.xml' }, { sitemap: isCategorySitemap.sitemap })
          }
          const isSitemap = await SiteMapModel.findOne({ sKey: config.CATEGORY_SITEMAP + '.xml' })
          if (isSitemap) {
            isSitemap.url.push(...categoriesUrl)
            await SiteMapModel.updateOne({ sKey: config.CATEGORY_SITEMAP + '.xml' }, { url: isSitemap.url })
          } else {
            await SiteMapModel.create({ sKey: config.CATEGORY_SITEMAP + '.xml', url: categoriesUrl })
          }
          console.log('categories sitemap completed')
        }
      }
    })

    const tagsUrl = []

    async.eachSeries(allTags, async (tags, cb) => {
      let tempObj = {}

      const seo = await SeoModel.findOne({ iId: _.mongify(tags._id) }).select('sSlug')
      if (seo?.sSlug) {
        const tagSitemap = await SiteMapModel.findOne({ sKey: config.POST_TAG_SITEMAP + '.xml' })
        if (!tagSitemap || tagSitemap?.url?.findIndex((ele) => ele.loc === `${seo?.sSlug}/`) === -1) {
          tempObj = {
            _id: tags._id,
            loc: `${seo?.sSlug}/`,
            lastmod: moment.tz(tags?.dUpdated, 'Asia/Kolkata'),
            changefreq: 'daily',
            priority: 0.8
          }
          tagsUrl.push(tempObj)
        }
      }
      Promise.resolve(cb)
    }, async (err) => {
      if (err) console.log({ err })
      else {
        console.log('tags sitemap completed')
        if (tagsUrl.length) {
          const isTagSitemap = await SiteMapModel.findOne({ sKey: config.BASE_SITEMAP + '.xml' })
          if (!isTagSitemap || isTagSitemap?.sitemap.findIndex((ele) => ele.loc === config.POST_TAG_SITEMAP + '.xml') === -1) {
            await SiteMapModel.updateOne({ sKey: config.BASE_SITEMAP + '.xml' }, { $push: { sitemap: { loc: config.POST_TAG_SITEMAP + '.xml', lastmod: new Date() } } })
          } else {
            isTagSitemap.sitemap[isTagSitemap.sitemap.findIndex((ele) => ele.loc === config.POST_TAG_SITEMAP + '.xml')].lastmod = new Date()
            await SiteMapModel.updateOne({ sKey: config.BASE_SITEMAP + '.xml' }, { sitemap: isTagSitemap.sitemap })
          }
          const isSitemap = await SiteMapModel.findOne({ sKey: config.POST_TAG_SITEMAP + '.xml' })
          if (isSitemap) {
            isSitemap.url.push(...tagsUrl)
            await SiteMapModel.updateOne({ sKey: config.POST_TAG_SITEMAP + '.xml' }, { url: isSitemap.url })
          } else {
            await SiteMapModel.create({ sKey: config.POST_TAG_SITEMAP + '.xml', url: tagsUrl })
          }
          console.log('tags sitemap completed')
        }
      }
    })

    const playersUrl = []

    async.eachSeries(allPlayers, async (player, cb) => {
      let tempObj = {}

      const seo = await SeoModel.findOne({ iId: _.mongify(player.iId) }).select('sSlug')
      if (seo?.sSlug) {
        const playerSitemap = await SiteMapModel.findOne({ sKey: config.PLAYER_SITEMAP + '.xml' })
        if (!playerSitemap || playerSitemap?.url?.findIndex((ele) => ele.loc === `${seo?.sSlug}/`) === -1) {
          tempObj = {
            _id: player._id,
            loc: `${seo?.sSlug}/`,
            lastmod: moment.tz(player?.dUpdated, 'Asia/Kolkata'),
            changefreq: 'daily',
            priority: 0.8
          }
          playersUrl.push(tempObj)
        }
      }
      Promise.resolve(cb)
    }, async (err) => {
      if (err) console.log({ err })
      else {
        if (playersUrl.length) {
          console.log('players sitemap completed')
          const isPlayerSitemap = await SiteMapModel.findOne({ sKey: config.BASE_SITEMAP + '.xml' })
          if (!isPlayerSitemap || isPlayerSitemap?.sitemap.findIndex((ele) => ele.loc === config.PLAYER_SITEMAP + '.xml') === -1) {
            await SiteMapModel.updateOne({ sKey: config.BASE_SITEMAP + '.xml' }, { $push: { sitemap: { loc: config.PLAYER_SITEMAP + '.xml', lastmod: new Date() } } })
          } else {
            isPlayerSitemap.sitemap[isPlayerSitemap.sitemap.findIndex((ele) => ele.loc === config.PLAYER_SITEMAP + '.xml')].lastmod = new Date()
            await SiteMapModel.updateOne({ sKey: config.BASE_SITEMAP + '.xml' }, { sitemap: isPlayerSitemap.sitemap })
          }
          const isSitemap = await SiteMapModel.findOne({ sKey: config.PLAYER_SITEMAP + '.xml' })
          if (isSitemap) {
            isSitemap.url.push(...playersUrl)
            await SiteMapModel.updateOne({ sKey: config.PLAYER_SITEMAP + '.xml' }, { url: isSitemap.url })
          } else {
            await SiteMapModel.create({ sKey: config.PLAYER_SITEMAP + '.xml', url: playersUrl })
          }
        }
      }
    })

    const teamsUrl = []

    async.eachSeries(allTeams, async (team, cb) => {
      let tempObj = {}

      const seo = await SeoModel.findOne({ iId: _.mongify(team.iId) }).select('sSlug')
      if (seo?.sSlug) {
        const teamSitemap = await SiteMapModel.findOne({ sKey: config.TEAM_SITEMAP + '.xml' })
        if (!teamSitemap || teamSitemap?.url?.findIndex((ele) => ele.loc === `${seo?.sSlug}/`) === -1) {
          tempObj = {
            _id: team._id,
            loc: `${seo?.sSlug}/`,
            lastmod: moment.tz(team?.dUpdated, 'Asia/Kolkata'),
            changefreq: 'daily',
            priority: 0.8
          }

          teamsUrl.push(tempObj)
        }
      }

      Promise.resolve(cb)
    }, async (err) => {
      if (err) console.log({ err })
      else {
        if (teamsUrl.length) {
          console.log('Team sitemap completed')
          const isTeamSitemap = await SiteMapModel.findOne({ sKey: config.BASE_SITEMAP + '.xml' })
          if (!isTeamSitemap || isTeamSitemap?.sitemap.findIndex((ele) => ele.loc === config.TEAM_SITEMAP + '.xml') === -1) {
            await SiteMapModel.updateOne({ sKey: config.BASE_SITEMAP + '.xml' }, { $push: { sitemap: { loc: config.TEAM_SITEMAP + '.xml', lastmod: new Date() } } })
          } else {
            isTeamSitemap.sitemap[isTeamSitemap.sitemap.findIndex((ele) => ele.loc === config.TEAM_SITEMAP + '.xml')].lastmod = new Date()
            await SiteMapModel.updateOne({ sKey: config.BASE_SITEMAP + '.xml' }, { sitemap: isTeamSitemap.sitemap })
          }
          const isSitemap = await SiteMapModel.findOne({ sKey: config.TEAM_SITEMAP + '.xml' })
          if (isSitemap) {
            isSitemap.url.push(...teamsUrl)
            await SiteMapModel.updateOne({ sKey: config.TEAM_SITEMAP + '.xml' }, { url: isSitemap.url })
          } else {
            await SiteMapModel.create({ sKey: config.TEAM_SITEMAP + '.xml', url: teamsUrl })
          }
        }
      }
    })

    const careerUrl = []

    async.eachSeries(allJobs, async (jobs, cb) => {
      let tempObj = {}

      const seo = await SeoModel.findOne({ iId: _.mongify(jobs._id) }).select('sSlug')
      if (seo?.sSlug) {
        const careerSitemap = await SiteMapModel.findOne({ sKey: config.CAREER_SITEMAP + '.xml' })
        if (!careerSitemap || careerSitemap?.url?.findIndex((ele) => ele.loc === `${seo?.sSlug}/`) === -1) {
          tempObj = {
            _id: jobs._id,
            loc: `${seo?.sSlug}/`,
            lastmod: moment.tz(jobs?.dUpdated, 'Asia/Kolkata'),
            changefreq: 'daily',
            priority: 0.7
          }

          careerUrl.push(tempObj)
        }
      }
      Promise.resolve(cb)
    }, async (err) => {
      if (err) console.log({ err })
      else {
        if (careerUrl.length) {
          console.log('carrer sitemap completed')
          const isCareerSitemap = await SiteMapModel.findOne({ sKey: config.BASE_SITEMAP + '.xml' })
          if (!isCareerSitemap || isCareerSitemap?.sitemap.findIndex((ele) => ele.loc === config.CAREER_SITEMAP + '.xml') === -1) {
            await SiteMapModel.updateOne({ sKey: config.BASE_SITEMAP + '.xml' }, { $push: { sitemap: { loc: config.CAREER_SITEMAP + '.xml', lastmod: new Date() } } })
          } else {
            isCareerSitemap.sitemap[isCareerSitemap.sitemap.findIndex((ele) => ele.loc === config.CAREER_SITEMAP + '.xml')].lastmod = new Date()
            await SiteMapModel.updateOne({ sKey: config.BASE_SITEMAP + '.xml' }, { sitemap: isCareerSitemap.sitemap })
          }
          const isSitemap = await SiteMapModel.findOne({ sKey: config.CAREER_SITEMAP + '.xml' })
          if (isSitemap) {
            isSitemap.url.push(...careerUrl)
            await SiteMapModel.updateOne({ sKey: config.CAREER_SITEMAP + '.xml' }, { url: isSitemap.url })
          } else {
            await SiteMapModel.create({ sKey: config.CAREER_SITEMAP + '.xml', url: careerUrl })
          }
        }
      }
    })

    const newsArchive = {}
    let image = []

    const allArticles = await ArticlesModel.find({ eState: 'pub', eVisibility: 'pb', dPublishDate: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } }, { _id: 1, dPublishDate: 1, sContent: 1, oImg: 1, oTImg: 1, sTitle: 1 }).sort({ dPublishDate: -1 })

    const allFantasyArticles = await FantasyArticleModel.find({ eVisibility: 'pb', eState: 'pub', dPublishDate: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } }, { _id: 1, oImg: 1, oTImg: 1, sTitle: 1, dPublishDate: 1 }).sort({ dPublishDate: -1 })

    const totalAllArticles = mergeSort(allArticles, allFantasyArticles)

    async.eachSeries(totalAllArticles, async (articles, cb) => {
      if (articles) {
        let tempObj = {}
        const imgTempObj = {}
        if (!newsArchive[`${config.POST_SITEMAP}-${new Date(articles.dPublishDate).getFullYear()}-${String(new Date(articles.dPublishDate).getMonth() + 1).padStart(2, '0')}`]) {
          Object.assign(newsArchive, { [`${config.POST_SITEMAP}-${new Date(articles.dPublishDate).getFullYear()}-${String(new Date(articles.dPublishDate).getMonth() + 1).padStart(2, '0')}`]: [] })
        }
        const seo = await SeoModel.findOne({ iId: _.mongify(articles._id) }).select('sSlug')

        if (articles?.oImg?.sUrl) {
          if (articles.oImg?.sUrl || articles.oImg?.sTitle || articles.oImg?.sCaption) {
            if (articles.oImg.sUrl) Object.assign(imgTempObj, { 'image:loc': `${config.S3_CDN_URL}${articles.oImg?.sUrl}` })
            if (articles.oImg.sTitle) Object.assign(imgTempObj, { 'image:title': articles.oImg?.sTitle })
            if (articles.oImg.sCaption) Object.assign(imgTempObj, { 'image:caption': articles.oImg?.sCaption })
            if (imgTempObj) image.push(imgTempObj)
          }
        }

        if (articles?.oTImg?.sUrl) {
          if (articles.oTImg?.sUrl || articles.oTImg?.sTitle || articles.oTImg?.sCaption) {
            if (articles.oTImg.sUrl) Object.assign(imgTempObj, { 'image:loc': `${config.S3_CDN_URL}${articles.oTImg?.sUrl}` })
            if (articles.oTImg.sTitle) Object.assign(imgTempObj, { 'image:title': articles.oTImg?.sTitle })
            if (articles.oTImg.sCaption) Object.assign(imgTempObj, { 'image:caption': articles.oTImg?.sCaption })
            if (imgTempObj) image.push(imgTempObj)
          }
        }

        if (articles?.sContent || articles?.sMatchPreview) {
          const parseContent = articles?.sContent ? parse(articles.sContent) : parse(articles.sMatchPreview)

          for (let index = 0; index < parseContent.querySelectorAll('img')?.length; index++) {
            const ele = parseContent.querySelectorAll('img')[index]
            if (ele.getAttribute('src')) {
              const images = await gallery.findOne({ sUrl: ele.getAttribute('src').replaceAll(config.S3_CDN_URL) })
              if (images?.sUrl || images?.sTitle || images?.sCaption) {
                if (images.sUrl) Object.assign(imgTempObj, { 'image:loc': `${config.S3_CDN_URL}${images?.sUrl}` })
                if (images.sTitle) Object.assign(imgTempObj, { 'image:title': images?.sTitle })
                if (images.sCaption) Object.assign(imgTempObj, { 'image:caption': images?.sCaption })
                if (imgTempObj) image.push(imgTempObj)
              }
            }
          }
        }

        tempObj = {
          _id: articles._id,
          loc: `${seo?.sSlug}/`,
          lastmod: moment.tz(articles?.dModifiedDate, 'Asia/Kolkata'),
          changefreq: 'daily',
          priority: 0.9
        }

        if (image.length) Object.assign(tempObj, { 'image:image': image })
        newsArchive[[`${config.POST_SITEMAP}-${new Date(articles.dPublishDate).getFullYear()}-${String(new Date(articles.dPublishDate).getMonth() + 1).padStart(2, '0')}`]].push(tempObj)

        image = []
      }
    }, async (err) => {
      if (err) console.log({ err })
      else {
        console.log('article sitemap completed')
        for await (const a of Object.keys(newsArchive)) {
          const newArticles = []
          const newsArchiveObj = newsArchive[a]
          const baseSitemap = await SiteMapModel.findOne({ sKey: config.BASE_SITEMAP + '.xml' })
          const newsSitemap = await SiteMapModel.findOne({ sKey: a + '.xml' })
          if (!baseSitemap?.sitemap?.some((ele) => ele.loc === a + '.xml')) {
            await SiteMapModel.updateOne({ _id: baseSitemap?._id }, { $push: { sitemap: { loc: a + '.xml', lastmod: new Date() } } })
          } else {
            baseSitemap.sitemap[baseSitemap.sitemap.findIndex((ele) => ele.loc === a + '.xml')].lastmod = new Date()
            await SiteMapModel.updateOne({ sKey: config.BASE_SITEMAP + '.xml' }, { sitemap: baseSitemap.sitemap })
          }
          if (!newsSitemap) await SiteMapModel.create({ sKey: a + '.xml', url: newsArchiveObj })
          else {
            newsArchiveObj.forEach((ele) => {
              if (newsSitemap.url.findIndex((elem) => elem.loc === ele.loc) === -1) newArticles.push(ele)
            })
            await SiteMapModel.updateOne({ sKey: a + '.xml' }, { $push: { url: newArticles } })
          }
        }
      }
    })

    const liveMatches = {}
    // eslint-disable-next-line prefer-regex-literals

    const allMatches = await MatchesModel.find({ sTitle: { $not: new RegExp('^.* tba.*', 'i') }, dStartDate: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } }, { dStartDate: 1 }).lean()
    async.eachSeries(allMatches, async (matches, cb) => {
      let quarter
      const month = new Date(matches.dStartDate).getMonth() + 1
      if (month / 4 >= 0 && month / 4 <= 1) quarter = 'Q1'
      if (month / 4 >= 1 && month / 4 <= 2) quarter = 'Q2'
      if (month / 4 >= 2 && month / 4 <= 3) quarter = 'Q3'

      if (!liveMatches[`${config.MATCH_SITEMAP}-${new Date(matches.dStartDate).getFullYear()}-${quarter}`]) {
        Object.assign(liveMatches, { [`${config.MATCH_SITEMAP}-${new Date(matches.dStartDate).getFullYear()}-${quarter}`]: [] })
      }
      let tempObj = {}

      const seo = await SeoModel.findOne({ iId: _.mongify(matches._id) }).select('sSlug')

      tempObj = {
        _id: matches._id,
        loc: `${seo?.sSlug}/`,
        lastmod: moment.tz(matches?.dUpdated, 'Asia/Kolkata'),
        changefreq: 'daily',
        priority: 0.8
      }

      liveMatches[`${config.MATCH_SITEMAP}-${new Date(matches.dStartDate).getFullYear()}-${quarter}`].push(tempObj)
    }, async (err) => {
      if (err) console.log({ err })
      else {
        console.log('matches sitemap completed')
        for (const a of Object.keys(liveMatches)) {
          const liveMatchesObj = liveMatches[a]
          const baseSitemap = await SiteMapModel.findOne({ sKey: config.BASE_SITEMAP + '.xml' })

          if (!baseSitemap?.sitemap?.some((ele) => ele.loc === a + '.xml')) {
            await SiteMapModel.updateOne({ _id: baseSitemap?._id }, { $push: { sitemap: { loc: a + '.xml', lastmod: new Date() } } })
            await SiteMapModel.create({ sKey: a + '.xml', url: liveMatchesObj })
          }
          await SiteMapModel.updateOne({ sKey: a + '.xml' }, { url: liveMatchesObj }, { upsert: true })
        }
      }
    })
    res.send('done')
  } catch (error) {
    // console.log(error)
    return error
  }
}
article.updateNewsSitemap = async (req, res) => {
  try {
    const timeEnd = moment().utc().add(3, 'hours')

    const timeStart = moment().utc()

    let matches = await MatchesModel.find({ $or: [{ dStartDate: { $gt: timeStart, $lt: timeEnd } }, { sStatusStr: 'live' }] }).sort({ dStartDate: -1 }).select('sTitle sSubtitle sFormatStr dStartDate').lean()

    const monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    matches = matches.map((ele) => {
      ele.sTitle = `${ele.sTitle} Live Score ${ele.sSubtitle} ${ele.sFormatStr.toUpperCase()} ${new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()} ${monthArr[new Date().getMonth()]} ${new Date().getFullYear()}`
      ele.dPublishDate = ele.dStartDate
      return ele
    })

    const remaining = 200 - matches.length

    const articlesLimit = Math.ceil(remaining / 2)

    const allNewsArticles = await ArticlesModel.find({ eState: 'pub', eVisibility: 'pb' }, { _id: 1, dPublishDate: 1, sContent: 1, oImg: 1, oTImg: 1, sTitle: 1 }).sort({ dPublishDate: -1 }).limit(articlesLimit).lean()

    const allNewsFantasyArticles = await FantasyArticleModel.find({ eVisibility: 'pb', eState: 'pub' }, { _id: 1, dPublishDate: 1, oImg: 1, oTImg: 1, sTitle: 1 }).sort({ dPublishDate: -1 }).limit(articlesLimit).lean()

    const totalSortArticles = mergeSort(allNewsArticles, allNewsFantasyArticles)
    let totalArticles = mergeSort(totalSortArticles, matches)

    totalArticles = totalArticles.slice(0, 99)

    const newsSitemap = []

    let image = []

    async.eachSeries(totalArticles, async (articles, cb) => {
      let tempObj = {}
      const imgTempObj = {}

      const seo = await SeoModel.findOne({ iId: _.mongify(articles._id), eType: { $ne: 'cu' }, eSubType: null }).select('sSlug aKeywords')

      if (articles?.oImg?.sUrl) {
        if (articles.oImg?.sUrl || articles.oImg?.sTitle || articles.oImg?.sCaption) {
          if (articles.oImg.sUrl) Object.assign(imgTempObj, { 'image:loc': `${config.S3_CDN_URL}${articles.oImg?.sUrl}` })
          if (articles.oImg.sTitle) Object.assign(imgTempObj, { 'image:title': articles.oImg?.sTitle })
          if (articles.oImg.sCaption) Object.assign(imgTempObj, { 'image:caption': articles.oImg?.sCaption })
          if (imgTempObj) image.push(imgTempObj)
        }
      }

      if (articles?.oTImg?.sUrl) {
        if (articles.oTImg?.sUrl || articles.oTImg?.sTitle || articles.oTImg?.sCaption) {
          if (articles.oTImg.sUrl) Object.assign(imgTempObj, { 'image:loc': `${config.S3_CDN_URL}${articles.oTImg?.sUrl}` })
          if (articles.oTImg.sTitle) Object.assign(imgTempObj, { 'image:title': articles.oTImg?.sTitle })
          if (articles.oTImg.sCaption) Object.assign(imgTempObj, { 'image:caption': articles.oTImg?.sCaption })
          if (imgTempObj) image.push(imgTempObj)
        }
      }

      if (articles?.sContent || articles?.sMatchPreview) {
        const parsedContent = articles?.sContent ? parse(articles.sContent) : parse(articles.sMatchPreview)

        for (let index = 0; index < parsedContent.querySelectorAll('img')?.length; index++) {
          const ele = parsedContent.querySelectorAll('img')[index]
          if (ele.getAttribute('src')) {
            const image = await gallery.findOne({ sUrl: ele.getAttribute('src').replaceAll(config.S3_CDN_URL) })
            if (image?.sUrl || image?.sTitle || image?.sCaption) {
              if (image.sUrl) Object.assign(imgTempObj, { 'image:loc': `${config.S3_CDN_URL}${image?.sUrl}` })
              if (image.sTitle) Object.assign(imgTempObj, { 'image:title': image?.sTitle })
              if (image.sCaption) Object.assign(imgTempObj, { 'image:caption': image?.sCaption })
              if (imgTempObj) image.push(imgTempObj)
            }
          }
        }
      }

      tempObj = {
        _id: articles._id,
        loc: `${seo?.sSlug}/`,
        'news:news': [{
          'news:publication': [{
            'news:name': 'Crictracker',
            'news:language': 'en'
          }],
          'news:publication_date': articles.dPublishDate,
          'news:title': articles.sTitle,
          'news:keywords': seo?.aKeywords?.join(',')
        }]
      }

      if (image.length) Object.assign(tempObj, { 'image:image': image })

      newsSitemap.push(tempObj)

      image = []
      Promise.resolve(cb)
    }, async (err) => {
      if (err) console.log({ err })
      else {
        console.log('article news sitemap completed')
        const baseSitemap = await SiteMapModel.findOne({ sKey: config.BASE_SITEMAP + '.xml' })
        const newsSitemapXML = await SiteMapModel.findOne({ sKey: config.NEWS_SITEMAP + '.xml' })
        if (!baseSitemap?.sitemap?.some((ele) => ele.loc === config.NEWS_SITEMAP + '.xml')) {
          await SiteMapModel.updateOne({ _id: baseSitemap?._id }, { $push: { sitemap: { loc: config.NEWS_SITEMAP + '.xml', lastmod: new Date() } } })
        }
        if (!newsSitemapXML) await SiteMapModel.create({ sKey: config.NEWS_SITEMAP + '.xml', url: newsSitemap })
        else await SiteMapModel.updateOne({ sKey: config.NEWS_SITEMAP + '.xml' }, { url: newsSitemap })
      }
    })

    res.send('sitemap Done')
  } catch (error) {
    return res.send('sitemap Error')
  }
}

article.assignTags = async (req, res) => {
  try {
    // const allPostCount = await posts.count({ where: { post_status: 'publish', post_type: 'post', id: { [Op.between]: [req.body.gte, req.body.gte + 20000] } } })

    // for (let index = 0; index < allPostCount / 1000; index++) {
    // const allPost = await posts.findAll({ where: { post_status: 'publish', post_type: 'post', id: { [Op.between]: [req.body.gte, req.body.gte + 20000] } } })

    // for (let index = 0; index < allPost.length; index++) {
    // const post = allPost[index]

    console.log({ index: 685868 })
    const articles = await ArticlesModel.findOne({ id: 685868 })
    if (articles) {
      try {
        const { data: { tags } } = await axios.get(`https://awesome.crictracker.com/wp-json/wp/v2/posts/${685868}`)
        console.log({ tags })
        if (Number(config.CREATE_TAG_ARTICLE)) {
          const tag = await articleTagManagement(tags)
          const articleTags = {
            aTeam: tag?.teamTag,
            aPlayer: tag?.playerTag,
            aVenue: tag?.venueTag,
            aTags: tag?.generalTag
          }
          console.log('ar', articleTags)
          // await ArticlesModel.updateOne({ _id: articles._id }, articleTags)
        }
      } catch (error) {
        console.log(error)
      }
    }
    // }
    // }
    res.json({ message: 'done' })
  } catch (error) {
    return error
  }
}

// tag and category count management
article.countTCManagemnet = async (req, res) => {
  try {
    const categories = await CategoriesModel.find({}).lean()
    const tags = await TagsModel.find({}).lean()
    async.eachSeries(categories, async (category, cb) => {
      const count = await ArticlesModel.countDocuments({ iCategoryId: category._id, eStatus: 'a', eState: 'pub' })
      await CategoriesModel.updateOne({ _id: category._id }, { $set: { nCount: count } })
      Promise.resolve(cb)
    })
    async.eachSeries(tags, async (tag, cb) => {
      const countGeneralTag = await ArticlesModel.countDocuments({ aTags: tag._id, eStatus: 'a', eState: 'pub' })
      const countPlayerTag = await ArticlesModel.countDocuments({ aPlayer: tag._id, eStatus: 'a', eState: 'pub' })
      const countVenueTag = await ArticlesModel.countDocuments({ aTeam: tag._id, eStatus: 'a', eState: 'pub' })
      const countTeamTag = await ArticlesModel.countDocuments({ aVenue: tag._id, eStatus: 'a', eState: 'pub' })
      await TagsModel.updateOne({ _id: tag._id }, { $set: { nCount: countGeneralTag + countPlayerTag + countVenueTag + countTeamTag } })
      Promise.resolve(cb)
    })
    res.send({ message: 'article/countManagement Done' })
  } catch (error) {
    res.send({ message: 'something went wrong' })
  }
}

article.dumpNewArticles = async (req, res) => {
  try {
    const [lastArticle] = await ArticlesModel.find({ bOld: true, eStatus: 'a', eState: 'pub' }).sort({ id: -1 }).select('id').limit(1).lean()
    const post = await posts.findAll({ where: { id: { [Op.gt]: Number(lastArticle?.id) }, post_status: 'publish', post_type: 'post' } })

    async.eachSeries(post, async (ele, cb) => {
      const mongoArticle = await ArticlesModel.findOne({ sTitle: ele.getDataValue('post_title') })
      const mongoSeoArticle = await SeoModel.findOne({ sSlug: ele.getDataValue('post_name') })
      if (!mongoArticle && !mongoSeoArticle) await dumpArticle(ele)
      Promise.resolve(cb)
    }, (err) => {
      console.log({ err })
    })

    res.json({ message: 'article/dump-article Done' })
  } catch (error) {
    res.send({ message: 'article/dump-article Error' })
  }
}

// const getPlayersData = (limit = 5, pageNo = 1, country = 'in') => {
//   console.log('In getPlayersData')
//   return new Promise((resolve, reject) => {
//     axios.get(`https://rest.entitysport.com/v2/players?per_page=${limit}&paged=${pageNo}&country=${country}`, { params: { token: process.env.ENTITY_SPORT_TOKEN } }).then(data => {
//       resolve(data)
//     }).catch(error => {
//       console.log({ error })
//       reject(error)
//     })
//   })
// }

article.transferImages = async (req, res) => {
  try {
    const oldS3Url = 'https://crictracker-admin-panel.s3.ap-south-1.amazonaws.com/'
    const newS3Url = 'https://media.crictracker.com.s3.ap-south-1.amazonaws.com/'

    const articleCount = await ArticlesModel.countDocuments({})

    for (let index = 0; index < articleCount / 50000; index++) {
      const article = await ArticlesModel.find({}).skip(index / 50000).limit(1000).lean()
      async.eachSeries(article, async (ele, cb) => {
        const sUrl = ele?.oImg?.sUr
        if (sUrl) await s3.UploadFromUrlToS3(`${oldS3Url}${sUrl}`, sUrl)
        console.log(sUrl)
        const parsedContent = parse(ele.sContent)
        parsedContent.querySelectorAll('img').forEach(async (img) => {
          await s3.UploadFromUrlToS3(img.getAttribute('src'), img.getAttribute('src').replaceAll(oldS3Url, '').replaceAll(newS3Url, ''))
          img.setAttribute('src', img.getAttribute('src').replaceAll(oldS3Url, newS3Url))
          console.log(img.getAttribute('src').replaceAll(oldS3Url, '').replaceAll(newS3Url, ''))
        })
        await ArticlesModel.updateOne({ _id: ele._id }, { $set: { sContent: parsedContent.toString() } })
        Promise.resolve(cb)
      })
    }
    res.send({ message: 'done' })
  } catch (error) {
    res.send({ message: error })
  }
}

article.updateImages = async (req, res) => {
  try {
    const count = await ArticlesModel.countDocuments({})
    for (let index = 0; index < count / 50000; index++) {
      const article = await ArticlesModel.find({}).skip(index * 1000).limit(1000).hint({ dCreated: -1 }).lean()
      let oImg = {}
      async.eachSeries(article, async (ele, cb) => {
        try {
          const data = await axios.get(`https://awesome.crictracker.com/wp-json/wp/v2/posts/${ele.id}`)
          const { featured_media } = data.data
          const { rendered } = data.data.content
          const sContent = await getImagesFromContent(rendered)
          const parsedContent = parse(rendered)

          if (parsedContent.querySelector('figure')?.querySelector('img')) {
            const sUrl = parsedContent.querySelector('figure').querySelector('img')

            if (parsedContent.querySelector('figure')?.querySelector('img')) await getS3URLImage(parsedContent.querySelector('figure').querySelector('img').getAttribute('src'), `${config.S3_BUCKET_ARTICLE_FEATUREIMAGE_PATH}/${sUrl}`)

            const altText = parse(rendered).querySelector('figure').querySelector('img')?.getAttribute('alt')
            const caption = parse(rendered).querySelector('figure').querySelector('figcaption').innerHTML

            const oImg = {
              sUrl: `${config.S3_BUCKET_ARTICLE_FEATUREIMAGE_PATH}/${sUrl}`,
              sText: altText,
              sCaption: caption
            }
            console.log('-----------------from figure----------------', { oImg })
            await ArticlesModel.updateOne({ _id: ele._id }, { oImg, sContent: sContent.parseContent.toString() })
          } else {
            if (featured_media !== 0) {
              const featuredMedia = await axios.get(`https://awesome.crictracker.com/wp-json/wp/v2/media/${featured_media}`)
              const { guid, caption, alt_text } = featuredMedia.data
              oImg = {
                sUrl: `${config.S3_BUCKET_ARTICLE_FEATUREIMAGE_PATH}/${guid.rendered.split('/').pop()}`,
                sText: alt_text,
                sCaption: caption.rendered
              }
              console.log('--------------------from url-----------------', { oImg })
              Promise.resolve(cb)
            } else {
              oImg = {
                sUrl: '',
                sText: '',
                sCaption: ''
              }
            }
            await ArticlesModel.updateOne({ _id: ele._id }, { oImg })
          }
        } catch (error) {
          Promise.resolve(cb)
        }
      }, () => {
        console.log('done')
        res.send({ message: 'done' })
      })
    }
  } catch (error) {
    console.log(error)
    // res.send({ message: error })
  }
}

article.updateToListicleArticle = async (req, res) => {
  try {
    const articleCount = await ArticlesModel.countDocuments({ bIsListicleArticle: true })

    for (let index = 0; index < articleCount / 1000; index++) {
      const articles = await ArticlesModel.find({ bIsListicleArticle: true }).skip(index * 1000).limit(1000).lean()
      async.eachSeries(articles, async (article, cb) => {
        // const data = await axios.get(`https://awesome.crictracker.com/wp-json/wp/v2/posts/${article.id}`)
        // const { content } = data.data
        // content.rendered = content.rendered.replaceAll('/<!-- pagebreak -->/i', /<!--nextpage-->/i)
        // content.rendered = content.rendered.replaceAll('<!-- nextpage -->', /<!--nextpage-->/i)
        // if (content.rendered.search(/<!--nextpage-->/i) > -1) console.log({ sTitle: article.sTitle })
        // const parseContent = await getImagesFromContent(content.rendered)
        // await ArticlesModel.updateOne({ _id: article._id }, { sContent: parseContent.parseContent.toString() })
        console.log({ id: article?.id })
        if (article.sContent.includes('pagebreak')) {
          const figure = article.sContent.split(/<!-- pagebreak -->/i)
          const ampContent = await convertAmp(article.sContent)

          const ampFigure = ampContent.split(/<!-- pagebreak -->/i)
          const pagingCount = figure.length
          const articlePaging = {
            nTotal: pagingCount,
            oAmpPageContent: ampFigure,
            oPageContent: figure
          }
          console.log('listicle')
          await ArticlesModel.updateOne({ _id: article._id }, { oListicleArticle: articlePaging, bIsListicleArticle: true })
        } else await ArticlesModel.updateOne({ _id: article._id }, { bIsListicleArticle: false })
      }, (err) => {
        if (err) console.log({ err })
        console.log('done')
      })
    }
  } catch (error) {
    res.send('error', error)
  }
}

article.santizeContent = async (req, res) => {
  try {
    const articles = await ArticlesModel.find().hint({ dPublishDate: 1 }).lean()
    async.eachSeries(articles, async (article, cb) => {
      const data = await axios.get(`https://awesome.crictracker.com/wp-json/wp/v2/posts/${article.id}`)
      const { content } = data.data
      const parseContent = await getImagesFromContent(content.rendered)
      await ArticlesModel.updateOne({ _id: article._id }, { sContent: parseContent.parseContent.toString() })
      console.log('--------------------------------------', article.id, '------------------------------------')
    }, () => {
      console.log('done')
    })
  } catch (error) {
    console.log(error)
  }
}

article.removeDuplicateArticle = async (req, res) => {
  try {
    const seos = await SeoModel.aggregate([
      {
        $match: {
          eType: 'ar'
        }
      }, {
        $sortByCount: '$sSlug'
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ])

    seos.forEach(async (ele) => {
      const seoSlug = await SeoModel.find({ sSlug: ele._id }).lean()
      for (let index = 0; index < seoSlug.length; index++) {
        const seoArticle = seoSlug[index]
        if (index > 0) {
          await SeoModel.deleteOne({ _id: _.mongify(seoArticle._id) })
          await ArticlesModel.deleteOne({ _id: seoArticle.iId })
        }
      }
    })
    res.send({ message: 'done' })
  } catch (error) {
    console.log(error)
    res.send({ error })
  }
}

article.updateArticleViewCount = async (req, res) => {
  try {
    const articles = await ArticlesModel.find().lean()
    async.eachSeries(articles, async (article, cb) => {
      const postMetaDetails = await postsMeta.findAll({ where: { post_id: article.id }, raw: true })

      const updateQuery = {
        nViewCount: !isNaN(Number(postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === 'views')]?.meta_value)) ? Number(postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === 'views')]?.meta_value) : 0,
        nOViews: !isNaN(Number(postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === 'views')]?.meta_value)) ? Number(postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === 'views')]?.meta_value) : 0
      }
      await ArticlesModel.updateOne({ _id: article._id }, updateQuery)
      Promise.resolve(cb)
    })
    res.json({ message: 'Done' })
    // const articles = await ArticlesModel.find().lean()
  } catch (error) {
    res.json({ message: 'Something went wrong' })
  }
}

article.updateGallery = async (req, res) => {
  try {
    const findArticles = await ArticlesModel.find({ bUpdated: false, id: { $exists: true } }).lean()
    for (let index = 0; index < findArticles.length; index++) {
      const findArticle = findArticles[index]
      try {
        const postAttachments = []
        if (findArticle && !findArticle.sContent.includes('media.crictracker.com')) {
          const post = await posts.findOne({ where: { id: findArticle.id } })
          console.log(post.getDataValue('id'))
          const data = await axios.get(`https://awesome.crictracker.com/wp-json/wp/v2/posts/${post.getDataValue('id')}`)
          if (data?.data) {
            const { rendered } = data.data.content

            const { amp_enabled, featured_media } = data.data

            const sContent = await getImagesFromContent(rendered, postAttachments)

            let image, altText, caption, postAuthor
            if (featured_media === 0) {
              if (parse(rendered).querySelector('figure') && sContent.parseContent.toString().search(/<!-- pagebreak -->/i) === -1) {
                image = parse(rendered).querySelector('figure').querySelector('img').getAttribute('src')
                altText = parse(rendered).querySelector('figure').querySelector('img').getAttribute('alt')
                caption = parse(rendered).querySelector('figure').querySelector('figcaption').innerHTML
                const getAuthor = await posts.findOne({ where: { id: featured_media } })
                if (postAuthor) {
                  const author = await wpuser.findOne({ where: { ID: getAuthor.getDataValue('post_author') } })
                  SeoModel.findOne({ sSlug: author.getDataValue('user_nicename') }).then((seoResponse) => {
                    postAuthor = seoResponse.iId
                  })
                }
              } else image = ''
            } else {
              const media = await axios.get(`https://awesome.crictracker.com/wp-json/wp/v2/media/${featured_media}`)
              if (parse(rendered).querySelector('figure')?.querySelector('img') && sContent.parseContent.toString().search(/<!-- pagebreak -->/i) === -1) {
                image = parse(rendered).querySelector('figure').querySelector('img').getAttribute('src')
                altText = parse(rendered).querySelector('figure').querySelector('img').getAttribute('alt')
                caption = parse(rendered).querySelector('figure').querySelector('figcaption').innerHTML
                const getAuthor = await posts.findOne({ where: { id: featured_media } })
                if (postAuthor) {
                  const author = await wpuser.findOne({ where: { ID: getAuthor.getDataValue('post_author') } })
                  SeoModel.findOne({ sSlug: author.getDataValue('user_nicename') }).then((seoResponse) => {
                    postAuthor = seoResponse.iId
                  })
                }
              } else {
                image = media?.data?.guid?.rendered
                altText = media?.data?.alt_text ?? media?.data?.title?.rendered
                caption = media?.data?.caption?.rendered
                const getAuthor = await posts.findOne({ where: { guid: image } })
                if (postAuthor) {
                  const author = await wpuser.findOne({ where: { ID: getAuthor.getDataValue('post_author') } })
                  SeoModel.findOne({ sSlug: author.getDataValue('user_nicename') }).then((seoResponse) => {
                    postAuthor = seoResponse.iId
                  })
                }
              }
            }

            const postMetaDetails = await postsMeta.findAll({ where: { post_id: post.getDataValue('id') }, raw: true })
            // const [seoPostData] = await sequelize.query('SELECT * FROM wp_yoast_indexable WHERE object_id = :object_id AND object_sub_type="post";', { raw: true, replacements: { object_id: parseInt(post.getDataValue('id')) }, type: Sequelize.QueryTypes.SELECT })
            // console.log({ image, altText, caption })
            image = image.replaceAll('https://www.crictracker.com', 'https://awesome.crictracker.com')
            const oMeta = {}
            const sUrl = image.includes('crictracker.com') ? `${config.S3_BUCKET_ARTICLE_FEATUREIMAGE_PATH}/${image.replaceAll('https://awesome.crictracker.com/wp-content/uploads/', '')?.replaceAll('https://image.crictracker.com/wp-content/uploads/', '')}` : image.split('/').pop()
            const nSize = await s3.getSize(sUrl)
            if (!nSize) {
              getS3URLImage(image, sUrl).then((responseImage) => {
                if (responseImage) {
                  size(s3.s3, config.S3_BUCKET_NAME, sUrl, async (err, dimensions, bytesRead) => {
                    if (err) {
                      console.log({ err }, 'size')
                    }
                    Object.assign(oMeta, {
                      nWidth: dimensions?.width,
                      nHeight: dimensions?.height,
                      nSize: bytesRead
                    })
                  })
                }
              })
            }

            const articleObject = {
              sContent: sContent.parseContent.toString(),
              oImg: {
                sUrl,
                sText: altText,
                sCaption: caption,
                oMeta
              },
              nDuration: !isNaN(Number(postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === '_yoast_wpseo_estimated-reading-time-minutes')]?.meta_value)) ? Number(postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === '_yoast_wpseo_estimated-reading-time-minutes')]?.meta_value) : 0,
              nViewCount: !isNaN(Number(postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === 'views')]?.meta_value)) ? Number(postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === 'views')]?.meta_value) + findArticle?.nViewCount : findArticle?.nViewCount,
              nOViews: !isNaN(Number(postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === 'views')]?.meta_value)) ? Number(postMetaDetails[postMetaDetails.findIndex((ele) => ele?.meta_key === 'views')]?.meta_value) + findArticle?.nOViews : findArticle.nOViews,
              dCreated: post.getDataValue('post_date_gmt'),
              dPublishDate: post.getDataValue('post_date_gmt'),
              dModifiedDate: post.getDataValue('post_modified_gmt'),
              bUpdate: true
            }

            if (amp_enabled) articleObject.sAmpContent = await convertAmp(articleObject?.sContent)
            articleObject.sInsContent = _.convertToInstantArticle(articleObject?.sContent)

            const insertedArticle = await ArticlesModel.findOneAndUpdate({ _id: findArticle._id }, articleObject)

            if (!insertedArticle?.nDuration) await updateArticleReadTime(insertedArticle._id)

            // if (seoPostData?.open_graph_image?.replaceAll('https://www.crictracker.com', 'https://awesome.crictracker.com') !== image) {
            //   getS3URLImage(seoPostData?.open_graph_image?.replaceAll('https://www.crictracker.com', 'https://awesome.crictracker.com'), `${config.S3_BUCKET_FB_PATH}/${seoPostData?.open_graph_image?.includes('crictracker.com') ? seoPostData?.open_graph_image?.replaceAll('https://awesome.crictracker.com/wp-content/uploads/', '')?.replaceAll('https://image.crictracker.com/wp-content/uploads/', '') : seoPostData?.open_graph_image?.split('/')?.pop()}`).then(async (responseImage) => {
            //     seoObject.oFB.sUrl = `${config.S3_BUCKET_FB_PATH}/${seoPostData?.open_graph_image?.includes('crictracker.com') ? seoPostData?.open_graph_image?.replaceAll('https://awesome.crictracker.com/wp-content/uploads/', '')?.replaceAll('https://image.crictracker.com/wp-content/uploads/', '') : seoPostData?.open_graph_image?.split('/')?.pop()}`
            //     if (responseImage) {
            //       size(s3.s3, config.S3_BUCKET_NAME, seoObject.oFB.sUrl, async (err, dimensions, bytesRead) => {
            //         if (err) {
            //           console.log({ err }, 'size')
            //         }
            //         Object.assign(seoObject.oFB, {
            //           oMeta: {
            //             nWidth: dimensions?.width,
            //             nHeight: dimensions?.height,
            //             nSize: bytesRead
            //           }
            //         })
            //       })
            //     }
            //   })
            // } else seoObject.oFB.sUrl = articleObject.oImg.sUrl

            // if (seoPostData?.twitter_image !== image) {
            //   getS3URLImage(seoPostData?.twitter_image, `${config.S3_BUCKET_TWITTER_PATH}/${seoPostData?.twitter_image?.split('/')?.pop()}`).then(async (responseImage) => {
            //     seoObject.oTwitter.sUrl = `${config.S3_BUCKET_TWITTER_PATH}/${seoPostData?.twitter_image?.split('/')?.pop()}`
            //     if (responseImage) {
            //       size(s3.s3, config.S3_BUCKET_NAME, seoObject.oTwitter.sUrl, async (err, dimensions, bytesRead) => {
            //         if (err) {
            //           console.log({ err }, 'size')
            //         }
            //         Object.assign(seoObject.oTwitter, {
            //           oMeta: {
            //             nWidth: dimensions?.width,
            //             nHeight: dimensions?.height,
            //             nSize: bytesRead
            //           }
            //         })
            //       })
            //     }
            //   })
            // } else seoObject.oTwitter.sUrl = articleObject.oImg.sUrl

            // await SeoModel.updateOne({ iId: _.mongify(insertedArticle._id) }, seoObject)
            sContent?.postAttachments?.map((ele) => {
              Object.assign(ele, { aArticleIds: [insertedArticle._id] })
              return ele
            })

            sContent?.postAttachments.push(articleObject?.oImg)

            for await (const attachment of sContent?.postAttachments) {
              const image = await gallery.findOne({ sUrl: attachment.sUrl.replace(config.S3_CDN_URL, '') })
              if (!image) await gallery.create({ aArticleIds: [insertedArticle._id], ...attachment, eStatus: 'a' })
              else {
                if (!image?.aArticleIds?.includes(_.mongify(insertedArticle._id))) await gallery.updateOne({ _id: image._id }, { $push: { aArticleIds: insertedArticle._id } })
              }
            }
            console.log('-----------------------done------------------------')
          }
        }
        await ArticlesModel.updateOne({ _id: findArticle._id }, { bUpdated: true })
      } catch (error) {
        console.log(error)
      }
    }

    // const fantasyArticles = await FantasyArticleModel.find({}).hint({ dPublishDate: 1 }).lean()

    // async.eachSeries(fantasyArticles, async (fantasyArticle, cb) => {
    //   if (fantasyArticle?.oImg?.sUrl) {
    //     const imageData = await s3.getSize(fantasyArticle.oImg.sUrl)
    //     fantasyArticle.oImg.oMeta = { nSize: imageData?.ContentLength }
    //     const insertObj = fantasyArticle.oImg
    //     await FantasyArticleModel.updateOne({ _id: fantasyArticle._id }, { oImg: fantasyArticle.oImg })
    //     const isImage = await gallery.countDocuments({ sUrl: fantasyArticle.oImg.sUrl })
    //     if (!isImage) await gallery.create(insertObj)
    //   }
    //   if (fantasyArticle?.oTImg?.sUrl) {
    //     const imageData = await s3.getSize(fantasyArticle.oTImg.sUrl)
    //     fantasyArticle.oTImg.oMeta = { nSize: imageData?.ContentLength }
    //     const insertObj = fantasyArticle.oTImg
    //     await FantasyArticleModel.updateOne({ _id: fantasyArticle._id }, { oTImg: fantasyArticle.oTImg })
    //     const isImage = await gallery.countDocuments({ sUrl: fantasyArticle.oTImg.sUrl })
    //     if (!isImage) await gallery.create(insertObj)
    //   }
    // })
    res.json({ message: 'done' })
  } catch (error) {
    console.log(error)
  }
}

article.updateArticleAttachments = async (req, res) => {
  try {
    const articleCount = await ArticlesModel.countDocuments({ bOld: true }).lean()
    const notFound = []
    const articles = await ArticlesModel.find().hint({ dPublishDate: 1 }).lean()
    for (let index = 0; index <= articleCount; index++) {
      const article = articles[index]
      console.log(article?.id)
      if (article?.oImg?.sUrl) {
        console.log({ type: 'ft' })
        const image = await gallery.findOne({ sUrl: article.oImg.sUrl })
        if (image) {
          if (!image?.aArticleIds?.includes(_.mongify(article._id))) await gallery.updateOne({ _id: image._id }, { $push: { aArticleIds: article._id } })
        } else {
          delete article.oImg._id
          await gallery.create({ aArticleIds: [article._id], ...article.oImg, eStatus: 'a' })
        }
      }

      if (article?.oTImg?.sUrl) {
        const image = await gallery.findOne({ sUrl: article.oTImg.sUrl })
        if (image) {
          if (!image?.aArticleIds?.includes(_.mongify(article._id))) await gallery.updateOne({ _id: image._id }, { $push: { aArticleIds: article._id } })
        } else {
          delete article.oImg._id
          notFound.push(article.oImg.sUrl)
          await gallery.create({ aArticleIds: [article._id], ...article.oTImg, eStatus: 'a' })
        }
      }

      if (article?.sContent) {
        console.log({ type: 'at', index })
        const content = parse(article.sContent)
        for (const ele of content.querySelectorAll('img')) {
          const oldImg = ele.getAttribute('src')
          if (oldImg.replace(config.S3_BUCKET_URL, '').replace(config.S3_BUCKET_LIVE_URL, '')) {
            const image = await gallery.findOne({ sUrl: oldImg.replace(config.S3_BUCKET_URL, '').replace(config.S3_BUCKET_LIVE_URL, '') })
            if (!image) console.log({ image })
            if (image) {
              if (!image?.aArticleIds?.includes(article._id)) await gallery.updateOne({ _id: image._id }, { $push: { aArticleIds: article._id } })
            } else gallery.create({ aArticleIds: [article._id], ...{ sUrl: oldImg.replace(config.S3_BUCKET_URL, '').replace(config.S3_BUCKET_LIVE_URL, ''), eStatus: 'a' } })
          }
        }
      }
    }
    res.json({ messaeg: 'done' })
  } catch (error) {
    console.log({ error })
  }
}

article.updateGalleryDimensions = async (req, res) => {
  try {
    const images = await gallery.find({ oMeta: null }).lean()

    async.each(images, async (image, cb) => {
      const nSize = await s3.getSize(image.sUrl)

      if (nSize) {
        size(s3.s3, config.S3_BUCKET_NAME, image.sUrl, async (err, dimensions, bytesRead) => {
          if (err) {
            console.log({ err }, 'size')
          }

          await gallery.updateOne({ _id: image._id }, {
            oMeta: {
              nWidth: dimensions?.width,
              nHeight: dimensions?.height,
              nSize: bytesRead
            }
          })
        })
      }
      console.log('-------------------', image._id)
      Promise.resolve(cb)
    }, (err, res) => {
      if (err) console.log({ err })
      else console.log('-----------------------------done_______---------------------')
    })
    res.json({ messaeg: 'done' })
  } catch (error) {
    console.log({ error })
  }
}

article.demo = async (req, res) => {
  const galleries = await gallery.find()
  async.eachSeries(galleries, async (image) => {
    const [author] = await AdminModel.aggregate([
      {
        $match: {
          eStatus: 'a'
        }
      }, {
        $sample: {
          size: 1
        }
      }
    ])

    await gallery.updateOne({ _id: image._id }, { iAuthorId: author._id })
  }, (err) => {
    if (err) console.log(err)
    else console.log('done')
  })
  res.json({ message: 'done' })
}

article.convertAmp = async (req, res) => {
  try {
    // const articleCount = await ArticlesModel.countDocuments({ sAmpContent: { $regex: new RegExp('^.*https\:\/\/platform\.instagram\.com\/en\_US\/embeds\.js.*.', 'ig') } })
    // const articleCount = await ArticlesModel.countDocuments({ sAmpContent: { $regex: new RegExp('^.*xml\:lang.*.', 'ig') } })
    const articleCount = await CmsModel.countDocuments({})
    // const articleCount = await CmsModel.countDocuments({})
    console.log({ articleCount })

    for (let index = 0; index < Math.ceil(articleCount / 100); index++) {
      const articles = await CmsModel.find({}).skip(0).limit(100).lean()
      // console.log({ articles: articles.length })
      async.eachSeries(articles, async (article, cb) => {
        if (article?.sContent) {
          console.log({ article: article._id })
          const parsedContent = parse(article?.sContent, { comment: true })

          // let content = await convertAmp(parsedContent.toString())
          let content
          try {
            content = await axios.post('https://ampconverter.herokuapp.com/', JSON.stringify({ plainHtml: parsedContent.toString() }))
          } catch (error) {
            console.log('error in', article._id)
          }

          if (content?.status === 200) {
            const htmlParsed = parse(article?.sContent, { comment: true })
            htmlParsed.querySelectorAll('table').map((s) => {
              if (s.parentNode.rawTagName !== 'div') {
                s.replaceWith(`<div class='table-responsive'>${s.toString()}</div>`)
              }
              return s
            })
            content = content.data.toString()

            content = parse(content, { comment: true })
            content.querySelectorAll('table').map((s) => {
              if (s.parentNode.rawTagName !== 'div') {
                s.replaceWith(`<div class='table-responsive'>${s.toString()}</div>`)
              }
              return s
            })

            content = content.toString()

            if (content.includes('<!-- pagebreak -->')) {
              const ampFigure = content.split(/<!-- pagebreak -->/i)

              await CmsModel.updateOne({ _id: article._id }, { 'oListicleArticle.oAmpPageContent': ampFigure })
            }

            await CmsModel.updateOne({ _id: article._id }, { sAmpContent: content, sContent: htmlParsed.toString() })
            setTimeout(function () { }, 100)
          } else {
            console.log('Faile to convert', article._id)
            let content = await convertAmp(parsedContent.toString())
            content = content.toString()

            if (content.includes('<!-- pagebreak -->')) {
              const ampFigure = content.split(/<!-- pagebreak -->/i)

              await ArticlesModel.updateOne({ _id: article._id }, { 'oListicleArticle.oAmpPageContent': ampFigure })
            }
            await ArticlesModel.updateOne({ _id: article._id }, { sAmpContent: content })
            setTimeout(function () { }, 100)
          }
        }
        Promise.resolve(cb)
      }, (error) => {
        console.log('done', error)
      })
    }
    return res.send('done')
  } catch (error) {
    console.log({ error })
    return res.send({ error, message: 'done' })
  }
}

// article.convertAmp = async (req, res) => {
//   try {
//     // const articleCount = await ArticlesModel.countDocuments({ _id: { $regex: new RegExp('^.*amp\-iframe loading\=.*.', 'ig') } })
//     // const articleCount = await ArticlesModel.countDocuments({ _id: '630f79b5ceb7a41871970a11' })
//     // console.log({ articleCount })
//     for (let index = 0; index < 1000 / 1000; index++) {
//       const articles = await ArticlesModel.find({ sAmpContent: { $regex: new RegExp('^.*\!important.*.', 'ig') } }).skip(0).limit(1000).lean()
//       // const articles = await ArticlesModel.find({ _id: '630f79b5ceb7a41871970a11' }).skip(index).limit(1000).lean()
//       // console.log({ articles })
//       async.eachSeries(articles, async (article, cb) => {
//         if (article.sAmpContent) {
//           console.log({ _id: article._id })
//           const parsedContent = parse(article.sAmpContent)
//           // console.log('innnn', parsedContent)

//           // await Promise.all(parsedContent.querySelectorAll('img').map(async (ele) => {
//           //   const size = await s3.getSize(ele.getAttribute('src').replaceAll(config.S3_BUCKET_URL, ''))
//           //   ele.setAttribute('src', encodeURI(ele.getAttribute('src')))
//           //   if (!size) ele.remove()
//           // }))
//           // https://platform.twitter.com/widgets.js\

//           parsedContent.querySelectorAll('span')?.map(s => {
//             const xmlAtt = s.getAttribute('xml:lang')
//             if (xmlAtt) {
//               s.removeAttribute('xml:lang')
//             }
//             const styleImpAtt = s.getAttribute('style')
//             if (styleImpAtt.includes('!important')) {
//               s.setAttribute('style', styleImpAtt.replace(' !important', ''))
//             }
//             return s
//           })

//           parsedContent.querySelectorAll('amp-iframe')?.map(s => {
//             const styleImpAtt = s.getAttribute('style')
//             if (styleImpAtt.includes('!important')) {
//               s.setAttribute('style', styleImpAtt.replace(' !important', ''))
//             }
//             return s
//           })
//           // parsedContent.querySelectorAll('amp-iframe')?.map(s => s.removeAttribute('loading'))
//           // await parsedContent.querySelectorAll('script').map(ele => {
//           //   if (ele.getAttribute('src') === 'https://www.instagram.com/embed.js') {
//           //     ele.remove()
//           //   }
//           //   return true
//           // })

//           // const content = await convertAmp(parsedContent.toString())
//           await ArticlesModel.updateOne({ _id: article._id }, { sAmpContent: parsedContent.toString() })
//           // if (parsedContent) await convertAmp(parsedContent.toString())
//         }
//         Promise.resolve(cb)
//       }, () => {
//         console.log('done')
//         return res.send('done')
//       })
//     }
//   } catch (error) {
//     console.log({ error })
//   }
// }

article.reUploadImage = async (req, res) => {
  try {
    const post = await posts.findAll({ where: { post_type: 'attachment', post_parent: { [Op.gt]: 0 } } })
    async.eachSeries(post, async (image, cb) => {
      const sUrl = encodeURI(image.getDataValue('guid').split('/').pop())

      const getImage = await gallery.findOne({ $or: [{ sUrl: `media/attachments/${sUrl}` }, { sUrl: `media/featureimage/${sUrl}` }] })
      if (getImage) {
        const size = await s3.getSize(getImage?.sUrl)
        if (!size) {
          await getS3URLImage(image.getDataValue('guid'), getImage.sUrl)
        }
      }
    })
  } catch (error) {
    return error
  }
}

article.updateData = async (req, res) => {
  try {
    const allPost = await ArticlesModel.find({ dModifiedDate: null, bOld: true })
    async.eachSeries(allPost, async (post, cb) => {
      try {
        const article = await posts.findOne({ where: { post_status: 'publish', post_type: 'post', id: post.id }, raw: true })
        if (article) {
          console.log('Article Found', article.id)

          const updateQuery = {
            dPublishDate: article.getDataValue('post_date_gmt'),
            dModifiedDate: article.getDataValue('post_modified_gmt')
          }

          await ArticlesModel.updateOne({ _id: post._id }, updateQuery)
        }
        Promise.resolve(cb)
      } catch (error) {
        Promise.resolve(cb)
        console.log(error)
      }
    })
    res.json({ message: 'done' })
  } catch (error) {
    return error
  }
}

article.assignConvertedTags = async (req, res) => {
  try {
    if (req.body?.length) {
      console.log('called', req.body?.length)
      for (let index = 0; index < req.body.length; index++) {
        const ele = req.body[index]
        const seo = await SeoModel.findOne({ sSlug: ele?.categorySlug })
        console.log({ seo })
        if (seo) {
          const allArticles = await ArticlesModel.find({ iCategoryId: _.mongify(seo.iId) }).lean()

          for (let index = 0; index < allArticles.length; index++) {
            const element = allArticles[index]
            const updateQuery = { iCategoryId: null }
            try {
              // Category Management
              const { data: { categories } } = await axios.get(`https://awesome.crictracker.com/wp-json/wp/v2/posts/${element.id}`)

              if (categories.length) {
                for (let index = 0; index < categories.length; index++) {
                  if (!updateQuery.iCategoryId) {
                    const elem = categories[index]
                    const term = await terms.findOne({ where: { term_id: elem } })
                    const categorySlug = await SeoModel.findOne({ sSlug: term.getDataValue('slug'), eStatus: 'a' })
                    if (categorySlug) {
                      if (categorySlug?.iId?.toString() !== element?.iCategoryId?.toString()) {
                        console.log('Category Changed -------------------')
                        updateQuery.iCategoryId = categorySlug.iId
                      }
                    }
                  }
                }
              }
            } catch (err) {
              console.log(err)
            }

            ele.tagSlug = ele?.newSlug ? ele?.newSlug : ele?.oldSlug
            console.log({ tagSlug: ele.tagSlug })

            const mongoSeries = await SeoModel.findOne({ sSlug: ele.tagSlug, eStatus: 'a' })
            const category = await CategoriesModel.findOne({ _id: mongoSeries?.iId })
            if (category) {
              Object.assign(updateQuery, { aSeries: { $push: category._id } })
            }
            // Tag Management
            // const mongoTag = await SeoModel.findOne({ sSlug: ele.tagSlug, eStatus: 'a' })
            // if (mongoTag) {
            //   console.log('tag found', mongoTag.eType, mongoTag.sSlug)
            //   if (mongoTag.eType === 'p') {
            //     if (element.aPlayer?.length) {
            //       if (element.aPlayer.findIndex((player) => player?.toString() === mongoTag?.iId?.toString()) === -1) {
            //         element.aPlayer.push(mongoTag.iId)
            //         updateQuery.aPlayer = element.aPlayer
            //       }
            //     } else updateQuery.aPlayer = [mongoTag.iId]
            //   }

            //   if (mongoTag.eType === 't') {
            //     if (element.aTeam?.length) {
            //       if (element.aTeam.findIndex((team) => team?.toString() === mongoTag?.iId?.toString()) === -1) {
            //         element.aTeam.push(mongoTag.iId)
            //         updateQuery.aTeam = element.aTeam
            //       }
            //     } else updateQuery.aTeam = [mongoTag.iId]
            //   }

            //   if (mongoTag.eType === 'v') {
            //     if (element.aVenue?.length) {
            //       if (element.aVenue.findIndex((venue) => venue?.toString() === mongoTag?.iId?.toString()) === -1) {
            //         element.aVenue.push(mongoTag.iId)
            //         updateQuery.aVenue = element.aVenue
            //       }
            //     } else updateQuery.aVenue = [mongoTag.iId]
            //   }

            //   if (mongoTag.eType === 'gt') {
            //     const genTag = await SeoModel.findOne({ sSlug: mongoTag.slug })
            //     if (genTag) {
            //       if (element.aTags?.length) {
            //         if (element.aTags.findIndex((tag) => tag?.toString() === mongoTag?.iId?.toString()) === -1) {
            //           element.aTags.push(mongoTag.iId)
            //           updateQuery.aTags = element.aTags
            //         }
            //       } else updateQuery.aTags = [mongoTag.iId]
            //     }
            //   }
            // }

            console.log({ updateQuery })
            await ArticlesModel.updateOne({ _id: element._id }, updateQuery)
          }
          await CategoriesModel.updateOne({ _id: seo.iId }, { eStatus: 'd' })
          await SeoModel.updateOne({ iId: _.mongify(seo.iId) }, { eStatus: 'd' })
        }
      }
      return res.json({ message: 'done' })
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

article.setInstantArticles = async (req, res) => {
  try {
    const articlesCount = await ArticlesModel.countDocuments()
    console.log({ articlesCount })
    for (let index = 0; index < articlesCount / 1000; index++) {
      const allArticles = await ArticlesModel.find().sort({ dPublishDate: -1 }).skip(index * 1000).limit(1000)
      for (let index = 0; index < allArticles.length; index++) {
        try {
          const article = allArticles[index]
          console.log({ id: article.id })
          const sCategoryName = await CategoriesModel.findOne({ _id: article.iCategoryId })
          const oDisplayAuthor = await AdminModel.findOne({ _id: article.iAuthorId })
          if (!oDisplayAuthor) console.log({ article: article._id })
          const authorSlug = await SeoModel.findOne({ iId: _.mongify(oDisplayAuthor._id) })
          const seoObject = await SeoModel.findOne({ iId: _.mongify(article._id) })
          Object.assign(oDisplayAuthor, { oSeo: authorSlug })
          Object.assign(article, { oDisplayAuthor, sCategoryName, oSeo: seoObject })
          console.log(config.FRONTEND_URL)
          const sInsContent = _.convertToInstantArticle(article)
          await ArticlesModel.updateOne({ _id: article._id }, { 'oAdvanceFeature.bFBEnable': true, sInsContent })
        } catch (error) {
          console.log(error)
        }
      }
    }
    res.send({ message: 'done' })
  } catch (error) {
    console.log(error)
    return error
  }
}

article.changeUrlMedia = async (req, res) => {
  try {
    const articlesCount = await ArticlesModel.countDocuments()
    for (let index = 0; index < articlesCount / 1000; index++) {
      const allArticles = await ArticlesModel.find().skip(index * 1000).limit(1000)
      for (let index = 0; index < allArticles.length; index++) {
        const article = allArticles[index]
        console.log({ id: article.id })
        const { sContent, sInsContent, sAmpContent } = article
        if (sContent) {
          const parseContent = parse(sContent, { comment: true })
          parseContent?.querySelectorAll('img')?.map((ele) => ele.setAttribute('src', ele.getAttribute('src').replace(config.S3_BUCKET_URL, config.S3_CDN_URL)))
          await ArticlesModel.updateOne({ _id: article._id }, { sContent: parseContent.toString() })
        }

        if (sInsContent) {
          const parseContent = parse(sInsContent, { comment: true })

          parseContent?.querySelectorAll('img')?.map((ele) => ele.setAttribute('src', ele.getAttribute('src').replace(config.S3_BUCKET_URL, config.S3_CDN_URL)))

          await ArticlesModel.updateOne({ _id: article._id }, { sInsContent: parseContent.toString() })
        }

        if (sAmpContent) {
          const parseContent = parse(sAmpContent, { comment: true })
          parseContent?.querySelectorAll('amp-img')?.map((ele) => ele.setAttribute('src', ele.getAttribute('src').replace(config.S3_BUCKET_URL, config.S3_CDN_URL)))

          parseContent?.querySelectorAll('img')?.map((ele) => ele.setAttribute('src', ele.getAttribute('src').replace(config.S3_BUCKET_URL, config.S3_CDN_URL)))
          parseContent?.querySelectorAll('figure')?.forEach((ele) => {
            ele.setAttribute('style', 'max-width: 100%; margin: 0;')
            ele.querySelectorAll('amp-img').map((elem) => {
              elem.setAttribute('style', 'max-width: 100%; margin: 0;')
              elem.removeAttribute('sizes')
              return elem
            })
          })
          parseContent.querySelectorAll('amp-img').map((elem) => {
            elem.setAttribute('style', 'max-width: 100%; margin: 0;')
            elem.removeAttribute('sizes')
            return elem
          })
          await ArticlesModel.updateOne({ _id: article._id }, { sAmpContent: parseContent.toString() })
        }
      }
    }
    res.send('doe')
  } catch (error) {
    console.log({ error })
    return error
  }
}

article.removePerTitle = async (req, res) => {
  try {
    // eslint-disable-next-line prefer-regex-literals
    const findAllArticles = await SeoModel.find({ sTitle: { $regex: new RegExp('^.*%%title%%.*', 'i') } }).lean()
    for await (const seo of findAllArticles) {
      const sTitle = seo.sTitle.replace('%%title%%', '')
      await SeoModel.updateOne({ _id: seo._id }, { sTitle })
    }
    res.send('done')
  } catch (error) {
    return error
  }
}

article.assignSeries = async (req, res) => {
  try {
    for (const ele of req.body) {
      const { termId, termType, iSeriesCategoryId, sSlug } = ele

      let page = 1
      for (let cont = 1; cont === 1;) {
        const { data } = await axios.get(`https://awesome.crictracker.com/wp-json/wp/v2/posts?${termType}=${termId}&page=${page}`)
        if (data.length < 10) cont = 0

        for (let index = 0; index < data.length; index++) {
          const element = data[index]

          console.log({ index, page })
          // console.log({ termId, termType, iSeriesCategoryId, sSlug, articleId: element.id })
          console.log(element.slug)
          const articleSeo = await SeoModel.findOne({ sSlug: element.slug })
          if (!articleSeo) continue
          const articleFound = await ArticlesModel.findOne({ _id: articleSeo.iId })
          if (articleFound) {
            console.log({ a: articleFound._id }, 'found')
            if (!articleFound?.aSeries?.includes(_.mongify(iSeriesCategoryId))) await ArticlesModel.updateOne({ _id: articleFound._id }, { $push: { aSeries: _.mongify(iSeriesCategoryId) } })
          }
        }
        console.log(data.length, page)
        page++
      }

      if (sSlug) {
        const seo = await SeoModel.findOne({ sSlug }).lean()
        if (seo?.eType === 'ct') {
          await CategoriesModel.updateOne({ _id: seo.iId }, { eStatus: 'd' })
          await SeoModel.updateOne({ iId: _.mongify(seo.iId) }, { eStatus: 'd' })
        } else if (seo?.eType === 'gt') {
          await TagsModel.updateOne({ _id: seo.iId }, { eStatus: 'd' })
          await SeoModel.updateOne({ iId: _.mongify(seo.iId) }, { eStatus: 'd' })
        } else console.log('OTHER TYPE', seo?._id, '-------------------------')
      }
    }
    res.send('done')
  } catch (error) {
    console.log(error)
    return error
  }
}

article.migrateArticleCategoryWise = async (req, res) => {
  try {
    if (req.body?.length) {
      for (const ele of req.body) {
        const { sqlId, mongoId } = ele
        console.log({ sqlId, mongoId })
        let page = 1
        for (let cont = 1; cont === 1;) {
          const { data } = await axios.get(`https://awesome.crictracker.com/wp-json/wp/v2/posts?categories=${sqlId}&page=${page}`)
          if (data.length < 10) cont = 0
          for (let index = 0; index < data.length; index++) {
            const element = data[index]
            const findArticle = await ArticlesModel.findOne({ id: element.id })
            const post = await posts.findOne({ where: { id: element.id } })
            if (!findArticle) await dumpArticle(post)
            await ArticlesModel.updateOne({ id: element.id }, { iCategoryId: mongoId })
            console.log({ index, page })
            // console.log({ termId, termType, iSeriesCategoryId, sSlug, articleId: element.id })
          }
          page++
        }
      }
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

article.migrateArticleTagWise = async (req, res) => {
  try {
    if (req.body?.length) {
      for (const ele of req.body) {
        const { sqlId, categoryId, tagSlug } = ele
        console.log({ sqlId, categoryId })
        let page = 1
        for (let cont = 1; cont === 1;) {
          const { data } = await axios.get(`https://awesome.crictracker.com/wp-json/wp/v2/posts?tags=${sqlId}&page=${page}`)
          if (data.length < 10) cont = 0
          for (let index = 0; index < data.length; index++) {
            const element = data[index]
            const findArticle = await ArticlesModel.findOne({ id: element.id })
            const post = await posts.findOne({ where: { id: element.id } })
            if (!findArticle) await dumpArticle(post)
            if (!findArticle?.aSeries?.includes(_.mongify(categoryId))) await ArticlesModel.updateOne({ id: element.id }, { $push: { aSeries: categoryId } })
            console.log({ index, page })
            // console.log({ termId, termType, iSeriesCategoryId, sSlug, articleId: element.id })
          }
          page++
        }
        const tag = await SeoModel.findOneAndUpdate({ sSlug: tagSlug }, { eStatus: 'd' })
        await TagsModel.updateOne({ _id: tag.iId }, { eStatus: 'd' })
      }
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

article.updateTags = async (req, res) => {
  try {
    const articlesCount = await ArticlesModel.countDocuments({ bOld: true })
    for (let index = 0; index < articlesCount / 1000; index++) {
      const allArticles = await ArticlesModel.find({ bOld: true }).skip(index * 1000).limit(1000)
      for (let index = 0; index < allArticles.length; index++) {
        const art = allArticles[index]
        console.log({ id: art.id })
        if (art?.aTeam?.length) {
          const aTeam = []
          for (const team of art?.aTeam) {
            const foundTeam = await TagsModel.findOne({ iId: team })
            if (foundTeam) aTeam.push(foundTeam._id)
          }
          console.log({ aTeam })
          await ArticlesModel.updateOne({ _id: art._id }, { aTeam })
        }
        if (art?.aPlayer?.length) {
          const aPlayer = []
          for (const player of art?.aPlayer) {
            const foundPlayer = await TagsModel.findOne({ iId: player })
            if (foundPlayer) aPlayer.push(foundPlayer._id)
          }
          console.log({ aPlayer })
          await ArticlesModel.updateOne({ _id: art._id }, { aPlayer })
        }

        if (art?.aVenue?.length) {
          const aVenue = []
          for (const venue of art?.aVenue) {
            const foundVenue = await TagsModel.findOne({ iId: venue })
            if (foundVenue) aVenue.push(foundVenue._id)
          }
          console.log({ aVenue })
          await ArticlesModel.updateOne({ _id: art._id }, { aVenue })
        }
      }
    }
    res.send('Done')
  } catch (error) {
    console.log(error)
    return error
  }
}

article.migrateArticle = async (req, res) => {
  try {
    if (req.body?.length) {
      for (const seoData of req.body) {
        const seo = await SeoModel.findOne({ sSlug: seoData.sSlug, eSubType: null }).lean()
        if (seo) {
          const { eType, iId } = seo
          let sqlId
          if (seoData.sSlug === 't20/ajman-t20-cup') [sqlId] = await terms.findAll({ where: { term_id: 335947 } })
          else if (seoData.sSlug === 'cricket-teams/australia') [sqlId] = await terms.findAll({ where: { term_id: 1530 } })
          else if (seoData.sSlug === 'cricket-teams/bangladesh') [sqlId] = await terms.findAll({ where: { term_id: 3568 } })
          else if (seoData.sSlug === 't20/cpl-caribbean-premier-league/barbados-tridents') [sqlId] = await terms.findAll({ where: { term_id: 216339 } })
          else if (seoData.sSlug === 't20/bbl-big-bash-league') [sqlId] = await terms.findAll({ where: { term_id: 1363 } })
          else if (seoData.sSlug === 't20/bpl-bangladesh-premier-league') [sqlId] = await terms.findAll({ where: { term_id: 3344 } })
          else if (seoData.sSlug === 't20/bbl-big-bash-league/brisbane-heat') [sqlId] = await terms.findAll({ where: { term_id: 215953 } })
          else if (seoData.sSlug === 't20/super-smash/canterbury-kings') [sqlId] = await terms.findAll({ where: { term_id: 216334 } })
          else if (seoData.sSlug === 't20/super-smash/central-stags') [sqlId] = await terms.findAll({ where: { term_id: 216335 } })
          else if (seoData.sSlug === 'champions-trophy') [sqlId] = await terms.findAll({ where: { term_id: 58677 } })
          else if (seoData.sSlug === 't20/bpl-bangladesh-premier-league/chattogram-challengers') [sqlId] = await terms.findAll({ where: { term_id: 284101 } })
          else if (seoData.sSlug === 't20/bpl-bangladesh-premier-league/chittagong-vikings') [sqlId] = await terms.findAll({ where: { term_id: 216305 } })
          else if (seoData.sSlug === 'lpl-lanka-premier-league/colombo-kings') [sqlId] = await terms.findAll({ where: { term_id: 335467 } })
          else if (seoData.sSlug === 't20/bpl-bangladesh-premier-league/comilla-victorians') [sqlId] = await terms.findAll({ where: { term_id: 216310 } })
          else if (seoData.sSlug === 'domestic-cricket/county-championship') [sqlId] = await terms.findAll({ where: { term_id: 242778 } })
          else if (seoData.sSlug === 't20/bpl-bangladesh-premier-league/cumilla-warriors') [sqlId] = await terms.findAll({ where: { term_id: 284103 } })
          else if (seoData.sSlug === 't20/bpl-bangladesh-premier-league/dhaka-dynamites') [sqlId] = await terms.findAll({ where: { term_id: 216304 } })
          else if (seoData.sSlug === 't20/bpl-bangladesh-premier-league/dhaka-platoon') [sqlId] = await terms.findAll({ where: { term_id: 284104 } })
          else if (seoData.sSlug === 'ecn-czech-super-series') [sqlId] = await terms.findAll({ where: { term_id: 330914 } })
          else if (seoData.sSlug === 'european-cricket-series-t10-league') [sqlId] = await terms.findAll({ where: { term_id: 332568 } })
          else if (seoData.sSlug === 'emirates-d20') [sqlId] = await terms.findAll({ where: { term_id: 335485 } })
          else if (seoData.sSlug === 't20/euro-t20-slam') [sqlId] = await terms.findAll({ where: { term_id: 240415 } })
          else if (seoData.sSlug === 't20/everest-premier-league') [sqlId] = await terms.findAll({ where: { term_id: 335883 } })
          else if (seoData.sSlug === 'fan2play-fantasy-tips') [sqlId] = await terms.findAll({ where: { term_id: 335542 } })
          else if (seoData.sSlug === 'finnish-premier-league-t20') [sqlId] = await terms.findAll({ where: { term_id: 333158 } })
          else if (seoData.sSlug === 'lpl-lanka-premier-league/galle-gladiators') [sqlId] = await terms.findAll({ where: { term_id: 335469 } })
          else if (seoData.sSlug === 't20/global-t20-canada') [sqlId] = await terms.findAll({ where: { term_id: 246139 } })
          else if (seoData.sSlug === 't20/ipl-indian-premier-league/gujarat-titans') [sqlId] = await terms.findAll({ where: { term_id: 335939 } })
          else if (seoData.sSlug === 't20/cpl-caribbean-premier-league/guyana-amazon-warriors') [sqlId] = await terms.findAll({ where: { term_id: 216340 } })
          else if (seoData.sSlug === 't20/bbl-big-bash-league/hobart-hurricanes') [sqlId] = await terms.findAll({ where: { term_id: 215946 } })
          else if (seoData.sSlug === 'cricket-world-cup-2019') [sqlId] = await terms.findAll({ where: { term_id: 176760 } })
          else if (seoData.sSlug === 'icc-t20-world-cup-qualifier-2019') [sqlId] = await terms.findAll({ where: { term_id: 260017 } })
          else if (seoData.sSlug === 'icc-womens-world-cup') [sqlId] = await terms.findAll({ where: { term_id: 335917 } })
          else if (seoData.sSlug === 'ipl-indian-premier-league') [sqlId] = await terms.findAll({ where: { term_id: 3556 } })
          else if (seoData.sSlug === 't20/ireland-inter-provincial-t20') [sqlId] = await terms.findAll({ where: { term_id: 336003 } })
          else if (seoData.sSlug === 't20/psl-pakistan-super-league/islamabad-united') [sqlId] = await terms.findAll({ where: { term_id: 216331 } })
          else if (seoData.sSlug === 't20/cpl-caribbean-premier-league/jamaica-tallawahs') [sqlId] = await terms.findAll({ where: { term_id: 216341 } })
          else if (seoData.sSlug === 't20/psl-pakistan-super-league/karachi-kings') [sqlId] = await terms.findAll({ where: { term_id: 216329 } })
          else if (seoData.sSlug === 't20/bpl-bangladesh-premier-league/khulna-tigers') [sqlId] = await terms.findAll({ where: { term_id: 284111 } })
          else if (seoData.sSlug === 't20/psl-pakistan-super-league/lahore-qalandars') [sqlId] = await terms.findAll({ where: { term_id: 216330 } })
          else if (seoData.sSlug === 'tag/ipl-auction') [sqlId] = await terms.findAll({ where: { term_id: 540 } })
          // eslint-disable-next-line keyword-spacing
          else[sqlId] = await terms.findAll({ where: { slug: seoData.sSlugsSlug.split('/').pop() }, order: [['term_id', 'DESC']], limit: 1 })
          console.log({ sSlug: seoData.sSlug, sqlId })
          let pageTeam = 1
          let pageTag = 1
          let pagePlayer = 1
          let pageVenue = 1
          let pageCat = 1
          if (eType === 't') {
            if (sqlId.getDataValue('term_id') === 1530) pageTeam = 1240
            if (sqlId.getDataValue('term_id') === 3568) pageTeam = 464
            if (sqlId.getDataValue('term_id') === 1533) pageTeam = 346
            const tagTeam = await TagsModel.findOne({ iId: _.mongify(iId) }).lean()
            for (let cont = 1; cont === 1;) {
              const { data } = await axios.get(`https://awesome.crictracker.com/wp-json/wp/v2/posts?${seoData.eType}=${sqlId.getDataValue('term_id')}&page=${pageTeam}`)
              if (data.status !== 400) {
                if (data.length < 10) cont = 0
                for (let index = 0; index < data.length; index++) {
                  const element = data[index]
                  const findArticle = await ArticlesModel.findOne({ id: element.id })
                  const post = await posts.findOne({ where: { id: element.id } })
                  if (!findArticle) await dumpArticle(post)
                  if (!findArticle?.aTeam?.includes(_.mongify(tagTeam._id))) {
                    console.log({ sSlug: seoData?.sSlug, sName: tagTeam?.sName, sTitle: findArticle?.sTitle })
                    await ArticlesModel.updateOne({ id: element.id }, { $push: { aTeam: tagTeam._id } })
                  }
                  console.log({ index, pageTeam })

                  // console.log({ termId, termType, iSeriesCategoryId, sSlug, articleId: element.id })
                }
                pageTeam++
              } else cont = 0
            }
          }

          if (eType === 'gt') {
            for (let cont = 1; cont === 1;) {
              const { data } = await axios.get(`https://awesome.crictracker.com/wp-json/wp/v2/posts?${seoData.eType}=${sqlId.getDataValue('term_id')}&page=${pageTag}`)
              if (data.status !== 400) {
                if (data.length < 10) cont = 0
                for (let index = 0; index < data.length; index++) {
                  const element = data[index]
                  const findArticle = await ArticlesModel.findOne({ id: element.id })
                  const post = await posts.findOne({ where: { id: element.id } })
                  if (!findArticle) await dumpArticle(post)
                  if (!findArticle?.aTags?.includes(_.mongify(iId))) {
                    console.log({ sSlug: seoData.sSlug, sTitle: findArticle?.sTitle })
                    await ArticlesModel.updateOne({ id: element.id }, { $push: { aTags: iId } })
                  }
                  console.log({ index, pageTag })
                  // console.log({ termId, termType, iSeriesCategoryId, sSlug, articleId: element.id })
                }
                pageTag++
              } else cont = 0
            }
          }

          if (eType === 'p') {
            const tagPlayer = await TagsModel.findOne({ iId: _.mongify(iId) }).lean()
            for (let cont = 1; cont === 1;) {
              const { data } = await axios.get(`https://awesome.crictracker.com/wp-json/wp/v2/posts?${seoData.eType}=${sqlId.getDataValue('term_id')}&page=${pagePlayer}`)
              if (data.status !== 400) {
                if (data.length < 10) cont = 0
                for (let index = 0; index < data.length; index++) {
                  const element = data[index]
                  const findArticle = await ArticlesModel.findOne({ id: element.id })
                  const post = await posts.findOne({ where: { id: element.id } })
                  if (!findArticle) await dumpArticle(post)
                  if (!findArticle?.aPlayer?.includes(_.mongify(tagPlayer._id))) {
                    console.log({ sSlug: seoData.sSlug, sName: tagPlayer.sName, sTitle: findArticle?.sTitle })
                    await ArticlesModel.updateOne({ id: element.id }, { $push: { aPlayer: tagPlayer._id } })
                  }
                  console.log({ index, pagePlayer })
                  // console.log({ termId, termType, iSeriesCategoryId, sSlug, articleId: element.id })
                }
                pagePlayer++
              } else cont = 0
            }
          }

          if (eType === 'v') {
            const tagVenue = await TagsModel.findOne({ iId: _.mongify(iId) }).lean()
            for (let cont = 1; cont === 1;) {
              const { data } = await axios.get(`https://awesome.crictracker.com/wp-json/wp/v2/posts?${seoData.eType}=${sqlId.getDataValue('term_id')}&page=${pageVenue}`)
              if (data.status !== 400) {
                if (data.length < 10) cont = 0
                for (let index = 0; index < data.length; index++) {
                  const element = data[index]
                  const findArticle = await ArticlesModel.findOne({ id: element.id })
                  const post = await posts.findOne({ where: { id: element.id } })
                  if (!findArticle) await dumpArticle(post)
                  if (!findArticle?.aVenue?.includes(_.mongify(tagVenue._id))) {
                    console.log({ sSlug: seoData.sSlug, sName: tagVenue.sName, sTitle: findArticle?.sTitle })
                    await ArticlesModel.updateOne({ id: element.id }, { $push: { aVenue: tagVenue._id } })
                  }
                  console.log({ index, pageVenue })
                  // console.log({ termId, termType, iSeriesCategoryId, sSlug, articleId: element.id })
                }
                pageVenue++
              } else cont = 0
            }
          }

          if (eType === 'ct') {
            const seriesCategory = await CategoriesModel.findOne({ _id: _.mongify(iId) }).lean()
            if (sqlId.getDataValue('term_id') === 58677) pageCat = 42
            if (sqlId.getDataValue('term_id') === 335485) pageCat = 9
            if (seriesCategory.eType === 'as') {
              for (let cont = 1; cont === 1;) {
                const { data } = await axios.get(`https://awesome.crictracker.com/wp-json/wp/v2/posts?${seoData.eType}=${sqlId.getDataValue('term_id')}&page=${pageCat}`)
                if (data.status !== 400) {
                  if (data.length < 10) cont = 0
                  for (let index = 0; index < data.length; index++) {
                    const element = data[index]
                    const findArticle = await ArticlesModel.findOne({ id: element.id })
                    const post = await posts.findOne({ where: { id: element.id } })
                    if (!findArticle) await dumpArticle(post)
                    if (!findArticle?.aSeries?.includes(_.mongify(seriesCategory._id))) {
                      console.log({ sSlug: seoData.sSlug, sName: seriesCategory.sName, sTitle: findArticle?.sTitle })
                      await ArticlesModel.updateOne({ id: element.id }, { $push: { aSeries: seriesCategory._id } })
                    }
                    console.log({ index, pageCat })
                    // console.log({ termId, termType, iSeriesCategoryId, sSlug, articleId: element.id })
                  }
                  pageCat++
                } else cont = 0
              }
            } else {
              for (let cont = 1; cont === 1;) {
                const { data } = await axios.get(`https://awesome.crictracker.com/wp-json/wp/v2/posts?${seoData.eType}=${sqlId.getDataValue('term_id')}&page=${pageCat}`)
                if (data.status !== 400) {
                  if (data.length < 10) cont = 0
                  for (let index = 0; index < data.length; index++) {
                    const element = data[index]
                    const findArticle = await ArticlesModel.findOne({ id: element.id })
                    const post = await posts.findOne({ where: { id: element.id } })
                    if (!findArticle) await dumpArticle(post)
                    else await posts.findOne({ where: { id: element.id } })
                    console.log({ index, pageCat })
                    // console.log({ termId, termType, iSeriesCategoryId, sSlug, articleId: element.id })
                  }
                  pageCat++
                } else cont = 0
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

// article.deleteOldImages = (req, res) => {
//   try {

//   } catch (error) {

//   }
// }

module.exports = article
