import React, { useEffect, useRef, useState } from 'react'
import { Accordion } from 'react-bootstrap'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import styles from '../matchSquads/style.module.scss'
import useTranslation from 'next-translate/useTranslation'

const XIItems = dynamic(() => import('./XIItems'))
const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })

const MatchXI = ({ data, status }) => {
  const { t } = useTranslation()
  const isElevenTeam1Available = useRef(false)
  const isElevenTeam2Available = useRef(false)
  const [isPlaying11, setIsPlaying11] = useState(false)

  useEffect(() => {
    (isElevenTeam1Available.current || isElevenTeam2Available.current) && setIsPlaying11(true)
  }, [isElevenTeam1Available, isElevenTeam2Available])

  return (
    <section className={styles.matchSquads}>
      <h4 className="text-uppercase">{isPlaying11 ? t('common:Playing11') : t('common:Squads')}</h4>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header className={styles.squadHead}>
            {data?.oTeam1?.oTeam?.sTitle} {isPlaying11 ? t('common:Playing11') : t('common:Squad')}
          </Accordion.Header>
          <Accordion.Body className={styles.squadBody}>
            {status !== 'scheduled' &&
              <>
                <div className="d-flex flex-wrap">
                  {data?.oTeam1?.aPlayers?.map((player, index) => {
                    if (player?.bPlaying11) {
                      isElevenTeam1Available.current = true
                      return (
                        <React.Fragment key={index}>
                          <XIItems data={player} styles={styles} />
                        </React.Fragment>
                      )
                    } else {
                      return null
                    }
                  })}
                </div>
                {isElevenTeam1Available.current && <p className={`${styles.reserve} text-center text-uppercase`}>{t('common:Reserve')}</p>}
                <div className="d-flex flex-wrap">
                  {data?.oTeam1?.aPlayers?.map(
                    (benchPlayer, index) => {
                      if (!benchPlayer?.bPlaying11) {
                        return (
                          <React.Fragment key={index}>
                            <XIItems data={benchPlayer} styles={styles} />
                          </React.Fragment>
                        )
                      } else {
                        return null
                      }
                    }
                  )}
                </div>
              </>
            }
            {status === 'scheduled' &&
              <div className="d-flex flex-wrap">
                {data?.oTeam1?.aPlayers?.map(
                  (benchPlayer, index) => {
                    if (!benchPlayer?.bPlaying11) {
                      return (
                        <React.Fragment key={index}>
                          <XIItems key={index} data={benchPlayer} styles={styles} />
                        </React.Fragment>
                      )
                    } else {
                      return null
                    }
                  })}
              </div>
            }
          </Accordion.Body>
        </Accordion.Item>
        <Ads
          id="div-ad-gpt-138639789-1660147282-3"
          adIdDesktop="Crictracker2022_Desktop_LiveScore_MID2_728x90"
          adIdMobile="Crictracker2022_Mobile_LiveScore_MID2_300x250"
          dimensionDesktop={[728, 90]}
          dimensionMobile={[300, 250]}
          mobile
          className={'text-center mb-3'}
        />
        <Accordion.Item eventKey="1">
          <Accordion.Header className={`${styles.squadHead}`}>
            {data?.oTeam2?.oTeam?.sTitle} {isPlaying11 ? t('common:Playing11') : t('common:Squad')}
          </Accordion.Header>
          <Accordion.Body className={`${styles.squadBody}`}>
            {status !== 'scheduled' &&
              <>
                <div className="d-flex flex-wrap">
                  {data?.oTeam2?.aPlayers?.map((player, index) => {
                    if (player?.bPlaying11) {
                      isElevenTeam2Available.current = true
                      return (
                        <React.Fragment key={index}>
                          <XIItems key={index} data={player} styles={styles} />
                        </React.Fragment>
                      )
                    } else {
                      return null
                    }
                  })}
                </div>
                {isElevenTeam2Available.current && <p className={`${styles.reserve} text-center text-uppercase`}>{t('common:Reserve')}</p>}
                <div className="d-flex flex-wrap">
                  {data?.oTeam2?.aPlayers?.map(
                    (benchPlayer, index) => {
                      if (!benchPlayer?.bPlaying11) {
                        return (
                          <React.Fragment key={index}>
                            <XIItems data={benchPlayer} styles={styles} />
                          </React.Fragment>
                        )
                      } else {
                        return null
                      }
                    }
                  )}
                </div>
              </>
            }
            {status === 'scheduled' &&
              <div className="d-flex flex-wrap">
                {data?.oTeam2?.aPlayers?.map(
                  (benchPlayer, index) => {
                    if (!benchPlayer?.bPlaying11) {
                      return <XIItems key={index} data={benchPlayer} styles={styles} />
                    } else {
                      return null
                    }
                  })}
              </div>
            }
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </section>
  )
}

MatchXI.propTypes = {
  data: PropTypes.object,
  status: PropTypes.string
}

export default MatchXI
