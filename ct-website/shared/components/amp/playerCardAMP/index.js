import React from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'

import { S3_PREFIX } from '@shared/constants'
import { playerType, scoreType } from '@utils'
import { allRoutes } from '@shared/constants/allRoutes'

const PlayerCardAMP = ({ data }) => {
  const slug = `${allRoutes.seriesStats(`${data?.oSeries?.oCategory?.oSeo?.sSlug || data?.oSeries?.oSeo?.sSlug}/`)}${data?.eFullType.split('_').join('-')}`
  return (
    <>
      <style jsx amp-custom>{`
    .playerCard{margin-bottom:18px;min-height:calc(100% - 18px);background:#fff;border-radius:16px;overflow:hidden;text-align:center}.playerCard .title{margin-top:0;padding:6px;background:#23272e;color:#fff}.playerCard a{color:inherit;text-decoration:none}.playerCard p{margin-top:0}.playerCard .playerImg{position:relative;background:url(/static/img-back-shape.svg) no-repeat center center/100% auto}.playerCard .imgBlock{margin:0 auto;width:178px;display:block;border:#fff 8px solid;overflow:hidden;border-radius:50%}.playerCard .award{padding:4px;min-width:112px;position:absolute;bottom:0;left:50%;-webkit-transform:translateX(-50%);-ms-transform:translateX(-50%);transform:translateX(-50%);background:#23272e;color:#fff;border-radius:4px}.playerCard .award.purple{background:#692f9e}.playerCard .award.orange{background:#f54820}.playerCard .score{margin:8px 0 2px;font-size:36px;line-height:50px;font-weight:800}@media(max-width: 1399px){.playerCard p{margin-bottom:14px}.playerCard .imgBlock{width:154px}.playerCard .score{font-size:30px;line-height:40px}}@media(max-width: 1199px){.playerCard{min-width:218px}}/*# sourceMappingURL=style.css.map */

      `}
      </style>
      <div className="playerCard text-center me-auto ms-auto">
        <Link href={slug} prefetch={false}><a><p className="title font-semi">{playerType(data?.eType)}</p></a></Link>
        <p className="big-text">
          <b className="text-uppercase">{data?.oPlayer?.eTagStatus === 'a' ? <a href={`/${data?.oPlayer?.oSeo?.sSlug}`} prefetch={false}>{data?.oPlayer?.sFullName || data?.oPlayer?.sFirstName}</a> : data?.oPlayer?.sFullName || data?.oPlayer?.sFirstName}</b> ({data?.oPlayer?.sCountry.toUpperCase()})
        </p>
        <div className="playerImg">
          {data?.oPlayer?.eTagStatus === 'a' ? (
            <a href={`/${data?.oPlayer?.oSeo?.sSlug}`} prefetch={false} className={`imgBlock d-block m-auto rounded-circle ${data?.oPlayer?.eTagStatus === 'a' ? '' : 'disabled'}`}>
              <amp-img
                src={data?.oPlayer?.oImg?.sUrl ? `${S3_PREFIX}${data?.oPlayer?.oImg?.sUrl}` : '/static/player-placeholder.jpg'}
                width="162"
                height="162"
                alt={data?.oPlayer?.oImg?.sText}
                layout="responsive"
              ></amp-img>
            </a>
          ) : (
            <div className="imgBlock d-block m-auto rounded-circle">
              <amp-img
                src={data?.oPlayer?.oImg?.sUrl ? `${S3_PREFIX}${data?.oPlayer?.oImg?.sUrl}` : '/static/player-placeholder.jpg'}
                width="162"
                height="162"
                alt={data?.oPlayer?.oImg?.sText}
                layout="responsive"
              ></amp-img>
            </div>
          )}
        </div>
        <p className="score">
          {data?.eType === 'hrs' && data?.nRuns}
          {data?.eType === 'hs' && data?.nHighest}
          {data?.eType === 'bbf' && data?.sBestInning}
          {data?.eType === 'hwt' && data?.nWickets}
        </p>
        <p className="big-text text-secondary">{scoreType(data?.eType)}</p>
      </div>
    </>
  )
}
PlayerCardAMP.propTypes = {
  data: PropTypes.object
}

export default PlayerCardAMP
