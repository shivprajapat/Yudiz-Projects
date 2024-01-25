import React from 'react'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'
// import { Button } from 'react-bootstrap'

import styles from './style.module.scss'
// import playerPlaceholder from '@assets/images/placeholder/player-placeholder.png'
// import { getImgURL } from '@shared/utils'
// import swapIcon from '@assets/images/icon/swap-icon.svg'

// const MyImage = dynamic(() => import('@shared/components/myImage'))
const PlayerImg = dynamic(() => import('@shared/components/playerImg'))

const PlayerInfo = ({ playerDetails }) => {
  return (
    <div className={`${styles.playerInfo} common-box p-0 overflow-hidden position-relative`}>
      {/* <Button variant="link" className={`${styles.swap} position-absolute`} >
        <MyImage
          src={swapIcon}
          width="24"
          height="24"
          alt="swap"
          layout="responsive"
        />
      </Button> */}
      <div className={`${styles.info} p-3 pb-0 text-uppercase`}>
        <h3 className="mb-1">{playerDetails?.sFullName || playerDetails?.sFirstName || '--'}</h3>
        <h4 className="mb-1">{playerDetails?.sCountryFull || playerDetails?.sNationality || '--'}</h4>
      </div>
      <div className={`${styles.playerPic} ms-auto`}>
        <PlayerImg
          head={playerDetails?.oImg}
          jersey={playerDetails?.oPrimaryTeam?.oJersey}
        />
        {/* <MyImage
          src={getImgURL(playerDetails?.oImg?.sUrl) || playerPlaceholder}
          width="200"
          height="200"
          alt={playerDetails?.oImg?.sText || 'player'}
          layout="responsive"
        /> */}
      </div>
    </div>
  )
}
PlayerInfo.propTypes = {
  playerDetails: PropTypes.object
}

export default PlayerInfo
