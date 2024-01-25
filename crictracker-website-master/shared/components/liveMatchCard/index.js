import React from 'react'
import styles from './style.module.scss'
import PropTypes from 'prop-types'
import { Badge } from 'react-bootstrap'
import dynamic from 'next/dynamic'
import Trans from 'next-translate/Trans'

import FlagTeam from '@assets/images/placeholder/flag-placeholder.png'
import { S3_PREFIX } from '@shared/constants'
import { badgeColorDecide, convertDate, dateCheck } from '@shared/utils'
import { allRoutes } from '@shared/constants/allRoutes'
import CustomLink from '../customLink'

const MyImage = dynamic(() => import('@shared/components/myImage'))

function LiveMatchCard({ data }) {
  const handleClick = (value) => {
    if (value?.sStatusStr === 'live') return allRoutes.matchDetailCommentary(value?.oSeo?.sSlug)
    else if (value?.sStatusStr === 'scheduled') return allRoutes.matchDetail(value?.oSeo?.sSlug)
    else if (value?.sStatusStr === 'completed' || value?.sStatusStr === 'cancelled') return allRoutes.matchDetailScorecard(`/${value?.oSeo?.sSlug}/`)
  }
  return (
    <div className={`${styles.liveMatchCard} d-flex flex-column align-items-center mb-2 position-relative light-bg br-lg px-md-3 px-sm-2 py-sm-2 ${data?.sStatusStr === 'scheduled' ? 'pt-2' : ''}`} >
      <div
        className={`w-100 position-relative d-flex ${data?.sStatusStr === 'scheduled' ? 'flex-wrap flex-sm-nowrap' : 'flex-column flex-sm-row'} ${data?.sStatusStr === 'scheduled' && styles.upcoming} align-items-sm-center justify-content-between`}
      >
        <CustomLink href={handleClick(data)} passHref>
          <a className={`${styles.scoreCardLink} position-absolute w-100 h-100 start-0 top-0 opacity-0`}>{data?.oSeries?.sTitle}</a>
        </CustomLink>
        <div className={`${styles.team} flex-shrink-0 text-start mb-2 mb-sm-0`}>
          <div className={`${styles.name} d-flex align-items-center`}>
            <div className={`${styles.teamImg} flex-shrink-0  rounded-circle overflow-hidden`}>
              <MyImage
                src={data?.oTeamScoreA?.oTeam?.oImg?.sUrl ? `${S3_PREFIX}${data?.oTeamScoreA?.oTeam?.oImg?.sUrl}` : FlagTeam}
                alt={data?.oTeamScoreA?.oTeam?.sAbbr}
                width="20"
                height="20"
                layout="responsive"
                sizes="(max-width: 767px) 24px, (max-width: 991px) 24px, (max-width: 1190px) 24px, 24px"
              />
            </div>
            <div className="d-flex align-items-center align-items-sm-start flex-sm-column flex-grow-1 flex-sm-grow-0 justify-content-between justify-content-sm-start">
              <b className="mx-1">{data?.oTeamScoreA?.oTeam?.sAbbr}</b>
              <p className={`${styles.score} font-semi mt-md-1`}>
                {data?.nLatestInningNumber === 1 &&
                  (data?.oTeamScoreA?.sScoresFull ? (
                    <b className="theme-text mx-1">{data?.oTeamScoreA?.sScoresFull}</b>
                  ) : (
                    <b className="mx-1"><Trans i18nKey="common:YetToBat" /></b>
                  ))}
                {data?.nLatestInningNumber > 1 &&
                  (data?.oTeamScoreA?.sScoresFull?.includes('*') ? (
                    <b className="theme-text mx-1">{data?.oTeamScoreA?.sScoresFull}</b>
                  ) : (
                    <b className="mx-1">{data?.oTeamScoreA?.sScoresFull}</b>
                  ))}
              </p>
            </div>
          </div>
        </div>
        <div className={`${styles.info} ${data?.sStatusStr === 'scheduled' ? 'text-center' : 'text-start text-sm-center'}`}>
          <Badge bg={badgeColorDecide(data?.sStatusStr)} className={`${styles.badge} live mb-1  ${data?.sStatusStr === 'scheduled' ? 'top-0' : ''}`}>
            {data?.sStatusStr === 'completed' && <span>{data?.sLiveGameStatusStr === 'none' ? <Trans i18nKey="common:Result" /> : data?.sLiveGameStatusStr} </span>}
            {data?.sStatusStr === 'live' && <span>{(data?.sLiveGameStatusStr === 'none' || data?.sLiveGameStatusStr === 'playing ongoing' || data?.sLiveGameStatusStr === 'innings break') ? <Trans i18nKey="common:Live" /> : data?.sLiveGameStatusStr} </span>}
            {data?.sStatusStr === 'scheduled' && <span><Trans i18nKey="common:Upcoming" /></span>}
          </Badge>
          {data?.sStatusStr === 'scheduled' && (
            <>
              <p className="d-inline d-sm-block">{data?.sSubtitle}, {data?.oVenue?.sLocation}</p>
              <p className="d-inline d-sm-block"><Trans i18nKey="common:MatchStartsAt" /> {convertDate(dateCheck(data?.dStartDate))}</p>
            </>
          )}
          {data?.sStatusStr !== 'scheduled' && (
            <p className="medium-text d-inline d-sm-block">{data?.sStatusNote}</p>
          )}
        </div>
        <div className={`${styles.team} flex-shrink-0 text-end mb-2 mb-sm-0`}>
          <div className={`${styles.name} d-flex align-items-center justify-content-end ${data?.sStatusStr !== 'scheduled' && 'flex-row-reverse flex-sm-row'}`}>
            <div className={`d-flex align-items-center align-items-sm-end flex-sm-column ${data?.sStatusStr !== 'scheduled' && 'flex-grow-1 flex-sm-grow-0'} justify-content-between justify-content-sm-center`}>
              <b className="mx-1">{data?.oTeamScoreB?.oTeam?.sAbbr}</b>
              <p className={`${styles.score} font-semi`}>
                {data?.nLatestInningNumber === 1 &&
                  (data?.oTeamScoreB?.sScoresFull ? (
                    <b className="theme-text mx-1">{data?.oTeamScoreB?.sScoresFull}</b>
                  ) : (
                    <b className="mx-1"><Trans i18nKey="common:YetToBat" /></b>
                  ))}
                {data?.nLatestInningNumber > 1 &&
                  (data?.oTeamScoreB?.sScoresFull?.includes('*') ? (
                    <b className="theme-text mx-1">{data?.oTeamScoreB?.sScoresFull}</b>
                  ) : (
                    <b className="mx-1">{data?.oTeamScoreB?.sScoresFull}</b>
                  ))}
              </p>
            </div>
            <div className={`${styles.teamImg} flex-shrink-0 rounded-circle overflow-hidden`}>
              <MyImage
                src={data?.oTeamScoreB?.oTeam?.oImg?.sUrl ? `${S3_PREFIX}${data?.oTeamScoreB?.oTeam?.oImg?.sUrl}` : FlagTeam}
                alt={data?.oTeamScoreB?.oTeam?.sAbbr}
                width="20"
                height="20"
                layout="responsive"
                sizes="(max-width: 767px) 24px, (max-width: 991px) 24px, (max-width: 1190px) 24px, 24px"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

LiveMatchCard.propTypes = {
  data: PropTypes.object
}

export default LiveMatchCard
