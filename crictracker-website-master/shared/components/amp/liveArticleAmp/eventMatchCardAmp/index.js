import React from 'react'
import PropTypes from 'prop-types'

import FlagTeam from '@assets/images/placeholder/flag-placeholder.png'
import { S3_PREFIX } from '@shared/constants'
import { badgeColorDecide, convertDate, dateCheck, formatScoreData } from '@shared/utils'

import Trans from 'next-translate/Trans'
import CustomLink from '@shared/components/customLink'
import { allRoutes } from '@shared/constants/allRoutes'

// const MyImage = dynamic(() => import('@shared/components/myImage'))

function EventMatchCardAmp({ data, liveEventId }) {
  const liveBlogData = data?.iMatchId ? data.oMatch : formatScoreData(data.oTeams)

  const handleClick = (value) => {
    if (value?.sStatusStr === 'live') return allRoutes.matchDetailCommentary(value?.oSeo?.sSlug)
    else if (value?.sStatusStr === 'scheduled') return allRoutes.matchDetail(value?.oSeo?.sSlug)
    else if (value?.sStatusStr === 'completed' || value?.sStatusStr === 'cancelled') return allRoutes.matchDetailScorecard(`/${value?.oSeo?.sSlug}/`)
  }

  return (
    <>
      <style jsx amp-custom>{`
.teamImg{width:50px}.eventMatchCard{position:relative;padding:10px 0px;background:var(--light-mode-bg);border-radius:16px;border:1px solid var(--border-light)}.eventMatchCard p{margin:0}.MatchStartsAt{font-size:14px}.name{display:flex;flex-direction:column}.teamB{flex-direction:column-reverse}.alterStatusNote{display:block;color:var(--font-color)}.statusNote{display:none;font-size:10px}.info{text-align:center}.info span{color:#fff}.bg-success{background:#14b305}.bg-danger{background:#f14f4f}.bg-primary{background:#045de9}.team{width:196px;color:var(--font-color)}.nameContent{margin-top:12px;align-items:center;text-align:center}.score{margin-top:4px;color:var(--font-light)}.scoreCardLink{height:100%;width:100%;position:absolute;top:0;left:0;overflow:hidden;z-index:9999;background:rgba(0,0,0,0)}.teamB{flex-direction:column-reverse}@media(max-width: 575px){.team{width:90px}.name{font-size:14px;line-height:20px}.MatchStartsAt{font-size:12px;line-height:14px}}


`}
      </style>
      <div className='eventMatchCard position-relative d-flex flex-column align-items-center mb-2'>
        {liveBlogData?.oSeo?.sSlug ? <CustomLink href={handleClick(liveBlogData)} passHref>
          <a className='scoreCardLink'></a>
        </CustomLink> : null}
        <div className="w-100  d-flex align-items-center justify-content-between">
          <div className='team flex-shrink-0 text-start'>
            <div className='name d-flex align-items-center'>
              <div className='teamImg'>
                <amp-img
                  style={{ marginBottom: '0' }}
                  src={liveBlogData?.oTeamScoreA?.oTeam?.oImg?.sUrl ? `${S3_PREFIX}${liveBlogData?.oTeamScoreA?.oTeam?.oImg?.sUrl}` : FlagTeam}
                  alt={liveBlogData?.oTeamScoreA?.oTeam?.sAbbr}
                  width="50"
                  height="50"
                >
                </amp-img>
              </div>
              <div className='nameContent d-flex flex-column'>
                <b>{liveBlogData?.oTeamScoreA?.oTeam?.sAbbr}</b>
                {liveBlogData?.oTeamScoreA?.sScoresFull ? <p className='score font-semi small-text'>
                  <b>{liveBlogData?.oTeamScoreA?.sScoresFull}</b>
                </p> : null}
              </div>
            </div>
          </div>
          <div className='info text-center'>
            {data?.iMatchId ? <>
              <span className={`bg-${badgeColorDecide(liveBlogData?.sStatusStr)} badge live mb-1`}>
                {liveBlogData?.sStatusStr === 'completed' && <span>{liveBlogData?.sLiveGameStatusStr === 'none' ? <Trans i18nKey="common:Result" /> : liveBlogData?.sLiveGameStatusStr} </span>}
                {liveBlogData?.sStatusStr === 'live' && <span>{(liveBlogData?.sLiveGameStatusStr === 'none' || liveBlogData?.sLiveGameStatusStr === 'playing ongoing' || liveBlogData?.sLiveGameStatusStr === 'innings break') ? <Trans i18nKey="common:Live" /> : liveBlogData?.sLiveGameStatusStr} </span>}
                {liveBlogData?.sStatusStr === 'scheduled' && <span><Trans i18nKey="common:Upcoming" /></span>}
              </span>
              <p>{liveBlogData?.sSubtitle}, {liveBlogData?.oVenue?.sLocation}</p>
              {liveBlogData?.sStatusStr === 'scheduled' && (
                <p className='MatchStartsAt' ><Trans i18nKey="common:MatchStartsAt" /> {convertDate(dateCheck(liveBlogData?.dStartDate))}</p>
              )}
            </> : null}
            {<p className='statusNote large-text'>{liveBlogData?.sStatusNote}</p>}
          </div>
          <div className='team flex-shrink-0 text-end'>
            <div className='name teamB d-flex align-items-center justify-content-end'>
              <div className='nameContent d-flex flex-column'>
                <b>{liveBlogData?.oTeamScoreB?.oTeam?.sAbbr}</b>
                {liveBlogData?.oTeamScoreB?.sScoresFull ? <p className='score font-semi small-text'>
                  <b>{liveBlogData?.oTeamScoreB?.sScoresFull}</b>
                </p> : null}
              </div>
              <div className='teamImg'>
                <amp-img
                  style={{ marginBottom: '0' }}
                  src={liveBlogData?.oTeamScoreB?.oTeam?.oImg?.sUrl ? `${S3_PREFIX}${liveBlogData?.oTeamScoreB?.oTeam?.oImg?.sUrl}` : FlagTeam}
                  alt={liveBlogData?.oTeamScoreB?.oTeam?.sAbbr}
                  width="50"
                  height="50"
                />
              </div>
            </div>
          </div>
        </div>
        {<p className='alterStatusNote medium-text mt-2'>{liveBlogData?.sStatusNote}</p>}
      </div >
    </>
  )
}

EventMatchCardAmp.propTypes = {
  data: PropTypes.object,
  liveEventId: PropTypes.string
}

export default EventMatchCardAmp
