import React from 'react'
import PropTypes from 'prop-types'

import playerBackground from '@assets/images/icon/player-bg.svg'
import PlayerImgAMP from '@shared/components/amp/playerImgAMP'

function PlayerInfoAMP({ playerDetails }) {
  return (
    <>
      <style jsx amp-custom>
        {`.playerInfo{padding:0;background:var(--light-mode-bg) no-repeat left center/auto 100%;overflow:hidden}.playerPic{width:180px;height:180px}.info{margin-bottom:-16px}/*# sourceMappingURL=style.css.map */
        `}
      </style>
      <div className="playerInfo common-box p-0 overflow-hidden position-relative mt-2 t-uppercase" style={{ backgroundImage: `url(${playerBackground.src})` }}>
        <div className="info p-3 pb-0">
          <h3 className="mb-1">{playerDetails?.sFullName || playerDetails?.sFirstName || '--'}</h3>
          <h4 className="font-medium mb-1">{playerDetails?.sCountryFull || playerDetails?.sNationality || '--'}</h4>
        </div>
        <div className="playerPic ms-auto">
          <PlayerImgAMP
            head={playerDetails?.oImg}
            jersey={playerDetails?.oPrimaryTeam?.oJersey}
          />
        </div>
      </div>
    </>
  )
}

PlayerInfoAMP.propTypes = {
  playerDetails: PropTypes.object
}

export default PlayerInfoAMP
