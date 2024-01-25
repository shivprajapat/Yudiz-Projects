import React from 'react'
import PropTypes from 'prop-types'

import TitleAMP from '@shared/components/amp/playerAMP/titleAMP'
import RecentMatchStats from '../recentMatchStats'

function PlayerRecentMatchesAMP({ playerDetails, playerRecentMatch }) {
  if (playerRecentMatch?.length) {
    return (
      <>
        <style jsx amp-custom>{`
        .ampSelectorContent amp-selector{outline:none;margin-bottom:0px;border-radius:16px}.ampSelectorContent amp-selector .viewOptions{display:none;outline:none}.ampSelectorContent amp-selector .viewOptions[selected]{display:block}.commonNav{margin:0px -6px 8px;white-space:nowrap;overflow:auto}.commonNav amp-selector{display:flex}.commonNav amp-selector [option][selected]{outline:0;color:#fff;background-color:#045de9;border-radius:2em}.commonNav amp-selector .item{-webkit-flex-grow:1;flex-grow:1;display:block;padding:5px 12px;font-size:12px;line-height:18px;color:var(--font-color-light);font-weight:700;background:var(--theme-bg);border-radius:2em;margin:0 6px}.commonNav amp-selector .item:hover{color:#fff;background-color:#045de9}.commonNav.themeLightNav a.active{background:var(--light-mode-bg)}.commonNav amp-selector,.commonNav .nav-link{flex-grow:1}/*# sourceMappingURL=style.css.map */
        `}
        </style>

        <section className="common-box">
          <div>
            <TitleAMP heading={'RecentForm'} />
            <div className="commonNav stickyNav d-flex isSticky themeLightNav text-nowrap t-uppercase equal-width-nav scroll-list flex-nowrap t-center">
              <amp-selector role="tablist" on="select:playerRecentMatch.toggle(index=event.targetOption, value=true)">
                {['ALL', 'TEST', 'ODI', 'T20']?.map((item, index) => (
                  <div role="tab" option={String(index)} key={`item${String(index)}`} selected={!index} className="item nav-link">
                    {item}
                  </div>
                ))}
              </amp-selector>
            </div>
            <div className="ampSelectorContent">
              <amp-selector id="playerRecentMatch" role="listbox">
                <div className="viewOptions" role="tabpanel" option="" selected={true}>
                  <RecentMatchStats playerDetails={playerDetails} playerRecentMatchData={playerRecentMatch.find(ele => ele.sFormatStr === 'all')?.aMatchData} isAll />
                </div>
                <div className="viewOptions" role="tabpanel" option="">
                  <RecentMatchStats playerDetails={playerDetails} playerRecentMatchData={playerRecentMatch.find(ele => ele.sFormatStr === 'test')?.aMatchData} />
                </div>
                <div className="viewOptions" role="tabpanel" option="">
                  <RecentMatchStats playerDetails={playerDetails} playerRecentMatchData={playerRecentMatch.find(ele => ele.sFormatStr === 'odi')?.aMatchData} />
                </div>
                <div className="viewOptions" role="tabpanel" option="">
                  <RecentMatchStats playerDetails={playerDetails} playerRecentMatchData={playerRecentMatch.find(ele => ele.sFormatStr === 't20')?.aMatchData} />
                </div>
              </amp-selector>
            </div>
          </div>
        </section>
      </>
    )
  } else return null
}

PlayerRecentMatchesAMP.propTypes = {
  playerDetails: PropTypes.object,
  playerRecentMatch: PropTypes.array
}
export default PlayerRecentMatchesAMP
