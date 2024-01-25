import React, { Fragment, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { getRandomColor, createImageFromInitials } from '../components/LetterImage'
import Loading from '../../../component/Loading'
import { isUpperCase } from '../../../utils/helper'
import PlayerImage from '../../../assests/images/PlayerImage.png'
import CompareTeam from '../../../HOC/SportsLeagueList/CompareTeam'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import useGetUrl from '../../../api/url/queries/useGetUrl'
const classNames = require('classnames')

function TeamComparePage (props) {
  const { opponentTeam, myTeam, team1, team2, team1ScorePoint, team2ScorePoint, loading } = props
  const [sortedOpponentTeam, setData] = useState([])
  const [firstRank, setFirstRank] = useState('')
  const [secondRank, setSecondRank] = useState('')
  const { sMediaUrl } = useGetUrl()

  const { sFirstTeamId, sSecondTeamId, sportsType } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => { // handle the response
    if (sportsType) {
      const sport = sportsType
      isUpperCase(sport) && navigate(`/team-compare/${sport.toLowerCase()}/${sFirstTeamId}/${sSecondTeamId}`)
    }
    if (location && location.state) {
      setFirstRank(location?.state?.firstRank)
      setSecondRank(location?.state?.secondRank)
    }
  }, [])
  useEffect(() => { // handle the response
    if (opponentTeam && opponentTeam.notCommon) {
      const data = opponentTeam && opponentTeam.notCommon && opponentTeam.notCommon.length !== 0 && opponentTeam.notCommon.sort((a, b) => (a.eRole > b.eRole) ? 1 : -1)
      setData(data)
    }
  }, [opponentTeam])
  return (
    <>
      {loading && <Loading />}
      <div className="user-container no-footer">
        <div className="team-compare-name d-flex bg-white">
          <div className={`tc-box ${document.dir === 'rtl' ? 'text-end' : 'text-start'}`}>
            <div className="tc-img">
              <img alt="" className='fixImgHeiWid' src={team1.sProPic ? sMediaUrl + 'thumb/' + team1.sProPic : createImageFromInitials(500, team1.sUserName, getRandomColor())} />
            </div>
            <h2>
              {team1.sUserName}
              {' '}
              (
              {team1.sName}
              )
            </h2>
            <p>
              <FormattedMessage id="Hash" />
              {' '}
              {firstRank || (team1.nRank ? team1.nRank : '-')}
            </p>
          </div>
          <div className="t-points text-center">
            <p className="m-0"><FormattedMessage id="Total_Points" /></p>
            <div className="points-box d-flex">
              <i className="icon-compare" />
              <span className={classNames({ active: team1ScorePoint > team2ScorePoint })}>{team1ScorePoint}</span>
              <span className={classNames({ active: team2ScorePoint > team1ScorePoint })}>{team2ScorePoint}</span>
            </div>
          </div>
          <div className={`tc-box ${document.dir === 'rtl' ? 'text-start' : 'text-end'}`}>
            <div className="tc-img">
              <img alt="" className='fixImgHeiWid' src={team2.sProPic ? sMediaUrl + 'thumb/' + team2.sProPic : createImageFromInitials(500, team2.sUserName, getRandomColor())} />
            </div>
            <h2>
              {team2.sUserName}
              {' '}
              (
              {team2.sName}
              )
            </h2>
            <p>
              <FormattedMessage id="Hash" />
              {' '}
              {secondRank || (team2.nRank ? team2.nRank : '-')}
            </p>
          </div>
        </div>
        {(team1.nTotalPoints && team2.nTotalPoints) && (
          <div className="twon-txt">
            {
              (team1.nTotalPoints > team2.nTotalPoints)
                ? (
                  <p>
                    {team1.sUserName}
                    {' '}
                    (
                    {team1.sName}
                    )
                    {' '}
                    <span className='won-by-color'><FormattedMessage id="won_by" /></span>
                    {' '}
                    <span>{team1.nTotalPoints - team2.nTotalPoints}</span>
                    {' '}
                    <FormattedMessage id="Points" />
                    {' '}
                  </p>
                  )
                : (team1.nTotalPoints < team2.nTotalPoints)
                    ? (
                      <p>
                        {team2.sUserName}
                        {' '}
                        (
                        {team2.sName}
                        )
                        {' '}
                        <span className='won-by-color'><FormattedMessage id="won_by" /></span>
                        {' '}
                        <span>{team2.nTotalPoints - team1.nTotalPoints}</span>
                        {' '}
                        <FormattedMessage id="Points" />
                        {' '}
                      </p>
                      )
                    : (team1.nTotalPoints === team2.nTotalPoints) && (
                    <p>
                      {' '}
                      <FormattedMessage id="Both_teams_have_same_points" />
                      {' '}
                    </p>
                      )
            }
          </div>
        )}
        <div className="compare-player bg-white">
          {
            myTeam.nCapPoints > opponentTeam.nCapPoints
              ? (
                <div className="point-title">
                  {' '}
                  <span className='point-title-span-color'><FormattedMessage id="Your_Teams_C_and_VC_lead_by" /></span>
                  {' '}
                  <span>{myTeam && myTeam.nCapPoints && opponentTeam.nCapPoints && (myTeam.nCapPoints - opponentTeam.nCapPoints)}</span>
                  {' '}
                  <FormattedMessage id="Pts" />
                  {' '}
                </div>
                )
              : (myTeam.nCapPoints === opponentTeam.nCapPoints)
                  ? (
                    <div className="point-title">
                      {' '}
                      <span className='point-title-span-color'><FormattedMessage id="Both_teams_C_and_VC_have_Same_Points" /></span>
                      {' '}
                      <span>{myTeam && myTeam.nCapPoints}</span>
                      {' '}
                      <FormattedMessage id="Pts" />
                      {' '}
                    </div>
                    )
                  : (
                    <div className="point-title">
                      {' '}
                      <span className='point-title-span-color'><FormattedMessage id="Your_opponents_C_and_VC_lead_by" /></span>
                      {' '}
                      <span>{opponentTeam && opponentTeam.nCapPoints && (opponentTeam.nCapPoints - myTeam.nCapPoints)}</span>
                      {' '}
                      <FormattedMessage id="Pts" />
                      {' '}
                    </div>
                    )
          }
          <div className="p-c-box d-flex align-items-center">
            <div className="p-box d-flex align-items-center">
              <div className="img">
                <img alt="" src={myTeam && myTeam.captain && myTeam.captain.sImage ? `${sMediaUrl}${myTeam.captain.sImage}` : PlayerImage} />
                <span className="p">
                  {' '}
                  <FormattedMessage id="C" />
                  {' '}
                </span>
              </div>
              <div className={`p-name ${document.dir === 'rtl' ? 'text-end' : 'text-start'}`}>
                <h3>{myTeam && myTeam.captain && myTeam.captain.sName}</h3>
                <p className={document.dir === 'rtl' ? 'd-flex justify-content-start' : ''}>
                  <span className={document.dir === 'rtl' ? 'ms-2' : 'me-2'}>{myTeam?.captain?.oTeam?.sName}</span>
                  {' '}
                  {myTeam && myTeam.captain && myTeam.captain.eRole}
                </p>
              </div>
            </div>
            {myTeam && myTeam.captain && opponentTeam && opponentTeam.captain && (myTeam.captain.nScoredPoints * 2 !== opponentTeam.captain.nScoredPoints * 2)
              ? (
                <div className="p-c-p-box justify-content-center d-flex">
                  <span className={classNames({ active: myTeam && myTeam.captain && opponentTeam && opponentTeam.captain && (myTeam.captain.nScoredPoints > opponentTeam.captain.nScoredPoints) }) }>{myTeam && myTeam.captain && (myTeam.captain.nScoredPoints * 2)}</span>
                  <span className={classNames({ active: myTeam && myTeam.captain && opponentTeam && opponentTeam.captain && (myTeam.captain.nScoredPoints < opponentTeam.captain.nScoredPoints) }) }>{opponentTeam && opponentTeam.captain && (opponentTeam.captain.nScoredPoints * 2)}</span>
                </div>
                )
              : (
                <div className="p-c-p-box justify-content-center d-flex">
                  <span>{myTeam && myTeam.captain && (myTeam.captain.nScoredPoints * 2)}</span>
                </div>
                )
            }
            <div className="p-box d-flex align-items-center">
              <div className={`p-name ${document.dir === 'rtl' ? 'text-start' : 'text-end'}`}>
                <h3>{opponentTeam && opponentTeam.captain && opponentTeam.captain.sName}</h3>
                <p className={document.dir === 'rtl' ? 'd-flex justify-content-end' : ''}>
                  {opponentTeam && opponentTeam.captain && opponentTeam.captain.eRole}
                  {' '}
                  <span className={document.dir === 'rtl' ? 'me-2' : 'ms-2'}>{opponentTeam?.captain?.oTeam?.sName}</span>
                </p>
              </div>
              <div className="img">
                <img alt="" src={opponentTeam && opponentTeam.captain && opponentTeam.captain.sImage ? `${sMediaUrl}${opponentTeam.captain.sImage}` : PlayerImage} />
                <span className="p">
                  {' '}
                  <FormattedMessage id="C" />
                </span>
              </div>
            </div>
          </div>
          <div className="p-c-box d-flex align-items-center">
            <div className="p-box d-flex align-items-center">
              <div className="img">
                <img alt="" src={myTeam && myTeam.captain && myTeam.viceCaptain.sImage ? `${sMediaUrl}${myTeam.viceCaptain.sImage}` : PlayerImage} />
                <span className="p"><FormattedMessage id="VC" /></span>
              </div>
              <div className={`p-name ${document.dir === 'rtl' ? 'text-end' : 'text-start'}`}>
                <h3>{myTeam && myTeam.viceCaptain && myTeam.viceCaptain.sName}</h3>
                <p className={document.dir === 'rtl' ? 'd-flex justify-content-start' : ''}>
                  <span className={document.dir === 'rtl' ? 'ms-2' : 'me-2'}>{myTeam?.viceCaptain?.oTeam?.sName}</span>
                  {' '}
                  {myTeam && myTeam.viceCaptain && myTeam.viceCaptain.eRole}
                </p>
              </div>
            </div>
            {myTeam && myTeam.viceCaptain && opponentTeam && opponentTeam.viceCaptain && (myTeam.viceCaptain.nScoredPoints * 1.5 !== opponentTeam.viceCaptain.nScoredPoints * 1.5)
              ? (
                <div className="p-c-p-box justify-content-center d-flex">
                  <span className={classNames({ active: myTeam && myTeam.viceCaptain && opponentTeam && opponentTeam.viceCaptain && (myTeam.viceCaptain.nScoredPoints > opponentTeam.viceCaptain.nScoredPoints) })}>{myTeam && myTeam.viceCaptain && (myTeam.viceCaptain.nScoredPoints * 1.5)}</span>
                  <span className={classNames({ active: myTeam && myTeam.viceCaptain && opponentTeam && opponentTeam.viceCaptain && (myTeam.viceCaptain.nScoredPoints < opponentTeam.viceCaptain.nScoredPoints) })}>{opponentTeam && opponentTeam.viceCaptain && (opponentTeam.viceCaptain.nScoredPoints * 1.5)}</span>
                </div>
                )
              : (
                <div className="p-c-p-box justify-content-center d-flex">
                  <span>{myTeam && myTeam.captain && (myTeam.captain.nScoredPoints * 2)}</span>
                </div>
                )
            }
            <div className="p-box d-flex align-items-center">
              <div className={`p-name ${document.dir === 'rtl' ? 'text-start' : 'text-end'}`}>
                <h3>{opponentTeam && opponentTeam.viceCaptain && opponentTeam.viceCaptain.sName}</h3>
                <p className={document.dir === 'rtl' ? 'd-flex justify-content-end' : ''}>
                  {opponentTeam && opponentTeam.viceCaptain && opponentTeam.viceCaptain.eRole}
                  {' '}
                  <span className={document.dir === 'rtl' ? 'me-2' : 'ms-2'}>{opponentTeam?.viceCaptain?.oTeam?.sName}</span>
                </p>
              </div>
              <div className="img">
                <img alt="" src={opponentTeam && opponentTeam.viceCaptain && opponentTeam.viceCaptain.sImage ? `${sMediaUrl}${opponentTeam.viceCaptain.sImage}` : PlayerImage} />
                <span className="p"><FormattedMessage id="VC" /></span>
              </div>
            </div>
          </div>
        </div>
        <div className="compare-player bg-white">
          {
            myTeam.nDifferentPoints > opponentTeam.nDifferentPoints
              ? (
                <div className="point-title">
                  {' '}
                  <span className='point-title-span-color'><FormattedMessage id="Your_Teams_players_lead_by" /></span>
                  {' '}
                  <span>
                    {' '}
                    {myTeam && myTeam.nDifferentPoints && opponentTeam.nDifferentPoints && (myTeam.nDifferentPoints - opponentTeam.nDifferentPoints)}
                    {' '}
                  </span>
                  {' '}
                  <FormattedMessage id="Pts" />
                  {' '}
                </div>
                )
              : (myTeam.nDifferentPoints === opponentTeam.nDifferentPoints)
                  ? (
                    <div className="point-title">
                      {' '}
                      <span className='point-title-span-color'><FormattedMessage id="Both_team_players_points_same" /></span>
                      {' '}
                      <span>{myTeam && myTeam.nDifferentPoints}</span>
                      {' '}
                      <FormattedMessage id="Pts" />
                      {' '}
                    </div>
                    )
                  : (
                    <div className="point-title">
                      {' '}
                      <span className='point-title-span-color'><FormattedMessage id="Your_opponents_players_lead_by" /></span>
                      {' '}
                      <span>{myTeam && myTeam.nDifferentPoints && opponentTeam.nDifferentPoints && (opponentTeam.nDifferentPoints - myTeam.nDifferentPoints)}</span>
                      {' '}
                      <FormattedMessage id="Pts" />
                      {' '}
                    </div>
                    )
          }
          {
            myTeam && myTeam.notCommon && myTeam.notCommon.length !== 0 && myTeam.notCommon.sort((a, b) => (a.eRole > b.eRole) ? 1 : -1).map((teamPlayer, index) => {
              return (
                <Fragment key={index}>
                  <div className="p-c-box d-flex align-items-center">
                    <div className="p-box d-flex align-items-center">
                      <div className="img">
                        <img alt="" src={teamPlayer?.sImage ? `${sMediaUrl}${teamPlayer.sImage}` : PlayerImage} />
                      </div>
                      <div className={`p-name ${document.dir === 'rtl' ? 'text-end' : 'text-start'}`}>
                        <h3>{teamPlayer.sName}</h3>
                        <p className={document.dir === 'rtl' ? 'd-flex justify-content-start' : ''}>
                          <span className={document.dir === 'rtl' ? 'ms-2' : 'me-2'}>
                            {teamPlayer?.oTeam?.sName}
                            {' '}
                          </span>
                          {teamPlayer.eRole}
                        </p>
                      </div>
                    </div>
                    {sortedOpponentTeam?.length > 0 && teamPlayer.nScoredPoints && (teamPlayer.nScoredPoints !== sortedOpponentTeam[index].nScoredPoints)
                      ? (
                        <div className="p-c-p-box justify-content-center d-flex">
                          <span className={classNames({ active: sortedOpponentTeam?.length > 0 && teamPlayer.nScoredPoints > sortedOpponentTeam[index].nScoredPoints })}>{teamPlayer.nScoredPoints}</span>
                          <span className={classNames({ active: sortedOpponentTeam?.length > 0 && teamPlayer.nScoredPoints < sortedOpponentTeam[index].nScoredPoints })}>{sortedOpponentTeam?.length > 0 && sortedOpponentTeam[index].nScoredPoints}</span>
                        </div>
                        )
                      : (
                        <div className="p-c-p-box justify-content-center d-flex">
                          <span>{myTeam && myTeam.captain && (myTeam.captain.nScoredPoints * 2)}</span>
                        </div>
                        )
                    }
                    <div className="p-box d-flex align-items-center">
                      <div className={`p-name ${document.dir === 'rtl' ? 'text-start' : 'text-end'}`}>
                        <h3>{sortedOpponentTeam?.length > 0 && sortedOpponentTeam[index].sName}</h3>
                        <p className={document.dir === 'rtl' ? 'd-flex justify-content-end' : ''}>
                          {sortedOpponentTeam?.length > 0 && sortedOpponentTeam[index].eRole}
                          {' '}
                          <span className={document.dir === 'rtl' ? 'me-2' : 'ms-2'}>{sortedOpponentTeam[index]?.oTeam?.sName}</span>
                        </p>
                      </div>
                      <div className="img">
                        <img alt="" src={sortedOpponentTeam?.length > 0 && sortedOpponentTeam[index].sImage ? `${sMediaUrl}${sortedOpponentTeam[index].sImage}` : PlayerImage} />
                      </div>
                    </div>
                  </div>
                </Fragment>
              )
            })
          }
        </div>
        <div className="compare-player bg-white">
          <div className="point-title">
            <span className='point-title-span-color'><FormattedMessage id="Common_Players" /></span>
            {' '}
            <span>
              {' '}
              {myTeam && myTeam.nCommonPoints}
              {' '}
            </span>
            <FormattedMessage id="Pts" />
          </div>

          {
            myTeam && myTeam.common && myTeam.common.length !== 0 && myTeam.common.sort((a, b) => (a.eRole > b.eRole) ? 1 : -1).map((teamPlayer, index) => {
              return (
                <Fragment key={index}>
                  <div className="p-c-box d-flex align-items-center">
                    <div className="p-box d-flex align-items-center">
                      <div className="img">
                        <img alt="" src={teamPlayer.sImage ? `${sMediaUrl}${teamPlayer.sImage}` : PlayerImage} />
                      </div>
                      <div className={`p-name ${document.dir === 'rtl' ? 'text-end' : 'text-start'}`}>
                        <h3>{teamPlayer.sName}</h3>
                        <p className={document.dir === 'rtl' ? 'd-flex justify-content-start' : ''}>
                          <span className={document.dir === 'rtl' ? 'ms-2' : 'me-2'}>{teamPlayer?.oTeam?.sName}</span>
                          {' '}
                          {teamPlayer.eRole}
                        </p>
                      </div>
                    </div>
                    <div className="p-c-p-box justify-content-center d-flex">
                      <span>{teamPlayer.nScoredPoints}</span>
                    </div>
                    <div className="p-box d-flex align-items-center">
                      <div className={`p-name ${document.dir === 'rtl' ? 'text-start' : 'text-end'}`}>
                        <h3>{teamPlayer.sName}</h3>
                        <p className={document.dir === 'rtl' ? 'd-flex justify-content-end' : ''}>
                          {teamPlayer.eRole}
                          {' '}
                          <span className={document.dir === 'rtl' ? 'me-2' : 'ms-2'}>{teamPlayer?.oTeam?.sName}</span>
                        </p>
                      </div>
                      <div className="img">
                        <img alt="" src={teamPlayer.sImage ? `${sMediaUrl}${teamPlayer.sImage}` : PlayerImage} />
                      </div>
                    </div>
                  </div>
                </Fragment>
              )
            })
          }
        </div>
      </div>
    </>
  )
}
TeamComparePage.propTypes = {
  onBackClick: PropTypes.string,
  loading: PropTypes.bool,
  location: PropTypes.shape({
    state: PropTypes.shape({
      firstRank: PropTypes.object,
      secondRank: PropTypes.bool
    })
  }),
  myTeam: PropTypes.shape({
    common: PropTypes.shape([{
      length: PropTypes.string
    }]),
    notCommon: PropTypes.shape({
      length: PropTypes.string,
      map: PropTypes.func,
      sort: PropTypes.func
    }),
    nDifferentPoints: PropTypes.number,
    nCapPoints: PropTypes.number,
    nCommonPoints: PropTypes.number,
    viceCaptain: PropTypes.string,
    captain: PropTypes.shape([{
      sName: PropTypes.string,
      eRole: PropTypes.string
    }
    ])
  }),
  match: PropTypes.object,
  opponentTeam: PropTypes.object,
  team1: PropTypes.object,
  team1ScorePoint: PropTypes.number,
  team2ScorePoint: PropTypes.number,
  history: PropTypes.object,
  team2: PropTypes.object
}
export default CompareTeam(TeamComparePage)
