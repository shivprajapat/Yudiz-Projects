/* eslint-disable no-useless-escape */
const { SeoModel, SeoRedirectModel } = require('../../model')
const { parse } = require('node-html-parser')
const async = require('async')
const axios = require('axios')
const Amperize = require('amperize')
const amperize = new Amperize()

const generateSlugFun = async (str) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        if (!str) return resolve(null)
        const slug = str?.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-\/]+/g, '')
          .replace(/\-\-+/g, '-')
          .replace(/_/g, '-')
          .replace(/\_\_+/g, '-')
          .replace(/^-+/, '')
        if (!slug) return reject(new Error(messages.english.formFieldInvalid.message.replace('##', 'slug')))
        const count = await SeoModel.count({ sSlug: slug, eStatus: 'a' })
        const countRedirect = await SeoRedirectModel.count({ sOldUrl: slug, eStatus: 'a' })
        if (!count && !countRedirect) return resolve(slug)

        const randomCodeFun = (size) => {
          const code = Math.floor(Math.random() * 100000 + 99999).toString()
          return code.slice(code.length - size)
        }

        const isSlugFun = (slug) => {
          // eslint-disable-next-line no-useless-escape
          const regeX = /^[A-Za-z0-9\/]+(?:-[A-Za-z0-9\/]+)*$/
          return !regeX.test(slug)
        }

        const genSlug = async () => {
          const sSlug = slug + `-${randomCodeFun(4)}`
          const count = await SeoModel.findOne({ sSlug: new RegExp(`^${sSlug}$`, 'i'), eStatus: 'a' })

          if (!count && !isSlugFun(sSlug)) return sSlug
          const res = await genSlug()
          return res
        }

        const generatedSlug = await genSlug()
        if (generatedSlug) return resolve(generatedSlug)
      } catch (error) {
        console.log({ error }, '===============')
        return resolve(null)
      }
    })()
  })
}

function validURL(str) {
  // const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
  //   '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
  //   '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
  //   '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
  //   '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
  //   '(\\#[-a-z\\d_]*)?$', 'i') // fragment locator
  // return !!pattern.test(str)

  const pattern = str.match(/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/g)
  return !!pattern
}

async function convertWithFixedBrokenLinks(sContent) {
  return new Promise((resolve, reject) => {
    try {
      const staticBrokenLinks = ['https://www.crictracker.com/category/cricket-match-predictions/', 'https://www.crictracker.com/category/cricket-news/', 'https://www.crictracker.com/category/fantasy-cricket/', 'https://www.crictracker.com/category/cricket-teams/india/', 'https://www.crictracker.com/category/t20/bbl-big-bash-league/']
      const staticCorrectLinks = ['https://www.crictracker.com/cricket-match-predictions/', 'https://www.crictracker.com/cricket-news/', 'https://www.crictracker.com/fantasy-cricket-tips/', 'https://www.crictracker.com/cricket-teams/india/', 'https://www.crictracker.com/t20/bbl-big-bash-league/']

      const htmlParsed = parse(sContent, { comment: true })
      async.mapSeries(htmlParsed.querySelectorAll('a'), async function (e, callback) {
        const link = e.getAttribute('href')
        console.log({ link: htmlParsed.querySelectorAll('a').length })
        if (link === undefined) {
          e.replaceWith(...e.childNodes)
        } else {
          const linkIndex = staticBrokenLinks.indexOf(link)
          if (!validURL(link)) {
            e.removeAttribute('href')
            e.replaceWith(...e.childNodes)
          } else if (linkIndex >= 0) {
            e.setAttribute('href', staticCorrectLinks[linkIndex])
          } else {
            try {
              if (!(link.includes('https://twitter.com') || link.includes('https://t.co'))) {
                await axios.get(link)
              }
            } catch (error) {
              if (String(error?.response?.status)[0] === '4' || String(error?.response?.status)[0] === '5' || error.toString().includes('ECONNREFUSED')) {
                e.removeAttribute('href')
                e.replaceWith(...e.childNodes)
              }
            }
          }
        }
        // console.log({ e })
        return callback(null, e)
      }, function (err) {
        if (err) {
          reject(err)
        } else {
          return resolve(htmlParsed.toString())
        }
      })
    } catch (error) {
      console.log({ error })
      reject(error)
    }
  })
}

const getAmpTweeter = (node) => {
  const patternTweet = 'https?\:\/\/twitter.com\/.*\/status\/([0-9a-z]+)'
  const regexTweet = new RegExp(patternTweet)
  const strTweet = node?.toString()
  const tweetMatch = strTweet?.match(regexTweet)
  const tweetId = tweetMatch ? tweetMatch[1] : ''
  return tweetId ? parse(`<amp-twitter width="375" height="472" layout="responsive" data-tweetid=${tweetId}>`) : parse('')
}

const getAmpInsta = (node) => {
  const patternInsta = 'instagram.com\/(p|tv|reel)\/([0-9a-zA-Z_\-]+)'
  const regexInsta = new RegExp(patternInsta)
  const strInsta = node?.toString()
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

function cleanAmp(sContent) {
  const htmlParsed = parse(sContent, { comment: true })

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
          s.querySelectorAll('tr')[j].querySelectorAll('td').map(el => el.removeAttribute('style'))
          s.querySelectorAll('tr')[j].querySelectorAll('th').map(el => el.removeAttribute('style'))
        } else {
          s.querySelectorAll('tr')[j].querySelectorAll('td').map(el => el.removeAttribute('style'))
        }
      }
    }

    return s
  })

  const eid = htmlParsed.getElementById('LB24_LIVE_CONTENT')?.getAttribute('data-eid')
  if (eid) htmlParsed.getElementById('LB24_LIVE_CONTENT').replaceWith(`<amp-iframe sandbox="allow-scripts allow-same-origin"src="https://v.24liveblog.com/iframe/?id=${eid}" width="100" height="100" layout="responsive" ></amp-iframe>`)

  return htmlParsed.toString()
}

function convertAmp(sContent, article) {
  return new Promise((resolve, reject) => {
    try {
      axios.post('https://amp.crictracker.com/', JSON.stringify({ plainHtml: sContent })).then(result => {
        if (!result?.data || result?.data.includes('Uncaught Error') || result?.data.includes('Unknown: Input variables exceeded')) {
          amperize.parse(sContent, function (error, result) {
            if (error) {
              return resolve('')
            } else {
              return resolve(cleanAmp(result))
            }
          })
        } else {
          return resolve(cleanAmp(result?.data))
        }
      }).catch(catchError => {
        amperize.parse(sContent, function (error, result) {
          if (error) {
            return resolve('')
          } else {
            return resolve(cleanAmp(result))
          }
        })
      })
    } catch (error) {
      return reject(error)
    }
  })
}

const fixBrokenLinksWithAmp = (sContent) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        // const article = await ArticlesModel.findById(iArticleId).lean()
        console.log('inn hooo bhai')
        const fixedArticle = await convertWithFixedBrokenLinks(sContent)
        let ampContent
        if (fixedArticle) {
          ampContent = await convertAmp(fixedArticle)
        }
        console.log({ ampContent })
        return resolve(ampContent)
      } catch (error) {
        console.log({ error })
        return reject(error)
      }
    })()
  })
}

module.exports = {
  generateSlugFun,
  fixBrokenLinksWithAmp
}
