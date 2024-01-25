import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import styles from './style.module.scss'
import { dateCheck, dateMonth } from '@utils'
import { archiveSeriesLoader } from '@shared/libs/allLoader'

const ArchiveList = ({ data, isLoading }) => {
  return (
    <div className={`${styles.archiveList} common-box py-0`}>
      {data?.map((archive) => {
        return (
          <div key={archive?._id} className={`${styles.item} d-lg-flex align-items-lg-center justify-content-lg-between`} id={archive?._id} >
            <p className="big-text mb-0 font-semi"><Link href={archive?.oCategory?.oSeo?.sSlug || archive?.oSeo?.sSlug || ''} prefetch={false}><a>{archive?.sTitle}</a></Link></p>
            <p className="mb-0 ms-lg-3 text-secondary">
              {dateMonth(dateCheck(archive?.dStartDate))} - {dateMonth(dateCheck(archive?.dEndDate))}
            </p>
          </div>
        )
      })}
      { isLoading && archiveSeriesLoader(2)}
    </div>
  )
}

ArchiveList.propTypes = {
  data: PropTypes.array,
  id: PropTypes.string,
  isLoading: PropTypes.bool
}

export default ArchiveList
