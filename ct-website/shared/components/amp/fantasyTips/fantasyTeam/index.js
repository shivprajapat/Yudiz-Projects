import React from 'react'
import PropTypes from 'prop-types'
// import { Nav } from 'react-bootstrap'
import dynamic from 'next/dynamic'

import { FantasyTipsIcon } from '@shared-components/ctIcons'
import useTranslation from 'next-translate/useTranslation'
import { convertDateAMPM } from '@utils'
// leagueType
import { allRoutes } from '@shared/constants/allRoutes'

const SingleFantasyLeague = dynamic(() => import('../singleFantasyLeague'))

const FantasyTeam = ({ teamData, matchData, isBtn, updatedTime, type }) => {
  const { t } = useTranslation()
  return (
    <>
      <style jsx amp-custom>{`
        .d-flex{display:flex;display:-webkit-flex}.align-center{-webkit-align-items:center;align-items:center}.grow-1{flex-grow:1;justify-content:space-between}.toss{margin-bottom:8px;padding:8px;background:#f2f4f7;border-radius:8px}.toss .icon{display:block;width:28px;margin-right:4px}.toss p{margin:0}.teamSlider{margin:0px 34px;padding-bottom:24px}.nav{background:#e7f0ff}.nav a{color:#045de9}.nav .active a:hover,.nav .active a{background:#045de9;color:#fff}.predictions{margin-right:62px}.predictions svg{margin-right:4px}.predictions :hover path{fill:#045de9}@media(min-width: 768px){.fantasyTeam{padding:12px;border:1px solid #e4e6eb;border-radius:16px}}@media(max-width: 767px){.teamSlider{margin:0px 10px}.team,.teamBlock{border-radius:16px}.info{padding-left:12px;padding-right:12px}.info>p{font-size:12px}.predictions{margin-right:20px}}/*# sourceMappingURL=style.css.map */

        `}</style>
      <section className="common-section pb-0" id="team">
        <div className="fantasyTeam">
          <div className="toss p-2 mb-2">
            <div className="d-flex align-center">
              <span className="icon me-2">
                {matchData?.sStatusStr === 'scheduled' && <amp-img src="/static/toss-icon.svg" alt="user" layout="responsive" width="40" height="40"></amp-img>}
              </span>
              <div className="d-flex flex-column flex-md-row align-center justify-content-between grow-1">
                {matchData?.sStatusStr === 'scheduled' && <p className="d-flex align-center mb-0">{t('common:TeamsWillBeUpdatedAfterToss')}</p>}
                <p className="mb-0 text-muted">
                  {t('common:LastUpdatedOn')} {updatedTime && ' - ' + convertDateAMPM(updatedTime)}
                </p>
              </div>
            </div>
          </div>
          {/* <Nav
            variant="pills"
            className="commonNav nav equal-width-nav text-uppercase scroll-list flex-nowrap text-nowrap mb-2"
          >
            {teamData?.map((league, index) => {
              return (
                <Nav.Item
                  key={index}
                  className={`item ${selectedTab === league.eLeague && 'active'}`}
                  onClick={() => handleTab(league.eLeague)}
                >
                  <a className={'nav-link'}>{leagueType(league.eLeague)}</a>
                </Nav.Item>
              )
            })}
          </Nav> */}
          <amp-carousel
            width="auto"
            height="720"
            layout="fixed-height"
            type="slides"
            role="region"
            aria-label="Basic carousel"
            className="teamSlider fantasy-team-slider simple-arrow"
          >
            {teamData?.map((team, indexI) => {
              return (
                team?.aTeam?.map((fantasyTeam, indexJ) => {
                  return <SingleFantasyLeague key={indexI + indexJ} indexJ={indexJ} data={fantasyTeam} type={type} teamAID={matchData?.oTeamA?._id} />
                })
              )
            })}
          </amp-carousel>

          {!isBtn && (
            <p className="predictions font-bold small-text text-end">
              <a href={allRoutes.matchDetailFantasyTips(`/${matchData?.oSeo?.sSlug}/`)} className="d-flex justify-content-end align-center">
                <FantasyTipsIcon /> {t('common:MorePredictions')}
              </a>
            </p>
          )}
        </div>
      </section>
    </>
  )
}

FantasyTeam.propTypes = {
  fantasystyles: PropTypes.any,
  teamData: PropTypes.array,
  matchData: PropTypes.object,
  isBtn: PropTypes.bool,
  playerData: PropTypes.array,
  updatedTime: PropTypes.string,
  type: PropTypes.string
}

export default FantasyTeam
