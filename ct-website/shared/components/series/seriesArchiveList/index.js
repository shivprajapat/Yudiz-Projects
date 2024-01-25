import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import styles from '../archiveList/style.module.scss'
import { dateCheck, dateMonth } from '@utils'
import dynamic from 'next/dynamic'

const NoData = dynamic(() => import('@shared-components/noData'), { ssr: false })

const SeriesArchiveList = ({ data }) => {
  const [sortedData, setSortedData] = useState()

  useEffect(() => {
    setSortedData(data?.sort((a, b) => dateCheck(b?.oSeries?.dStartDate) - dateCheck(a?.oSeries?.dStartDate)))
  }, [data])

  if (!data?.length) return <NoData />
  return (
    <div className={`${styles.archiveList} common-box py-0`}>
      {sortedData?.map((archive) => {
        return (
          <div key={archive?._id} className={`${styles.item} d-lg-flex align-items-lg-center justify-content-lg-between`}>
            <Link href={archive?.oSeo?.sSlug || archive?.oSeries?.oSeo?.sSlug} prefetch={false}>
              <a>
                <p className="big-text mb-0 font-semi">{archive?.oSeries?.sTitle}{archive?.oSeries?.sSeason && ' - ' + archive?.oSeries?.sSeason}</p>
              </a>
            </Link>
            <p className="mb-0 ms-lg-3 text-secondary">
              {dateMonth(dateCheck(archive?.oSeries?.dStartDate))} - {dateMonth(dateCheck(archive?.oSeries?.dEndDate))}
            </p>
          </div>
        )
      })}
    </div>
  )
}

SeriesArchiveList.propTypes = {
  data: PropTypes.array
}

export default SeriesArchiveList
