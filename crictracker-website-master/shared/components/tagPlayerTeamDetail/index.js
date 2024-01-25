import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { articleLoader } from '@shared/libs/allLoader'

const SeriesHome = dynamic(() => import('@shared/components/series/seriesHome'), { loading: () => articleLoader(['g', 's']) })
const SeriesNews = dynamic(() => import('@shared/components/series/seriesNews'), { loading: () => articleLoader(['g', 's']) })
const SeriesFantasyArticle = dynamic(() => import('@shared/components/series/seriesFantasyArticle'), { loading: () => articleLoader(['g', 's']) })
const SeriesVideos = dynamic(() => import('@shared/components/series/seriesVideos'), { loading: () => articleLoader(['g', 's']) })

function TagPlayerTeamDetail({ tag, seoData, activeTab, onTabChanges }) {
  if (activeTab === 'home') {
    return <SeriesHome data={tag?.home} category={tag?.data} onTabChanges={onTabChanges} />
  } else if (activeTab === 'news') {
    return <SeriesNews category={{ ...tag?.data, iId: seoData?.iId }} isClientOnly />
  } else if (activeTab === 'fantasyArticle') {
    return <SeriesFantasyArticle category={tag?.data} isClientOnly />
  } else if (activeTab === 'videos') {
    return <SeriesVideos category={tag?.data} isClientOnly />
  } else {
    return null
  }
}
TagPlayerTeamDetail.propTypes = {
  seoData: PropTypes.object,
  tag: PropTypes.object,
  activeTab: PropTypes.string,
  onTabChanges: PropTypes.func
}
export default TagPlayerTeamDetail
