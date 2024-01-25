import React from 'react'
import styles from './style.module.scss'
import PropTypes from 'prop-types'
import { Badge } from 'react-bootstrap'

import FlagTeam from '@assets/images/placeholder/flag-placeholder.png'
import dynamic from 'next/dynamic'
import { S3_PREFIX } from '@shared/constants'
import Trans from 'next-translate/Trans'
import { badgeColorDecide } from '@shared/utils'
import useWindowSize from '@shared/hooks/windowSize'
import { allRoutes } from '@shared/constants/allRoutes'
import { useRouter } from 'next/router'

const MyImage = dynamic(() => import('@shared/components/myImage'))

function LiveMatchCard({ data }) {
  const router = useRouter()
  const [width] = useWindowSize()

  const handleClick = (value) => {
    if (value?.sStatusStr === 'live') router.push(allRoutes.matchDetailCommentary(value?.oSeo?.sSlug))
    else if (value?.sStatusStr === 'scheduled') router.push(allRoutes.matchDetail(value?.oSeo?.sSlug))
    else if (value?.sStatusStr === 'completed' || value?.sStatusStr === 'cancelled') router.push(allRoutes.matchDetailScorecard(`/${value?.oSeo?.sSlug}/`))
  }
  return (
    <div role="button" className={`${styles.liveMatchCard} d-flex flex-column align-items-center`} onClick={() => handleClick(data)}>
      <div className="w-100 d-flex align-items-center justify-content-between">
        <div className={`${styles.team} flex-shrink-0 text-start`}>
          <div className={`${styles.name} d-flex align-items-center ${width < 767 && 'flex-column'}`}>
            <div className={styles.teamImg}>
              <MyImage
                src={data?.oTeamScoreA?.oTeam?.oImg?.sUrl ? `${S3_PREFIX}${data?.oTeamScoreA?.oTeam?.oImg?.sUrl}` : FlagTeam}
                alt={data?.oTeamScoreA?.oTeam?.sAbbr}
                width="20"
                height="20"
                layout="responsive"
                sizes="(max-width: 767px) 24px, (max-width: 991px) 24px, (max-width: 1190px) 200px, 24px"
              />
            </div>
            <div className={`d-flex flex-column ${width < 767 && 'align-items-center mt-2 text-nowrap'}`}>
              <b>{data?.oTeamScoreA?.oTeam?.sAbbr}</b>
              <p className={`${styles.score} font-semi`}>
                {data?.nLatestInningNumber === 1 &&
                  (data?.oTeamScoreA?.sScoresFull ? (
                    <b className={'theme-text'}>{data?.oTeamScoreA?.sScoresFull}</b>
                  ) : (
                    <b><Trans i18nKey="common:YetToBat" /></b>
                  ))}
                {data?.nLatestInningNumber > 1 &&
                  (data?.oTeamScoreA?.sScoresFull?.includes('*') ? (
                    <b className={'theme-text'}>{data?.oTeamScoreA?.sScoresFull}</b>
                  ) : (
                    <b>{data?.oTeamScoreA?.sScoresFull}</b>
                  ))}
              </p>
            </div>
          </div>
        </div>
        <div className={`${styles.info} text-center`}>
          <Badge bg={badgeColorDecide(data?.sStatusStr)} className="live mb-1">
            {data?.sStatusStr === 'completed' && <span>{data?.sLiveGameStatusStr === 'none' ? <Trans i18nKey="common:Result" /> : data?.sLiveGameStatusStr} </span>}
            {data?.sStatusStr === 'live' && <span>{(data?.sLiveGameStatusStr === 'none' || data?.sLiveGameStatusStr === 'playing ongoing' || data?.sLiveGameStatusStr === 'innings break') ? <Trans i18nKey="common:Live" /> : data?.sLiveGameStatusStr} </span>}
            {data?.sStatusStr === 'scheduled' && <span><Trans i18nKey="common:Upcoming" /></span>}
          </Badge>
          <p>{data?.sSubtitle}, {data?.oVenue?.sLocation}</p>
          {width >= 767 && <p className="medium-text">{data?.sStatusNote}</p>}
        </div>
        <div className={`${styles.team} flex-shrink-0 text-end`}>
          <div className={`${styles.name} d-flex align-items-center justify-content-end ${width < 767 && 'flex-column flex-column-reverse'}`}>
            <div className={`d-flex flex-column ${width < 767 && 'align-items-center mt-2 text-nowrap'}`}>
              <b>{data?.oTeamScoreB?.oTeam?.sAbbr}</b>
              <p className={`${styles.score} font-semi`}>
                {data?.nLatestInningNumber === 1 &&
                  (data?.oTeamScoreB?.sScoresFull ? (
                    <b className={'theme-text'}>{data?.oTeamScoreB?.sScoresFull}</b>
                  ) : (
                    <b><Trans i18nKey="common:YetToBat" /></b>
                  ))}
                {data?.nLatestInningNumber > 1 &&
                  (data?.oTeamScoreB?.sScoresFull?.includes('*') ? (
                    <b className={'theme-text'}>{data?.oTeamScoreB?.sScoresFull}</b>
                  ) : (
                    <b>{data?.oTeamScoreB?.sScoresFull}</b>
                  ))}
              </p>
            </div>
            <div className={styles.teamImg}>
              <MyImage
                src={data?.oTeamScoreB?.oTeam?.oImg?.sUrl ? `${S3_PREFIX}${data?.oTeamScoreB?.oTeam?.oImg?.sUrl}` : FlagTeam}
                alt={data?.oTeamScoreB?.oTeam?.sAbbr}
                width="20"
                height="20"
                layout="responsive"
                sizes="(max-width: 767px) 24px, (max-width: 991px) 24px, (max-width: 1190px) 200px, 24px"
              />
            </div>
          </div>
        </div>
      </div>
      {width < 767 && <p className="medium-text mt-2">{data?.sStatusNote}</p>}
    </div>
  )
}

LiveMatchCard.propTypes = {
  data: PropTypes.object
}

export default LiveMatchCard
