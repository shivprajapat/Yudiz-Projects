import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { Badge } from 'react-bootstrap'

import styles from './style.module.scss'
import FlagTeam from '@assets/images/placeholder/flag-placeholder.png'

import useTranslation from 'next-translate/useTranslation'
import { S3_PREFIX } from '@shared/constants'
import Trans from 'next-translate/Trans'
import { useSubscription } from '@apollo/client'
import { GET_MATCH_HEADER } from '@graphql/match/match.subscription'
import { CupIcon } from '@shared/components/ctIcons'

const Header = dynamic(() => import('./header'))
const MyImage = dynamic(() => import('@shared/components/myImage'))
export default function Result({ data }) {
  const [liveData, setLiveData] = useState(data)
  const { data: updatedData } = useSubscription(GET_MATCH_HEADER, { variables: { input: { iMatchId: data?._id } } })
  const { t } = useTranslation()

  useEffect(() => {
    updatedData && setLiveData(updatedData?.getMatchBySlug?.oMatchDetailsFront)
  }, [updatedData])

  useEffect(() => {
    setLiveData(data)
  }, [data])
  const currentTeamData = ['completed', 'cancelled'].includes(data.sStatusStr) ? data?.aInning[0] : data?.aInning[data?.aInning.length - 1]
  const currentBattingTeamId = currentTeamData?.iBattingTeamId

  const isCurrentBatting = currentBattingTeamId === data?.oTeamScoreA?.oTeam?._id
  return (
    <>
      <section className={styles.matchHeader}>
        <Header data={data} />
        <div className={`${styles.matchInfo} d-md-flex`}>
          <div className={`${styles.teams} flex-grow-1`}>
            <div className="d-flex align-items-center">
              {data?.sStatusStr === 'live' && (
                <Badge bg="danger" className={`${styles.badge} live me-2 me-xl-3`}>
                  <span>{(data?.sLiveGameStatusStr === 'none' || data?.sLiveGameStatusStr === 'playing ongoing' || data?.sLiveGameStatusStr === 'innings break') ? <Trans i18nKey="common:Live" /> : liveData?.sLiveGameStatusStr}</span>
                </Badge>
              )}
              {data?.sStatusStr === 'completed' && (
                <Badge bg="success" className={`${styles.badge} live me-2 me-xl-3`}>
                  <span>{t('common:Result')}</span>
                </Badge>
              )}
              {data?.sStatusStr === 'cancelled' && (
                <Badge bg="danger" className={`${styles.badge} live me-2 me-xl-3`}>
                  <span>{t('common:Cancelled')}</span>
                </Badge>
              )}
              {liveData?.sStatusNote || liveData?.sLiveMatchNote}
            </div>
            <div className={`${styles.team} d-flex align-items-center justify-content-between justify-content-md-start flex-shrink-0 mt-3 mt-md-3 mb-1`}>
              <div className={`${styles.name} d-flex align-items-center`}>
                <div className={`${styles.flag}`}>
                  {isCurrentBatting ? <MyImage
                    src={data?.oTeamScoreA?.oTeam?.oImg?.sUrl ? `${S3_PREFIX}${data?.oTeamScoreA?.oTeam?.oImg?.sUrl}` : FlagTeam}
                    alt={data?.oTeamScoreA?.oTeam?.sAbbr}
                    layout="responsive"
                    width="20"
                    height="20"
                  /> : <MyImage
                    src={data?.oTeamScoreB?.oTeam?.oImg?.sUrl ? `${S3_PREFIX}${data?.oTeamScoreB?.oTeam?.oImg?.sUrl}` : FlagTeam}
                    alt={data?.oTeamScoreB?.oTeam?.sAbbr}
                    layout="responsive"
                    width="20"
                    height="20"
                  />}
                </div>
                {isCurrentBatting ? <p className="big-text font-semi">
                  {data?.oTeamScoreA?.oTeam?.sAbbr}
                  {data?.sStatusStr === 'completed' && data?.oTeamScoreA?.oTeam?._id === data?.oWinner?._id && <span className={`${styles.winner} ms-2`}><CupIcon /></span>}
                </p> : <p className="big-text font-semi">
                  {data?.oTeamScoreB?.oTeam?.sAbbr}
                  {data?.sStatusStr === 'completed' && data?.oTeamScoreB?.oTeam?._id === data?.oWinner?._id && <span className={`${styles.winner} ms-2`}><CupIcon /></span>}
                </p>}
              </div>
              {isCurrentBatting ? liveData?.nLatestInningNumber === 1 &&
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
              ))}
            </div>
            <div className={`${styles.team} d-flex align-items-center justify-content-between justify-content-md-start flex-shrink-0 mt-3 mt-md-3 mb-1`}>
              <div className={`${styles.name} d-flex align-items-center`}>
                <div className={`${styles.flag}`}>
                  {!isCurrentBatting ? <MyImage
                    src={data?.oTeamScoreA?.oTeam?.oImg?.sUrl ? `${S3_PREFIX}${data?.oTeamScoreA?.oTeam?.oImg?.sUrl}` : FlagTeam}
                    alt={data?.oTeamScoreA?.oTeam?.sAbbr}
                    layout="responsive"
                    width="20"
                    height="20"
                  /> : <MyImage
                    src={data?.oTeamScoreB?.oTeam?.oImg?.sUrl ? `${S3_PREFIX}${data?.oTeamScoreB?.oTeam?.oImg?.sUrl}` : FlagTeam}
                    alt={data?.oTeamScoreB?.oTeam?.sAbbr}
                    layout="responsive"
                    width="20"
                    height="20"
                  />}
                </div>
                {!isCurrentBatting ? <p className="big-text font-semi">
                  {data?.oTeamScoreA?.oTeam?.sAbbr}
                  {data?.sStatusStr === 'completed' && data?.oTeamScoreA?.oTeam?._id === data?.oWinner?._id && <span className={`${styles.winner} ms-2 d-inline-block`}><CupIcon /></span>}
                </p> : <p className="big-text font-semi">
                  {data?.oTeamScoreB?.oTeam?.sAbbr}
                  {data?.sStatusStr === 'completed' && data?.oTeamScoreB?.oTeam?._id === data?.oWinner?._id && <span className={`${styles.winner} ms-2 d-inline-block`}><CupIcon /></span>}
                </p>}
              </div>
              <div>
                {!isCurrentBatting ? liveData?.nLatestInningNumber === 1 &&
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
                  ))}
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
                {t('common:ManOfTheMatch')} :  {liveData?.oMom?.sFullName}
              </p>
            )}
            {(data?.sStatusStr === 'completed' && liveData?.oMos?.sFullName) && (
              <p className="text-secondary">
                {t('common:ManOfTheSeries')} :  {liveData?.oMos?.sFullName}
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

Result.propTypes = {
  data: PropTypes.object
}
