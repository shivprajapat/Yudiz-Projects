import React from 'react'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'
import { IPL_TEAM_NAME_WITH_ID } from '@shared/libs/promotion-banner'

const MatchScore = ({ match }) => {
  const handleScore = (score) => {
    return score.split(' ')[0]
  }
  return (
    <>
      <div className='d-flex flex-column align-items-center'>
        <div className={`badge mb-2 ${match?.sStatusStr === 'cancelled' || match?.sStatusStr === 'live' ? 'badge-danger' : 'badge-primary'}`}>{match?.sStatusStr}</div>
        <div className='matchInfo d-flex justify-content-center align-items-center'>
          <div className='teamScore d-flex flex-column align-items-center justify-content-center'>
            <p className='team mb-0 text-uppercase font-bold'>{IPL_TEAM_NAME_WITH_ID[match?.oTeamScoreA?.oTeam?._id] || match?.oTeamScoreA?.oTeam?.sAbbr}</p>
            <p className="mb-0 text-uppercase">{handleScore(match?.oTeamScoreA?.sScoresFull) || <b><Trans i18nKey="common:YetToBat" /></b>}</p>
          </div>
          <p className="mb-0 px-2">vs</p>
          <div className='teamScore d-flex flex-column align-items-center justify-content-center'>
            <p className='mb-0 team text-uppercase font-bold'>{IPL_TEAM_NAME_WITH_ID[match?.oTeamScoreB?.oTeam?._id] || match?.oTeamScoreB?.oTeam?.sAbbr}</p>
            <p className="mb-0 text-uppercase">{handleScore(match?.oTeamScoreB?.sScoresFull) || <b><Trans i18nKey="common:YetToBat" /></b>}</p>
          </div>
        </div>
      </div>
    </>
  )
}

MatchScore.propTypes = {
  match: PropTypes.object
}

export default MatchScore
