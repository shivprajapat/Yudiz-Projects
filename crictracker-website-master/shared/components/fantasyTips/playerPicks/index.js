import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Nav, Row } from 'react-bootstrap'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import navstyles from '../../commonNav/./style.module.scss'
import useTranslation from 'next-translate/useTranslation'

const SinglePlayerPick = dynamic(() => import('../singlePlayerPick'))

const PlayerPicks = ({ fantasystyles, playerPicksData, playerTeam }) => {
  const { t } = useTranslation()
  const [selectedTab, setSelectedTab] = useState('captains')

  const handleTab = (value) => {
    setSelectedTab(value)
  }
  return (
    <section className={`${styles.playerPicks} common-section pb-0`} id="cVc">
      <p className={`${fantasystyles?.itemTitle} text-primary fw-bold text-uppercase d-flex align-items-center`}>
        {t('common:PlayerPicks')}
      </p>
      <Nav
        variant="pills"
        className={`${navstyles.commonNav} ${styles.nav} equal-width-nav text-uppercase scroll-list flex-nowrap text-nowrap mb-2`}
      >
        <Nav.Item className={`${navstyles.item} ${selectedTab === 'captains' ? styles.active : ''}`} onClick={() => handleTab('captains')}>
          <a className={'nav-link'}>{t('common:Captains')}</a>
        </Nav.Item>
        <Nav.Item className={`${navstyles.item} ${selectedTab === 'top' ? styles.active : ''}`} onClick={() => handleTab('top')}>
          <a className={'nav-link'}>{t('common:Top')}</a>
        </Nav.Item>
        <Nav.Item className={`${navstyles.item} ${selectedTab === 'budget' ? styles.active : ''}`} onClick={() => handleTab('budget')}>
          <a className={'nav-link'}>{t('common:Budget')}</a>
        </Nav.Item>
      </Nav>
      <Row>
        {selectedTab === 'captains' &&
          playerPicksData?.aCVCFan?.map((captainData, index) => (
            <SinglePlayerPick styles={styles} playerTeam={playerTeam} key={index} type={selectedTab} data={captainData} />
          ))}
        {selectedTab === 'top' &&
          playerPicksData?.aTopicPicksFan?.map((topPickData, index) => (
            <SinglePlayerPick styles={styles} playerTeam={playerTeam} key={index} type={selectedTab} data={topPickData} />
          ))}
        {selectedTab === 'budget' &&
          playerPicksData?.aBudgetPicksFan?.map((budgetData, index) => (
            <SinglePlayerPick styles={styles} playerTeam={playerTeam} key={index} type={selectedTab} data={budgetData} />
          ))}
      </Row>
    </section>
  )
}

PlayerPicks.propTypes = {
  fantasystyles: PropTypes.any,
  playerPicksData: PropTypes.object,
  playerTeam: PropTypes.object,
  playerData: PropTypes.array
}

export default PlayerPicks
