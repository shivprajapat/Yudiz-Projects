import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import { playerType, scoreType } from '@utils'
// import { allRoutes } from '@shared/constants/allRoutes'
import CustomLink from '../customLink'

const PlayerImg = dynamic(() => import('@shared/components/playerImg'))

const PlayerCard = ({ data, subPagesURLS }) => {
  // const slug = `${allRoutes.seriesStats(`${data?.oSeries?.oCategory?.oSeo?.sSlug || data?.oSeries?.oSeo?.sSlug}/`)}${data?.eFullType?.split('_').join('-')}`
  const slug = `/${subPagesURLS[data?.oSeriesStatsTypes?.eSubType]?.sSlug}/`
  return (
    <div className={`${styles.playerCard} light-bg text-center br-lg mx-auto overflow-hidden`}>
      <CustomLink href={slug} prefetch={false}><a><p className={`${styles.title} p-2 font-semi`}>{playerType(data?.eType)}</p></a></CustomLink>
      <p className="big-text">
        <b className="text-uppercase">{data?.oPlayer?.eTagStatus === 'a' ? <CustomLink href={`/${data?.oPlayer?.oSeo?.sSlug}/`} prefetch={false}><a>{data?.oPlayer?.sFullName || data?.oPlayer?.sFirstName}</a></CustomLink> : data?.oPlayer?.sFullName || data?.oPlayer?.sFirstName}</b> ({data?.oPlayer?.sCountry.toUpperCase()})
      </p>
      <div className={`${styles.playerImg} position-relative`}>
        {data?.oPlayer?.eTagStatus === 'a' ? (
          <CustomLink href={`/${data?.oPlayer?.oSeo?.sSlug}/`} prefetch={false}>
            <a className={`${styles.imgBlock} d-block m-auto rounded-circle overflow-hidden ${data?.oPlayer?.eTagStatus === 'a' ? '' : 'disabled'}`}>
              <PlayerImg
                head={data?.oPlayer?.oImg}
                jersey={data?.oTeam?.oJersey}
                enableBg
              />
            </a>
          </CustomLink>
        ) : (
          <div className={`${styles.imgBlock} d-block m-auto rounded-circle overflow-hidden`}>
            <PlayerImg
              head={data?.oPlayer?.oImg}
              jersey={data?.oTeam?.oJersey}
              enableBg
            />
          </div>
        )}
      </div>
      <p className={`${styles.score} mt-2 mb-0`}>
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
  data: PropTypes.object,
  subPagesURLS: PropTypes.object
}

export default PlayerCard
