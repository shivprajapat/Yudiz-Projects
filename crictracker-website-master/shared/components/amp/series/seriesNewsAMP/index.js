import React from 'react'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'

import NoDataAMP from '@shared-components/amp/noDataAMP'
import ArticleGrid from '@shared/components/amp/articleAMP/articleGrid'
import ArticleSmall from '@shared/components/amp/articleAMP/articleSmall'

const SeriesNewsAMP = ({ data, category, hideBadge, isClientOnly }) => {
  const newsData = data?.aResults || []

  return (
    <>
      <style jsx amp-custom>{`
        .t-center { text-align: center} .t-uppercase { text-transform: uppercase; }
      `}
      </style>
      {newsData?.length !== 0 && (
        <div className="seriesHome">
          <h4 className="t-uppercase">
            <Trans i18nKey="common:LatestNews" />
          </h4>
          {newsData?.map((news, i) => {
            if (i === 0) {
              return (
                <React.Fragment key={news._id}>
                  <ArticleGrid id={news?._id} isLarge={true} data={news} hideBadge={hideBadge} />
                  <div className="d-flex justify-content-center mb-3">
                    <amp-ad
                      width="300"
                      height="250"
                      type="doubleclick"
                      data-slot="138639789/Crictracker2022_AMP_SP_ATF_300x250"
                      data-multi-size-validation="false"
                      data-enable-refresh="30"
                    />
                  </div>
                </React.Fragment>
              )
            } else if (i > 0 && i < 9) {
              return (
                <React.Fragment key={news._id}>
                  <ArticleSmall id={news?._id} data={news} />
                  {i === 3 && (
                    <div key={'adsMid'} className="t-center" id={news?._id}>
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
                </React.Fragment>
              )
            } else if (i >= 9 && i <= 12) {
              return (
                <ArticleSmall key={news._id} id={news?._id} isLarge={false} data={news} hideBadge={hideBadge} />
              )
            } else {
              return (
                <React.Fragment key={news?._id}>
                  {i === 13 && (
                    <div className="col-12">
                      <h4 className="t-uppercase">
                        <Trans i18nKey="common:MoreArticles" />
                      </h4>
                    </div>
                  )}
                  <ArticleSmall id={news?._id} isLarge={true} data={news} hideBadge={hideBadge} />
                </React.Fragment>
              )
            }
          })}
        </div>
      )}
      {newsData?.length === 0 && <NoDataAMP />}
    </>
  )
}

SeriesNewsAMP.propTypes = {
  data: PropTypes.object,
  category: PropTypes.object,
  hideBadge: PropTypes.bool,
  isClientOnly: PropTypes.bool
}

export default SeriesNewsAMP
