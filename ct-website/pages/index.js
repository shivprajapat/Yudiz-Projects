import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import { articleLoader } from '@shared/libs/allLoader'
import Error from '@shared/components/error'
import HomePageContent from '@shared/components/homePageComponents/homePageContent'
import HomePageArticle from '@shared/components/homePageComponents/homePageArticle'
import { handleApiError } from '@shared/utils'

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

function Home({ articles }) {
  return (
    <>
      <HomePageContent>
        {(type) => {
          if (type === 'fa') return <HomePageFantasyArticle />
          else if (type === 'v') return <HomePageVideo />
          else return <HomePageArticle articles={articles} />
        }}
      </HomePageContent>
    </>
  )
}

Home.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.object)
}

export default Error(Home)

export async function getServerSideProps({ res, query }) {
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
    res.setHeader('Cache-Control', 'no-cache')
    const status = handleApiError(e)
    return status
  }
}
