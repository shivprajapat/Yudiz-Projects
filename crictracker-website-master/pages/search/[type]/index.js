import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import queryGraphql from '@shared/components/queryGraphql'
import { getSearchPayload } from '../index'
import { GET_SEARCH_NEWS, GET_SEARCH_PLAYER, GET_SEARCH_SERIES, GET_SEARCH_TEAM, GET_SEARCH_VIDEO } from '@graphql/search/search.query'
import { pageLoading } from '@shared/libs/allLoader'
import Error from '@shared/components/error'
import { handleApiError } from '@shared/utils'

const ArticleSkeleton = dynamic(() => import('@shared/components/skeleton/components/articleSkeleton'), { ssr: false })
const SearchContent = dynamic(() => import('@shared/components/searchComponents/searchContent'), { loading: () => pageLoading() })
const SearchNews = dynamic(() => import('@shared/components/searchComponents/searchNews'), { loading: () => searchLoader() })
const SearchTeam = dynamic(() => import('@shared/components/searchComponents/searchTeam'), { loading: () => searchLoader('g') })
const SearchVideo = dynamic(() => import('@shared/components/searchComponents/searchVideo'), { loading: () => searchLoader() })
const SearchSeries = dynamic(() => import('@shared/components/searchComponents/searchSeries'), { loading: () => searchLoader('g') })
const SearchPlayer = dynamic(() => import('@shared/components/searchComponents/searchPlayer'), { loading: () => searchLoader('g') })

const Search = ({ players, series, team, news, video, type }) => {
  return (
    <SearchContent>
      {type === 'news' && <SearchNews news={news} />}
      {type === 'team' && <SearchTeam team={team} />}
      {type === 'video' && <SearchVideo video={video} />}
      {type === 'series' && <SearchSeries series={series} />}
      {type === 'players' && <SearchPlayer players={players} />}
    </SearchContent>
  )
}
Search.propTypes = {
  players: PropTypes.object,
  series: PropTypes.object,
  team: PropTypes.object,
  news: PropTypes.object,
  video: PropTypes.object,
  type: PropTypes.string
}
export default Error(Search)

function searchLoader(type) {
  if (type === 'g') {
    return (
      <div className="d-flex w-100">
        <div className="w-50 pe-2">
          <ArticleSkeleton wi type="t" />
        </div>
        <div className="w-50 ps-2">
          <ArticleSkeleton wi type="t" />
        </div>
      </div>
    )
  } else {
    return (
      <>
        <ArticleSkeleton type="s" />
        <ArticleSkeleton type="s" />
        <ArticleSkeleton type="s" />
      </>
    )
  }
}

export async function getServerSideProps({ query, res, resolvedUrl }) {
  try {
    res.setHeader('Cache-Control', 'public, max-age=120')
    if (query.type === 'news') {
      const { data: news } = await queryGraphql(GET_SEARCH_NEWS, { input: getSearchPayload(query?.q, 10) })
      return {
        props: {
          type: query.type,
          news: news?.getArticleSearch
        }
      }
    } else if (query.type === 'video') {
      const { data: video } = await queryGraphql(GET_SEARCH_VIDEO, { input: getSearchPayload(query?.q, 10) })
      return {
        props: {
          type: query.type,
          video: video?.getVideoSearch
        }
      }
    } else if (query.type === 'series') {
      const { data: series } = await queryGraphql(GET_SEARCH_SERIES, { input: getSearchPayload(query?.q, 10) })
      return {
        props: {
          type: query.type,
          series: series?.getSeriesSearch
        }
      }
    } else if (query.type === 'players') {
      const { data: player } = await queryGraphql(GET_SEARCH_PLAYER, { input: getSearchPayload(query?.q, 10) })
      return {
        props: {
          type: query.type,
          players: player?.getPlayerSearch
        }
      }
    } else if (query.type === 'team') {
      const { data: team } = await queryGraphql(GET_SEARCH_TEAM, { input: getSearchPayload(query?.q, 10) })
      return {
        props: {
          type: query.type,
          team: team?.getTeamSearch
        }
      }
    } else {
      return {
        props: {
          type: query.type,
          error: true
        }
      }
    }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    const status = handleApiError(e, resolvedUrl)
    return status
  }
}
