import React from 'react'
import PropTypes from 'prop-types'

import playerImg from '@assets/images/placeholder/player-placeholder.jpg'
import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'

const MyImage = dynamic(() => import('@shared/components/myImage'))

export default function PlayerRoles({ styles, data, capData, playerData, teamA }) {
  return (
    <>
      <div className={`${styles.player} mx-1 mx-sm-2 mx-xl-3 flex-shrink-0`}>
        <div className={`${styles.playerImg} mx-auto`}>
          <MyImage src={playerImg} alt="user" placeholder="blur" layout="responsive" width="40" height="40" />
        </div>
        <div className={`${styles.name} ${teamA === data?.oTeam?._id ? '' : 'bg-dark text-light'}`}>{data?.oPlayer?.sShortName || data?.oPlayer?.sFirstName}</div>
        {data?._id === capData?.oCapFan?._id && (
          <div className={`${styles.tag} text-light bg-primary rounded-circle small-text`}>
            <Trans i18nKey="common:C" />
          </div>
        )}
        {data?._id === capData?.oVCFan?._id && (
          <div className={`${styles.tag} text-light bg-primary rounded-circle small-text`}>
            <Trans i18nKey="common:VC" />
          </div>
        )}
        {data?._id === capData?.oTPFan?._id && (
          <div className={`${styles.tag} text-light bg-primary rounded-circle small-text`}>12</div>
        )}
        <p className="xsmall-text text-light mt-1">{data?.nRating}</p>
      </div>
    </>
  )
}

PlayerRoles.propTypes = {
  styles: PropTypes.any,
  data: PropTypes.object,
  capData: PropTypes.object,
  playerData: PropTypes.array,
  teamA: PropTypes.string
}
