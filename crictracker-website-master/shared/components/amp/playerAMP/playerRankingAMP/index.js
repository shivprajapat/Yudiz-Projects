import React from 'react'
import PropTypes from 'prop-types'
import useTranslation from 'next-translate/useTranslation'
import winnerIcon from '@assets/images/icon/cup-dark-icon.svg'
import { getMatchType, getPlayerRoleType } from '@shared/libs/player'

function PlayerRankingAMP({ playerRanking }) {
  const { t } = useTranslation()

  return (
    <>
      <style jsx amp-custom>
        {`.rankingStyle{margin:-10px 0px}.widget-title{margin-bottom:14px}.widget-title .icon{width:24px;-webkit-filter:invert(26%) sepia(93%) saturate(2578%) hue-rotate(218deg) brightness(94%) contrast(93%);filter:invert(26%) sepia(93%) saturate(2578%) hue-rotate(218deg) brightness(94%) contrast(93%)}@media(prefers-color-scheme: dark){.widget-title .icon{-webkit-filter:invert(88%) sepia(34%) saturate(4957%) hue-rotate(187deg) brightness(101%) contrast(118%);filter:invert(88%) sepia(34%) saturate(4957%) hue-rotate(187deg) brightness(101%) contrast(118%)}}.iccRank{margin-left:-4px;margin-right:-4px}.rank{border-radius:8px;border:1px solid #a6c8ff;background:var(--light-mode-bg);margin-bottom:6px;padding:4px 8px}.rank:last-child{margin-bottom:0}/*# sourceMappingURL=style.css.map */
        `}
      </style>
      {playerRanking?.length > 0 && (
        <div className="widget mb-3">
          <div className="widget-title">
            <h3 className="small-head d-flex align-items-center text-uppercase mb-0">
              <span className="icon me-1">
                <amp-img src={winnerIcon.src} alt="winner" width="24" height="24" layout="responsive" />
              </span>
              <span>{t('common:ICCRanking')}</span>
            </h3>
          </div>
          <div className="iccRank font-semi d-flex flex-wrap align-items-start">
            {playerRanking?.map((ele, index) => (
              <p key={index} className="rank cs-item mx-1">
                <span className="theme-text flex-shrink-0">#{ele?.nRank}</span>&nbsp;
                {`${getPlayerRoleType(ele?.eRankType)} in ${getMatchType(ele?.eMatchType)}`}
              </p>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

PlayerRankingAMP.propTypes = {
  playerRanking: PropTypes.array
}
export default PlayerRankingAMP
