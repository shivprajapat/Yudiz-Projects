import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import playerImg from '@assets/images/placeholder/player-placeholder.jpg'
import useTranslation from 'next-translate/useTranslation'

const MyImage = dynamic(() => import('@shared/components/myImage'))

const AvoidPlayer = ({ fantasystyles, avoidPlayers }) => {
  const { t } = useTranslation()
  return (
    <section className={`${styles.avoidPlayer} common-section pb-0`}>
      <p className={`${fantasystyles?.itemTitle} text-primary font-bold text-uppercase d-flex align-items-center`}>
        {t('common:AvoidPlayerMessage')}
      </p>
      <Row className={`${styles.list}`}>
        {avoidPlayers &&
          avoidPlayers.map((player, index) => (
            <Col sm={6} key={index}>
              <div className={`${styles.item} d-flex align-items-center mb-2`}>
                <div className={`${styles.imgBlock} flex-shrink-0 me-3 text-center`}>
                  <MyImage src={playerImg} alt="user" placeholder="blur" layout="responsive" width="40" height="40" />
                  <div className={`${styles.point} text-light bg-dark rounded-pill`}>
                    {player?.oPlayerFan?.nRating}
                  </div>
                </div>
                <div>
                  <p className="mb-1 font-bold">{player?.oPlayerFan?.oPlayer?.sFirstName}</p>
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
  playerData: PropTypes.array
}

export default AvoidPlayer
