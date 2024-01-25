import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Accordion } from 'react-bootstrap'
import { useSubscription } from '@apollo/client'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import styles from './style.module.scss'
import { tableLoader } from '@shared/libs/allLoader'
import { FULL_SCOREBOARD } from '@graphql/match/match.subscription'
import CustomLink from '@shared/components/customLink'
import { getMatchPlayers } from '@shared/libs/match-detail'
import { checkIsGlanceView } from '@shared/utils'

const ScorecardTable = dynamic(() => import('@shared-components/match/scorecardTable'), { loading: () => tableLoader() })
const FallWickets = dynamic(() => import('@shared-components/match/fallWickets'))
const ThemeTable = dynamic(() => import('@shared-components/themeTable'))
const MatchDetailOverview = dynamic(() => import('@shared-components/match/matchDetailOverview'))
const GlanceAd = dynamic(() => import('@shared-components/ads/glanceAd'), { ssr: false })

const MatchDetailScorecard = ({ data, style, squad, matchDetail, matchOverView }) => {
  const players = getMatchPlayers()
  const router = useRouter()
  const { t } = useTranslation()
  const [fullScoreBoard, setFullScoreBoard] = useState(data?.fetchLiveInningsData)
  const labels = [`${t('common:Bowler')}`, `${t('common:Ov')}`, `${t('common:M')}`, `${t('common:R')}`, `${t('common:W')}`, `${t('common:NB')}`, `${t('common:WD')}`, `${t('common:Eco')}`]
  const table = useRef({ sOvers: 'Ov', nMaidens: 'M', nRunsConceded: 'R', nWickets: 'W', nNoBalls: 'NB', nWides: 'WD', sEcon: 'Eco' })
  const fullSquad = squad?.listMatchSquad
  const isGlanceView = checkIsGlanceView(router?.query)

  typeof window !== 'undefined' && useSubscription(FULL_SCOREBOARD, {
    variables: { input: { iMatchId: matchDetail?._id, nInningNumber: matchDetail?.nLatestInningNumber } },
    onSubscriptionData: ({ subscriptionData }) => {
      const match = subscriptionData?.data?.fetchLiveInningsData
      if (match) {
        setFullScoreBoard(data?.fetchLiveInningsData?.map((item, index) => {
          if (item.nInningNumber === match?.nInningNumber) {
            return match
          }
          return item
        }))
      }
    }
  })

  const scoreBoard = matchDetail?.sStatusStr === 'completed' || matchDetail?.sStatusStr === 'canceled' ? fullScoreBoard : fullScoreBoard?.slice(0)?.reverse()
  return (
    <>
      <section className={`${styles.scorecards}`}>
        {scoreBoard?.map((item, index) => {
          return (
            <React.Fragment key={`sb${index}`}>
              <Accordion defaultActiveKey={'0'}>
                <Accordion.Item eventKey={`${index}`}>
                  <Accordion.Header className={`${styles.scoreHead}`}>
                    <div className={`${styles.title} d-flex justify-content-between align-items-center flex-grow-1 pe-1`}>
                      {item?.sName}{' '}
                      <span>
                        {item?.oEquations?.nRuns +
                          '/' +
                          item?.oEquations?.nWickets +
                          (item?.sResultStr === 'declared' ? 'd' : '') +
                          ' (' +
                          item?.oEquations?.sOvers +
                          ')'}
                      </span>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body className={`${styles.scoreBody} p-0 my-2 bg-transparent`}>
                    <ScorecardTable data={item} fullSquad={fullSquad} matchDetail={matchDetail} />
                    {item?.aFOWs?.length > 0 && <FallWickets data={item} />}
                    <div className={`${style?.personTbl}`}>
                      <ThemeTable labels={labels} isBordered={true}>
                        {item?.aBowlers?.map((bowler, index) => {
                          const b = players[bowler?.iBowlerId] || bowler?.oBowler
                          return (
                            <tr key={index} className={`${bowler.highlight && 'highlight'}`}>
                              {b?.eTagStatus === 'a' ? (
                                <td>
                                  <CustomLink href={`/${b?.oSeo?.sSlug}`} prefetch={false}>
                                    <a>{b?.sFullName || b?.sShortName}</a>
                                  </CustomLink>
                                </td>
                              ) : (
                                <td>{b?.sFullName || b?.sShortName}</td>
                              )}
                              {Object.keys(table.current)?.map((value) => {
                                return <td key={value}>{bowler[value]}</td>
                              })}
                            </tr>
                          )
                        })}
                      </ThemeTable>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              {isGlanceView && (
                <>
                  {/* {index === 0 && (
                    <GlanceAd
                      id={`div-gpt-ad-3${new Date().getTime() * ((Math.random() + 1) * 1000)}`}
                      adId="Crictracker_mrec_mid"
                      dimension={[[300, 250], [336, 280], 'fluid']}
                      adUnitName="Crictracker_Sportstab_InArticleMedium_Mid2"
                      placementName="InArticleMedium"
                      className="d-flex justify-content-center"
                      width={300}
                      height={250}
                      pageName="Crictracker SportsTab"
                    />
                  )} */}
                  {index === 1 && (
                    <GlanceAd
                      id={`div-gpt-ad-4${new Date().getTime() * ((Math.random() + 1) * 1000)}`}
                      adId="Crictracker_mrec_bottom"
                      dimension={[[300, 250], [336, 280], 'fluid']}
                      className="mt-2 d-flex justify-content-center"
                      adUnitName="Crictracker_Sportstab_InArticleMedium_Mid3"
                      placementName="InArticleMedium"
                      width={300}
                      height={250}
                      pageName="Crictracker SportsTab"
                    />
                  )}
                </>
              )}
            </React.Fragment>
          )
        })}
      </section>
      {matchDetail?.sStatusStr !== 'scheduled' && matchDetail?.bIsCommentary &&
        <section>
          <MatchDetailOverview data={matchOverView} matchDetail={matchDetail} />
        </section>}
    </>
  )
}

MatchDetailScorecard.propTypes = {
  data: PropTypes.object,
  style: PropTypes.any,
  squad: PropTypes.object,
  matchDetail: PropTypes.object,
  matchOverView: PropTypes.object
}
export default MatchDetailScorecard
