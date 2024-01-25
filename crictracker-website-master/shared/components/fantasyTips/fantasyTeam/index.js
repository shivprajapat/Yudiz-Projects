import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Nav } from 'react-bootstrap'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

import styles from './style.module.scss'
import navstyles from '../../commonNav/./style.module.scss'
import { FantasyTipsIcon } from '@shared/components/ctIcons'
import Slider from '@shared/components/slider'
import tossIcon from '@assets/images/icon/toss-icon.svg'
import { convertDateAMPM, leagueType, sendMobileWebViewEvent } from '@utils'
import { allRoutes } from '@shared/constants/allRoutes'
import CustomLink from '@shared/components/customLink'

const SingleFantasyLeague = dynamic(() => import('../singleFantasyLeague'))
const MyImage = dynamic(() => import('@shared/components/myImage'))

const FantasyTeam = ({ teamData = [], matchData, isBtn, updatedTime, type, playerTeam }) => {
  const { t } = useTranslation()
  const [selectedTab, setSelectedTab] = useState(teamData?.[0]?.eLeague)
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
      <div className={`${styles.fantasyTeam} mb-2`}>
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
            const { name, shortName } = leagueType(league.eLeague)
            return (
              <Nav.Item
                key={index}
                className={`${navstyles.item} ${selectedTab === league.eLeague ? styles.active : ''}`}
                onClick={() => handleTab(league.eLeague)}
              >
                <a className={'nav-link'}>
                  <span className='d-none d-md-block'>{name}</span>
                  <span className='d-md-none'>{shortName || name}</span>
                </a>
              </Nav.Item>
            )
          })}
        </Nav>
        <div className={`${styles.teamSlider} fantasy-team-slider simple-arrow pb-3`}>
          <Slider nav gap={0} destroyBelow={1199}>
            {teamData?.map((team, indexI) => {
              return (
                team.eLeague === selectedTab &&
                team?.aTeam?.map((fantasyTeam, indexJ) => {
                  return (
                    <SingleFantasyLeague
                      playerTeam={playerTeam}
                      styles={styles}
                      key={indexI + indexJ}
                      indexJ={indexJ}
                      data={fantasyTeam}
                      type={type}
                      teamAID={matchData?.oTeamA?._id}
                      leagueType={leagueType(team.eLeague).name}
                    />
                  )
                })
              )
            })}
          </Slider>
        </div>
        {!isBtn && (
          <p className={`${styles.predictions} fw-bold small-text text-end`} onClick={() => handleEvent(matchData?._id)}>
            <CustomLink href={allRoutes.matchDetailFantasyTips(`/${matchData?.oSeo?.sSlug}/`)} prefetch={false}>
              <a className="d-flex justify-content-end align-items-center" style={router?.query?.isMobileWebView && { pointerEvents: 'none' }}>
                <FantasyTipsIcon /> {t('common:MoreMatchDetails')}
              </a>
            </CustomLink>
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
  type: PropTypes.string,
  playerTeam: PropTypes.object
}

export default FantasyTeam
