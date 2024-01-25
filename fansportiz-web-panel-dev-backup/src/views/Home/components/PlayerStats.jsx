import React, { useState, useEffect, useRef, Fragment } from 'react'
import { Table } from 'reactstrap'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import SkeletonPlayerStatus from '../../../component/SkeletonPlayerStatus'
import PlayerImage from '../../../assests/images/User2.png'
// import qs from 'query-string'
import { createSearchParams, useNavigate, useParams } from 'react-router-dom'
import useGetUrl from '../../../api/url/queries/useGetUrl'
const classNames = require('classnames')

function PlayerStats (props) {
  const { uniqueList } = props
  const [loading, setLoading] = useState(false)
  const [SortingFrom, setSortingFrom] = useState('points')
  const [sorted, setSorted] = useState(false)
  const [listed, setListed] = useState([])
  const { matchPlayerList, completed } = props
  const previousProps = useRef({
    matchPlayerList
  }).current
  const { sMediaUrl } = useGetUrl()

  const { sportsType, sMatchId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    setSorted(false)
    if (matchPlayerList?.length > 1) {
      if (SortingFrom === 'points') {
        let list
        if (sorted) {
          list = matchPlayerList && matchPlayerList.length > 0 && matchPlayerList.sort((a, b) => a.sName > b.sName ? 1 : -1).sort((a, b) => Number(a.nScoredPoints) > Number(b.nScoredPoints) ? 1 : -1)
        } else {
          list = matchPlayerList && matchPlayerList.length > 0 && matchPlayerList.sort((a, b) => a.sName > b.sName ? 1 : -1).sort((a, b) => Number(a.nScoredPoints) > Number(b.nScoredPoints) ? -1 : 1)
        }
        setListed(list)
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    if (previousProps.matchPlayerList !== matchPlayerList) {
      setLoading(false)
      if (SortingFrom === 'points') {
        let list
        if (sorted) {
          list = matchPlayerList && matchPlayerList.length > 0 && matchPlayerList.sort((a, b) => a.sName > b.sName ? 1 : -1).sort((a, b) => Number(a.nScoredPoints) > Number(b.nScoredPoints) ? 1 : -1)
        } else {
          list = matchPlayerList && matchPlayerList.length > 0 && matchPlayerList.sort((a, b) => a.sName > b.sName ? 1 : -1).sort((a, b) => Number(a.nScoredPoints) > Number(b.nScoredPoints) ? -1 : 1)
        }
        setListed(list)
      }
    }
    return () => {
      previousProps.matchPlayerList = matchPlayerList
    }
  }, [matchPlayerList])

  const ChangeSorting = (value) => {
    setListed([])
    setSortingFrom(value)
    setSorted(!sorted)
    if (sorted) {
      let listedItem
      if (value === 'players') {
        listedItem = matchPlayerList.sort((a, b) => a.sName > b.sName ? -1 : 1)
        setListed(listedItem)
      } else if (value === 'points') {
        listedItem = matchPlayerList.sort((a, b) => a.sName > b.sName ? 1 : -1).sort((a, b) => Number(a.nScoredPoints) > Number(b.nScoredPoints) ? -1 : 1)
        setListed(listedItem)
      } else if (value === 'selBy') {
        listedItem = matchPlayerList.sort((a, b) => a.sName > b.sName ? 1 : -1).sort((a, b) => a.nSetBy > b.nSetBy ? -1 : 1)
        setListed(listedItem)
      } else if (value === 'C') {
        listedItem = matchPlayerList.sort((a, b) => a.sName > b.sName ? 1 : -1).sort((a, b) => a.nCaptainBy > b.nCaptainBy ? -1 : 1)
        setListed(listedItem)
      } else if (value === 'VC') {
        listedItem = matchPlayerList.sort((a, b) => a.sName > b.sName ? 1 : -1).sort((a, b) => a.nViceCaptainBy > b.nViceCaptainBy ? -1 : 1)
        setListed(listedItem)
      }
    } else {
      let listedItem
      if (value === 'players') {
        listedItem = matchPlayerList.sort((a, b) => a.sName > b.sName ? 1 : -1)
        setListed(listedItem)
      } else if (value === 'points') {
        listedItem = matchPlayerList.sort((a, b) => a.sName > b.sName ? 1 : -1).sort((a, b) => Number(a.nScoredPoints) > Number(b.nScoredPoints) ? 1 : -1)
        setListed(listedItem)
      } else if (value === 'selBy') {
        listedItem = matchPlayerList.sort((a, b) => a.sName > b.sName ? 1 : -1).sort((a, b) => a.nSetBy > b.nSetBy ? 1 : -1)
        setListed(listedItem)
      } else if (value === 'C') {
        listedItem = matchPlayerList.sort((a, b) => a.sName > b.sName ? 1 : -1).sort((a, b) => a.nCaptainBy > b.nCaptainBy ? 1 : -1)
        setListed(listedItem)
      } else if (value === 'VC') {
        listedItem = matchPlayerList.sort((a, b) => a.sName > b.sName ? 1 : -1).sort((a, b) => a.nViceCaptainBy > b.nViceCaptainBy ? 1 : -1)
        setListed(listedItem)
      }
    }
  }
  const sortClass = classNames({ 'icon-up-arrow': sorted === true, 'icon-down-arrow': sorted !== true })

  return (
    <>
      { loading
        ? <SkeletonPlayerStatus numberOfColumns={10} />
        : (
          <Fragment>
            <div className='playerStates'>
              <Table className="bg-white player-list player-stats-table m-0" hover>
                <thead>
                  <tr>
                    <th className={document.dir === 'rtl' ? 'text-end' : ''} onClick={() => ChangeSorting('players')}>
                      <FormattedMessage id="Players" />
                      { SortingFrom === 'players' &&
                      <i className={`${sortClass} asc-dsc`} />
                    }
                    </th>
                    {completed && (
                    <th onClick={() => ChangeSorting('points')}>
                      <FormattedMessage id="Point" />
                      { SortingFrom === 'points' &&
                      <i className={`${sortClass}  asc-dsc`} />
                    }
                    </th>
                    )}
                    <th onClick={() => ChangeSorting('selBy')}>
                      <FormattedMessage id="Sel_by" />
                      { SortingFrom === 'selBy' &&
                      <i className={`${sortClass} asc-dsc`} />
                    }
                    </th>
                    <th onClick={() => ChangeSorting('C')}>
                      <FormattedMessage id="C_by" />
                      { SortingFrom === 'C' &&
                      <i className={`${sortClass} asc-dsc`} />
                    }
                    </th>
                    <th onClick={() => ChangeSorting('VC')}>
                      <FormattedMessage id="VC_by" />
                      { SortingFrom === 'VC' &&
                      <i className={`${sortClass} asc-dsc`} />
                    }
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                  listed && listed.length > 0 && listed.map(data => {
                    const ans = uniqueList && uniqueList.length !== 0 && uniqueList.some((data1) => data1 === data._id)
                    const name = data.sName.split(' ')
                    return (
                      <tr key={data._id}
                        onClick={() =>
                          navigate(`/view-player-stats-info/${sportsType}/${sMatchId}/${data._id}`,
                            {
                              search: `?${createSearchParams({
                                sortBy: SortingFrom || undefined,
                                sort: !sorted || undefined,
                                playerStat: true || undefined
                              })}`,
                              state: {
                                playerStat: true
                              }
                            })
                        }
                        style={{ backgroundColor: ans ? '#EBFBFF' : '#FFFFFF' }}
                      >
                        <td style={{ backgroundColor: ans ? '#EBFBFF' : '#FFFFFF' }}>
                          <div className="d-flex align-items-center">
                            <div className={classNames({ 'ms-2': document.dir === 'rtl', 'l-img': true })}>
                              <img alt="" src={data && data.sImage && sMediaUrl ? `${sMediaUrl}${data.sImage}` : PlayerImage} />
                            </div>
                            <div>
                              <h4 className="p-name">{data && data.sName && `${name && name.length >= 2 ? data.sName[0] : name[0]} ${name && name.length === 2 ? name[1] : name && name.length === 3 ? `${name[1]} ${name[2]}` : ''}`}</h4>
                              <p className="c-name">
                                {data && data?.oTeam && data?.oTeam?.sShortName}
                                <span className="role">{data && data.eRole && data.eRole}</span>
                              </p>
                            </div>
                          </div>
                        </td>
                        {
                          completed &&
                          <td>{data && data.nScoredPoints && parseFloat(Number((data.nScoredPoints)).toFixed(2))}</td>
                        }
                        <td>
                          {data && data.nSetBy && parseFloat(Number((data.nSetBy)).toFixed(2))}
                          <FormattedMessage id="Percentage" />
                        </td>
                        <td>
                          {data && data.nCaptainBy && data.nCaptainBy}
                          <FormattedMessage id="Percentage" />
                        </td>
                        <td>
                          {data && data.nViceCaptainBy && data.nViceCaptainBy}
                          <FormattedMessage id="Percentage" />
                        </td>
                      </tr>
                    )
                  })
                }
                </tbody>
              </Table>
            </div>
          </Fragment>
          )
      }
    </>
  )
}

PlayerStats.propTypes = {
  onPlayerInfoClick: PropTypes.func,
  data: PropTypes.shape({
    nViceCaptainBy: PropTypes.number,
    nCaptainBy: PropTypes.number,
    nScoredPoints: PropTypes.number,
    nSetBy: PropTypes.number,
    eRole: PropTypes.string,
    sName: PropTypes.string
  }),
  uniqueList: PropTypes.shape([{
    nViceCaptainBy: PropTypes.number,
    nCaptainBy: PropTypes.number,
    nScoredPoints: PropTypes.number,
    _id: PropTypes.string
  }]),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      sportsType: PropTypes.string
    })
  }),
  matchPlayerList: PropTypes.array,
  completed: PropTypes.bool,
  setPlayers: PropTypes.func,
  history: PropTypes.object
}

export default PlayerStats
