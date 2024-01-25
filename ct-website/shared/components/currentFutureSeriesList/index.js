import React from 'react'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'

import styles from './style.module.scss'
import { dateCheck, dateMonth, MonthYear } from '@utils'
import Link from 'next/link'

const CurrentFutureSeriesList = ({ data }) => {
  return (
    <>
    {data?.length !== 0 && <div className={styles.archiveList}>
      <div className={`${styles.item} common-box d-flex align-items-center bg-secondary text-light font-bold mb-2`}>
        <p className={`${styles.month} flex-shrink-0 mb-0`}><Trans i18nKey="common:Month" /></p>
        <div className={`${styles.seriesItem} flex-grow-1 d-md-flex justify-content-md-between`}>
          <p className="mb-0"><Trans i18nKey="common:Series" /></p>
          <p className={`${styles.duration} mb-0 flex-shrink-0 d-none d-md-block`}><Trans i18nKey="common:Duration" /></p>
        </div>
      </div>
      {data?.map((seriesData, index) => {
        return (
          <div key={index} className={`${styles.item} common-box d-flex mb-2`}>
            <p className={`${styles.month} font-semi mb-0 flex-shrink-0`}>{MonthYear(seriesData?.sMonth)}</p>
            <div className={`${styles.series} flex-grow-1`}>
              {seriesData?.aSeries?.map((series) => {
                return (
                  <React.Fragment key={series._id}>
                    <div className={`${styles.seriesItem} d-md-flex justify-content-md-between`}>
                      <p className="font-semi mb-1 mb-md-0 flex-grow-1"><Link href={series?.oCategory?.oSeo?.sSlug || series?.oSeo?.sSlug || ''} prefetch={false}><a>{series?.sTitle}</a></Link></p>
                      <p className={`${styles.duration} flex-shrink-0 mb-0`}>
                        {dateMonth(dateCheck(series?.dStartDate))} - {dateMonth(dateCheck(series?.dEndDate))}
                      </p>
                    </div>
                  </React.Fragment>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>}
    </>
  )
}

CurrentFutureSeriesList.propTypes = {
  data: PropTypes.array
}

export default CurrentFutureSeriesList
