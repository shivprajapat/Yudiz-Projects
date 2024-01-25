import React, { useState } from 'react'
import PropTypes from 'prop-types'
import FlagTeam from '@assets/images/placeholder/flag-placeholder.png'
import dynamic from 'next/dynamic'
import { S3_PREFIX } from '@shared/constants'
import { badgeColorDecide, convertDate, dateCheck, formatScoreData } from '@shared/utils'
import { useSubscription } from '@apollo/client'
import { GET_CUSTOM_SCORE_SUBSCRIPTION } from '@graphql/article/article.subscription'
import { GET_MATCH_HEADER } from '@graphql/match/match.subscription'
import { Badge } from 'react-bootstrap'
import Trans from 'next-translate/Trans'
import styles from './style.module.scss'
import CustomLink from '@shared/components/customLink'
import { allRoutes } from '@shared/constants/allRoutes'

const MyImage = dynamic(() => import('@shared/components/myImage'))

function EventMatchCard({ data, liveEventId }) {
  const [liveBlogData, setLiveBlogsData] = useState(data?.iMatchId ? data.oMatch : formatScoreData(data.oTeams))

  useSubscription(data?.iMatchId ? GET_MATCH_HEADER : GET_CUSTOM_SCORE_SUBSCRIPTION, {
    variables: { input: data?.iMatchId ? { iMatchId: data?.iMatchId } : { iEventId: liveEventId } },
    skip: typeof window === 'undefined',
    onSubscriptionData: ({ subscriptionData }) => {
      const md = subscriptionData?.data?.getMatchBySlug?.oMatchDetailsFront
      if (md) {
        setLiveBlogsData({
          ...liveBlogData,
          ...md,
          oTeamScoreA: { ...liveBlogData?.oTeamScoreA, ...md?.oTeamScoreA },
          oTeamScoreB: { ...liveBlogData?.oTeamScoreB, ...md?.oTeamScoreB }
        })
      } else if (subscriptionData?.data?.getLiveMatchScore?.oTeams) {
        setLiveBlogsData(formatScoreData(subscriptionData?.data?.getLiveMatchScore?.oTeams))
      }
    }
  })
  const handleClick = (value) => {
    if (value?.sStatusStr === 'live') return allRoutes.matchDetailCommentary(value?.oSeo?.sSlug)
    else if (value?.sStatusStr === 'scheduled') return allRoutes.matchDetail(value?.oSeo?.sSlug)
    else if (value?.sStatusStr === 'completed' || value?.sStatusStr === 'cancelled') return allRoutes.matchDetailScorecard(`/${value?.oSeo?.sSlug}/`)
  }

  return (
    <div className={`${styles.eventMatchCard} d-flex flex-column align-items-center mb-2 br-lg position-relative overflow-hidden`} >
      {liveBlogData?.oSeo?.sSlug ? <CustomLink href={handleClick(liveBlogData)} passHref>
        <a className={`${styles.scoreCardLink} position-absolute h-100 w-100 start-0 top-0 bg-transparent`}></a>
      </CustomLink> : null}
      <div className="w-100 d-flex align-items-center justify-content-between">
        <div className={`${styles.team} flex-shrink-0 text-start`}>
          <div className={`${styles.name} d-flex align-items-center`}>
            <div className={styles.teamImg}>
              <MyImage
                src={liveBlogData?.oTeamScoreA?.oTeam?.oImg?.sUrl ? `${S3_PREFIX}${liveBlogData?.oTeamScoreA?.oTeam?.oImg?.sUrl}` : FlagTeam}
                alt={liveBlogData?.oTeamScoreA?.oTeam?.sAbbr}
                width="20"
                height="20"
                layout="responsive"
                sizes="(max-width: 767px) 24px, (max-width: 991px) 24px, (max-width: 1190px) 200px, 24px"
              />
            </div>
            <div className={`${styles.nameContent} d-flex flex-column`}>
              <b>{liveBlogData?.oTeamScoreA?.oTeam?.sAbbr}</b>
              {liveBlogData?.oTeamScoreA?.sScoresFull ? <p className={`${styles.score} font-semi small-text mt-1`}>
                <b>{liveBlogData?.oTeamScoreA?.sScoresFull}</b>
              </p> : null}
            </div>
          </div>
        </div>
        <div className={`${styles.info} text-center`}>
          {data?.iMatchId ? <>
            <Badge bg={badgeColorDecide(liveBlogData?.sStatusStr)} className="live mb-1">
              {liveBlogData?.sStatusStr === 'completed' && <span>{liveBlogData?.sLiveGameStatusStr === 'none' ? <Trans i18nKey="common:Result" /> : liveBlogData?.sLiveGameStatusStr} </span>}
              {liveBlogData?.sStatusStr === 'live' && <span>{(liveBlogData?.sLiveGameStatusStr === 'none' || liveBlogData?.sLiveGameStatusStr === 'playing ongoing' || liveBlogData?.sLiveGameStatusStr === 'innings break') ? <Trans i18nKey="common:Live" /> : liveBlogData?.sLiveGameStatusStr} </span>}
              {liveBlogData?.sStatusStr === 'scheduled' && <span><Trans i18nKey="common:Upcoming" /></span>}
            </Badge>
            <p>{liveBlogData?.sSubtitle}, {liveBlogData?.oVenue?.sLocation}</p>
            {liveBlogData?.sStatusStr === 'scheduled' && (
              <p className={styles.MatchStartsAt} ><Trans i18nKey="common:MatchStartsAt" /> {convertDate(dateCheck(liveBlogData?.dStartDate))}</p>
            )}
          </> : null}
          {<p className={`${styles.statusNote} large-text`}>{liveBlogData?.sStatusNote}</p>}
        </div>
        <div className={`${styles.team} flex-shrink-0 text-end`}>
          <div className={`${styles.name} ${styles.teamB} d-flex align-items-center justify-content-end`}>
            <div className={`${styles.nameContent} d-flex flex-column`}>
              <b>{liveBlogData?.oTeamScoreB?.oTeam?.sAbbr}</b>
              {liveBlogData?.oTeamScoreB?.sScoresFull ? <p className={`${styles.score} font-semi small-text mt-1`}>
                <b>{liveBlogData?.oTeamScoreB?.sScoresFull}</b>
              </p> : null}
            </div>
            <div className={styles.teamImg}>
              <MyImage
                src={liveBlogData?.oTeamScoreB?.oTeam?.oImg?.sUrl ? `${S3_PREFIX}${liveBlogData?.oTeamScoreB?.oTeam?.oImg?.sUrl}` : FlagTeam}
                alt={liveBlogData?.oTeamScoreB?.oTeam?.sAbbr}
                width="20"
                height="20"
                layout="responsive"
                sizes="(max-width: 767px) 24px, (max-width: 991px) 24px, (max-width: 1190px) 200px, 24px"
              />
            </div>
          </div>
        </div>
      </div>
      {<p className={`${styles.alterStatusNote} medium-text mt-2`}>{liveBlogData?.sStatusNote}</p>}
    </div >
  )
}

EventMatchCard.propTypes = {
  data: PropTypes.object,
  liveEventId: PropTypes.string
}

export default EventMatchCard
