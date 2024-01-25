import React from 'react'
import CustomLink from '@shared/components/customLink'
import PropTypes from 'prop-types'
import { convertDt24h, getStandingsMatchData } from '@shared/utils'

export default function StandingMatchData({ match, teamId }) {
  const data = getStandingsMatchData(match, teamId)
  return (
    <tr>
      <td>
        <span className="d-block">{data?.sOpponentTeam}</span>
        {match?.sWinMargin || match?.sStatusStr === 'cancelled' || data.isDraw ? <CustomLink href={match?.oSeo?.sSlug}>
          <a className="d-inline-block text-decoration-underline">{match?.sWinMargin && !data.isDraw ? `${data.isWinner ? 'Won' : 'Loss'} by ${match?.sWinMargin}` : match?.sStatusNote}</a>
        </CustomLink> : null}
      </td>
      <td>{match?.sSubtitle}</td>
      <td>{convertDt24h(match.dStartDate)}</td>
    </tr>
  )
}

StandingMatchData.propTypes = {
  match: PropTypes.object.isRequired,
  teamId: PropTypes.string
}
