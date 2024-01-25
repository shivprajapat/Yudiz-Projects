import React from 'react'
import PropTypes from 'prop-types'
import { Link, matchPath, useLocation } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import classNames from 'classnames'

// Images
import Medal from '../../../assests/images/medal.svg'
import leaderboardPlaceholder from '../../../assests/images/leaderboardPlaceholder.svg'
import infoIcon from '../../../assests/images/info-icon-gray.svg'

// Utils
import { isImageValid } from '../../../utils/helper'
import useGetUrl from '../../../api/url/queries/useGetUrl'

function LeaderboardCard (props) {
  const { data, leaderboardTitle, activeSport, currSeries } = props
  const { sMediaUrl } = useGetUrl()

  const location = useLocation()

  const leaderboardClass = classNames(`leaderboard-card ${props?.leaderboardCard ? 'leaderboard-card2' : ''}`, { round: props.round })
  const pathname1 = matchPath('/game/leader-board/v1', location.pathname) || matchPath('/game/leader-board/:id/v1', location.pathname) || matchPath('/game/leader-board/details/:detailsId/v1', location.pathname) ? `/game/leader-board/details/${data && data._id}/v1` : `/game/leader-board/details/${data && data._id}`
  const pathname2 = matchPath('/game/leader-board/v1', location.pathname) || matchPath('/game/leader-board/:id/v1', location.pathname) || matchPath('/game/leader-board/details/:detailsId/v1', location.pathname) ? `/game/leader-board/${data && data._id}/v1` : `/game/leader-board/${data && data._id}`

  return (
    <div className={leaderboardClass}>
      <Link className="info-link"
        state={ { data, leaderboardTitle, activeSport, currSeries } }
        to={{
          pathname: pathname1
        }}
      >
        <img src={infoIcon} />
      </Link>

      <Link className="lbc-inner"
        state={ { data, leaderboardTitle, activeSport, currSeries } }
        to={{
          pathname: pathname2
        }}
      >
        <div className="img">
          <img alt="" src={isImageValid(sMediaUrl + 'thumb/ ' + data?.sImage) ? `${sMediaUrl}thumb/${data?.sImage}` : leaderboardPlaceholder}/>
        </div>
        <div className="lbc-right">
          <h3>{data && data.sName}</h3>
          <p>
            <img alt="" src={Medal}/>
            <span><FormattedMessage id="First_Prize" /></span>
            {' '}
            {': '}
            {data?.sFirstPrize || 0}
          </p>
        </div>
      </Link>
    </div>
  )
}

LeaderboardCard.propTypes = {
  round: PropTypes.bool,
  leaderboardCard: PropTypes.bool,
  data: PropTypes.shape({
    _id: PropTypes.string,
    sName: PropTypes.string,
    sImage: PropTypes.string,
    sFirstPrize: PropTypes.string,
    aPrizeBreakup: PropTypes.array
  }),
  leaderboardTitle: PropTypes.string,
  activeSport: PropTypes.string,
  currSeries: PropTypes.string
}

export default LeaderboardCard
