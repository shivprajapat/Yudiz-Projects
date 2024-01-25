const { PlayListsModel, PlayListItemsModel, VideosModel } = require('../../model')
const { google } = require('googleapis')
const service = google.youtube('v3')
const { OAuth2 } = google.auth
const _ = require('../../../global')
const config = require('../../../config')
const moment = require('moment')
const { getS3ImageURL } = require('../../utils/index')
const axios = require('axios')
const { YOUTUBE_CHANNEL_ID, YOUTUBE_API_KEY, SEO_REST_URL } = config

class Playlists {
  async youTubeAuthorized(req, res) {
    try {
      // const isExistCode = await redisAuthDb.get('yt:code')
      // if (isExistCode) return res.status(messages.status.statusOk).jsonp({ status: messages.status.statusOk, message: messages.english.fetchSuccess.replace('##', messages.english.link), data: { bIsExist: true } })

      const oauth2Client = new OAuth2(
        config.YOUTUBE_CLIENT_ID,
        config.YOUTUBE_CLIENT_SECRET,
        config.YOUTUBE_REDIRECT_URI
      )

      // Obtain the google login link to which we'll send our users to give us access
      const loginLink = oauth2Client.generateAuthUrl({
        access_type: 'offline', // Indicates that we need to be able to access data continuously without the user constantly giving us consent
        scope: config.YOUTUBE_OAUTH_SCOPE // Using the access scopes from our config file
      })

      return res.status(messages.status.statusOk).jsonp({ status: messages.status.statusOk, message: messages.english.fetchProcessing.message.replace('##', messages.english.link), data: { bIsExist: false, sLink: loginLink } })
    } catch (error) {
      return res.status(messages.status.statusInternalError).jsonp({ status: messages.status.statusInternalError, message: messages.english.wentWrong.message })
    }
  }

  async oAuthCalllback(req, res) {
    try {
      if (req.query.error) {
        return res.redirect('/')
      } else {
        const oauth2Client = new OAuth2(
          config.YOUTUBE_CLIENT_ID,
          config.YOUTUBE_CLIENT_SECRET,
          config.YOUTUBE_REDIRECT_URI
        )
        oauth2Client.getToken(req.query.code, async function (err, token) {
          if (err) return res.redirect('/')
          oauth2Client.credentials = token
          // const dExpiryDate = +new Date(token?.expiry_date)
          // await redisAuthDb.setex('yt:code', dExpiryDate, JSON.stringify({ sCode: req.query.code }))

          await fetchPlaylist(service, oauth2Client, '')
          // return res.status(messages.status.statusOk).jsonp({ status: messages.status.statusOk, message: messages.english.updateSuccess.message.replace('##', messages.english.data) })
          return res.redirect(config.ADMIN_FRONT_REDIRECT_URL)
        })
      }
    } catch (error) {
      return res.status(messages.status.statusInternalError).jsonp({ status: messages.status.statusInternalError, message: messages.english.wentWrong.message })
    }
  }

  async getYoutubePlaylist(req, res) {
    try {
      await fetchPlaylist()
      return res.status(messages.status.statusOk).jsonp({ status: messages.status.statusOk, message: 'update-playlist Done', data: null })
    } catch (error) {
      console.log(error)
      return res.status(messages.status.statusInternalError).jsonp({ status: messages.status.statusInternalError, message: 'update-playlist Error' })
    }
  }

  async updateYoutubePlaylist(req, res) {
    // console.log(await PlayListItemsModel.deleteMany({ iPlaylistId: '634f9253e4dd0ed49c4bc82e' }))
    // console.log(await PlayListItemsModel.deleteMany({ iPlaylistId: '634f9253e4dd0ed49c4bc82e' }))
    // console.log(await PlayListItemsModel.deleteMany({ iPlaylistId: '634f9253e4dd0ed49c4bc82e' }))

    try {
      fetchPlaylist()
      return res.status(messages.status.statusOk).jsonp({ status: messages.status.statusOk, message: 'update-playlist Done', data: null })
    } catch (error) {
      console.log(error)
      return res.status(messages.status.statusInternalError).jsonp({ status: messages.status.statusInternalError, message: 'update-playlist Error' })
    }
  }

  async assignPlayListPageToken(req, res) {
    const youtubeUrl = 'https://youtube.googleapis.com/youtube/v3/playlists'
    let count = 0
    // store previous  token of  last page
    // get last record and get token from it
    // put token in api and check next page is there or not

    let playlistAPI = `${youtubeUrl}?part=snippet,contentDetails,status,player&channelId=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}&maxResults=50`
    const response = await axios.get(playlistAPI, {
      headers: {
        Accept: 'application/json'
      }
    })

    const playLists = response.data.items

    let nextPageToken

    if (response.data?.nextPageToken) nextPageToken = response.data?.nextPageToken

    for (const playList of playLists) {
      count += 1
      console.log(playList.id, count)
      await PlayListsModel.updateOne({ sKey: playList.id }, { oPgToken: { bFPage: true } })
    }

    while (nextPageToken) {
      playlistAPI = `${youtubeUrl}?part=snippet,contentDetails,status,player&channelId=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}&pageToken=${nextPageToken}&maxResults=50`

      const response = await axios.get(playlistAPI, {
        headers: {
          Accept: 'application/json'
        }
      })

      const playLists = response.data.items

      for (const playList of playLists) {
        await PlayListsModel.updateOne({ sKey: playList.id }, { oPgToken: { bFPage: false, sPgToken: nextPageToken } })
      }

      if (response.data?.nextPageToken) nextPageToken = response.data?.nextPageToken
      else nextPageToken = null
    }
  }

  async assignPlayListItemsPageToken(req, res) {
    const allPlayLists = await PlayListsModel.find()
    for (const { sKey } of allPlayLists) {
      const youtubeUrl = 'https://youtube.googleapis.com/youtube/v3/playlistItems'

      let playlistItemsAPI = `${youtubeUrl}?part=snippet,contentDetails,status&playlistId=${sKey}&key=${YOUTUBE_API_KEY}`

      const response = await axios.get(playlistItemsAPI, {
        headers: {
          Accept: 'application/json'
        }
      })
      let nextPageToken
      const playLists = response.data.items

      for (const playList of playLists) {
        await PlayListItemsModel.updateOne({ sKey: playList.id }, { oPgToken: { bFPage: true } })
      }

      if (response.data?.nextPageToken) nextPageToken = response.data?.nextPageToken
      while (nextPageToken) {
        playlistItemsAPI = `${youtubeUrl}?part=snippet,contentDetails,status&playlistId=${sKey}&key=${YOUTUBE_API_KEY}&pageToken=${nextPageToken}&maxResults=50`

        const response = await axios.get(playlistItemsAPI, {
          headers: {
            Accept: 'application/json'
          }
        })

        const playLists = response.data.items

        for (const playList of playLists) {
          await PlayListItemsModel.updateOne({ sKey: playList.id }, { oPgToken: { bFPage: false, sPgToken: nextPageToken } })
        }

        if (response.data?.nextPageToken) nextPageToken = response.data?.nextPageToken
        else nextPageToken = null
      }
    }
  }

  async assignVideosPageToken(req, res) {
    try {
      const allVideos = await VideosModel.find()
      for (const { sKey } of allVideos) {
        const youtubeUrl = 'https://youtube.googleapis.com/youtube/v3/videos'
        let VideoAPI = `${youtubeUrl}?part=snippet,contentDetails,status,statistics,player&id=${sKey}&key=${YOUTUBE_API_KEY}`

        const response = await axios.get(VideoAPI, {
          headers: {
            Accept: 'application/json'
          }
        })
        let nextPageToken

        const playLists = response.data.items

        for (const playList of playLists) {
          console.log({ sKey: playList.id })
          await VideosModel.updateOne({ sKey: playList.id }, { oPgToken: { bFPage: true } })
        }

        if (response.data?.nextPageToken) nextPageToken = response.data?.nextPageToken

        while (nextPageToken) {
          VideoAPI = `${youtubeUrl}?part=snippet,contentDetails,status,statistics,player&id=${sKey}&key=${YOUTUBE_API_KEY}&pageToken=${nextPageToken}&maxResults=50`

          const response = await axios.get(VideoAPI, {
            headers: {
              Accept: 'application/json'
            }
          })

          const playLists = response.data.items

          for (const playList of playLists) {
            await VideosModel.updateOne({ sKey: playList.id }, { oPgToken: { bFPage: false, sPgToken: nextPageToken } })
          }

          if (response.data?.nextPageToken) nextPageToken = response.data?.nextPageToken
          else nextPageToken = null
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  async updateNewVideos(req, res) {
    try {
      const youtubePlayListUrl = 'https://youtube.googleapis.com/youtube/v3/playlists'
      // const youtubePlayListItemsUrl = 'https://youtube.googleapis.com/youtube/v3/playlistItems'
      // const youtubeVideosUrl = 'https://youtube.googleapis.com/youtube/v3/playlists'

      let youtubePlayListResult = []
      // const youtubePlayListItemsResult = []
      // const youtubeVideosResult = []
      let playListResponse
      let playLists

      const [lastPlayListRecord] = await PlayListsModel.find().sort({ dCreated: -1 }).limit(1).lean()
      let playListPageToken = lastPlayListRecord?.oPgToken?.sPgToken ? lastPlayListRecord?.oPgToken?.sPgToken : null

      const totalDbRec = await PlayListsModel.countDocuments().lean()

      if (playListPageToken) {
        playListResponse = await axios.get(`${youtubePlayListUrl}?part=snippet,contentDetails,status,player&channelId=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}&pageToken=${playListPageToken}&maxResults=50`, {
          headers: {
            Accept: 'application/json'
          }
        })

        playLists = playListResponse?.data?.items?.map((playList) => {
          Object.assign(playList, { oPgToken: { bFPage: false, sPgToken: playListPageToken } })
          return playList
        })
      } else {
        playListResponse = await axios.get(`${youtubePlayListUrl}?part=snippet,contentDetails,status,player&channelId=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}&maxResults=50`, {
          headers: {
            Accept: 'application/json'
          }
        })
        playLists = playListResponse?.data?.items?.map((playList) => {
          Object.assign(playList, { oPgToken: { bFPage: true } })
          return playList
        })
      }

      const totalApiRec = playListResponse?.data?.pageInfo?.totalResults

      if (totalApiRec !== totalDbRec) {
        playListPageToken = playListResponse?.data?.nextPageToken

        youtubePlayListResult.push(...playLists)

        if (playListPageToken) {
          while (playListPageToken) {
            const playlistAPI = `${youtubePlayListUrl}?part=snippet,contentDetails,status,player&channelId=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}&pageToken=${playListPageToken}&maxResults=50`

            const response = await axios.get(playlistAPI, {
              headers: {
                Accept: 'application/json'
              }
            })

            let playLists = response.data.items

            playLists = playLists.map((playList) => {
              Object.assign(playList, { oPgToken: { bFPage: false, sPgToken: playListPageToken } })
              return playList
            })

            if (response.data?.nextPageToken) {
              playListPageToken = response.data?.nextPageToken
              youtubePlayListResult.push(...playLists)
            } else {
              youtubePlayListResult.push(...playLists)
              playListPageToken = null
            }
          }
        }
      } else {
        // if both record are same then we process only last playlistItem
        playLists = playLists.slice(playLists.length - 1)
        youtubePlayListResult.push(...playLists)
        return await processPlaylist(youtubePlayListResult)
      }

      const processPlaylistFrom = youtubePlayListResult.length - (totalApiRec - totalDbRec)
      youtubePlayListResult = youtubePlayListResult.slice(processPlaylistFrom - 1)
      await processPlaylist(youtubePlayListResult)

      // await processPlaylist(youtubePlayListResult)
    } catch (error) {
      console.log(error)
    }
  }

  async assignNewVideoDate(req, res) {
    try {
      let playLists = await PlayListsModel.find().lean()
      playLists = playLists.filter((ele) => ele._id)
      for (const playList of playLists) {
        let videos = await VideosModel.find({ iPlaylistId: _.mongify(playList._id) }).sort({ dPublishDate: -1 }).lean()
        videos = videos.filter((ele) => ele.dPublishDate)[0]
        const x = await PlayListsModel.updateOne({ _id: playList._id }, { $set: { dNewVideoDate: moment(videos?.dPublishDate).utc() } })
        console.log(x)
      }
      res.send('done')
    } catch (error) {
      console.log(error)
    }
  }

  async assignNewCategory(req, res) {
    try {
      const playListsCat = await PlayListsModel.find({ iCategoryId: { $exists: true } }).lean()
      // const playListsNotCat = await PlayListsModel.find({ iCategoryId: { $exists: false } }).lean()

      for (const playList of playListsCat) {
        const x = await VideosModel.findOne({ iPlaylistId: _.mongify(playList._id) })
        console.log({ x })
      }

      // for (const playList of playListsNotCat) {
      //   const y = await VideosModel.findOne({ iPlaylistId: _.mongify(playList._id) })
      //   console.log({ y })
      // }
      res.send('done')
    } catch (error) {
      console.log(error)
    }
  }
}

async function fetchPlaylist() {
  try {
    const youtubeUrl = 'https://youtube.googleapis.com/youtube/v3/playlists'

    // store previous  token of  last page
    // get last record and get token from it
    // put token in api and check next page is there or not

    let playlistAPI = `${youtubeUrl}?part=snippet,contentDetails,status,player&channelId=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}&maxResults=50`
    const response = await axios.get(playlistAPI, {
      headers: {
        Accept: 'application/json'
      }
    })

    let playLists = response.data.items

    const results = []
    let nextPageToken

    if (response.data?.nextPageToken) nextPageToken = response.data?.nextPageToken

    playLists = playLists.map((playList) => {
      Object.assign(playList, { oPgToken: { bFPage: true } })
      return playList
    })

    results.push(...playLists)

    while (nextPageToken) {
      playlistAPI = `${youtubeUrl}?part=snippet,contentDetails,status,player&channelId=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}&pageToken=${nextPageToken}&maxResults=50`

      const response = await axios.get(playlistAPI, {
        headers: {
          Accept: 'application/json'
        }
      })

      let playLists = response.data.items

      playLists = playLists.map((playList) => {
        Object.assign(playList, { oPgToken: { bFPage: false, sPgToken: nextPageToken } })
        return playList
      })

      if (response.data?.nextPageToken) {
        nextPageToken = response.data?.nextPageToken
        results.push(...playLists)
      } else {
        results.push(...playLists)
        nextPageToken = null
      }
    }
    await processPlaylist(results)
    return
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

async function processPlaylist(playLists) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        for (const list of playLists) {
          const { id, snippet, status, contentDetails, player, oPgToken } = list
          const { publishedAt, channelId, title, description, thumbnails, channelTitle } = snippet
          const { itemCount } = contentDetails
          const { privacyStatus } = status
          const { embedHtml } = player
          const data = {
            sKey: id,
            dPublishDate: publishedAt,
            sChannelId: channelId,
            sTitle: title,
            sDescription: description,
            sChannelTitle: channelTitle,
            sPrivacyStatus: privacyStatus,
            sEmbedHtml: embedHtml,
            // eslint-disable-next-line no-useless-escape
            sEmbedUrl: embedHtml.match(/(?<=src=").*?(?=[\"])/gm)[0],
            nVideosCount: itemCount,
            oPgToken
          }
          data.aThumbnails = await processThumbnailsData(thumbnails, config.S3_BUCKET_PLAYLIST_PATH)
          const oDefaultThumbnail = getDefaultThumbUrl(data.aThumbnails)
          data.sThumbnailUrl = oDefaultThumbnail?.sUrl
          data.sThumbnailWidth = oDefaultThumbnail?.sWidth
          data.sThumbnailHeight = oDefaultThumbnail?.sHeight
          const newPlaylistData = await updatePlaylist(id, data)
          await fetchPlaylistItem({ _id: newPlaylistData, sKey: id }, '')
        }
        resolve()
      } catch (error) {
        reject(error)
      }
    })()
  })
}

async function updatePlaylist(sKey, data) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const isExist = await PlayListsModel.findOne({ sKey }).lean()
        if (!isExist) {
          console.log('New created playlist')
          const newData = await PlayListsModel.create(data)
          const seoParams = {
            iId: newData._id,
            eType: 'pl',
            sSlug: `playlist/${newData.sTitle.toString().toLowerCase().split(' ').join('-')}`,
            sTitle: `${newData.sTitle}`,
            sDescription: `${newData.sDescription}`
            // sSlug: `cricket-videos/${newData.sTitle}`
          }
          // queuePush('addSeoData', seoParams)
          await axios.post(`${SEO_REST_URL}api/add-seos-data`, { seos: [seoParams] }, { headers: { 'Content-Type': 'application/json' } })
          resolve(newData._id)
        } else {
          console.log('Updated playlist')
          await PlayListsModel.updateOne({ sKey }, data)
          resolve(isExist._id)
        }
      } catch (error) {
        reject(error)
      }
    })()
  })
}

async function fetchPlaylistItem(newPlaylistData) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const { _id, sKey } = newPlaylistData
        // const response = await service.playlistItems.list({
        //   auth: oauth2Client,
        //   mine: true,
        //   playlistId: sKey,
        //   part: 'snippet,contentDetails,status',
        //   maxResults: 50
        // })
        const youtubeUrl = 'https://youtube.googleapis.com/youtube/v3/playlistItems'

        let playlistItemsAPI = `${youtubeUrl}?part=snippet,contentDetails,status&playlistId=${sKey}&key=${YOUTUBE_API_KEY}`

        const response = await axios.get(playlistItemsAPI, {
          headers: {
            Accept: 'application/json'
          }
        })
        let nextPageToken
        const results = []
        let playLists = response.data.items

        playLists = playLists.map((playList) => {
          Object.assign(playList, { oPgToken: { bFPage: true } })
          return playList
        })

        if (response.data?.nextPageToken) nextPageToken = response.data?.nextPageToken
        results.push(...playLists)
        while (nextPageToken) {
          playlistItemsAPI = `${youtubeUrl}?part=snippet,contentDetails,status&playlistId=${sKey}&key=${YOUTUBE_API_KEY}&pageToken=${nextPageToken}&maxResults=50`

          const response = await axios.get(playlistItemsAPI, {
            headers: {
              Accept: 'application/json'
            }
          })

          let playLists = response.data.items

          playLists = playLists.map((playList) => {
            Object.assign(playList, { oPgToken: { bFPage: false, sPgToken: nextPageToken } })
            return playList
          })

          if (response.data?.nextPageToken) {
            results.push(...playLists)
            nextPageToken = response.data?.nextPageToken
          } else {
            results.push(...playLists)
            nextPageToken = null
          }
        }

        await processPlayListsItems(_id, results)
        resolve()
      } catch (error) {
        reject(error)
      }
    })()
  })
}

async function processPlayListsItems(_id, playListsItems) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const iPlaylistId = _id
        for (const list of playListsItems) {
          const { id, snippet, contentDetails, status, oPgToken } = list
          const { channelId, title, description, thumbnails, channelTitle, position, videoOwnerChannelTitle, videoOwnerChannelId } = snippet
          const { videoId, videoPublishedAt } = contentDetails

          const data = {
            sKey: id,
            sVideoOwnerChannelId: videoOwnerChannelId,
            sVideoOwnerChannelTitle: videoOwnerChannelTitle,
            sVideoKey: videoId,
            iPlaylistId,
            dPublishDate: videoPublishedAt,
            sChannelKey: channelId,
            sTitle: title,
            sDescription: description,
            sChannelTitle: channelTitle,
            sPrivacyStatus: status?.privacyStatus,
            nPosition: position,
            oPgToken
          }
          data.aThumbnails = await processThumbnailsData(thumbnails, '')

          const newPlaylistItem = await updatePlaylistItems(id, data)
          await fetchVideos({ sVideoKey: videoId, _id: iPlaylistId, iPlaylistItem: newPlaylistItem }, '')
        }
        resolve()
      } catch (error) {
        reject(error)
      }
    })()
  })
}

async function updatePlaylistItems(sKey, data) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const isExist = await PlayListItemsModel.findOne({ sKey }).lean()
        if (!isExist) {
          console.log('item created')
          const newData = await PlayListItemsModel.create(data)
          resolve(newData._id)
        } else {
          console.log('item updated')
          await PlayListItemsModel.updateOne({ sKey }, data)
          resolve(isExist._id)
        }
      } catch (error) {
        reject(error)
      }
    })()
  })
}

async function fetchVideos(newVideoData) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const { _id, sVideoKey } = newVideoData
        // const response = await service.videos.list({
        //   auth: oauth2Client,
        //   mine: true,
        //   id: sVideoKey,
        //   part: 'snippet,contentDetails,status,statistics,player',
        //   maxResults: 50
        // })
        const youtubeUrl = 'https://youtube.googleapis.com/youtube/v3/videos'
        let VideoAPI = `${youtubeUrl}?part=snippet,contentDetails,status,statistics,player&id=${sVideoKey}&key=${YOUTUBE_API_KEY}`

        const response = await axios.get(VideoAPI, {
          headers: {
            Accept: 'application/json'
          }
        })
        let nextPageToken
        const results = []
        let playLists = response.data.items

        playLists = playLists.map((playList) => {
          Object.assign(playList, { oPgToken: { bFPage: true } })
          return playList
        })

        if (response.data?.nextPageToken) nextPageToken = response.data?.nextPageToken

        results.push(...playLists)
        while (nextPageToken) {
          VideoAPI = `${youtubeUrl}?part=snippet,contentDetails,status,statistics,player&id=${sVideoKey}&key=${YOUTUBE_API_KEY}&pageToken=${nextPageToken}&maxResults=50`

          const response = await axios.get(VideoAPI, {
            headers: {
              Accept: 'application/json'
            }
          })

          let playLists = response.data.items

          playLists = playLists.map((playList) => {
            Object.assign(playList, { oPgToken: { bFPage: true } })
            return playList
          })

          if (response.data?.nextPageToken) {
            results.push(...playLists)
            nextPageToken = response.data?.nextPageToken
          } else {
            results.push(...playLists)
            nextPageToken = null
          }
        }

        await processVideos(_id, results)
        resolve()
      } catch (error) {
        reject(error)
      }
    })()
  })
}

async function processVideos(_id, videos) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const iPlaylistId = _id
        for (const list of videos) {
          const { id, snippet, contentDetails, status, statistics, player, oPgToken } = list
          const { publishedAt, title, description, thumbnails, tags } = snippet
          const { uploadStatus, failureReason, rejectionReason, privacyStatus, publishAt, license, embeddable, publicStatsViewable, madeForKids, selfDeclaredMadeForKids } = status
          const { viewCount, likeCount, dislikeCount, favoriteCount, commentCount } = statistics
          const { embedHtml, embedHeight, embedWidth } = player
          const { hasCustomThumbnail, licensedContent, caption, definition, dimension, duration } = contentDetails

          const data = {
            sKey: id,
            iPlaylistId,
            dPublishDate: publishedAt,
            sTitle: title,
            sDescription: description,
            aTags: tags,
            oStatus: {
              sUploadStatus: uploadStatus,
              sFailureReason: failureReason,
              sRejectionReason: rejectionReason,
              sPrivacyStatus: privacyStatus,
              dPublishDate: publishAt,
              sLicense: license,
              bIsEmbeddable: embeddable,
              bIsPublicStatsViewable: publicStatsViewable,
              bIsMadeForKids: madeForKids,
              bIsSelfDeclaredMadeForKids: selfDeclaredMadeForKids
            },
            oStats: {
              nViewCount: viewCount, nLikeCount: likeCount, nDislikeCount: dislikeCount, nFavoriteCount: favoriteCount, nCommentCount: commentCount
            },
            oPlayer: {
              sEmbedHtml: embedHtml,
              sEmbedHeight: embedHeight,
              sEmbedWidth: embedWidth,
              // eslint-disable-next-line no-useless-escape
              sEmbedUrl: embedHtml.match(/(?<=src=").*?(?=[\"])/gm)[0].split('//')[1]
            },
            bHasCustomThumbnail: hasCustomThumbnail,
            bIsLicensedContent: licensedContent,
            sCaption: caption,
            sDefinition: definition,
            sDimension: dimension,
            sDuration: duration,
            nDurationSeconds: moment.duration(duration).asSeconds(),
            oPgToken
          }
          data.aThumbnails = await processThumbnailsData(thumbnails, config.S3_BUCKET_VIDEO_PATH)
          const oDefaultThumbnail = getDefaultThumbUrl(data.aThumbnails)
          data.sThumbnailUrl = oDefaultThumbnail?.sUrl
          data.sThumbnailWidth = oDefaultThumbnail?.sWidth
          data.sThumbnailHeight = oDefaultThumbnail?.sHeight
          await updateVideos(id, data)
        }
        resolve()
      } catch (error) {
        reject(error)
      }
    })()
  })
}

async function updateVideos(sKey, data) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const isExist = await VideosModel.findOne({ sKey }).lean()
        if (!isExist) {
          console.log('Videos Created')

          const playlist = await PlayListsModel.findById(data.iPlaylistId, { iCategoryId: 1 }).lean()
          if (playlist?.iCategoryId) Object.assign(data, { iCategoryId: playlist.iCategoryId })
          await PlayListsModel.updateOne({ _id: data.iPlaylistId }, { dNewVideoDate: data.dPublishDate })
          const newData = await VideosModel.create(data)
          const seoParams = {
            iId: newData._id,
            eType: 'vi',
            sSlug: `cricket-videos/${newData.sTitle.toString().toLowerCase().split(' ').join('-')}`,
            sTitle: `${newData.sTitle}`,
            sDescription: `${newData.sDescription}`
          }
          // queuePush('addSeoData', seoParams)
          await axios.post(`${SEO_REST_URL}api/add-seos-data`, { seos: [seoParams] }, { headers: { 'Content-Type': 'application/json' } })
          resolve(newData._id)
        } else {
          console.log('Videos updated')
          await VideosModel.updateOne({ sKey }, data)
          resolve(isExist._id)
        }
      } catch (error) {
        reject(error)
      }
    })()
  })
}

async function processThumbnailsData(data, path) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const aThumbnails = []
        const { default: Default, medium, high, standard, maxres } = data
        if (Default) {
          const res = path ? await getS3ImageURL(Default?.url, path, Default?.url.replaceAll('https://i.ytimg.com/vi/', '')) : { success: true, path: Default?.url }
          const sUrl = res.success ? res.path : ''
          aThumbnails.push({ sKey: 'default', sUrl, sWidth: Default?.width, sHeight: Default?.height })
        }
        if (medium) {
          const res = path ? await getS3ImageURL(medium?.url, path, medium?.url.replaceAll('https://i.ytimg.com/vi/', '')) : { success: true, path: medium?.url }
          const sUrl = res.success ? res.path : ''
          aThumbnails.push({ sKey: 'medium', sUrl, sWidth: medium?.width, sHeight: medium?.height })
        }
        if (high) {
          const res = path ? await getS3ImageURL(high?.url, path, high?.url.replaceAll('https://i.ytimg.com/vi/', '')) : { success: true, path: high?.url }
          const sUrl = res.success ? res.path : ''
          aThumbnails.push({ sKey: 'high', sUrl, sWidth: high?.width, sHeight: high?.height })
        }
        if (standard) {
          const res = path ? await getS3ImageURL(standard?.url, path, standard?.url.replaceAll('https://i.ytimg.com/vi/', '')) : { success: true, path: standard?.url }
          const sUrl = res.success ? res.path : ''
          aThumbnails.push({ sKey: 'standard', sUrl, sWidth: standard?.width, sHeight: standard?.height })
        }
        if (maxres) {
          const res = path ? await getS3ImageURL(maxres?.url, path, maxres?.url.replaceAll('https://i.ytimg.com/vi/', '')) : { success: true, path: maxres?.url }
          const sUrl = res.success ? res.path : ''
          aThumbnails.push({ sKey: 'maxres', sUrl, sWidth: maxres?.width, sHeight: maxres?.height })
        }
        resolve(aThumbnails)
      } catch (error) {
        reject(error)
      }
    })()
  })
}

function getDefaultThumbUrl(aThumbnails = []) {
  const aPriority = ['medium', 'high', 'standard', 'default', 'maxres']
  for (const priority of aPriority) {
    const oDefaultThumbnail = aThumbnails.find(thumb => thumb?.sKey === priority)
    if (oDefaultThumbnail) {
      return oDefaultThumbnail
    }
  }
}

module.exports = new Playlists()
