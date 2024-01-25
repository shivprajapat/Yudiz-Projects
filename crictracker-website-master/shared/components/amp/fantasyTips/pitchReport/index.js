import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'

import pitch from '@assets/images/pitch.svg'
import arrow from '@assets/images/icon/dashed-arrow.svg'
import arrowLeft from '@assets/images/icon/dashed-left-arrow.svg'
const TitleBlock = dynamic(() => import('@shared-components/amp/fantasyTips/titleBlock'))

const PitchReport = ({ fantasystyles, overviewData }) => {
  const { t } = useTranslation()
  return (
    <>
      <style jsx amp-custom>{`
       .common-section{padding-top:12px}.icon{width:32px}.pitchReport a{color:var(--theme-color-medium);text-decoration:underline}.pitchReport a:hover{color:var(--theme-font)}.arrow{width:54px;bottom:80%;left:80%}.arrowLeft{left:auto;right:80%}.condition{width:40%;height:8px;background:var(--theme-medium)}.value{background:#045de9;height:100%}.rounded-pill{border-radius:2em}.overflow-hidden{overflow:hidden}.text-end{text-align:end}.noPitchData{top:50%;left:50%;transform:translate(-50%, -50%);flex-direction:row-reverse}@media(prefers-color-scheme: dark){.arrow{-webkit-filter:brightness(0) invert(1);filter:brightness(0) invert(1)}.pitch{-webkit-filter:brightness(0.6);filter:brightness(0.6)}}/*# sourceMappingURL=style.css.map */

      `}</style>
      <section className="common-section pitchReport pb-0">
        <TitleBlock title={t('common:PitchReport')} />
        <div className="infoDesc" dangerouslySetInnerHTML={{ __html: overviewData?.sPitchReport || '' }}></div>
        <div className="mt-3 mt-md-4">
          {(overviewData?.nPaceBowling || overviewData?.nSpinBowling) ? <div className="d-flex justify-content-center align-items-center font-semi">
            <div className="flex-1 position-relative">
              <p className="big-text mb-0 text-end">{overviewData?.nPaceBowling ? `${overviewData?.nPaceBowling}%` : 'N/A'}</p>
              <p className="mb-0">{t('common:paceBowling')}</p>
            </div>
            <div className="condition mx-2 mx-md-3 position-relative rounded-pill overflow-hidden">
              <div className="value position-absolute h-100" style={{ width: overviewData?.nPaceBowling ? `${overviewData?.nPaceBowling}%` : '0%' }}></div>
            </div>
            <div className="flex-1 position-relative">
              <p className="big-text mb-0">{overviewData?.nSpinBowling ? `${overviewData?.nSpinBowling}%` : 'N/A'}</p>
              <p className="mb-0">{t('common:spinBowling')}</p>
            </div>
          </div> : null
          }
          <div className="position-relative">
            <div className="pitch mt-2 my-md-3">
              <amp-img src={pitch.src} alt="pitch" layout="responsive" width="351" height="39" ></amp-img>
            </div>
            <div className={`d-flex justify-content-between align-items-center font-semi ${(overviewData?.nBattingPitch || overviewData?.nBowlingPitch) ? 'mt-2' : ''}`}>
              {overviewData?.nBattingPitch ? <div className="flex-1 position-relative">
                <p className="big-text mb-0">{overviewData?.nBattingPitch ? `${overviewData?.nBattingPitch}%` : 'N/A'}</p>
                <p className="mb-0">{t('common:battingPitch')}</p>
                <div className="arrow position-absolute">
                  <amp-img src={arrow.src} alt="pitch" layout="responsive" width="24" height="24" ></amp-img>
                </div>
              </div> : null}
              <div className={`big-text t-center ${(overviewData?.nBattingPitch || overviewData?.nBowlingPitch) ? '' : 'noPitchData position-absolute d-flex align-items-center'}`}>
                <h2 className={`mb-0 ${(overviewData?.nBattingPitch || overviewData?.nBowlingPitch) ? '' : 'mb-0 ms-2'}`}>{overviewData?.sAvgScore}</h2>
                <p className="mb-0">{t('common:averageScore')}</p>
              </div>
              {overviewData?.nBowlingPitch ? <div className="flex-1 text-end position-relative">
                <p className="big-text mb-0">{overviewData?.nBowlingPitch ? `${overviewData?.nBowlingPitch}%` : 'N/A'}</p>
                <p className="mb-0">{t('common:bowlingPitch')}</p>
                <div className="arrow arrowLeft position-absolute">
                  <amp-img src={arrowLeft.src} alt="pitch" layout="responsive" width="24" height="24" ></amp-img>
                </div>
              </div> : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

PitchReport.propTypes = {
  fantasystyles: PropTypes.any,
  overviewData: PropTypes.object
}

export default PitchReport
