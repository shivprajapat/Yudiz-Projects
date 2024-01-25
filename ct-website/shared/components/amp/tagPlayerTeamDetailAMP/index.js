import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { articleLoader } from '@shared/libs/allLoader'
import { useRouter } from 'next/router'

const SeriesHomeAMP = dynamic(() => import('@shared/components/amp/seriesHomeAMP'), { loading: () => articleLoader(['g', 's']) })
const SeriesNewsAMP = dynamic(() => import('@shared/components/amp/series/seriesNewsAMP'), { loading: () => articleLoader(['g', 's']) })
const SeriesVideosAMP = dynamic(() => import('@shared/components/amp/series/seriesVideosAMP'), { loading: () => articleLoader(['g', 's']) })

function TagPlayerTeamDetailAMP({ tag, seoData }) {
  const router = useRouter()
  if (router?.query?.tab === 'news') {
    return <SeriesNewsAMP data={tag?.home?.oArticles} category={{ ...tag?.data, iId: seoData?.iId }} isClientOnly />
  } else if (router?.query?.tab === 'videos') {
    return <SeriesVideosAMP data={tag?.home?.oVideos} category={tag?.data} isClientOnly />
  } else {
    return <SeriesHomeAMP data={tag?.home} category={tag?.data} />
  }
}
TagPlayerTeamDetailAMP.propTypes = {
  seoData: PropTypes.object,
  tag: PropTypes.object
}
export default TagPlayerTeamDetailAMP
