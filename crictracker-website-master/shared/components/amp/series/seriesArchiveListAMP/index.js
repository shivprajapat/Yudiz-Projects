import React from 'react'
import PropTypes from 'prop-types'

import { dateCheck, dateMonth } from '@utils'
import dynamic from 'next/dynamic'

const NoDataAMP = dynamic(() => import('@shared-components/amp/noDataAMP'))

const SeriesArchiveListAMP = ({ data }) => {
  const sortedData = data?.slice().sort((a, b) => dateCheck(b?.oSeries?.dStartDate) - dateCheck(a?.oSeries?.dStartDate))

  return (
    <>
      <style jsx amp-custom>{`
     p{margin:0}.common-box{margin-bottom:24px;padding:2px 16px;background:var(--light-mode-bg);border-radius:16px}.common-box>:last-child{margin-bottom:0}.d-lg-flex{display:flex;display:-webkit-flex}.align-items-lg-center{-webkit-align-items:center;align-items:center}.justify-content-lg-between{-webkit-justify-content:space-between;justify-content:space-between}a{text-decoration:none;color:inherit}a:hover{color:#045de9}.archiveList .item{padding:12px 0}.archiveList .item:not(:last-child){border-bottom:1px solid var(--light)}.text-secondary{font-size:14px;line-height:20px}@media(max-width: 991px){.d-lg-flex{display:block}}@media(max-width: 767px){.common-box{margin-bottom:20px;padding:2px 12px;border-radius:12px}.text-secondary{font-size:13px;line-height:18px}}/*# sourceMappingURL=style.css.map */

      `}
      </style>
      {data && <div className="archiveList common-box py-0">
        {sortedData?.map((archive) => {
          return (
            <div key={archive?._id} className="item d-lg-flex align-items-lg-center justify-content-lg-between">
              <a href={`/${archive?.oSeo?.sSlug || archive?.oSeries?.oSeo?.sSlug}`} >
                <p className="big-text mb-0 font-semi">{archive?.oSeries?.sTitle}{archive?.oSeries?.sSeason && ' - ' + archive?.oSeries?.sSeason}</p>
              </a>
              <p className="mb-0 ms-lg-3 text-secondary">
                {dateMonth(dateCheck(archive?.oSeries?.dStartDate))} - {dateMonth(dateCheck(archive?.oSeries?.dEndDate))}
              </p>
            </div>
          )
        })}
      </div>}
      {!data && <NoDataAMP />}
    </>
  )
}

SeriesArchiveListAMP.propTypes = {
  data: PropTypes.array
}

export default SeriesArchiveListAMP
