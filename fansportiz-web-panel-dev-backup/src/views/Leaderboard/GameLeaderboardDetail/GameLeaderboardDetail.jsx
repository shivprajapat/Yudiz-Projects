import React, { Fragment, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import classnames from 'classnames'
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'

// Images
import PlayerImage from '../../../assests/images/PlayerImage.png'
import Bonus from '../../../assests/images/Bonus.svg'
import Cash from '../../../assests/images/cash.svg'
import NoDataFound from '../../../assests/images/ic_no_data_found.svg'

// Components
import LeaderboardCard from '../components/LeaderboardCard'
import SkeletonTable from '../../../component/SkeletonTable'
import SkeletonGameLeaderBoard from '../../../component/SkeletonGameLeaderBoard'
import { getRandomColor, createImageFromInitials } from '../../Home/components/LetterImage'
import useSeriesCategoryDetails from '../../../api/leaderboard/queries/useSeriesCategoryDetails'
import useAllLeaderboardRank from '../../../api/leaderboard/queries/useAllLeaderboardRank'
import useMyLeaderboardRank from '../../../api/leaderboard/queries/useMyLeaderboardRank'
import useGetUrl from '../../../api/url/queries/useGetUrl'

function GameLeaderboardDetailPage (props) {
  const location = useLocation()
  const { detailsId, id } = useParams()
  const { sMediaUrl } = useGetUrl()

  const activeSport = location?.state?.activeSport
  const currSeries = location?.state?.currSeries

  const userData = useSelector(state => state.auth.userData) || JSON.parse(localStorage.getItem('userData'))
  const currencyLogo = useSelector(state => state.settings.currencyLogo)

  const [activeTab, setActiveTab] = useState('1')
  const [leaderBoardAllData, setLeaderBoardAllData] = useState([])

  const leaderboardTitle = location?.state?.leaderboardTitle

  const { data: leaderboardCategoryDetails, isLoading: isCategoryDetailsLoading } = useSeriesCategoryDetails(detailsId || id)
  const { data: leaderboardAllRank, isLoading: isLeaderboardAllRankLoading } = useAllLeaderboardRank(id, detailsId)
  const { data: leaderboardMyRank, isLoading: isLeaderboardMyRankLoading } = useMyLeaderboardRank(id, detailsId)

  useEffect(() => {
    const Data = leaderboardAllRank && leaderboardAllRank.length > 0 ? leaderboardAllRank.filter(leaderBoard => leaderBoard.oUser.iUserId !== userData?._id) : leaderboardAllRank
    setLeaderBoardAllData(Data)
  }, [leaderboardAllRank])

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }

  return (
    <div className="leaderboard-table no-footer d-flex flex-column">
      {
        (detailsId ? (isCategoryDetailsLoading) : (isCategoryDetailsLoading || isLeaderboardMyRankLoading || isLeaderboardAllRankLoading))
          ? (
            <SkeletonGameLeaderBoard />
            )
          : (
            <LeaderboardCard {...props} activeSport={activeSport} currSeries={currSeries} data={leaderboardCategoryDetails} leaderboardTitle={leaderboardTitle} />
            )
      }
      {
        detailsId
          ? (
            <>
              <Nav className="d-flex justify-content-around flex-nowrap align-items-center match-links m-0 backWhite">
                <NavItem><NavLink className={classnames({ active2: activeTab === '1' })} onClick={() => { toggle('1') }}><FormattedMessage id="Prize_breakup" /></NavLink></NavItem>
                <NavItem><NavLink className={classnames({ active2: activeTab === '2' })} onClick={() => { toggle('2') }}><FormattedMessage id="Conditions" /></NavLink></NavItem>
              </Nav>
              <div className="leadershipBoard-height">
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="1">
                    {
                      (isCategoryDetailsLoading)
                        ? <SkeletonTable Lines={7} />
                        : (
                          <>
                            {
                          leaderboardCategoryDetails && leaderboardCategoryDetails.length !== 0
                            ? (
                              <div className="leader-detail h-100 overflow-auto">
                                <table className="bg-white player-list price-table participated-playerlist table">
                                  <thead>
                                    <tr>
                                      <td><span><FormattedMessage id="Prize" /></span></td>
                                      <td><span><FormattedMessage id="Rank" /></span></td>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {
                                      leaderboardCategoryDetails && leaderboardCategoryDetails.aPrizeBreakup && leaderboardCategoryDetails.aPrizeBreakup.length > 0
                                        ? leaderboardCategoryDetails.aPrizeBreakup.map((prize) => (
                                          <tr
                                            key={prize._id}
                                          >
                                            <td>
                                              <div className="d-flex align-items-center">
                                                {
                                                    prize && prize.eRankType === 'E'
                                                      ? (
                                                        <div className="p-img">
                                                          <img alt="" src={prize && prize.sImage ? `${sMediaUrl}${prize.sImage}` : PlayerImage} />
                                                        </div>
                                                        )
                                                      : prize && prize.eRankType === 'B'
                                                        ? (
                                                          <div className="p-img">
                                                            <img alt={<FormattedMessage id="Matches" />} src={Bonus} width="40px" />
                                                          </div>
                                                          )
                                                        : prize && prize.eRankType === 'R'
                                                          ? (
                                                            <div className="p-img">
                                                              <img alt={<FormattedMessage id="Matches" />} src={Cash} width="40px" />
                                                            </div>
                                                            )
                                                          : ''
                                                  }
                                                <div>
                                                  <span className="p-name">
                                                    {(prize.eRankType === 'E' && prize?.sInfo?.length) ? prize.sInfo : `${currencyLogo} ${prize.nPrize}`}
                                                    {' '}
                                                    {prize && prize.eRankType === 'B' ? ' Bonus' : prize.eRankType === 'R' ? ' Cash' : ''}
                                                  </span>
                                                </div>
                                              </div>
                                            </td>
                                            <td className="hash-black">
                                              {' '}
                                              <FormattedMessage id="Hash" />
                                              {' '}
                                              {prize && prize.nRankFrom && prize.nRankTo && prize.nRankFrom === prize.nRankTo ? `${prize.nRankFrom}` : `${prize.nRankFrom} - ${prize.nRankTo}`}
                                              {' '}
                                            </td>
                                          </tr>
                                        ))
                                        : (
                                          <tr>
                                            <td colSpan="2">
                                              <div className="no-team fixing-width3 d-flex align-items-center justify-content-center">
                                                <div className="">
                                                  <i className="icon-trophy" />
                                                  <h6 className="m-3"><FormattedMessage id="No_Prize_Breakup_Found" /></h6>
                                                </div>
                                              </div>
                                            </td>
                                          </tr>
                                          )
                                    }
                                  </tbody>
                                </table>
                              </div>
                              )
                            : (
                              <div className="no-team fixing-width3 d-flex align-items-center justify-content-center">
                                <div className="">
                                  <i className="icon-trophy" />
                                  <h6 className="m-3"><FormattedMessage id="No_data_found_Please_check_back_after_while" /></h6>
                                </div>
                              </div>
                              )
                        }
                          </>
                          )
                  }
                  </TabPane>
                  <TabPane tabId="2">
                    <div className="user-container no-footer bg-white">
                      <div className="cms">
                        {
                        leaderboardCategoryDetails && leaderboardCategoryDetails.sContent
                          ? (
                            <div dangerouslySetInnerHTML={{ __html: leaderboardCategoryDetails && leaderboardCategoryDetails.sContent && leaderboardCategoryDetails.sContent }} className="offer-d-txt" />
                            )
                          : (
                            <p>
                              {' '}
                              <FormattedMessage id="No_Conditions_Here" />
                              {' '}
                            </p>
                            )
                      }
                      </div>
                    </div>
                  </TabPane>
                </TabContent>
              </div>
            </>
            )
          : (
            <div className="leader-detail h-100 overflow-auto">
              <table className="bg-white player-list price-table participated-playerlist table">
                <thead>
                  <tr>
                    <td><span><FormattedMessage id="Leaders" /></span></td>
                    <td><span>{leaderboardCategoryDetails && leaderboardCategoryDetails?.sColumnText?.split(' ').map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase()).join(' ')}</span></td>
                    <td><span><FormattedMessage id="Rank" /></span></td>
                  </tr>
                </thead>
                <tbody>
                  {(isCategoryDetailsLoading || isLeaderboardMyRankLoading || isLeaderboardAllRankLoading)
                    ? <SkeletonTable Lines={7} series />
                    : (
                      <Fragment>
                        {
                        leaderboardMyRank && leaderboardMyRank.oUser && (
                          <tr
                            style={{ backgroundColor: '#EBFBFF' }}
                          >
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="l-img">
                                  <img alt="" src={leaderboardMyRank && leaderboardMyRank.oUser && leaderboardMyRank.oUser.sProPic ? `${sMediaUrl}thumb/${leaderboardMyRank.oUser.sProPic}` : createImageFromInitials(500, leaderboardMyRank?.sUsername || leaderboardMyRank?.sUsername || leaderboardMyRank?.oUser?.sName || leaderboardMyRank?.oUser?.sUsername, getRandomColor())} />
                                </div>
                                <div>
                                  <span className="p-name">{leaderboardMyRank?.sUsername || leaderboardMyRank?.oUser?.sUsername || leaderboardMyRank?.oUser?.sName}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              {' '}
                              {leaderboardMyRank && leaderboardMyRank.nUserScore ? parseFloat(Number((leaderboardMyRank.nUserScore)).toFixed(2)) : '0'}
                              {' '}
                            </td>
                            <td>
                              {' '}
                              {leaderboardMyRank && leaderboardMyRank.nUserRank ? `#${leaderboardMyRank.nUserRank}` : '-'}
                              {' '}
                            </td>
                          </tr>
                        )
                      }
                        {
                        leaderBoardAllData && leaderBoardAllData.length > 0 && leaderBoardAllData.map((data) => (
                          <tr key={data._id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="p-img">
                                  <img alt="" src={data && data.oUser && data.oUser.sProPic ? `${sMediaUrl}thumb/${data.oUser.sProPic}` : createImageFromInitials(500, data?.sUsername, data?.oUser?.sUsername || data?.oUser?.sName, getRandomColor())} />
                                </div>
                                <div>
                                  <span className="p-name">{data?.sUsername || data?.oUser?.sUsername || data.oUser.sName}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              {' '}
                              {data.nUserScore ? parseFloat(Number((data.nUserScore)).toFixed(2)) : '0'}
                              {' '}
                            </td>
                            <td>
                              {' '}
                              {data.nUserRank ? `#${data.nUserRank}` : '-'}
                              {' '}
                            </td>
                          </tr>
                        ))
                      }
                        {
                        ((leaderboardMyRank && leaderboardMyRank.length === 0 && leaderBoardAllData && leaderBoardAllData.length === 0) || (!leaderboardMyRank && leaderBoardAllData && leaderBoardAllData.length === 0)) && (
                          <tr className="margin-top: 50px">
                            <td colSpan="3">
                              <div className="no-team fixing-width3 d-flex align-items-center justify-content-center noLeagueShaw">
                                <div className="">
                                  <img src={NoDataFound} />
                                  <h6 className="m-3"><FormattedMessage id="No_Data_Found" /></h6>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )
                      }
                      </Fragment>
                      )}
                </tbody>
              </table>
            </div>
            )
      }
    </div>
  )
}

export default GameLeaderboardDetailPage
