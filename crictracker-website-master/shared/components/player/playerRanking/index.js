import React from 'react'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'

import winnerIcon from '@assets/images/icon/cup-dark-icon.svg'
import { getMatchType, getPlayerRoleType } from '@shared/libs/player'

const MyImage = dynamic(() => import('@shared/components/myImage'))

function PlayerRanking({ playerRanking, className }) {
  const style = {
    iccRank: { margin: '-0.25rem' },
    rank: { border: '1px solid var(--theme-color-medium)' }
  }
  const { t } = useTranslation()

  if (playerRanking?.length > 0) {
    return (
      <div className={`widget ${className || ''}`}>
        <div className="widget-title">
          <h3 className="small-head d-flex align-items-center text-uppercase mb-0">
            <span className="icon me-1">
              <MyImage src={winnerIcon} alt="winner" width="24" height="24" layout="responsive" />
            </span>
            <span>{t('common:ICCRanking')}</span>
          </h3>
        </div>
        <div className="font-semi m-n1 d-flex flex-wrap align-items-start" style={style?.iccRank}>
          {playerRanking?.map((ele, index) => (
            <p key={index} className="bg-white py-1 px-2 cs-item m-1 br-sm" style={style?.rank}>
              <span className="theme-text flex-shrink-0">#{ele?.nRank}</span>&nbsp;
              {`${getPlayerRoleType(ele?.eRankType)} in ${getMatchType(ele?.eMatchType)}`}
            </p>
          ))}
        </div>
      </div>
    )
  } else return null
}
PlayerRanking.propTypes = {
  playerRanking: PropTypes.array,
  className: PropTypes.string
}
export default PlayerRanking
