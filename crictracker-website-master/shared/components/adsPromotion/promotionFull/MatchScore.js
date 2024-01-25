import React from 'react'
import PropTypes from 'prop-types'
import styles from './style.module.scss'
import Trans from 'next-translate/Trans'
import { IPL_TEAM_NAME_WITH_ID } from '@shared/libs/promotion-banner'

const MatchScore = ({ match }) => {
  const handleScore = (score) => {
    return score.split(' ')[0]
  }
  return (
    <div className='d-flex flex-column align-items-center'>
      <div className={`${styles.badge} badge mb-2 ${match?.sStatusStr === 'cancelled' || match?.sStatusStr === 'live' ? styles.danger : ''}`}>{match?.sStatusStr}</div>
      <div className={`${styles.matchInfo} d-flex justify-content-center align-items-center`}>
        <div className={styles.teamScore}>
          <p className={`${styles.team} mb-0 fw-bold`}>{IPL_TEAM_NAME_WITH_ID[match?.oTeamScoreA?.oTeam?._id] || match?.oTeamScoreA?.oTeam?.sAbbr}</p>
          {match?.sStatusStr !== 'cancelled' && <p className="mb-0">{handleScore(match?.oTeamScoreA?.sScoresFull) || <b><Trans i18nKey="common:YetToBat" /></b>}</p>}
        </div>
        <p className="mb-0">vs</p>
        <div className={styles.teamScore}>
          <p className={`${styles.team} mb-0 fw-bold`}>{IPL_TEAM_NAME_WITH_ID[match?.oTeamScoreB?.oTeam?._id] || match?.oTeamScoreB?.oTeam?.sAbbr}</p>
          {match?.sStatusStr !== 'cancelled' && <p className="mb-0">{handleScore(match?.oTeamScoreB?.sScoresFull) || <b><Trans i18nKey="common:YetToBat" /></b>}</p>}
        </div>
      </div>
    </div>
  )
}

MatchScore.propTypes = {
  match: PropTypes.object
}

export default MatchScore
