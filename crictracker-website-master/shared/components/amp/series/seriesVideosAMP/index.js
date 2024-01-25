import React from 'react'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'

import NoDataAMP from '@shared-components/amp/noDataAMP'
import ArticleSmall from '@shared/components/amp/articleAMP/articleSmall'
import ArticleBig from '@shared/components/amp/articleAMP/articleBig'

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
          <ArticleBig data={videosData[0]} isVideo={true} />
          <div className="text-center mb-3">
            <amp-ad
              width="300"
              height="250"
              type="doubleclick"
              data-slot="138639789/Crictracker2022_AMP_SP_ATF_300x250"
              data-multi-size-validation="false"
              data-enable-refresh="30"
            />
          </div>
          {videosData[1] &&
            <ArticleSmall data={videosData[1]} isVideo={true} />
          }
          {videosData[2] &&
            <ArticleSmall data={videosData[2]} isVideo={true} />
          }
          {videosData[2] && (
            <div className="text-center">
              <amp-ad
                width="300"
                height="250"
                type="doubleclick"
                data-slot="138639789/Crictracker2022_AMP_SP_MID_300x250"
                data-multi-size-validation="false"
                data-enable-refresh="30"
              />
            </div>
          )}
          {videosData?.map((video, i) => {
            if (i > 2) {
              return (
                <React.Fragment key={video?._id}>
                  <ArticleSmall id={video?._id} data={video} isVideo={true} />
                </React.Fragment>
              )
            } else return null
          })}
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
