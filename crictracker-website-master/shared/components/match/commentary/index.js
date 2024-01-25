import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

import styles from './style.module.scss'
import Ads from '@shared/components/ads'
import CommentaryCommonBox from '../commentaryCommonBox'
import { checkIsGlanceView } from '@shared/utils'
// import { AnnouncementIcon } from '../../ctIcons'

const EndOver = dynamic(() => import('./endover'))
const GlanceAd = dynamic(() => import('@shared-components/ads/glanceAd'), { ssr: false })
const MatchXI = dynamic(() => import('../matchXI'))

const Commentary = ({ data, id, matchDetail, playingXI }) => {
  const { t } = useTranslation()
  const previousId = useRef()
  const router = useRouter()
  const isGlanceView = checkIsGlanceView(router?.query)

  return (
    <section className={`${styles.commentary} br-md overflow-hidden`}>
      {data?.map((over, index, item) => {
        previousId.current = item[index - 1]
        if (over?.sEventId !== previousId.current?.sEventId && over?.sEventId !== '0-1' && over?.sEventId !== '0') {
          return (
            <div key={`${index}${over?.sEventId}`} id={`${over?.sEventId}${over?.sOver}${over?.nInningNumber}`} className={index}>
              {over?.eEvent !== 'oe' &&
                <div className={`${styles.item} common-box d-flex align-items-center rounded-0`} id={over?.sEventId}>
                  <div className={`${styles.ball} d-flex flex-column flex-md-row-reverse align-items-center text-center`}>
                    {over?.sScore === '0' && <div className={`${styles.run} rounded-pill`}>{over?.sScore}</div>}
                    {(over?.sScore !== 'w' && ((over?.nRuns > 0 && over?.nRuns < 4) || over?.nRuns === 5 || over?.nRuns > 6)) && <div className={`${styles.run} rounded-pill bg-info border-info`}>{over?.sScore}</div>}
                    {(over?.sScore === '4b' || over?.sScore === '4lb') && <div className={`${styles.run} rounded-pill bg-info border-info`}>{over?.sScore}</div>}
                    {over?.sScore === 'w' && <div className={`${styles.run} rounded-pill bg-danger border-danger text-white`}>{over?.sScore.toUpperCase()}</div>}
                    {over?.sScore === '4' && <div className={`${styles.run} rounded-pill bg-success border-success text-white`}>{over?.sScore.toUpperCase()}</div>}
                    {over?.sScore === '6' && <div className={`${styles.run} ${styles.runPrimary} rounded-pill bg-primary text-white`}>{over?.sScore.toUpperCase()}</div>}
                    <span className={`${styles.ballNo} fw-bold`}>{over?.sOver}.{over?.sBall}</span>
                  </div>
                  <p className="mb-0">
                    {over?.sCommentary} {over?.eEvent === 'w' && <b>{over?.oWicketBatter !== null && (over?.oWicketBatter?.sFullName || over?.oWicketBatter?.sShortName)} {`${over?.nBatterRuns}(${over?.nBatterBalls})`}</b>} <b>{over?.sHowOut !== null && over?.sHowOut}</b>
                  </p>
                </div>
              }
              {over?.eEvent === 'oe' &&
                <>
                  <EndOver data={over} id={over?.sEventId} inning={matchDetail?.aInning} />
                  {(Number(over?.sOver) % 2) === 1 && (
                    <Ads
                      id={`div-ad-gpt-138639789-323133-2-${over?.sOver}-${index}`}
                      adIdDesktop="Crictracker2022_Mobile_LiveScore_MID_300x250"
                      // adIdMobile="Crictracker2022_Desktop_LiveScore_MID_728x90"
                      dimensionDesktop={[300, 250]}
                      // dimensionMobile={[300, 250]}
                      // mobile
                      className={'text-center d-md-none'}
                    />
                  )}
                  {(Number(over?.sOver) % 2) === 0 && (
                    <>
                      {/* <Ads
                        id={`div-ad-gpt-138639789-67490261-3-${over?.sOver}-${index}`}
                        adIdDesktop="Crictracker2022_Desktop_LiveScore_MID2_728x90"
                        adIdMobile="Crictracker2022_Mobile_LiveScore_MID2_300x250"
                        dimensionDesktop={[728, 90]}
                        dimensionMobile={[300, 250]}
                        mobile
                        className={'text-center d-none d-md-block'}
                      /> */}
                      {isGlanceView && (
                        <GlanceAd
                          id={`div-gpt-ad-156${new Date().getTime() * ((Math.random() + 1) * 1000)}`}
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
                </>
              }
              {(over?.sEventId === '1' && over?.nInningNumber !== 1) && <h3 className="small-head mt-3 text-primary text-uppercase">{t('common:EndInning')}</h3>}
            </div>
          )
        } else if (over?.sEventId === '0') { // for Toss detail
          return (
            <React.Fragment key={`comm${over?.sEventId}`}>
              <CommentaryCommonBox className='mt-3' title={'Toss Detail'}>
                {over?.sCommentary}
              </CommentaryCommonBox>
            </React.Fragment>
          )
        } else if (over?.sEventId === '0-1' && playingXI?.oTeam1?.aPlayers?.length > 0 && playingXI?.oTeam2?.aPlayers?.length > 0) { // For Playing 11
          return (
            <React.Fragment key={`comm${over?.sEventId}`}>
              {/* <CommentaryCommonBox className='mt-3' title={`${over?.oTeamA?.sTeam} ${t('common:Playing11')}`}>
                {over?.oTeamA?.sPlayers}
              </CommentaryCommonBox>
              <CommentaryCommonBox title={`${over?.oTeamB?.sTeam} ${t('common:Playing11')}`}>
                {over?.oTeamB?.sPlayers}
              </CommentaryCommonBox> */}
              {data?.length > 1 && <br />}
              <MatchXI
                data={playingXI}
                status={matchDetail?.sStatusStr}
                isOutSideCountryPlane={matchDetail?.oSeries?._id === '63f052b9d5e097df610db62d'}
              />
            </React.Fragment>
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
  matchDetail: PropTypes.object,
  playingXI: PropTypes.object
}

export default Commentary
