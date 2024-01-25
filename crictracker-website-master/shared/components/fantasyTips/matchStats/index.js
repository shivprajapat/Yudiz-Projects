import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Col, Nav, Row } from 'react-bootstrap'
import { useLazyQuery } from '@apollo/client'
import Trans from 'next-translate/Trans'

import styles from './style.module.scss'
import navStyles from '@shared-components/commonNav/style.module.scss'
import StatPlayer from '@shared-components/statPlayer'
import { FANTASY_PLAYERS_STATS } from '@graphql/fantasy-tips/fantasy-tips.query'
import { fantasyMatchPlayerStats, fantasyMatchPlayerStatsTypes } from '@shared/libs/fantasyMatchPlayerStats'
import { matchStatsLoader } from '@shared/libs/allLoader'

const MatchStats = ({ fantasyStyles, fantasyArticleData, playerTeam }) => {
  const [activeTab, setActiveTab] = useState(fantasyMatchPlayerStatsTypes[0])
  const [payload, setPayload] = useState({ iSeriesId: fantasyArticleData?.oMatch?.oSeries?._id, aSeriesStatsType: [activeTab], nLimit: 6, aTeamId: [fantasyArticleData?.oMatch?.oTeamA?._id, fantasyArticleData?.oMatch?.oTeamB?._id] })
  const [playerData, setPlayerData] = useState()

  const [getPlayerData, { loading }] = useLazyQuery(FANTASY_PLAYERS_STATS, {
    onCompleted: (data) => {
      if (data && data.fetchFantasyPlayerStats) {
        setPlayerData(data.fetchFantasyPlayerStats?.length ? data.fetchFantasyPlayerStats[0] : [])
      }
    }
  })
  useEffect(() => {
    setPayload({ ...payload, aSeriesStatsType: [activeTab] })
  }, [activeTab])

  useEffect(() => {
    getPlayerData({ variables: { input: payload } })
  }, [payload])

  if (playerData?.aData?.length) {
    return (
      <div className='mt-4'>
        <p className={`${fantasyStyles.itemTitle} text-primary fw-bold text-uppercase d-flex align-items-center`}>
          <Trans i18nKey="common:PlayersStatsInSeries" />
        </p>
        <Nav className={`${navStyles.commonNav} ${navStyles.isSticky} ${navStyles.themeLightNav} text-nowrap text-uppercase equal-width-nav scroll-list flex-nowrap`} variant="pills">
          {
            fantasyMatchPlayerStats?.map((item, index) => {
              return (
                <Nav.Item key={index} className={navStyles.item}>
                  <a className={`${activeTab === item?.internalName && navStyles.active} nav-link`} onClick={() => setActiveTab(item?.internalName)}>
                    {item?.navItem}
                  </a>
                </Nav.Item>
              )
            })
          }
        </Nav>
        {loading ? matchStatsLoader() : (
          <Row className='gx-2 gx-md-3'>
            {playerData?.aData?.map((player, index) => {
              return (
                <Col key={index} md={6} className={`${styles.statItem} mb-0`}>
                  <StatPlayer playerTeam={playerTeam} data={player} index={index + 1} activeTab={playerData.eSeriesStatsType} />
                </Col>
              )
            })}
          </Row>
        )}

      </div>
    )
  } else {
    return null
  }
}
MatchStats.propTypes = {
  fantasyArticleData: PropTypes.object,
  playerTeam: PropTypes.object,
  fantasyStyles: PropTypes.any
}

export default MatchStats
