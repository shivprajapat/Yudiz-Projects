import React from 'react'
import PropTypes from 'prop-types'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import wincup from '@assets/images/icon/wincup-icon.svg'
import teamPlaceholder from '@assets/images/placeholder/team-placeholder.jpg'
import { S3_PREFIX } from '@shared/constants'

const MyImage = dynamic(() => import('@shared/components/myImage'))

const WinPrediction = ({ overViewData }) => {
  const { t } = useTranslation()
  return (
    <div className="common-section pb-0">
      <div className={`${styles.winPrediction} common-box d-flex justify-content-between align-items-center py-2 py-md-3 px-2 px-sm-3 px-md-4`}>
        <div className="d-flex align-items-center">
          <div className={`${styles.flag} me-2 me-md-3 rounded-circle overflow-hidden`}>
            <MyImage
              src={overViewData?.oWinnerTeam.oImg.sUrl ? (S3_PREFIX + overViewData?.oWinnerTeam.oImg.sUrl) : teamPlaceholder}
              blurDataURL={overViewData?.oWinnerTeam.oImg.sUrl ? teamPlaceholder : ''}
              alt="team"
              layout="responsive"
              height='42px'
              width='42px' />
          </div>
          <h4 className="font-semi">{overViewData?.oWinnerTeam?.sTitle}</h4>
        </div>
        <p className={`${styles.itemTitle} text-primary fw-bold text-uppercase d-flex align-items-center`} >
          <span className={`${styles.icon} me-2 me-md-3 flex-shrink-0`}>
            <MyImage src={wincup} alt="Prediction" layout="responsive" />
          </span>
          <span>{t('common:WinPrediction')}</span>
        </p>
      </div>
    </div>
  )
}

WinPrediction.propTypes = {
  overViewData: PropTypes.object
}

export default WinPrediction
