import React from 'react'
import PropTypes from 'prop-types'
// import { Nav } from 'react-bootstrap'
import dynamic from 'next/dynamic'

import { FantasyTipsIcon } from '@shared-components/ctIcons'
import useTranslation from 'next-translate/useTranslation'
import { convertDateAMPM, leagueType } from '@utils'
// leagueType
import { allRoutes } from '@shared/constants/allRoutes'

const SingleFantasyLeague = dynamic(() => import('../singleFantasyLeague'))

const FantasyTeam = ({ teamData, matchData, isBtn, updatedTime, type, playerTeam }) => {
  const { t } = useTranslation()
  return (
    <>
      <style jsx amp-custom>{`
        .grow-1{flex-grow:1;justify-content:space-between}.toss{margin-bottom:8px;padding:8px;background:var(--light-bg);border-radius:8px}.toss .icon{display:block;width:28px;margin-right:4px}.toss p{margin:0}.teamSlider{margin:0px;padding-bottom:24px}.nav{background:var(--theme-light)}.nav a{color:var(--theme-color)}.nav .active a:hover,.nav .active a{background:var(--theme-color);color:#fff}.predictions{margin-right:20px}.predictions svg{margin-right:4px}.predictions path{fill:var(--theme-color)}.team,.teamBlock{border-radius:16px}.info{padding-left:12px;padding-right:12px}.info>p{font-size:12px}/*# sourceMappingURL=style.css.map */

      `}</style>
      <section className="pb-0" id="team">
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
          <div className="commonNav stickyNav d-flex isSticky themeLightNav text-nowrap text-uppercase equal-width-nav scroll-list flex-nowrap t-center">
            <amp-selector role="tablist" on="select:fantasyTeam.toggle(index=event.targetOption, value=true)">
              {teamData?.map((item, index) => {
                const { name, shortName } = leagueType(item.eLeague)
                return (
                  <div role="tab" option={String(index)} key={String(index)} selected={!index} className="item nav-link">
                    {shortName || name}
                  </div>
                )
              })}
            </amp-selector>
          </div>
          <div className="ampSelectorContent">
            <amp-selector id="fantasyTeam" role="listbox">
              <div className="viewOptions" role="tabpanel" option="">
                <amp-carousel
                  width="auto"
                  height="550"
                  layout="fixed-height"
                  type="slides"
                  role="region"
                  aria-label="Basic carousel"
                  className="teamSlider fantasy-team-slider simple-arrow"
                >
                  {teamData[0]?.aTeam?.map((fantasyTeam, indexJ) => (
                    <SingleFantasyLeague key={indexJ} indexJ={indexJ} data={fantasyTeam} type={type} playerTeam={playerTeam} teamAID={matchData?.oTeamA?._id} leagueType={teamData[0]?.eLeagueFull} />
                  ))}
                </amp-carousel>
              </div>
              <div className="viewOptions" role="tabpanel" option="">
                <amp-carousel
                  width="auto"
                  height="550"
                  layout="fixed-height"
                  type="slides"
                  role="region"
                  aria-label="Basic carousel"
                  className="teamSlider fantasy-team-slider simple-arrow"
                >
                  {teamData[1]?.aTeam?.map((fantasyTeam, indexJ) => (
                    <SingleFantasyLeague key={indexJ} indexJ={indexJ} data={fantasyTeam} type={type} playerTeam={playerTeam} teamAID={matchData?.oTeamA?._id} leagueType={teamData[1]?.eLeagueFull} />
                  ))}
                </amp-carousel>
              </div>
              <div className="viewOptions" role="tabpanel" option="" selected={true}>
                <amp-carousel
                  width="auto"
                  height="550"
                  layout="fixed-height"
                  type="slides"
                  role="region"
                  aria-label="Basic carousel"
                  className="teamSlider fantasy-team-slider simple-arrow"
                >
                  {teamData[2]?.aTeam?.map((fantasyTeam, indexJ) => {
                    return (
                      <SingleFantasyLeague key={indexJ} indexJ={indexJ} data={fantasyTeam} type={type} playerTeam={playerTeam} teamAID={matchData?.oTeamA?._id} leagueType={teamData[2]?.eLeagueFull} />
                    )
                  })}
                </amp-carousel>
              </div>
              <div className="viewOptions" role="tabpanel" option="">
                <amp-carousel
                  width="auto"
                  height="550"
                  layout="fixed-height"
                  type="slides"
                  role="region"
                  aria-label="Basic carousel"
                  className="teamSlider fantasy-team-slider simple-arrow"
                >
                  {teamData[3]?.aTeam?.map((fantasyTeam, indexJ) => {
                    return (
                      <SingleFantasyLeague key={indexJ} indexJ={indexJ} data={fantasyTeam} type={type} playerTeam={playerTeam} teamAID={matchData?.oTeamA?._id} leagueType={teamData[3]?.eLeagueFull} />
                    )
                  })}
                </amp-carousel>
              </div>
            </amp-selector>
          </div>

          {!isBtn && (
            <p className="predictions font-bold small-text text-end mt-1 mb-2">
              <a href={allRoutes.matchDetailFantasyTips(`/${matchData?.oSeo?.sSlug}/`)} className="d-flex justify-content-end align-items-center">
                <FantasyTipsIcon /> <span className="ms-1">{t('common:MoreMatchDetails')}</span>
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
  updatedTime: PropTypes.any,
  type: PropTypes.string,
  playerTeam: PropTypes.object
}

export default FantasyTeam
