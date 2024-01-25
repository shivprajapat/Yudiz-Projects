import React from 'react'
import PropTypes from 'prop-types'
import styles from './style.module.scss'

const MatchScore = ({ match }) => {
  const handleScore = (score) => {
    return score.split(' ')[0]
  }
  return (
    <div className='d-flex flex-column align-items-center'>
        <div className={`badge bg-light mb-2 ${match?.sStatusStr === 'cancelled' || match?.sStatusStr === 'live' ? 'text-danger' : 'text-primary'}`}>{match?.sStatusStr}</div>
        <div className={`${styles.matchInfo} d-flex justify-content-center align-items-center`}>
        <div>
            <p className={`${styles.team} mb-0 font-bold`}>{match?.oTeamScoreA?.oTeam?.sAbbr}</p>
            {match?.sStatusStr !== 'cancelled' && <p className="mb-0">{handleScore(match?.oTeamScoreA?.sScoresFull)}</p>}
        </div>
        <p className="mb-0">vs</p>
        <div>
            <p className={`${styles.team} mb-0 font-bold`}>{match?.oTeamScoreB?.oTeam?.sAbbr}</p>
            {match?.sStatusStr !== 'cancelled' && <p className="mb-0">{handleScore(match?.oTeamScoreB?.sScoresFull)}</p>}
        </div>
        </div>
    </div>
  )
}

MatchScore.propTypes = {
  match: PropTypes.object
}

export default MatchScore
