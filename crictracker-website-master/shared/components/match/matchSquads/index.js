import React from 'react'
import { Accordion } from 'react-bootstrap'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'

import styles from './style.module.scss'

const SquadItems = dynamic(() => import('./squadItems'))

const MatchSquads = ({ data }) => {
  const { t } = useTranslation()
  return (
    <section className={styles.matchSquads}>
      <h4 className="text-uppercase">{t('common:Squads')}</h4>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header className={styles.squadHead}>
            {data?.oTeam1?.oTeam?.sTitle} {t('common:Squad')}
          </Accordion.Header>
          <Accordion.Body className={styles.squadBody}>
            <div className="d-flex flex-wrap">
              {data?.oTeam1?.aPlayers?.map((player) => (
                <SquadItems key={player?._id} data={player} styles={styles} captainId={data?.oTeam1?.iC} />
              ))}
            </div>
            <p className={`${styles.reserve} text-center text-uppercase`}>{t('common:Reserve')}</p>
            <div className="d-flex flex-wrap">
              {data?.oTeam1?.aBenchedPlayers?.map((benchPlayer) => (
                <SquadItems key={benchPlayer?._id} data={benchPlayer} styles={styles} />
              ))}
            </div>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header className={`${styles.squadHead}`}>
            {data?.oTeam2?.oTeam?.sTitle} {t('common:Squad')}
          </Accordion.Header>
          <Accordion.Body className={`${styles.squadBody}`}>
            <div className="d-flex flex-wrap">
              {data?.oTeam2?.aPlayers?.map((player) => (
                <SquadItems key={player?._id} data={player} styles={styles} captainId={data?.oTeam2?.iC} />
              ))}
            </div>
            <p className={`${styles.reserve} text-center text-uppercase`}>{t('common:Reserve')}</p>
            <div className="d-flex flex-wrap">
              {data?.oTeam2?.aBenchedPlayers?.map((benchPlayer) => (
                <SquadItems key={benchPlayer?._id} data={benchPlayer} styles={styles} />
              ))}
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </section>
  )
}

MatchSquads.propTypes = {
  data: PropTypes.object
}

export default MatchSquads
