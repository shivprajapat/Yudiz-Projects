import React from 'react'
import PropTypes from 'prop-types'

import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'

const PlayerImg = dynamic(() => import('@shared/components/playerImg'))

export default function PlayerRoles({ styles, data, capData, playerData, teamA, playerTeam }) {
  return (
    <>
      <div className={`${styles.player} mx-1 mx-sm-2 mx-xl-3 flex-shrink-0`}>
        <div className={`${styles.playerImg} mx-auto`}>
          <PlayerImg
            head={data?.oPlayer?.oImg}
            jersey={playerTeam?.oJersey}
            enableBg
          />
        </div>
        <div className={`${styles.name} ${teamA === data?.oTeam?._id ? '' : styles.nameDark}`}>
          <span className="overflow-hidden">{data?.oPlayer?.sShortName || data?.oPlayer?.sFirstName}</span>
        </div>
        {data?._id === capData?.oCapFan?._id && (
          <div className={`${styles.tag} rounded-circle small-text`}>
            <Trans i18nKey="common:C" />
          </div>
        )}
        {data?._id === capData?.oVCFan?._id && (
          <div className={`${styles.tag} rounded-circle small-text`}>
            <Trans i18nKey="common:VC" />
          </div>
        )}
        {data?._id === capData?.oTPFan?._id && (
          <div className={`${styles.tag} rounded-circle small-text`}>12</div>
        )}
        <p className={`${styles.rating} xsmall-text mt-1 mb-0`}>{data?.nRating}</p>
      </div>
    </>
  )
}

PlayerRoles.propTypes = {
  styles: PropTypes.any,
  data: PropTypes.object,
  capData: PropTypes.object,
  playerTeam: PropTypes.object,
  playerData: PropTypes.array,
  teamA: PropTypes.string
}
