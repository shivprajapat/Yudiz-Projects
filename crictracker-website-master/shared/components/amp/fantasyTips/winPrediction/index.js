import React from 'react'
import PropTypes from 'prop-types'
import useTranslation from 'next-translate/useTranslation'

import wincup from '@assets/images/icon/wincup-icon.svg'
import teamPlaceholder from '@assets/images/placeholder/team-placeholder.jpg'
import { S3_PREFIX } from '@shared/constants'

const WinPrediction = ({ overViewData }) => {
  const { t } = useTranslation()
  return (
    <>
      <style jsx amp-custom>{`
      .winPrediction{background:var(--theme-light)}.flag{width:32px;overflow:hidden;border-radius:50%}.icon{width:24px}[data-mode=dark] .icon{-webkit-filter:brightness(0) invert(1) opacity(0.4);filter:brightness(0) invert(1) opacity(0.4)}/*# sourceMappingURL=style.css.map */

      `}</style>
      <div className="common-section pb-0">
        <div className="winPrediction common-box d-flex justify-content-between align-items-center py-2 px-2">
          <div className="d-flex align-items-center">
            <div className="flag me-2 rounded-circle overflow-hidden">
              <amp-img src={overViewData?.oWinnerTeam?.oImg?.sUrl ? (S3_PREFIX + overViewData?.oWinnerTeam?.oImg?.sUrl) : teamPlaceholder.src} width="32" height="32" alt="team" layout="responsive"></amp-img>
            </div>
            <h4 className="font-semi mb-0">{overViewData?.oWinnerTeam?.sTitle}</h4>
          </div>
          <p className="itemTitle text-primary font-bold t-uppercase d-flex align-items-center">
            <span className="icon me-2 flex-shrink-">
              <amp-img src={wincup.src} width="24" height="24" alt="Prediction" layout="responsive"></amp-img>
            </span>
            <span>{t('common:WinPrediction')}</span>
          </p>
        </div>
      </div>
    </>
  )
}

WinPrediction.propTypes = {
  overViewData: PropTypes.object
}

export default WinPrediction
