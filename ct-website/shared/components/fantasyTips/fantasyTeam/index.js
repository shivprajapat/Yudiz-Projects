import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { Nav } from 'react-bootstrap'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import navstyles from '../../commonNav/./style.module.scss'
import { FantasyTipsIcon } from '../../ctIcons'
import Slider from '@shared/components/slider'
import tossIcon from '@assets/images/icon/toss-icon.svg'
import useTranslation from 'next-translate/useTranslation'
import { convertDateAMPM, leagueType, sendMobileWebViewEvent } from '@utils'
import { allRoutes } from '@shared/constants/allRoutes'
import { useRouter } from 'next/router'

const SingleFantasyLeague = dynamic(() => import('../singleFantasyLeague'))
const MyImage = dynamic(() => import('@shared/components/myImage'))

const FantasyTeam = ({ teamData, matchData, isBtn, updatedTime, type }) => {
  const { t } = useTranslation()
  const [selectedTab, setSelectedTab] = useState()
  const router = useRouter()

  const handleTab = (value) => {
    setSelectedTab(value)
  }
  const handleEvent = (id) => {
    if (router?.query?.isMobileWebView) {
      sendMobileWebViewEvent(`matchPredictionId:${id}`)
    }
  }
  useEffect(() => {
    teamData && setSelectedTab(teamData[0]?.eLeague)
  }, [teamData])
  return (
    <section className="pt-2 pt-md-3" id="team">
      <div className={`${styles.fantasyTeam} bg-light`}>
        <div className={`${styles.toss} p-2 mb-2`}>
          <div className="d-flex align-items-center">
            {matchData?.sStatusStr === 'scheduled' && <span className={`${styles.icon} me-2`}>
              <MyImage src={tossIcon} alt="user" layout="responsive" width="40" height="40" />
            </span>}
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between flex-grow-1">
              {matchData?.sStatusStr === 'scheduled' && <p className="d-flex align-items-center mb-0">{t('common:TeamsWillBeUpdatedAfterToss')}</p>}
              <p className="mb-0 text-muted">
                {t('common:LastUpdatedOn')} {updatedTime && ' - ' + convertDateAMPM(updatedTime)}
              </p>
            </div>
          </div>
        </div>
        <Nav
          variant="pills"
          className={`${navstyles.commonNav} ${styles.nav} equal-width-nav text-uppercase scroll-list flex-nowrap text-nowrap mb-2`}
        >
          {teamData?.map((league, index) => {
            return (
              <Nav.Item
                key={index}
                className={`${navstyles.item} ${selectedTab === league.eLeague && styles.active}`}
                onClick={() => handleTab(league.eLeague)}
              >
                <a className={'nav-link'}>{leagueType(league.eLeague)}</a>
              </Nav.Item>
            )
          })}
        </Nav>
        <div className={`${styles.teamSlider} fantasy-team-slider simple-arrow pb-3`}>
          <Slider nav gap={0}>
            {teamData?.map((team, indexI) => {
              return (
                team.eLeague === selectedTab &&
                team?.aTeam?.map((fantasyTeam, indexJ) => {
                  return <SingleFantasyLeague styles={styles} key={indexI + indexJ} indexJ={indexJ} data={fantasyTeam} type={type} teamAID={matchData?.oTeamA?._id} />
                })
              )
            })}
          </Slider>
        </div>
        {!isBtn && (
          <p className={`${styles.predictions} font-bold small-text text-end`} onClick={() => handleEvent(matchData?._id)}>
            <Link href={allRoutes.matchDetailFantasyTips(`/${matchData?.oSeo?.sSlug}/`)} prefetch={false}>
              <a className="d-flex justify-content-end align-items-center" style={router?.query?.isMobileWebView && { pointerEvents: 'none' }}>
                <FantasyTipsIcon /> {t('common:MorePredictions')}
              </a>
            </Link>
          </p>
        )}
      </div>
    </section>
  )
}

FantasyTeam.propTypes = {
  fantasystyles: PropTypes.any,
  teamData: PropTypes.array,
  matchData: PropTypes.object,
  isBtn: PropTypes.bool,
  playerData: PropTypes.array,
  updatedTime: PropTypes.any,
  type: PropTypes.string
}

export default FantasyTeam
