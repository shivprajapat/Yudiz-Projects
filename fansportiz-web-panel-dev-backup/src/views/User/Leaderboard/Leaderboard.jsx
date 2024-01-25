/* eslint-disable no-unused-vars */
import React, { useState, useEffect, Fragment } from 'react'
import { Nav, NavItem, NavLink, TabContent, Table, TabPane } from 'reactstrap'
import classnames from 'classnames'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { useQueryState } from 'react-router-use-location-state'
import { getRandomColor, createImageFromInitials } from '../../Home/components/LetterImage'
import qs from 'query-string'
import Loading from '../../../component/SkeletonLeaderShip'
import Leadershipboard from '../../../HOC/LeaderBoard/leadershipboard'
import { useLocation } from 'react-router-dom'
import useGetUrl from '../../../api/url/queries/useGetUrl'

function LeaderboardPage (props) {
  const { leadershipBoardList, loading } = props
  const { sMediaUrl } = useGetUrl()

  const [activeTabs, setActiveState] = useQueryState('activeTab', '1')
  const [activeTab, setActiveTab] = useState('1')
  let active = 1

  const location = useLocation()

  useEffect(() => {
    const obj = qs.parse(location?.search)
    if (obj) {
      if (obj.activeTab) {
        active = obj.activeTab
        setActiveState(active)
        toggle(active)
      }
    }
  }, [])

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab)
  }
  return (
    <div className="user-container bg-white no-footer leaderboard">
      <Nav className="d-flex live-tabs justify-content-around bg-white">
        <NavItem className="text-center">
          <NavLink className={classnames({ active: activeTab === '1' })}
            onClick={() => {
              toggle('1')
              setActiveState('1')
            }}
          >
            <FormattedMessage id="Series_wise" />

          </NavLink>
        </NavItem>
        <NavItem className="text-center">
          <NavLink className={classnames({ active: activeTab === '2' })}
            onClick={() => {
              toggle('2')
              setActiveState('2')
            }}
          >
            {' '}
            <FormattedMessage id="Last_Month" />

          </NavLink>
        </NavItem>
        <NavItem className="text-center">
          <NavLink className={classnames({ active: activeTab === '3' })}
            onClick={() => {
              toggle('3')
              setActiveState('3')
            }}
          >
            {' '}
            <FormattedMessage id="All_Time" />

          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          {loading
            ? <Loading length={5} />
            : (
              <Fragment>
                {
                  leadershipBoardList && leadershipBoardList.aSeasonData && leadershipBoardList.aSeasonData.length !== 0
                    ? (
                      <Fragment>
                        {
                          leadershipBoardList.aSeasonData.map((data, index) => {
                            return (
                              <Fragment key={data._id}>
                                <div className="player-cat bg-white">
                                  <h1>{data.sTitle}</h1>
                                  <Table className={`bg-white player-list m-0 mb-3 border1 ${index >= 1 ? 'mt-5' : 'mt-3'}`}>
                                    {/* <thead className='tableHead'>
                                      <tr>
                                        <td colSpan={2} className='align_left'><FormattedMessage id="All_Teams" /></td>
                                        <td className='align_right'><FormattedMessage id="Rank" /></td>
                                      </tr>
                                    </thead> */}
                                    <tbody className='tableBody'>
                                      {
                                        data && data.aData && data.aData.length > 0 && data.aData.map(seriesData => {
                                          return (
                                            <Fragment key={seriesData.nUserRank}>
                                              <tr className='mt-3'>
                                                <td>
                                                  <div className="l-img">
                                                    <img alt="" src={seriesData && seriesData.oUser && seriesData.oUser.sProPic ? sMediaUrl + 'thumb/' + seriesData.oUser.sProPic : createImageFromInitials(500, seriesData && seriesData.oUser && seriesData.oUser.sUsername, getRandomColor())} />
                                                  </div>
                                                </td>
                                                <td className={classnames({ 'align-left': document.dir !== 'rtl', 'text-end': document.dir === 'rtl' })}>
                                                  <h4 className="p-name mb-1">{seriesData && seriesData.oUser && seriesData.oUser.sUsername}</h4>
                                                  <p className="c-name">
                                                    {seriesData && seriesData.nTotalJoinLeague}
                                                    {' '}
                                                    <FormattedMessage id="Leagues_Joined" />
                                                  </p>
                                                </td>
                                                <td className='align_right'>
                                                  <b><FormattedMessage id="Hash" /></b>
                                                  {seriesData.nUserRank}
                                                </td>
                                              </tr>
                                            </Fragment>
                                          )
                                        })
                                      }
                                    </tbody>
                                  </Table>
                                </div>
                              </Fragment>
                            )
                          })
                        }
                      </Fragment>
                      )
                    : (
                      <Fragment>
                        <div className="no-team d-flex align-items-center justify-content-center">
                          <div className="">
                            <i className="icon-trophy" />
                            <h6 className="m-3"><FormattedMessage id="No_Data_Found" /></h6>
                          </div>
                        </div>
                      </Fragment>
                      )
                }
              </Fragment>
              )
          }
        </TabPane>
        <TabPane tabId="2">
          {loading
            ? <Loading length={5} />
            : (
              <Fragment>
                {
                  leadershipBoardList && leadershipBoardList.oMonthData && leadershipBoardList.oMonthData?.aData?.length !== 0
                    ? (
                      <Fragment>
                        <div className="player-cat bg-white">
                          <h1>{leadershipBoardList?.oMonthData?.sTitle}</h1>
                          <Table className="bg-white player-list m-0 mb-3 border1">
                            {/* <thead className='tableHead'>
                              <tr>
                                <td colSpan={2} className='align_left'><FormattedMessage id="All_Teams" /></td>
                                <td className='align_right'><FormattedMessage id="Rank" /></td>
                              </tr>
                            </thead> */}
                            <tbody className='tableBody'>
                              {
                                leadershipBoardList?.oMonthData?.aData.map((data, index) => {
                                  return (
                                    <Fragment key={data._id}>
                                      <tr>
                                        <td>
                                          <div className="l-img">
                                            <img alt="" src={data && data.oUser && data.oUser && data.oUser.sProPic ? sMediaUrl + 'thumb/' + data.oUser.sProPic : createImageFromInitials(500, data && data.oUser && data.oUser && data.oUser.sUsername, getRandomColor())} />
                                          </div>
                                        </td>
                                        <td className={classnames({ 'align-left': document.dir !== 'rtl', 'text-end': document.dir === 'rtl' })}>
                                          <h4 className="p-name">{data && data.oUser && data.oUser.sUsername}</h4>
                                          <p className="c-name">
                                            {data && data.nTotalJoinLeague}
                                            {' '}
                                            <FormattedMessage id="Leagues_Joined" />
                                          </p>
                                        </td>
                                        <td className='align_right'>
                                          <b><FormattedMessage id="Hash" /></b>
                                          {index + 1}
                                        </td>
                                      </tr>
                                    </Fragment>
                                  )
                                })
                              }
                            </tbody>
                          </Table>
                        </div>
                      </Fragment>
                      )
                    : (
                      <Fragment>
                        <div className="no-team d-flex align-items-center justify-content-center">
                          <div className="">
                            <i className="icon-trophy" />
                            <h6 className="m-3"><FormattedMessage id="No_Record_Found" /></h6>
                          </div>
                        </div>
                      </Fragment>
                      )
                }
              </Fragment>
              )
          }
        </TabPane>
        <TabPane tabId="3">
          {loading
            ? <Loading length={5} />
            : (
              <Fragment>
                {
                  leadershipBoardList && leadershipBoardList.oAllTimeData && leadershipBoardList.oAllTimeData?.aData?.length !== 0
                    ? (
                      <div className="player-cat bg-white">
                        <h1>{leadershipBoardList?.oAllTimeData?.sTitle}</h1>
                        <Table className="bg-white player-list m-0 mb-3 border1">
                          {/* <thead className='tableHead'>
                            <tr>
                              <td colSpan={2} className='align_left'><FormattedMessage id="All_Teams" /></td>
                              <td className='align_right'><FormattedMessage id="Rank" /></td>
                            </tr>
                          </thead> */}
                          <tbody className='tableBody'>
                            {
                              leadershipBoardList?.oAllTimeData?.aData.map((data, index) => {
                                return (
                                  <Fragment key={data._id}>
                                    <tr>
                                      <td>
                                        <div className="l-img">
                                          <img alt="" src={data && data.oUser && data.oUser && data.oUser.sProPic ? sMediaUrl + 'thumb/' + data.oUser.sProPic : createImageFromInitials(500, data && data.oUser && data.oUser && data.oUser.sUsername, getRandomColor())} />
                                        </div>
                                      </td>
                                      <td className={classnames({ 'align-left': document.dir !== 'rtl', 'text-end': document.dir === 'rtl' })}>
                                        <h4 className="p-name">{data && data.oUser && data.oUser.sUsername}</h4>
                                        <p className="c-name">
                                          {data && data.nTotalJoinLeague}
                                          {' '}
                                          <FormattedMessage id="Leagues_Joined" />
                                        </p>
                                      </td>
                                      <td className='align_right'>
                                        <b><FormattedMessage id="Hash" /></b>
                                        {index + 1}
                                      </td>
                                    </tr>
                                  </Fragment>
                                )
                              })
                            }
                          </tbody>
                        </Table>
                      </div>
                      )
                    : (
                      <Fragment>
                        <div className="no-team d-flex align-items-center justify-content-center">
                          <div className="">
                            <i className="icon-trophy" />
                            <h6 className="m-3"><FormattedMessage id="No_Record_Found" /></h6>
                          </div>
                        </div>
                      </Fragment>
                      )
                }
              </Fragment>
              )
          }
        </TabPane>
      </TabContent>
    </div>
  )
}
LeaderboardPage.propTypes = {
  getLeadershipList: PropTypes.func,
  leadershipBoardList: PropTypes.shape({
    aSeasonData: PropTypes.shape([{
      aSeries: PropTypes.array
    }
    ]),
    oMonthData: PropTypes.shape([{
      aData: PropTypes.array
    }
    ]),
    oAllTimeData: PropTypes.shape([{
      aData: PropTypes.array
    }
    ])
  }),
  loading: PropTypes.bool,
  location: PropTypes.object
}
export default Leadershipboard(LeaderboardPage)
