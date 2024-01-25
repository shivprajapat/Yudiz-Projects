import React from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import { S3_PREFIX } from '@shared/constants'
import { playerType, scoreType } from '@utils'
import playerImg from '@assets/images/placeholder/player-placeholder.jpg'
import { allRoutes } from '@shared/constants/allRoutes'

const MyImage = dynamic(() => import('@shared/components/myImage'))

const PlayerCard = ({ data }) => {
  const slug = `${allRoutes.seriesStats(`${data?.oSeries?.oCategory?.oSeo?.sSlug || data?.oSeries?.oSeo?.sSlug}/`)}${data?.eFullType.split('_').join('-')}`
  return (
    <div className={`${styles.playerCard} text-center me-auto ms-auto`}>
      <Link href={slug} prefetch={false}><a><p className={`${styles.title} font-semi`}>{playerType(data?.eType)}</p></a></Link>
      <p className="big-text">
        <b className="text-uppercase">{data?.oPlayer?.eTagStatus === 'a' ? <Link href={`/${data?.oPlayer?.oSeo?.sSlug}`} prefetch={false}><a>{data?.oPlayer?.sFullName || data?.oPlayer?.sFirstName}</a></Link> : data?.oPlayer?.sFullName || data?.oPlayer?.sFirstName}</b> ({data?.oPlayer?.sCountry.toUpperCase()})
      </p>
      <div className={styles.playerImg}>
        {data?.oPlayer?.eTagStatus === 'a' ? (
          <Link href={`/${data?.oPlayer?.oSeo?.sSlug}`} prefetch={false}>
            <a className={`${styles.imgBlock} d-block m-auto rounded-circle ${data?.oPlayer?.eTagStatus === 'a' ? '' : 'disabled'}`}>
              <MyImage
                src={data?.oPlayer?.oImg?.sUrl ? `${S3_PREFIX}${data?.oPlayer?.oImg?.sUrl}` : playerImg}
                width="162"
                height="162"
                alt={data?.oPlayer?.oImg?.sText}
                layout="responsive"
              />
            </a>
          </Link>
        ) : (
          <div className={`${styles.imgBlock} d-block m-auto rounded-circle`}>
            <MyImage
              src={data?.oPlayer?.oImg?.sUrl ? `${S3_PREFIX}${data?.oPlayer?.oImg?.sUrl}` : playerImg}
              width="162"
              height="162"
              alt={data?.oPlayer?.oImg?.sText}
              layout="responsive"
            />
          </div>
        )}
      </div>
      <p className={styles.score}>
        {data?.eType === 'hrs' && data?.nRuns}
        {data?.eType === 'hs' && data?.nHighest}
        {data?.eType === 'bbf' && data?.sBestInning}
        {data?.eType === 'hwt' && data?.nWickets}
      </p>
      <p className={`${styles.stype} big-text text-secondary`}>{scoreType(data?.eType)}</p>
    </div>
  )
}
PlayerCard.propTypes = {
  data: PropTypes.object
}

export default PlayerCard
