import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import Trans from 'next-translate/Trans'

import { articleLoader } from '@shared/libs/allLoader'
import NoDataAMP from '@shared-components/amp/noDataAMP'

const ArticleBig = dynamic(() => import('@shared-components/amp/articleAMP/articleBig'), { loading: () => articleLoader(['g']) })
const ArticleGrid = dynamic(() => import('@shared-components/amp/articleAMP/articleGrid'), { loading: () => articleLoader(['g']) })

const SeriesVideosAMP = ({ data, category, isClientOnly }) => {
  const videosData = data?.aResults || []
  return (
    <>
      <style jsx amp-custom>{`
        .text-center { text-align: center}
      `}
      </style>
      {videosData?.length > 0 && (
        <div className="seriesVideo">
          <h4 className="text-uppercase">
            <Trans i18nKey="common:Videos" />
          </h4>
          <div className="row align-items-start">
            <div className="col-lg-8">
              <ArticleBig data={videosData[0]} isVideo={true} />
            </div>
            <div className="col-lg-4">
              {videosData[1] && <ArticleGrid data={videosData[1]} isVideo={true} />}
              {videosData[2] && <ArticleGrid data={videosData[2]} isVideo={true} />}
            </div>
          </div>
          <div className="equal-height-article row">
            {videosData?.map((video, i) => {
              if (i > 2) {
                return (
                  <React.Fragment key={video?._id}>
                    {i === 9 && (
                      <div className="col-12">
                      </div>
                    )}
                    {i === 18 && (
                      <div className="col-12">
                      </div>
                    )}
                    <div className="col-md-4 col-sm-6" id={video?._id}>
                      <ArticleGrid data={video} isVideo={true} />
                    </div>
                  </React.Fragment>
                )
              } else return null
            })}
          </div>
        </div>
      )}
      {videosData?.length === 0 && <NoDataAMP />}
    </>
  )
}

SeriesVideosAMP.propTypes = {
  data: PropTypes.object,
  category: PropTypes.object,
  isClientOnly: PropTypes.bool
}

export default SeriesVideosAMP
