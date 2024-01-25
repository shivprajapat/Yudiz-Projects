/* eslint-disable camelcase */

const OneSignal = require('@onesignal/node-onesignal')
const { handleCatchError } = require('./utilities.services')

const pushTopicNotification = async (sTopic, sTitle, sBody) => {
  try {
    const ONESIGNAL_APP_ID = 'd231d9d1-8145-47d0-8694-333473c635d9'
    /*
 * CREATING ONESIGNAL KEY TOKENS
 */
    const app_key_provider = {
      getToken() {
        return 'YWViZWRkY2EtYjA4Mi00YTc3LTljYzMtMWM1ZjZhZGRjNTZl'
      }
    }
    console.log('app_key_provider', app_key_provider.getToken())
    /**
  * CREATING ONESIGNAL CLIENT
  */
    const configuration = OneSignal.createConfiguration({
      authMethods: {
        app_key: {
          tokenProvider: app_key_provider
        }
      }
    })
    const client = new OneSignal.DefaultApi(configuration)

    /**
 * CREATE NOTIFICATION
 */
    const notification = new OneSignal.Notification()
    notification.app_id = ONESIGNAL_APP_ID
    notification.included_segments = ['Subscribed Users']
    // notification.included_segments = ['All']
    // notification.include_player_ids = ['fe37a83e-57b0-459d-9699-dc5d9aff2494', '14a8c7f9-4764-4777-a1b1-6183505629bf']
    notification.contents = {
      en: sBody
    }
    notification.headings = {
      en: sTitle
    }
    notification.subtitle = {
      en: sTitle
    }
    notification.url = 'http://127.0.0.1:5501'
    // notification.buttons = [
    //   {

    //   }
    // ]
    notification.icon = 'https://onesignal.com/images/notification_logo.png'
    notification.buttons = [{ /* Buttons */
      /* Choose any unique identifier for your button. The ID of the clicked button            is passed to you so you can identify which button is clicked */
      id: 'like-button',
      /* The text the button should display. Supports emojis. */
      text: 'Like',
      /* A valid publicly reachable URL to an icon. Keep this small because it's               downloaded on each notification display. */
      icon: 'http://i.imgur.com/N8SN8ZS.png',
      /* The URL to open when this action button is clicked. See the sections below            for special URLs that prevent opening any window. */
      url: 'https://example.com/?_osp=do_not_open'
    },
    {
      id: 'read-more-button',
      text: 'Read more',
      icon: 'http://i.imgur.com/MIxJp1L.png',
      url: 'https://example.com/?_osp=do_not_open'
    }]

    // notification.web_buttons = [{ /* Buttons */
    //   /* Choose any unique identifier for your button. The ID of the clicked button            is passed to you so you can identify which button is clicked */
    //   id: 'like-button',
    //   /* The text the button should display. Supports emojis. */
    //   text: 'Like',
    //   /* A valid publicly reachable URL to an icon. Keep this small because it's               downloaded on each notification display. */
    //   icon: 'http://i.imgur.com/N8SN8ZS.png',
    //   /* The URL to open when this action button is clicked. See the sections below            for special URLs that prevent opening any window. */
    //   url: 'https://example.com/?_osp=do_not_open'
    // },
    // {
    //   id: 'read-more-button',
    //   text: 'Read more',
    //   icon: 'http://i.imgur.com/MIxJp1L.png',
    //   url: 'https://example.com/?_osp=do_not_open'
    // }]

    // pass metaData to notification
    notification.data = {
      foo: 'bar',
      abc: 123,
      url: 'https://example.com/?_osp=do_not_open',
      url2: 'https://example.com/?_osp=do_not_open'
    }

    notification.big_picture = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'
    notification.chrome_web_icon = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'
    notification.chrome_web_image = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'
    notification.chrome_web_badge = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'

    notification.small_icon = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'
    notification.large_icon = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'

    // safari web push
    notification.safari_web_icon = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'
    notification.safari_web_image = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'
    notification.safari_web_badge = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'

    // notification.

    const { id } = await client.createNotification(notification)
    console.log(id)

    /**
 * VIEW NOTIFICATION
 */
    // const response = await client.getNotification(ONESIGNAL_APP_ID, id)
    // console.log(response)
  } catch (error) {
    handleCatchError(error)
  }
}

const pushNotificationUsingTokens = async (data) => {
  try {
    const chunkSize = 500
    const chunks = Math.ceil(data.sPushToken.length / chunkSize)

    let confirm

    for (let i = 0; i < chunks; i++) {
      const start = i * chunkSize
      const end = (i + 1) * chunkSize
      const chunk = data.sPushToken.slice(start, end)

      const ONESIGNAL_APP_ID = 'cd96c102-8c03-4a5b-ad75-904e342b1b7d'

      const app_key_provider = {
        getToken() {
          return 'YTExNDAwOTItZDgyMi00MDgyLWIxMDAtNTk1ZjM2ZmE1ODlj'
        }
      }

      const configuration = OneSignal.createConfiguration({
        authMethods: {
          app_key: {
            tokenProvider: app_key_provider
          }
        }
      })
      const client = new OneSignal.DefaultApi(configuration)

      const notification = new OneSignal.Notification()
      notification.app_id = ONESIGNAL_APP_ID
      // notification.included_segments = ['Subscribed Users']
      // notification.included_segments = ['All']
      notification.include_player_ids = chunk

      notification.contents = {
        en: data.sBody
      }
      notification.headings = {
        en: data.sTitle
      }
      notification.subtitle = {
        en: data.sTitle
      }
      notification.url = data.sUrl

      notification.icon = 'https://onesignal.com/images/notification_logo.png'

      notification.web_buttons = [
        {
          id: 'read-more-button',
          text: 'Read more',
          icon: 'http://i.imgur.com/MIxJp1L.png',
          url: 'http://127.0.0.1:5501',
          web_url: 'http://127.0.0.1:5501'
        }]
      // pass metaData to notification
      notification.data = {
        foo: 'bar',
        abc: 123,
        url: 'https://example.com/?_osp=do_not_open',
        url2: 'https://example.com/?_osp=do_not_open'
      }

      notification.big_picture = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'
      notification.chrome_web_icon = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'
      notification.chrome_web_image = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'
      notification.chrome_web_badge = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'

      notification.small_icon = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'
      notification.large_icon = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'

      // safari web push
      notification.safari_web_icon = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'
      notification.safari_web_image = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'
      notification.safari_web_badge = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'

      const { id } = await client.createNotification(notification)
      console.log('notification id +++++++++ ', id)
    }
    return confirm
  } catch (error) {
    console.log('error', error)
    handleCatchError(error)
  }
}

module.exports = {
  pushTopicNotification,
  pushNotificationUsingTokens
}
