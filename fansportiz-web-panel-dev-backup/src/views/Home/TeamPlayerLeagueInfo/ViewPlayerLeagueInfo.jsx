/* eslint-disable react/prop-types */
import React, { Fragment, useEffect, useState } from 'react'
import moment from 'moment'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Button } from 'reactstrap'
import Loading from '../../../component/SkeletonPlayerLeagueInfo'
import { defaultPlayerRoleImages } from '../../../utils/helper'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import HomeImage from '../../../assests/images/homeIconWhite.svg'
import noPlayerStatsLogo from '../../../assests/images/noplayer-stat-logo.svg'
import info from '../../../assests/images/info-icon-gray.svg'
import qs from 'query-string'
import PlayerDetails from '../../../HOC/SportsLeagueList/PlayerDetails'
import useActiveSports from '../../../api/activeSports/queries/useActiveSports'
import classNames from 'classnames'
import useGetUrl from '../../../api/url/queries/useGetUrl'

function ViewPlayerLeagueInfo (props) {
  const { playerData, seasonMatch, loading, match } = props
  const { activeSport } = useActiveSports()
  const { sMediaUrl } = useGetUrl()
  const [playerTotalPoints, setPlayerTotalPoints] = useState(0)

  const { sportsType, sUserTeamId, sMatchId, sPlayerId, index, userLeague } = useParams()
  const [searchParams] = useSearchParams()
  const homePage = searchParams.get('homePage')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (seasonMatch) {
      const points = seasonMatch?.length > 1 ? seasonMatch.reduce((a, b) => a?.nScoredPoints + b?.nScoredPoints) : seasonMatch[0]?.nScoredPoints
      setPlayerTotalPoints(points || 0)
    }
  }, [seasonMatch])

  return (
    <Fragment>
      <div className="player-info p-league-info pb-0">
        <div className="league-header u-header">
          <div className="d-flex align-items-center header-i">
            <button
              className={document.dir === 'rtl' ? 'btn-link icon-right-arrow' : 'btn-link icon-left-arrow'}
              onClick={() => {
                if (location?.state?.teamCreationPage) {
                  navigate(`/create-team/${sportsType}/${sMatchId}`,
                    {
                      search: `?${qs.stringify({
                        homePage: homePage ? 'yes' : undefined
                      })}`,
                      state: { ...location.state }
                    })
                } else if (index && userLeague) {
                  navigate(`/team-preview/${sportsType}/${sMatchId}/${userLeague}/${sUserTeamId}/${parseInt(index)}`,
                    {
                      search: `?${qs.stringify({
                        homePage: homePage ? 'yes' : undefined
                      })}`
                    })
                } else {
                  navigate(`/my-teams-preview/${sportsType}/${sMatchId}/${sUserTeamId}`,
                    {
                      search: `?${qs.stringify({
                        homePage: homePage ? 'yes' : undefined
                      })}`
                    })
                }
              }}
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
            <img alt="" className="h-100 v-100 fullBorderRadius" src={playerData?.sImage && sMediaUrl ? `${sMediaUrl}${playerData?.sImage}` : defaultPlayerRoleImages(sportsType, playerData?.eRole)} />
          </div>
          <div className="player-d-i d-flex justify-content-around">
            <div className={`item m-0 ${document.dir === 'rtl' ? 'text-end' : 'text-start'}`}>
              <p><FormattedMessage id="Credits" /></p>
              <b>{playerData && playerData.nFantasyCredit ? playerData.nFantasyCredit : 0}</b>
            </div>
            <div className={`item m-0 ${document.dir === 'rtl' ? 'text-end' : 'text-start'}`}>
              <p><FormattedMessage id="Total_Points" /></p>
              <b>{playerTotalPoints}</b>
            </div>
          </div>
        </div>
        <ul className="p-league">
          {seasonMatch && seasonMatch.length > 0 && <h2 className="pli-t"><FormattedMessage id="Matchwise_Fantasy_Stats" /></h2>}
          {
            loading
              ? <Loading />
              : seasonMatch && seasonMatch.length > 0 && seasonMatch?.sort((a, b) => new Date(b?.oMatch?.dStartDate) - new Date(a?.oMatch?.dStartDate)).map(match2 => {
                return (
                  <li key={match?._id}
                    onClick={() => {
                      if (location?.state?.teamCreationPage) {
                        navigate(`/create-team/view-player-info/${(sportsType).toLowerCase()}/${sMatchId}/${match2?._id}`,
                          {
                            state: { ...location.state, matchPlayerId: match2?._id },
                            search: `?${qs.stringify({
                              playerLeagueInfo: 'y',
                              homePage: homePage ? 'y' : undefined,
                              userLeague: userLeague || undefined,
                              index: index ? parseInt(index) : undefined
                            })}`
                          })
                      } else {
                        navigate(`/view-player-info/${(sportsType).toLowerCase()}/${sMatchId}/${sUserTeamId}/${sPlayerId}`,
                          {
                            state: { matchPlayerId: match2?._id },
                            search: `?${qs.stringify({
                              playerLeagueInfo: 'y',
                              homePage: homePage ? 'y' : undefined,
                              userLeague: userLeague || undefined,
                              index: index ? parseInt(index) : undefined
                            })}`
                          })
                      }
                    }}
                  >
                    <div className="d-flex">
                      <h3 className={classNames('l-name', { 'text-end': document.dir === 'rtl' })}>
                        {match2?.oMatch?.sName}
                        {' '}
                        <span className='ps-2'><img src={info} /></span>
                      </h3>
                      <span className={classNames('l-date', { 'text-start': document.dir === 'rtl' })}>
                        {match2?.oMatch?.dStartDate && moment(match2.oMatch.dStartDate).format('ll')}
                        {' '}
                      </span>
                    </div>
                    <div className="d-flex">
                      <div className={classNames('l-state', { 'text-end': document.dir === 'rtl' })}>
                        <p><FormattedMessage id="Selected_by" /></p>
                        <b>
                          {match2?.nSetBy}
                          {' '}
                          <FormattedMessage id="Percentage" />
                        </b>
                      </div>
                      <div className="l-state text-center">
                        <p><FormattedMessage id="Credits" /></p>
                        <b>{match2?.nFantasyCredit}</b>
                      </div>
                      <div className={classNames('l-state', { 'text-end': document.dir !== 'rtl', 'text-start': document.dir === 'rtl' })}>
                        <p><FormattedMessage id="Points" /></p>
                        <b>{match2?.nScoredPoints}</b>
                      </div>
                    </div>
                  </li>
                )
              })
          }
          {
            seasonMatch?.length <= 0 && (
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
ViewPlayerLeagueInfo.propTypes = {
  onBackClick: PropTypes.func,
  onPlayerInfoClick: PropTypes.func,
  playerData: PropTypes.shape({
    eRole: PropTypes.string,
    sName: PropTypes.string,
    nFantasyCredit: PropTypes.number,
    nScoredPoints: PropTypes.number,
    sImage: PropTypes.string
  }),
  nScoredPoints: PropTypes.number,
  seasonMatch: PropTypes.array,
  loading: PropTypes.bool,
  pId: PropTypes.string
}
export default PlayerDetails(ViewPlayerLeagueInfo)
