import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import { addAdsInsideParagraph, addEditorAds } from '@shared/utils'
import InnerHTML from '@shared/components/InnerHTML'
import pitch from '@assets/images/pitch.svg'
import arrow from '@assets/images/icon/dashed-arrow.svg'
import arrowLeft from '@assets/images/icon/dashed-left-arrow.svg'
import useTranslation from 'next-translate/useTranslation'
const MyImage = dynamic(() => import('@shared/components/myImage'))

const PitchReport = ({ overviewData, fantasystyles, title, info }) => {
  const { t } = useTranslation()
  return (
    <section className={`${styles.pitchReport} common-section pb-0`} id="pitch">
      <p className={`${fantasystyles?.itemTitle} text-primary fw-bold text-uppercase`}>{title}</p>
      <InnerHTML
        className={`${fantasystyles?.infoDesc} big-text`}
        html={addEditorAds(addAdsInsideParagraph(overviewData?.sPitchReport || '', [0]))}
      />
      <div className="mt-3 mt-md-4 position-relative">
        {(overviewData?.nPaceBowling || overviewData?.nSpinBowling) ? (
          <div className="d-flex justify-content-center align-items-center font-semi">
            <div className="flex-1 position-relative">
              <p className="big-text mb-0 text-end">{overviewData?.nPaceBowling ? `${overviewData?.nPaceBowling}%` : 'N/A'}</p>
              <p className="mb-0">{t('common:paceBowling')}</p>
            </div>
            <div className={`${styles.condition} mx-2 mx-md-3 position-relative rounded-pill overflow-hidden`}>
              <div className={`${styles.value} position-absolute h-100`} style={{ width: overviewData?.nPaceBowling ? `${overviewData?.nPaceBowling}%` : 0 }}></div>
            </div>
            <div className="flex-1 position-relative">
              <p className="big-text mb-0">{overviewData?.nSpinBowling ? `${overviewData?.nSpinBowling}%` : 'N/A'}</p>
              <p className="mb-0">{t('common:spinBowling')}</p>
            </div>
          </div>
        ) : null}
        <div className="position-relative">
          <div className={`${styles.pitch} mt-2 mt-md-3`}>
            <MyImage src={pitch} alt="pitch" layout="responsive" />
          </div>
          <div className={`d-flex justify-content-between align-items-center font-semi ${(overviewData?.nBattingPitch || overviewData?.nBowlingPitch) ? 'mt-2 mt-md-3' : ''}`}>
            {overviewData?.nBattingPitch ? (
              <div className="flex-1 position-relative">
                <p className="big-text mb-0">{overviewData?.nBattingPitch ? `${overviewData?.nBattingPitch}%` : 'N/A'}</p>
                <p className="mb-0">{t('common:battingPitch')}</p>
                <div className={`${styles.arrow} position-absolute`}>
                  <MyImage src={arrow} alt="pitch" layout="responsive" />
                </div>
              </div>
            ) : null}
            <div className={`big-text text-center ${(overviewData?.nBattingPitch || overviewData?.nBowlingPitch) ? '' : 'position-absolute top-50 start-50 translate-middle d-flex align-items-center flex-row-reverse d-md-block'}`}>
              <h2 className={`${(overviewData?.nBattingPitch || overviewData?.nBowlingPitch) ? 'mb-n1' : 'mb-0 mb-md-n1 ms-2 ms-md-0'}`}>{overviewData?.sAvgScore}</h2>
              <p className="mb-0">{t('common:averageScore')}</p>
            </div>
            {overviewData?.nBowlingPitch ? (
              <div className="flex-1 text-end position-relative">
                <p className="big-text mb-0">{overviewData?.nBowlingPitch ? `${overviewData?.nBowlingPitch}%` : 'N/A'}</p>
                <p className="mb-0">{t('common:bowlingPitch')}</p>
                <div className={`${styles.arrow} ${styles.arrowLeft} position-absolute`}>
                  <MyImage src={arrowLeft} alt="pitch" layout="responsive" />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section >
  )
}

PitchReport.propTypes = {
  fantasystyles: PropTypes.any,
  title: PropTypes.any,
  info: PropTypes.any,
  overviewData: PropTypes.object
}

export default PitchReport
