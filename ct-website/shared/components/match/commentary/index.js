import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import useTranslation from 'next-translate/useTranslation'
import Ads from '@shared/components/ads'
// import { AnnouncementIcon } from '../../ctIcons'

const EndOver = dynamic(() => import('./endover'))

const Commentary = ({ data, id, inning }) => {
  const { t } = useTranslation()
  const previousId = useRef()
  return (
    <section className={`${styles.commentary}`}>
      {data?.map((over, index, item) => {
        previousId.current = item[index - 1]
        if (over?.sEventId !== previousId.current?.sEventId) {
          return (
            <div key={index} className={index}>
              {over?.eEvent !== 'oe' &&
                <div className={`${styles.item} common-box d-flex align-items-center`} id={over?.sEventId}>
                  <div className={`${styles.ball} d-flex flex-column flex-md-row-reverse align-items-center text-center`}>
                    {over?.sScore === '0' && <div className={`${styles.run} rounded-pill`}>{over?.sScore}</div>}
                    {(over?.sScore !== 'w' && ((over?.nRuns > 0 && over?.nRuns < 4) || over?.nRuns === 5 || over?.nRuns > 6)) && <div className={`${styles.run} rounded-pill bg-info border-info`}>{over?.sScore}</div>}
                    {(over?.sScore === '4b' || over?.sScore === '4lb') && <div className={`${styles.run} rounded-pill bg-info border-info`}>{over?.sScore}</div>}
                    {over?.sScore === 'w' && <div className={`${styles.run} rounded-pill bg-danger border-danger text-white`}>{over?.sScore.toUpperCase()}</div>}
                    {over?.sScore === '4' && <div className={`${styles.run} rounded-pill bg-success border-success text-white`}>{over?.sScore.toUpperCase()}</div>}
                    {over?.sScore === '6' && <div className={`${styles.run} rounded-pill bg-primary border-primary text-white`}>{over?.sScore.toUpperCase()}</div>}
                    <span className={`${styles.ballNo} font-bold`}>{over?.sOver}.{over?.sBall}</span>
                  </div>
                  <p className="mb-0">
                    {over?.sCommentary} {over?.eEvent === 'w' && <b>{over?.oWicketBatter !== null && (over?.oWicketBatter?.sFullName || over?.oWicketBatter?.sShortName)} {`${over?.nBatterRuns}(${over?.nBatterBalls})`}</b>} <b>{over?.sHowOut !== null && over?.sHowOut}</b>
                  </p>
                </div>
              }
              {over?.eEvent === 'oe' &&
                <>
                  <EndOver data={over} id={over?.sEventId} inning={inning} />
                  {(Number(over?.sOver) % 2) === 1 && (
                    <Ads
                      id={`div-ad-gpt-138639789-323133-2-${over?.sOver}-${index}`}
                      adIdDesktop="Crictracker2022_Desktop_LiveScore_MID_728x90"
                      adIdMobile="Crictracker2022_Mobile_LiveScore_MID_300x250"
                      dimensionDesktop={[728, 90]}
                      dimensionMobile={[300, 250]}
                      mobile
                      className={'text-center'}
                    />
                  )}
                  {(Number(over?.sOver) % 2) === 0 && (
                    <Ads
                      id={`div-ad-gpt-138639789-67490261-3-${over?.sOver}-${index}`}
                      adIdDesktop="Crictracker2022_Desktop_LiveScore_MID2_728x90"
                      adIdMobile="Crictracker2022_Mobile_LiveScore_MID2_300x250"
                      dimensionDesktop={[728, 90]}
                      dimensionMobile={[300, 250]}
                      mobile
                      className={'text-center'}
                    />
                  )}
                </>
              }
              {(over?.sEventId === '1' && over?.nInningNumber !== 1) && <h3 className="small-head mt-3 text-primary text-uppercase">{t('common:EndInning')}</h3>}
            </div>
          )
        } else {
          return null
        }
      })}
      {/* <div className={`${styles.announcement} bg-info common-box d-flex align-items-center`}>
        <AnnouncementIcon />
        <p className="mb-0">
          <b className="text-uppercase">Vineet:</b> Kohli should try to give the strike to Pant to negate the reverse swing of Anderson.
          Anderson doesnt seem to be that much effective for left-handers. -- What would you say now?
        </p>
      </div> */}
    </section>
  )
}

Commentary.propTypes = {
  data: PropTypes.array,
  id: PropTypes.string,
  inning: PropTypes.array
}

export default Commentary
