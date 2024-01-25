import React, { Fragment, useEffect, useState } from 'react'
import Loading from '../../../component/SkeletonTable'
import { Button, Table } from 'reactstrap'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { defaultPlayerRoleImages } from '../../../utils/helper'
import { compose } from 'redux'
import PlayerDetails from '../../../HOC/SportsLeagueList/PlayerDetails'
import TeamList from '../../../HOC/SportsLeagueList/TeamList'
import { useParams } from 'react-router-dom'
import classNames from 'classnames'
import useGetUrl from '../../../api/url/queries/useGetUrl'

function PlayerInfo (props) {
  const { matchPlayerList, tempPlayers, pId, onChangePlayer, playerData, pointBreakUp, nScoredPoints, loading, userTeamId, userTeam, getUserTeam } = props
  const [index, setindex] = useState('')
  const [data, setData] = useState('')

  const { sMediaUrl } = useGetUrl()
  const { sportsType } = useParams()

  useEffect(() => {
    matchPlayerList?.length > 0 && matchPlayerList.map((player, index) => {
      if (player._id === pId) {
        setindex(parseInt(index))
        setData(player)
        return index
      }
      return player
    })
  }, [pId])

  useEffect(() => {
    const playerD = tempPlayers?.length > 0 && tempPlayers.filter((player, index) => {
      if (player.iMatchPlayerId === pId || player._id === pId) {
        setindex(parseInt(index))
      }
      return player.iMatchPlayerId === pId || player._id === pId
    })
    userTeam?.aPlayers?.map((data) => {
      if (playerD[0]?.iMatchPlayerId === data?.iMatchPlayerId || playerD[0]?._id === data?.iMatchPlayerId) {
        setData(playerD[0])
      }
      return index
    })
  }, [pId, userTeam])

  useEffect(() => {
    if (userTeamId && tempPlayers?.length > 0) {
      getUserTeam(userTeamId)
    }
  }, [userTeamId])

  useEffect(() => {
    if (index !== '' && index >= 0 && tempPlayers?.length > 0) {
      const ID = tempPlayers?.length > 0 && (tempPlayers[index].iMatchPlayerId || tempPlayers[index]._id)
      const playerData = tempPlayers?.length > 0 && tempPlayers[index]
      ID && onChangePlayer(ID)
      playerData && setData(playerData)
    } else if (index !== '' && index >= 0 && matchPlayerList?.length > 0) {
      const ID = matchPlayerList?.length > 0 && (matchPlayerList[index]._id || tempPlayers[index]._id)
      const playerData = matchPlayerList?.length > 0 && matchPlayerList[index]
      ID && onChangePlayer(ID)
      playerData && setData(playerData)
    }
  }, [index])

  return (
    <>
      {loading && <Loading Lines={7} series/>}
      <div className="player-info p-0">
        <div className="league-header u-header">
          <div className="d-flex align-items-center header-i">
            <button className={document.dir === 'rtl' ? 'btn-link icon-right-arrow' : 'btn-link icon-left-arrow'} onClick={() => props.onBackClick()} />
            <div>
              <h1 className="text-uppercase">{data && data.sName}</h1>
            </div>
          </div>
        </div>
        <div className='height-118'>
          <div className="player-detail d-flex align-items-center">
            <div className="p-i">
              <img alt="" className='h-100 w-100 borderRadius' src={data?.sImage && sMediaUrl ? `${sMediaUrl}${data?.sImage}` : defaultPlayerRoleImages(sportsType, playerData.eRole)} />
            </div>
            {/* <div className="player-d-i d-flex flex-wrap">
              <div className="item">
                <p><FormattedMessage id="Selected_by" /></p>
                <b>{playerData && playerData.nSetBy ? playerData.nSetBy : <FormattedMessage id="Zero" />}<FormattedMessage id="Percentage" /></b>
              </div>
              <div className="item text-center">
                <p><FormattedMessage id="Points" /></p>
                <b>{nScoredPoints || <FormattedMessage id="Zero" />}</b>
              </div>
              <div className="item text-end">
                <p><FormattedMessage id="Credits" /></p>
                <b>{playerData && playerData.nFantasyCredit ? playerData.nFantasyCredit : <FormattedMessage id="Zero" />}</b>
              </div>
              <div className="item">
                <p><FormattedMessage id="C_by" /></p>
                <b>{playerData && playerData.nCaptainBy ? playerData.nCaptainBy : <FormattedMessage id="Zero" />}<FormattedMessage id="Percentage" /></b>
              </div>
              <div className="item text-center">
                <p><FormattedMessage id="VC_by" /></p>
                <b>{playerData && playerData.nViceCaptainBy ? playerData.nViceCaptainBy : <FormattedMessage id="Zero" />}<FormattedMessage id="Percentage" /></b>
              </div>
            </div> */}
            <div className="player-d-i d-flex flex-wrap">
              <div className={classNames('item', { 'text-end': document.dir === 'rtl' })}>
                <p><FormattedMessage id="Selected_by" /></p>
                <b>
                  {playerData?.nSetBy ? playerData.nSetBy : <FormattedMessage id="Zero" />}
                  <FormattedMessage id="Percentage" />
                </b>
              </div>
              <div className="item text-center">
                <p><FormattedMessage id="Points" /></p>
                <b>{nScoredPoints || <FormattedMessage id="Zero" />}</b>
              </div>
              <div className={classNames('item', { 'text-end': document.dir !== 'rtl', 'text-start': document.dir === 'rtl' })}>
                <p><FormattedMessage id="Credits" /></p>
                <b>{playerData?.nFantasyCredit ? playerData.nFantasyCredit : <FormattedMessage id="Zero" />}</b>
              </div>
              <div className={classNames('item', { 'text-end': document.dir === 'rtl' })}>
                <p><FormattedMessage id="C_by" /></p>
                <b>
                  {playerData?.nCaptainBy ? playerData.nCaptainBy : <FormattedMessage id="Zero" />}
                  <FormattedMessage id="Percentage" />
                </b>
              </div>
              <div className="item text-center">
                <p><FormattedMessage id="VC_by" /></p>
                <b>
                  {playerData?.nViceCaptainBy ? playerData.nViceCaptainBy : <FormattedMessage id="Zero" />}
                  <FormattedMessage id="Percentage" />
                </b>
              </div>
            </div>
          </div>
          <Table className="player-d-t">
            <thead>
              <tr>
                <th><FormattedMessage id="Events" /></th>
                <th><FormattedMessage id="Actions" /></th>
                <th><FormattedMessage id="Points" /></th>
              </tr>
            </thead>
            <tbody>
              {
                loading
                  ? <Loading Lines={7} series={true}/>
                  : pointBreakUp && pointBreakUp.length && pointBreakUp.length !== 0
                    ? pointBreakUp.map(points => {
                      return (
                        <tr key={points._id}>
                          <td>{points && points.sName && points.sName}</td>
                          <td>{points && points.nPoint && points.nScoredPoints ? parseFloat(Number((points.nScoredPoints / points.nPoint)).toFixed(2)) : !points.nPoint ? (points?.nScoredPoints !== 0 ? 'Yes' : 'No') : 0}</td>
                          <td>
                            {points && points.nScoredPoints && points.nScoredPoints}
                            {' '}
                          </td>
                        </tr>
                      )
                    })
                    : (
                      <Fragment>
                        <tr>
                          <td colSpan='3'>
                            <FormattedMessage id="No_pointBreakup_Available" />
                          </td>
                        </tr>
                      </Fragment>
                      )
              }
            </tbody>
          </Table>
        </div>
        <Table className='tfoot'>
          <tr>
            <td colSpan="2"><FormattedMessage id="Total" /></td>
            <td>{nScoredPoints}</td>
          </tr>
          <tr>
            <td colSpan='3'>
              <div className='text-align-center justify-content-between d-flex'>
                <Button className='prev-btn'
                  disabled={index === 0}
                  onClick={() => {
                    if (index !== 0) {
                      setindex(parseInt(index) - 1)
                    }
                  }}
                >
                  <FormattedMessage id="Previous" />
                </Button>
                <div className='lineHeight'>
                  {userTeam?.aPlayers?.length ? index + 1 + '/' + userTeam?.aPlayers?.length : index + 1 + '/' + matchPlayerList?.length}
                </div>
                <Button className='next-btn'
                  disabled={tempPlayers?.length ? index === tempPlayers?.length - 1 : index === matchPlayerList?.length - 1}
                  onClick={() => {
                    if (index !== matchPlayerList?.length || index !== tempPlayers?.length) {
                      setindex(parseInt(index) + 1)
                    }
                  }}
                >
                  <FormattedMessage id="Next" />
                </Button>
              </div>
            </td>
            {/* <td style={{ textAlign: 'right' }} disabled={index === matchPlayerList?.length} onClick={() => {
                  if (index !== matchPlayerList.length) {
                    setindex(parseInt(index) + 1)
                  }
                }}>
                  <FormattedMessage id="Next" />
                </td> */}
          </tr>
        </Table>
      </div>
    </>
  )
}

PlayerInfo.propTypes = {
  onBackClick: PropTypes.func,
  playerData: PropTypes.shape({
    nViceCaptainBy: PropTypes.number,
    nCaptainBy: PropTypes.number,
    nFantasyCredit: PropTypes.number,
    nSetBy: PropTypes.number,
    eRole: PropTypes.string,
    sName: PropTypes.string
  }),
  match: PropTypes.object,
  pointBreakUp: PropTypes.array,
  matchPlayerList: PropTypes.array,
  pId: PropTypes.string,
  onChangePlayer: PropTypes.func,
  nScoredPoints: PropTypes.number,
  loading: PropTypes.bool,
  userTeam: PropTypes.object,
  getUserTeam: PropTypes.func,
  userTeamId: PropTypes.string,
  tempPlayers: PropTypes.array
}

export default compose(TeamList, PlayerDetails)(PlayerInfo)
