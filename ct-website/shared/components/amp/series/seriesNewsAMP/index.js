import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import Trans from 'next-translate/Trans'

import { articleLoader } from '@shared/libs/allLoader'
import NoDataAMP from '@shared-components/amp/noDataAMP'

const ArticleSmall = dynamic(() => import('@shared-components/amp/articleAMP/articleSmall'), { loading: () => articleLoader(['s']) })
const ArticleGrid = dynamic(() => import('@shared-components/amp/articleAMP/articleGrid'), { loading: () => articleLoader(['g']) })

const SeriesNewsAMP = ({ data, category, hideBadge, isClientOnly }) => {
  const newsData = data?.aResults || []

  return (
    <>
      <style jsx amp-custom>{`
        .text-center { text-align: center}
      `}
      </style>
      {newsData?.length !== 0 && (
        <div className="seriesHome">
          <h4 className="text-uppercase">
            <Trans i18nKey="common:LatestNews" />
          </h4>
          <div className="row">
            {newsData?.map((news, i) => {
              if (i === 0) {
                return (
                  <div key={news._id} className="col-12" id={news?._id}>
                    <ArticleSmall isLarge={true} data={news} hideBadge={hideBadge} />
                  </div>
                )
              } else if (i > 0 && i < 7) {
                return (
                  <div key={news._id} className="col-lg-4 col-sm-6" id={news?._id}>
                    <ArticleGrid data={news} />
                  </div>
                )
              } else if (i >= 7 && i <= 12) {
                return (
                  <div key={news?._id} className="col-md-6" id={news?._id}>
                    <ArticleSmall isLarge={false} data={news} hideBadge={hideBadge} />
                  </div>
                )
              } else {
                return (
                  <React.Fragment key={news?._id}>
                    {i === 13 && (
                      <>
                        <h4 className="text-uppercase">
                          <Trans i18nKey="common:MoreArticles" />
                        </h4>
                      </>
                    )}
                    {i === 17 && (
                      <div className="col-12"></div>
                    )}
                    <div className="col-12" id={news?._id}>
                      <ArticleSmall isLarge={true} data={news} hideBadge={hideBadge} />
                    </div>
                  </React.Fragment>
                )
              }
            })}
          </div>
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
