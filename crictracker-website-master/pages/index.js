import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import { articleLoader } from '@shared/libs/allLoader'
import Error from '@shared/components/error'
import Layout from '@shared/components/layout'

// const HomePageContent = dynamic(() => import('@shared-components/homePageComponents/homePageContent'), { loading: () => pageLoading() })
// const HomePageArticle = dynamic(() => import('@shared-components/homePageComponents/homePageArticle'), {
//   loading: () => articleLoader(['g', 's'])
// })
const HomePageFantasyArticle = dynamic(() => import('@shared/components/homePageComponents/homePageFantasyArticle'), {
  loading: () => articleLoader(['g', 's']),
  ssr: false
})
const HomePageVideo = dynamic(() => import('@shared/components/homePageComponents/homePageVideo'), {
  loading: () => articleLoader(['g', 's']),
  ssr: false
})
const HomePageArticle = dynamic(() => import('@shared/components/homePageComponents/homePageArticle'))
const HomePageContent = dynamic(() => import('@shared/components/homePageComponents/homePageContent'))

function Home({ articles, widgetPosition, miniScorecard }) {
  function getMetaDetail() {
    return {
      oSeo: {
        sTitle: 'Cricket Teams, Stats, Latest News, Match Predictions, Fantasy Tips &amp; Results',
        sDescription: 'Get cricket match updates (Domestic &amp; International), team stats, series results, fixtures, latest news, top stories, match preview, predictions, review, results, fantasy tips, statistical highlights, videos and complete cricket analysis along with ICC Cricket player rankings on CricTracker'
      }
    }
  }

  return (
    <Layout data={getMetaDetail()}>
      <HomePageContent
        articles={articles}
        widgetPosition={widgetPosition}
        miniScorecard={miniScorecard}
      >
        {(type) => {
          if (type === 'fa') return <HomePageFantasyArticle />
          else if (type === 'v') return <HomePageVideo />
          else return <HomePageArticle articles={articles} widgetPosition={widgetPosition} />
        }}
      </HomePageContent>
    </Layout >
  )
}

Home.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.object),
  widgetPosition: PropTypes.arrayOf(PropTypes.object),
  miniScorecard: PropTypes.arrayOf(PropTypes.object)
}

export default Error(Home)

export async function getServerSideProps({ res, query, resolvedUrl }) {
  try {
    if (query?.p) {
      try {
        const getRedirectionURL = (await import('../shared/libs/homePage')).redirectToArticleWhenQueryHaveID
        const { returnObj } = await getRedirectionURL(query?.p)
        return returnObj
      } catch (e) {
        return { notFound: true }
      }
    } else {
      res.setHeader('Cache-Control', 'public, max-age=600')
      const homePageFunction = (await import('../shared/libs/homePage')).getHomePageData
      const data = await homePageFunction('a')
      return {
        props: data
      }
    }
  } catch (e) {
    console.log({ homepage: e })
    res.setHeader('Cache-Control', 'no-cache')
    const handleApiError = (await import('@shared/utils')).handleApiError
    const status = handleApiError(e, resolvedUrl)
    return status
  }
}
