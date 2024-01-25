import React, { Fragment } from 'react'
import moment from 'moment'
import { Link, useParams } from 'react-router-dom'
import { Button } from 'reactstrap'
import Loading from '../../../component/SkeletonPlayerLeagueInfo'
import { defaultPlayerRoleImages } from '../../../utils/helper'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import HomeImage from '../../../assests/images/homeIconWhite.svg'
import noPlayerStatsLogo from '../../../assests/images/noplayer-stat-logo.svg'
import info from '../../../assests/images/info-icon-gray.svg'
import PlayerDetails from '../../../HOC/SportsLeagueList/PlayerDetails'
import useActiveSports from '../../../api/activeSports/queries/useActiveSports'
import classNames from 'classnames'
import useGetUrl from '../../../api/url/queries/useGetUrl'

function PlayerLeagueInfo (props) {
  const { playerData, seasonMatch, loading, match, onBackClick, onPlayerInfoClick, playerScorePoints } = props
  const { activeSport } = useActiveSports()
  const { sMediaUrl } = useGetUrl()

  const { sportsType } = useParams()

  function goToScoreList (match) {
    playerScorePoints(match._id)
    onPlayerInfoClick()
  }

  return (
    <Fragment>
      <div className="player-info p-league-info pb-0">
        <div className="league-header u-header">
          <div className="d-flex align-items-center header-i">
            <button
              className={document.dir === 'rtl' ? 'btn-link icon-right-arrow' : 'btn-link icon-left-arrow'}
              onClick={() => onBackClick()}
            />
            <Button className='button-link bg-transparent py-2' tag={Link} to={`/home/${activeSport}`}><img src={HomeImage} /></Button>
            <div className={document.dir === 'rtl' ? 'text-end' : ''}>
              <h1>{playerData && playerData.sName ? playerData.sName : ''}</h1>
              <p>
                {playerData && playerData.sTeamName}
                {', '}
                {playerData && playerData.eRole}
              </p>
            </div>
          </div>
        </div>
        <div className="player-detail d-flex align-items-center">
          <div className="p-i mt-0">
            <img alt="" className="h-100 v-100 fullBorderRadius" src={playerData?.sImage && sMediaUrl ? `${sMediaUrl}${playerData?.sImage}` : defaultPlayerRoleImages(sportsType, playerData.eRole)} />
          </div>
          <div className="player-d-i d-flex justify-content-around">
            <div className="item m-0">
              <p><FormattedMessage id="Credits" /></p>
              <b>{playerData && playerData.nFantasyCredit ? playerData.nFantasyCredit : 0}</b>
            </div>
            <div className="item m-0">
              <p><FormattedMessage id="Total_Points" /></p>
              <b>{playerData && playerData.nScoredPoints ? playerData.nScoredPoints : 0}</b>
            </div>
          </div>
        </div>
        <ul className="p-league">
          {seasonMatch && seasonMatch.length > 0 && <h2 className="pli-t"><FormattedMessage id="Matchwise_Fantasy_Stats" /></h2>}
          {
            loading
              ? <Loading />
              : seasonMatch && seasonMatch.length > 0 && seasonMatch.map(match2 => {
                return (
                  <li key={match._id}
                    onClick={() => goToScoreList(match2)}
                  >
                    <div className="d-flex">
                      <h3 className="l-name">
                        {match2 && match2.oMatch && match2.oMatch.sName}
                        {' '}
                        <span className='ps-2'><img src={info} /></span>
                      </h3>
                      <span className="l-date">
                        {match2 && match2.oMatch && match2.oMatch.dStartDate && moment(match2.oMatch.dStartDate).format('ll')}
                        {' '}
                      </span>
                    </div>
                    <div className="d-flex">
                      <div className={classNames('l-state', { 'text-end': document.dir === 'rtl' })}>
                        <p><FormattedMessage id="Selected_by" /></p>
                        <b>
                          {match2 && match2.nSetBy && match2.nSetBy}
                          {' '}
                          <FormattedMessage id="Percentage" />
                        </b>
                      </div>
                      <div className="l-state text-center">
                        <p><FormattedMessage id="Credits" /></p>
                        <b>{match2 && match2.nFantasyCredit && match2.nFantasyCredit}</b>
                      </div>
                      <div className={classNames('l-state', { 'text-end': document.dir !== 'rtl', 'text-start': document.dir === 'rtl' })}>
                        <p><FormattedMessage id="Points" /></p>
                        <b>{match2 && match2.nScoredPoints && match2.nScoredPoints}</b>
                      </div>
                    </div>
                  </li>
                )
              })
          }
          {
            seasonMatch && !seasonMatch.length && (
            <div className="no-team d-flex align-items-center justify-content-center fixing-width2">
              <div className='px-4'>
                <img src={noPlayerStatsLogo} />
                <h6 className='mt-4'>
                  <FormattedMessage id="No_stats_available_for_this_player_yet" />
                </h6>
              </div>
            </div>
            )
          }
        </ul>
      </div>
    </Fragment>
  )
}

PlayerLeagueInfo.propTypes = {
  onBackClick: PropTypes.func,
  onPlayerInfoClick: PropTypes.func,
  playerData: PropTypes.shape({
    eRole: PropTypes.string,
    sName: PropTypes.string,
    nFantasyCredit: PropTypes.number,
    nScoredPoints: PropTypes.number,
    sImage: PropTypes.string,
    sTeamName: PropTypes.string
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      matchID: PropTypes.string,
      playerId: PropTypes.string,
      userTeamID: PropTypes.string,
      sportsType: PropTypes.string
    }),
    _id: PropTypes.string
  }),
  history: PropTypes.object,
  nScoredPoints: PropTypes.number,
  seasonMatch: PropTypes.array,
  loading: PropTypes.bool,
  pId: PropTypes.string,
  playerScorePoints: PropTypes.func
}

export default PlayerDetails(PlayerLeagueInfo)
