import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Accordion } from 'react-bootstrap'
import { useSubscription } from '@apollo/client'

import styles from './style.module.scss'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'
import { tableLoader } from '@shared/libs/allLoader'
import { FULL_SCOREBOARD } from '@graphql/match/match.subscription'
import Link from 'next/link'

const ScorecardTable = dynamic(() => import('@shared-components/match/scorecardTable'), { loading: () => tableLoader() })
const FallWickets = dynamic(() => import('@shared-components/match/fallWickets'))
const ThemeTable = dynamic(() => import('@shared-components/themeTable'))
const MatchDetailOverview = dynamic(() => import('@shared-components/match/matchDetailOverview'))

const MatchDetailScorecard = ({ data, style, squad, matchDetail, matchOverView }) => {
  const { t } = useTranslation()
  const [fullScoreBoard, setFullScoreBoard] = useState(data?.fetchLiveInningsData)
  const labels = [`${t('common:Bowler')}`, `${t('common:Ov')}`, `${t('common:M')}`, `${t('common:R')}`, `${t('common:W')}`, `${t('common:NB')}`, `${t('common:WD')}`, `${t('common:Eco')}`]
  const table = useRef({ sOvers: 'Ov', nMaidens: 'M', nRunsConceded: 'R', nWickets: 'W', nNoBalls: 'NB', nWides: 'WD', sEcon: 'Eco' })
  const fullSquad = squad?.listMatchSquad

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
  return (
    <>
      <section className={`${styles.scorecards}`}>
        {matchDetail?.sStatusStr === 'completed' || matchDetail?.sStatusStr === 'canceled' ? fullScoreBoard?.map((item, index) => {
          return (
            <Accordion key={index} defaultActiveKey={`${index}`}>
              <Accordion.Item eventKey={`${index}`}>
                <Accordion.Header className={`${styles.scoreHead}`}>
                  <div className={`${styles.title} d-flex justify-content-between align-items-center flex-grow-1`}>
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
                <Accordion.Body className={`${styles.scoreBody}`}>
                  <ScorecardTable data={item} fullSquad={fullSquad} />
                  {item?.aFOWs?.length > 0 && <FallWickets data={item} />}
                  <div className={`${style?.personTbl}`}>
                    <ThemeTable labels={labels} isBordered={true}>
                      {item?.aBowlers?.map((bowler, index) => {
                        return (
                          <tr key={index} className={`${bowler.highlight && 'highlight'}`}>
                            {bowler?.oBowler?.eTagStatus === 'a' ? <td><Link href={`/${bowler?.oBowler?.oSeo?.sSlug}`} prefetch={false}><a>{bowler?.oBowler?.sFullName || bowler?.oBowler?.sShortName}</a></Link></td> : <td>{bowler?.oBowler?.sFullName || bowler?.oBowler?.sShortName}</td>}
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
          )
        }) : fullScoreBoard?.slice(0).reverse().map((item, index) => {
          return (
            <Accordion key={index} defaultActiveKey={`${index}`}>
              <Accordion.Item eventKey={`${index}`}>
                <Accordion.Header className={`${styles.scoreHead}`}>
                  <div className={`${styles.title} d-flex justify-content-between align-items-center flex-grow-1`}>
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
                <Accordion.Body className={`${styles.scoreBody}`}>
                  <ScorecardTable data={item} fullSquad={fullSquad} />
                  {item?.aFOWs?.length > 0 && <FallWickets data={item} />}
                  <div className={`${style?.personTbl}`}>
                    <ThemeTable labels={labels} isBordered={true}>
                      {item?.aBowlers?.map((bowler, index) => {
                        return (
                          <tr key={index} className={`${bowler.highlight && 'highlight'}`}>
                            {bowler?.oBowler?.eTagStatus === 'a' ? <td><Link href={`/${bowler?.oBowler?.oSeo?.sSlug}`} prefetch={false}><a>{bowler?.oBowler?.sFullName || bowler?.oBowler?.sShortName}</a></Link></td> : <td>{bowler?.oBowler?.sFullName || bowler?.oBowler?.sShortName}</td>}
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
