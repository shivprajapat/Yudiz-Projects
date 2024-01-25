import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { Badge } from 'react-bootstrap'

import { useRouter } from 'next/router'
import styles from './style.module.scss'
import FlagTeam from '@assets/images/placeholder/flag-placeholder.png'

import useTranslation from 'next-translate/useTranslation'
import { S3_PREFIX } from '@shared/constants'
import Trans from 'next-translate/Trans'
import { useQuery, useSubscription } from '@apollo/client'
import { GET_MATCH_HEADER, MATCH_DETAIL_FOR_CLIENT } from '@graphql/match/match.subscription'
import { CupIcon } from '@shared/components/ctIcons'
import { WPL_TEAM_NAME_WITH_ID } from '@shared/libs/daily-hunt'
import GlobalEventsContext from '@shared/components/global-events/GlobalEventsContext'
import CustomLink from '@shared/components/customLink'

const Header = dynamic(() => import('./header'))
const MyImage = dynamic(() => import('@shared/components/myImage'))
function Result({ data, liveScoreData = [], currentTab, showShareBtn, isDailyHuntMode }) {
  const router = useRouter()
  const [liveData, setLiveData] = useState(data)
  const { data: updatedData } = useSubscription(GET_MATCH_HEADER, { variables: { input: { iMatchId: data?._id } } })
  const { t } = useTranslation()
  const currentTeamData = ['completed', 'cancelled'].includes(data.sStatusStr) ? data?.aInning[0] : data?.aInning[data?.aInning.length - 1]
  const currentBattingTeamId = currentTeamData?.iBattingTeamId
  const isCurrentBatting = currentBattingTeamId === data?.oTeamScoreA?.oTeam?._id
  const teamOne = isCurrentBatting ? 'oTeamScoreA' : 'oTeamScoreB'
  const teamTwo = isCurrentBatting ? 'oTeamScoreB' : 'oTeamScoreA'
  const { stateGlobalEvents } = useContext(GlobalEventsContext)

  // Remove once proxy cache issue fixed (temporary)
  useQuery(MATCH_DETAIL_FOR_CLIENT, {
    variables: { input: { _id: data?._id } },
    onCompleted: (data) => {
      if (data?.getMatchById) {
        setLiveData({
          ...liveData,
          ...data?.getMatchById,
          oTeamScoreA: { ...liveData?.oTeamScoreA, ...data?.getMatchById?.oTeamScoreA },
          oTeamScoreB: { ...liveData?.oTeamScoreB, ...data?.getMatchById?.oTeamScoreB }
        })
      }
    }
  })

  useEffect(() => {
    if (updatedData?.getMatchBySlug?.oMatchDetailsFront) {
      const md = updatedData?.getMatchBySlug?.oMatchDetailsFront
      setLiveData({
        ...liveData,
        ...md,
        oTeamScoreA: { ...liveData?.oTeamScoreA, ...md?.oTeamScoreA },
        oTeamScoreB: { ...liveData?.oTeamScoreB, ...md?.oTeamScoreB }
      })
    }
  }, [updatedData])

  useEffect(() => {
    setLiveData(data)
  }, [data])

  useEffect(async () => { // Live document title
    const checkIsGlanceView = (await import('@shared/utils')).checkIsGlanceView
    const isGlanceView = checkIsGlanceView(router?.query)

    if (!isGlanceView) {
      const { matchDetailTabSlug } = (await import('@shared/constants/allRoutes'))
      if (!matchDetailTabSlug.includes(currentTab)) {
        const { setMatchDetailTabTitle } = (await import('@shared/libs/match-detail'))
        const liveInning = stateGlobalEvents?.liveInning?.aActiveBatters ? stateGlobalEvents?.liveInning : liveScoreData[0]
        const title = setMatchDetailTabTitle(liveData, liveInning, isCurrentBatting)
        if (title) document.title = title
        // document.querySelector('title').textContent = title
      }
    }
  }, [liveData, currentTab, stateGlobalEvents])

  function getTeamName(key) { // For daily hunt change original team name bcz of copyright
    const name = WPL_TEAM_NAME_WITH_ID[data[key]?.oTeam?._id] || data[key]?.oTeam?.sAbbr
    return (
      <p className="big-text font-semi">
        {isDailyHuntMode ? name : data[key]?.oTeam?.sAbbr}
        {data?.sStatusStr === 'completed' && data[key]?.oTeam?._id === data?.oWinner?._id && (
          <span className={`${styles.winner} ms-2`}><CupIcon /></span>
        )}
      </p>
    )
  }

  function getMatchStatus() {
    if (data?.sStatusStr === 'live') {
      if ((data?.sLiveGameStatusStr === 'none' || data?.sLiveGameStatusStr === 'playing ongoing' || data?.sLiveGameStatusStr === 'innings break')) {
        return <Trans i18nKey="common:Live" />
      } else return liveData?.sLiveGameStatusStr
    } else if (data?.sStatusStr === 'completed') {
      return <Trans i18nKey="common:Result" />
    } else if (data?.sStatusStr === 'cancelled') {
      return <Trans i18nKey="common:Cancelled" />
    }
  }

  function getScore(key) {
    if (liveData[key]?.sScoresFull) {
      const textClass = liveData?.nLatestInningNumber === 1 ? 'text-primary' : liveData[key]?.sScoresFull?.includes('*') ? 'text-primary' : 'text-secondary'
      return <p className={`${styles.score} ${textClass} big-text font-semi`}>{liveData[key]?.sScoresFull}</p>
    } else {
      return <p className={`${styles.score} big-text text-secondary font-semi`}>{t('common:YetToBat')}</p>
    }
  }

  return (
    <>
      <Header data={data} showShareBtn={showShareBtn} />
      <div className={`${styles.matchInfo} py-2 px-2 px-md-3 px-xl-4 light-bg d-md-flex br-md mb-01 top-0`}>
        <div className={`${styles.teams} flex-grow-1 mt-sm-1`}>
          <div className="d-flex align-items-center">
            <Badge bg={data?.sStatusStr === 'completed' ? 'success' : 'danger'} className={`${styles.badge} live me-1 me-sm-2 me-xl-3`}>
              <span>{getMatchStatus()}</span>
            </Badge>
            <span className="d-block overflow-hidden text-nowrap t-ellipsis">{liveData?.sStatusNote || liveData?.sLiveMatchNote}</span>
          </div>
          <div className={`${styles.team} d-flex align-items-center justify-content-between justify-content-md-start flex-shrink-0 mt-3 mt-md-3 mb-1`}>
            <div className={`${styles.name} d-flex align-items-center`}>
              <div className={`${styles.flag}`}>
                <MyImage
                  src={data[teamOne]?.oTeam?.oImg?.sUrl ? `${S3_PREFIX}${data[teamOne]?.oTeam?.oImg?.sUrl}` : FlagTeam}
                  alt={data[teamOne]?.oTeam?.sAbbr}
                  layout="responsive"
                  width="20"
                  height="20"
                  sizes="(max-width: 767px) 24px, (max-width: 991px) 24px, (max-width: 1190px) 200px, 24px"
                />
              </div>
              {getTeamName(teamOne)}
              {/* {isCurrentBatting ? <p className="big-text font-semi">
                  {isDailyHuntMode ? WPL_TEAM_NAME_ABBR[data?.oTeamScoreA?.oTeam?.sAbbr] : data?.oTeamScoreA?.oTeam?.sAbbr}
                  {data?.sStatusStr === 'completed' && data?.oTeamScoreA?.oTeam?._id === data?.oWinner?._id && <span className={`${styles.winner} ms-2`}><CupIcon /></span>}
                </p> : <p className="big-text font-semi">
                  {isDailyHuntMode ? WPL_TEAM_NAME_ABBR[data?.oTeamScoreB?.oTeam?.sAbbr] : data?.oTeamScoreB?.oTeam?.sAbbr}
                  {data?.sStatusStr === 'completed' && data?.oTeamScoreB?.oTeam?._id === data?.oWinner?._id && <span className={`${styles.winner} ms-2`}><CupIcon /></span>}
                </p>} */}
            </div>
            {getScore(teamOne)}
            {/* {isCurrentBatting ? (
                liveData?.nLatestInningNumber === 1 && (liveData?.oTeamScoreA?.sScoresFull ? (
                  <p className={`${styles.score} big-text text-primary font-semi`}>{liveData?.oTeamScoreA?.sScoresFull}</p>
                ) : (
                  <p className={`${styles.score} big-text text-secondary font-semi`}>{t('common:YetToBat')}</p>
                ))
              ) : liveData?.nLatestInningNumber === 1 && (liveData?.oTeamScoreB?.sScoresFull ? (
                <p className={`${styles.score} big-text text-primary font-semi`}>{liveData?.oTeamScoreB?.sScoresFull}</p>
              ) : (
                <p className={`${styles.score} big-text text-secondary font-semi`}>{t('common:YetToBat')}</p>
              ))}
              {isCurrentBatting ? liveData?.nLatestInningNumber > 1 &&
                (liveData?.oTeamScoreA?.sScoresFull?.includes('*') ? (
                  <p className={`${styles.score} big-text text-primary font-semi`}>{liveData?.oTeamScoreA?.sScoresFull}</p>
                ) : (
                  <p className={`${styles.score} big-text text-secondary font-semi`}>{liveData?.oTeamScoreA?.sScoresFull}</p>
                )) : liveData?.nLatestInningNumber > 1 &&
              (liveData?.oTeamScoreB?.sScoresFull?.includes('*') ? (
                <p className={`${styles.score} big-text text-primary font-semi`}>{liveData?.oTeamScoreB?.sScoresFull}</p>
              ) : (
                <p className={`${styles.score} big-text text-secondary font-semi`}>{liveData?.oTeamScoreB?.sScoresFull}</p>
              ))} */}
          </div>
          <div className={`${styles.team} d-flex align-items-center justify-content-between justify-content-md-start flex-shrink-0 mt-3 mt-md-3 mb-1`}>
            <div className={`${styles.name} d-flex align-items-center`}>
              <div className={`${styles.flag}`}>
                <MyImage
                  src={data[teamTwo]?.oTeam?.oImg?.sUrl ? `${S3_PREFIX}${data[teamTwo]?.oTeam?.oImg?.sUrl}` : FlagTeam}
                  alt={data[teamTwo]?.oTeam?.sAbbr}
                  layout="responsive"
                  width="20"
                  height="20"
                  sizes="(max-width: 767px) 24px, (max-width: 991px) 24px, (max-width: 1190px) 200px, 24px"
                />
              </div>
              {getTeamName(teamTwo)}
              {/* {!isCurrentBatting ? <p className="big-text font-semi">
                  {isDailyHuntMode ? WPL_TEAM_NAME_ABBR[data?.oTeamScoreA?.oTeam?.sAbbr] : data?.oTeamScoreA?.oTeam?.sAbbr}
                  {data?.sStatusStr === 'completed' && data?.oTeamScoreA?.oTeam?._id === data?.oWinner?._id && <span className={`${styles.winner} ms-2 d-inline-block`}><CupIcon /></span>}
                </p> : <p className="big-text font-semi">
                  {isDailyHuntMode ? WPL_TEAM_NAME_ABBR[data?.oTeamScoreB?.oTeam?.sAbbr] : data?.oTeamScoreB?.oTeam?.sAbbr}
                  {data?.sStatusStr === 'completed' && data?.oTeamScoreB?.oTeam?._id === data?.oWinner?._id && <span className={`${styles.winner} ms-2 d-inline-block`}><CupIcon /></span>}
                </p>} */}
            </div>
            <div>
              {getScore(teamTwo)}
              {/* {!isCurrentBatting ? liveData?.nLatestInningNumber === 1 &&
                  (liveData?.oTeamScoreA?.sScoresFull ? (
                    <p className={`${styles.score} big-text text-primary font-semi`}>{liveData?.oTeamScoreA?.sScoresFull}</p>
                  ) : (
                    <p className={`${styles.score} big-text text-secondary font-semi`}>{t('common:YetToBat')}</p>
                  )) : liveData?.nLatestInningNumber === 1 &&
                (liveData?.oTeamScoreB?.sScoresFull ? (
                  <p className={`${styles.score} big-text text-primary font-semi`}>{liveData?.oTeamScoreB?.sScoresFull}</p>
                ) : (
                  <p className={`${styles.score} big-text text-secondary font-semi`}>{t('common:YetToBat')}</p>
                ))}
                {!isCurrentBatting ? liveData?.nLatestInningNumber > 1 &&
                  (liveData?.oTeamScoreA?.sScoresFull?.includes('*') ? (
                    <p className={`${styles.score} big-text text-primary font-semi`}>{liveData?.oTeamScoreA?.sScoresFull}</p>
                  ) : (
                    <p className={`${styles.score} big-text text-secondary font-semi`}>{liveData?.oTeamScoreA?.sScoresFull}</p>
                  )) : liveData?.nLatestInningNumber > 1 &&
                (liveData?.oTeamScoreB?.sScoresFull?.includes('*') ? (
                  <p className={`${styles.score} big-text text-primary font-semi`}>{liveData?.oTeamScoreB?.sScoresFull}</p>
                ) : (
                  <p className={`${styles.score} big-text text-secondary font-semi`}>{liveData?.oTeamScoreB?.sScoresFull}</p>
                ))} */}
            </div>
          </div>
        </div>
        <div className={`${styles.info} text-md-end`}>
          {data?.sStatusStr === 'live' && (
            <p className="text-secondary">
              {liveData?.oLiveScore?.nRunrate > 0 && t('common:CurrentRunRate') + ' : ' + liveData?.oLiveScore?.nRunrate}
              {liveData?.oLiveScore?.sRequiredRunrate && '|' + t('common:RequiredRunRate') + ' : ' + liveData?.oLiveScore?.sRequiredRunrate}
            </p>
          )}
          {(data?.sStatusStr === 'completed' && liveData?.oMom?.sFullName) && (
            <p className="text-secondary">
              {t('common:ManOfTheMatch')}:  {
                liveData?.oMom?.oSeo?.sSlug ? (
                  <CustomLink href={`/${liveData?.oMom?.oSeo?.sSlug}`}>
                    <a>{liveData?.oMom?.sFullName}</a>
                  </CustomLink>
                ) : liveData?.oMom?.sFullName
              }
            </p>
          )}
          {(data?.sStatusStr === 'completed' && liveData?.oMos?.sFullName) && (
            <p className="text-secondary">
              {t('common:ManOfTheSeries')}:  {liveData?.oMos?.sFullName}
            </p>
          )}
        </div>
      </div>
    </>
  )
}

Result.propTypes = {
  data: PropTypes.object,
  liveScoreData: PropTypes.array,
  currentTab: PropTypes.string,
  showShareBtn: PropTypes.string,
  isDailyHuntMode: PropTypes.bool
}
export default Result
