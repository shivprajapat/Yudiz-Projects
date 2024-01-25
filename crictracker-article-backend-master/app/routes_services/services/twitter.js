const axios = require('axios')
const { TWITTER_TOKEN } = require('../../../config')
/* eslint-disable camelcase */
/* eslint-disable prefer-regex-literals */

class TwitterServices {
  async generateTwitterData(req, res) {
    try {
      const tweet = await getTweetData(req.params.tweetId)
      let tweet2
      if (tweet?.aReferencedTweets) {
        tweet2 = await getTweetData(tweet.aReferencedTweets[0].id)
      }

      let tweet3
      if (tweet2?.aReferencedTweets && tweet2?.aReferencedTweets[0]?.type === 'quoted') {
        tweet3 = await getTweetData(tweet2.aReferencedTweets[0].id)
        tweet2.oReferenceTweet = {
          eType: tweet2.aReferencedTweets[0].type,
          ...tweet3
        }
      }

      tweet.oReferenceTweet = {
        ...tweet2
      }
      if (tweet?.aReferencedTweets) tweet.oReferenceTweet.eType = tweet?.aReferencedTweets[0].type
      return res.send(tweet)
    } catch (error) {
      console.log(error)
      return res.json({ message: 'Something went wrong' })
    }
  }
}

function getTweetData(tweetId) {
  try {
    return new Promise((resolve, reject) => {
      axios.get(`https://api.twitter.com/2/tweets/${tweetId}?user.fields=verified,name,username,profile_image_url&tweet.fields=entities,attachments,public_metrics,referenced_tweets,conversation_id,created_at&expansions=attachments.media_keys,author_id&media.fields=url,variants,alt_text,preview_image_url,duration_ms,public_metrics`, { headers: { Authorization: `Bearer ${TWITTER_TOKEN}` } }).then(tweetData => {
        const regex = /https:\/\/t\.co\/.([^\s]+)/ig

        const user = tweetData?.data?.includes?.users[0]
        const media = tweetData?.data?.includes?.media
        const { retweet_count, like_count } = tweetData?.data?.data?.public_metrics
        const { text: sContent, id: sTweetId, created_at: dCreatedAt, referenced_tweets: aReferencedTweets } = tweetData?.data?.data
        const re = sContent.match(regex)

        const tweetObj = {
          sTweetId,
          sUrl: `https://twitter.com/${user?.username}/status/${sTweetId}`,
          oAuthor: {
            sName: user.name,
            bVerified: user.verified,
            sUsername: user.username,
            sProfilePic: user.profile_image_url,
            sId: user.id
          },
          oPublicMetrics: {
            nRetweet: retweet_count,
            nLikes: like_count
          },
          sContent: (re && media) ? sContent.slice(0, regex.lastIndex - re[re.length - 1].length - 1) : sContent,
          aMedia: [],
          aReferencedTweets,
          dCreatedAt
        }

        if (re && media) tweetObj.sShortUrl = re[re.length - 1]

        media?.forEach(e => {
          const m = { eType: e.type }
          if (e.type === 'video') m.sUrl = e?.variants?.find(v => v.bit_rate === 2176000)?.url
          else m.sUrl = e?.url

          if (e.preview_image_url) m.sPosterUrl = e.preview_image_url
          if (!m.sUrl) m.sUrl = e.variants[0]?.url

          tweetObj.aMedia.push(m)
        })

        const { html } = parseTweetToHtml(tweetData?.data?.data, tweetObj.sShortUrl || null)

        if (html) tweetObj.sHtml = html
        resolve(tweetObj)
      }).catch(error => {
        reject(error)
      })
    })
  } catch (error) {
    console.log(error)
  }
}

function parseTweetToHtml(tweetObj, sShortUrl) {
  tweetObj.sShortUrl = sShortUrl
  const entityProcessors = {
    hashtags: processHashTags,
    mentions: processUserMentions,
    urls: processUrls
  }

  // hashtags
  // mentions
  // urls
  // annotations
  // cashtags

  const { entities } = tweetObj
  let processorObj

  // Copying text value to a new property html. The final output will be set to this property
  tweetObj.html = tweetObj.text

  // Process entities
  if (entities && Object.getOwnPropertyNames(entities).length) {
    Object.keys(entities).forEach((entity) => {
      if (entities[entity].length) {
        processorObj = entities[entity]
        if (entityProcessors[entity]) entityProcessors[entity](processorObj, tweetObj)
      }
    })
  }

  // Process Emoji's
  // processEmoji(tweetObj)

  return tweetObj
}

// Done working
function processHashTags(tags, tweetObj) {
  tags.forEach((tagObj) => {
    const anchor = ('#' + tagObj.tag).link(
      'https://twitter.com/hashtag/' + tagObj.tag
    )
    tweetObj.html = tweetObj.html.replace('#' + tagObj.tag, anchor)
  })
}

// Done working
function processUserMentions(users, tweetObj) {
  users.forEach((userObj) => {
    const anchor = `<a href='https://twitter.com/${userObj.username}'>@${userObj.username}</a>`

    const regex = new RegExp('@' + userObj.username, 'gi')
    tweetObj.html = tweetObj.html.replace(regex, anchor)
  })
}

// Done working
function processUrls(urls, tweetObj) {
  urls.forEach((urlObj) => {
    if (urlObj.url !== tweetObj.sShortUrl) tweetObj.html = tweetObj.html.replace(urlObj.url, `<a href='${urlObj.expanded_url}'>${urlObj.display_url}</a>`)
    else tweetObj.html = tweetObj.html.replace(urlObj.url, '').trim()
  })
}

// function processEmoji(tweetObj) {
//   tweetObj.html = twemoji.parse(tweetObj.html)
// }

module.exports = new TwitterServices()
