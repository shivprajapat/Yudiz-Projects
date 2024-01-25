import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'

import styles from './style.module.scss'

const PlayerImg = dynamic(() => import('@shared/components/playerImg'))

const AvoidPlayer = ({ fantasystyles, avoidPlayers, playerTeam }) => {
  const { t } = useTranslation()
  return (
    <section className={`${styles.avoidPlayer} common-section pb-0`} id="avoidablePlayers">
      <p className={`${fantasystyles?.itemTitle} text-primary fw-bold text-uppercase d-flex align-items-center`}>
        {t('common:AvoidPlayerMessage')}
      </p>
      <Row className={`${styles.list}`}>
        {avoidPlayers &&
          avoidPlayers?.map((player, index) => (
            <Col sm={6} key={index}>
              <div className={`${styles.item} d-flex align-items-center mb-2`}>
                <div className={`${styles.imgBlock} flex-shrink-0 me-3 text-center`}>
                  <PlayerImg
                    head={player?.oPlayerFan?.oPlayer?.oImg}
                    jersey={playerTeam[player?.oPlayerFan?.oTeam?._id]?.oJersey}
                    enableBg
                  />
                  <div className={`${styles.point} text-light bg-dark rounded-pill`}>
                    {player?.oPlayerFan?.nRating}
                  </div>
                </div>
                <div>
                  <p className="mb-1 fw-bold">{player?.oPlayerFan?.oPlayer?.sFirstName}</p>
                  <p className="text-secondary mb-1">
                    {player?.oPlayerFan?.oTeam?.sAbbr && player?.oPlayerFan?.oTeam?.sAbbr + ' | '} {player?.oPlayerFan?.oPlayer?.sPlayingRole?.toUpperCase()}
                  </p>
                  {player?.sDescription && <p className="mb-0 text-secondary">{player?.sDescription}</p>}
                </div>
              </div>
            </Col>
          ))}
      </Row>
    </section>
  )
}

AvoidPlayer.propTypes = {
  fantasystyles: PropTypes.any,
  avoidPlayers: PropTypes.array,
  playerData: PropTypes.array,
  playerTeam: PropTypes.object
}

export default AvoidPlayer
