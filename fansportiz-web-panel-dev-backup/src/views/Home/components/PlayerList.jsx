import React, { Fragment, useState, useEffect } from 'react'
import { Button, Table } from 'reactstrap'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import plusIcon from '../../../assests/images/plus.svg'
import minusIcon from '../../../assests/images/minus.svg'
import SkeletonCreateTeam from '../../../component/SkeletonCreateTeam'
import { defaultPlayerRoleImages } from '../../../utils/helper'
import { useParams } from 'react-router-dom'
import useGetUrl from '../../../api/url/queries/useGetUrl'
const classNames = require('classnames')

function PlayerList (props) {
  const { data, isEleven, loader, isTeamSeven, cancel, teamId, creditLeft, uniquePlayerList, teamSevenName, matchDetails } = props
  const [loading, setLoading] = useState(false)
  const [SortingFrom, setSortingFrom] = useState('points')
  const [sorted, setSorted] = useState(true)
  const [listed, setListed] = useState([])
  const { sMediaUrl } = useGetUrl()

  const { sportsType } = useParams()

  useEffect(() => {
    if (SortingFrom === 'points') {
      const list = data && data.length > 0 && data.sort((a, b) => a.nScoredPoints > b.nScoredPoints ? 1 : -1)
      setListed(list)
    }
    setLoading(false)
  }, [data])

  const ChangeSorting = (value) => {
    setListed([])
    setSortingFrom(value)
    setSorted(!sorted)
    if (sorted) {
      let listedItem
      if (value === 'selectedBy') {
        listedItem = data.sort((a, b) => a.sName > b.sName ? -1 : 1)
        setListed(listedItem)
      } else if (value === 'points') {
        listedItem = data.sort((a, b) => b.nSeasonPoints - a.nSeasonPoints)
        setListed(listedItem)
      } else if (value === 'credits') {
        listedItem = data.sort((a, b) => b.nFantasyCredit - a.nFantasyCredit)
        setListed(listedItem)
      }
    } else {
      let listedItem
      if (value === 'selectedBy') {
        listedItem = data.sort((a, b) => a.sName > b.sName ? 1 : -1)
        setListed(listedItem)
      } else if (value === 'points') {
        listedItem = data.sort((a, b) => a.nSeasonPoints - b.nSeasonPoints)
        setListed(listedItem)
      } else if (value === 'credits') {
        listedItem = data.sort((a, b) => a.nFantasyCredit - b.nFantasyCredit)
        setListed(listedItem)
      }
    }
  }

  return (
    <>
      <Table className='bg-white player-list' hover>
        <thead>
          <tr>
            <th><FormattedMessage id="Filter" /></th>
            <th className={document.dir === 'rtl' ? 'text-end' : 'text-start'} onClick={() => ChangeSorting('selectedBy')}>
              <FormattedMessage id="Selected_by" />
              {SortingFrom === 'selectedBy' &&
                <i className={classNames({ 'icon-up-arrow': sorted === true, 'icon-down-arrow': sorted !== true })} />
              }
            </th>
            <th className='align_right' onClick={() => ChangeSorting('points')}>
              <FormattedMessage id="Points" />
              {SortingFrom === 'points' &&
                <i className={classNames({ 'icon-up-arrow': sorted === true, 'icon-down-arrow': sorted !== true })} />
              }
            </th>
            <th className='text-center' onClick={() => ChangeSorting('credits')}>
              <FormattedMessage id="Credits" />
              {SortingFrom === 'credits' &&
                <i className={classNames({ 'icon-up-arrow': sorted === true, 'icon-down-arrow': sorted !== true })} />
              }
            </th>
            <th />
          </tr>
        </thead>
        <tbody>
          {(loading || loader)
            ? <SkeletonCreateTeam />
            : listed && listed.length >= 1 && listed.map((player) => {
              const ans = uniquePlayerList && uniquePlayerList.length !== 0 && uniquePlayerList.some(data1 => data1 === player._id)
              return (
                <Fragment key={player._id}>
                  {player?.eStatus === 'Y' && (
                    <>
                      <tr className={`${!player.isAdded && (isEleven || (isTeamSeven && player.sTeamName === teamSevenName) || cancel || creditLeft - player.nFantasyCredit < 0) ? 'disabled' : ans ? 'unique' : ''} ${player.isAdded === true ? 'backYellowLight' : ''}`}>
                        <td>
                          <div className="l-img" onClick={() => props.onPlayerInfo(player._id)}>
                            <img alt="" src={player && player.sImage ? `${sMediaUrl}${player.sImage}` : defaultPlayerRoleImages(sportsType, player?.eRole)} />
                            {
                                matchDetails?.bLineupsOut && player && player.bShow && (
                                <div className='verified-player'>
                                  <i className="icon-verified Player-Image" />
                                  <p><FormattedMessage id='Playing' /></p>
                                </div>
                                )
                              }
                          </div>
                        </td>
                        <td onClick={() => props.addPlayerFun({ ...player, isAdded: player.isAdded === false ? !isEleven ? !player.isAdded : player.isAdded : !player.isAdded })}>
                          <h4 className={classNames({ 'text-end': document.dir === 'rtl', 'p-name': true })} >{player && player.sName ? player.sName : ' - '}</h4>
                          <p className={classNames({ 'text-end': document.dir === 'rtl', 'c-name': true })} >{player && player.sTeamName ? player.sTeamName : ' - '}</p>
                          <p className={classNames({ 'purple c-name line': teamId[0] === player.oTeam.iTeamId, 'Blue c-name line': teamId[0] !== player.oTeam.iTeamId })}>
                            <FormattedMessage id="Selected_by">{txt => txt}</FormattedMessage>
                            {' '}
                            <span dir='ltr' id='crate-team-percentage'>
                              {Math.round(player.nSetBy)}
                              %
                            </span>
                            {' '}
                            <span style={{ width: `${player.nSetBy >= 100 ? 100 : player.nSetBy}%` }} />
                          </p>
                        </td>
                        <td className='text-center' onClick={() => props.addPlayerFun({ ...player, isAdded: player.isAdded === false ? !isEleven ? !player.isAdded : player.isAdded : !player.isAdded })}>{player && player.nSeasonPoints ? player.nSeasonPoints : '0'}</td>
                        <td className='text-center' onClick={() => props.addPlayerFun({ ...player, isAdded: player.isAdded === false ? !isEleven ? !player.isAdded : player.isAdded : !player.isAdded })}>{player && player.nFantasyCredit ? player.nFantasyCredit : '0'}</td>
                        <td className='align_right' onClick={() => props.addPlayerFun({ ...player, isAdded: player.isAdded === false ? !isEleven ? !player.isAdded : player.isAdded : !player.isAdded })}>
                          <Button className='btn-width-54' color='link'><img src={player.isAdded !== true ? plusIcon : minusIcon} /></Button>
                        </td>
                      </tr>
                      {!matchDetails?.bLineupsOut && player?.bPlayInLastMatch && (
                      <div className='last-played-match'>
                        <i className="icon-verified Player-Image" />
                        <p><FormattedMessage id='Played_Last_Match'>{txt => txt}</FormattedMessage></p>
                      </div>
                      )}
                    </>
                  )}
                </Fragment>
              )
            }
            )
          }
        </tbody>
      </Table >
    </>
  )
}

PlayerList.propTypes = {
  data: PropTypes.array,
  onPlayerInfo: PropTypes.func,
  addPlayerFun: PropTypes.func,
  isEleven: PropTypes.bool,
  match: PropTypes.shape({
    params: PropTypes.shape({
      sportsType: PropTypes.string
    })
  }),
  isTeamSeven: PropTypes.bool,
  loader: PropTypes.bool,
  cancel: PropTypes.bool,
  creditLeft: PropTypes.number,
  teamId: PropTypes.array,
  uniquePlayerList: PropTypes.array,
  teamSevenName: PropTypes.string,
  matchDetails: PropTypes.object
}

export default PlayerList
