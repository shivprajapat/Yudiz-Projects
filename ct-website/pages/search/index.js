import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import { GET_SEARCH_NEWS, GET_SEARCH_PLAYER, GET_SEARCH_SERIES, GET_SEARCH_TEAM, GET_SEARCH_VIDEO } from '@graphql/search/search.query'
import queryGraphql from '@shared/components/queryGraphql'
import { pageLoading } from '@shared/libs/allLoader'
import Error from '@shared/components/error'
import { handleApiError } from '@shared/utils'

const Skeleton = dynamic(() => import('@shared/components/skeleton'), { ssr: false })
const ArticleSkeleton = dynamic(() => import('@shared/components/skeleton/components/articleSkeleton'), { ssr: false })
const SearchContent = dynamic(() => import('@shared/components/searchComponents/searchContent'), { loading: () => pageLoading() })
const SearchAll = dynamic(() => import('@shared/components/searchComponents/searchAll'), {
  loading: () => (
    <>
      <Skeleton width={'150px'} className={'mb-2'} />
      <ArticleSkeleton type="t" />
      <Skeleton width={'150px'} className={'mb-2'} />
      <ArticleSkeleton type="t" />
    </>
  )
})

const Search = ({ players, series, team, news, video, error }) => {
  return (
    <>
      <SearchContent>
        <SearchAll players={players} series={series} team={team} news={news} video={video} />
      </SearchContent>
    </>
  )
}
Search.propTypes = {
  players: PropTypes.object,
  series: PropTypes.object,
  team: PropTypes.object,
  news: PropTypes.object,
  video: PropTypes.object,
  error: PropTypes.string
}
export default Error(Search)

export const getSearchPayload = (search, limit) => {
  return {
    nLimit: limit,
    nSkip: 1,
    sSearch: search,
    sSortBy: 'dCreated',
    nOrder: -1
  }
}

export async function getServerSideProps({ query, res }) {
  try {
    res.setHeader('Cache-Control', 'public, max-age=60')
    const { data: player } = await queryGraphql(GET_SEARCH_PLAYER, { input: getSearchPayload(query?.q, 4) })
    const { data: series } = await queryGraphql(GET_SEARCH_SERIES, { input: getSearchPayload(query?.q, 4) })
    const { data: team } = await queryGraphql(GET_SEARCH_TEAM, { input: getSearchPayload(query?.q, 4) })
    const { data: news } = await queryGraphql(GET_SEARCH_NEWS, { input: getSearchPayload(query?.q, 4) })
    const { data: video } = await queryGraphql(GET_SEARCH_VIDEO, { input: getSearchPayload(query?.q, 4) })
    return {
      props: {
        players: player?.getPlayerSearch,
        series: series?.getSeriesSearch,
        team: team?.getTeamSearch,
        news: news?.getArticleSearch,
        video: video?.getVideoSearch
      }
    }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    const status = handleApiError(e)
    return status
  }
}
