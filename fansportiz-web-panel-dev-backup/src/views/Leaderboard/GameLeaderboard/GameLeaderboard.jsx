import React, { useState, useEffect, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink, TabContent, TabPane, UncontrolledButtonDropdown } from 'reactstrap'
import classnames from 'classnames'
import { useQueryState } from 'react-router-use-location-state'

// Images
import Cricket from '../../../assests/images/cricket.svg'
import Football from '../../../assests/images/football.svg'
import Kabaddi from '../../../assests/images/kabaddi.svg'
import BasketBall from '../../../assests/images/Basketball.svg'
import BaseBall from '../../../assests/images/baseball.svg'

// Components
import LeaderboardCard from '../components/LeaderboardCard'
import Loading from '../../../component/SkeletonGameLeaderBoard'

// APIs
import useSeriesList from '../../../api/leaderboard/queries/useSeriesList'
import useActiveSports from '../../../api/activeSports/queries/useActiveSports'
import useSeriesCategoryList from '../../../api/leaderboard/queries/useSeriesCategoryList'

function GameLeaderboardPage (props) {
  const [series, setSeries] = useState('')
  const [activeSport, setActiveSports] = useQueryState('activeTab', '')
  const [currSeries, setCurrSeries] = useQueryState('currSeries', '')

  const { data: activeSports, isLoading: isActiveSportLoading, activeSport: queryActiveSport } = useActiveSports()
  const { data: seriesList, isLoading: isSeriesListLoading } = useSeriesList(activeSport)
  const { data: categoryList, isLoading: isCategoryListLoading } = useSeriesCategoryList(series.id)

  useEffect(() => {
    if (queryActiveSport && !activeSport) {
      setActiveSports(queryActiveSport)
    }
  }, [queryActiveSport])

  useEffect(() => {
    if (seriesList && seriesList.length > 0) {
      const data = seriesList.find((series) => series._id === currSeries)
      if (data) {
        setCurrSeries(data._id)
        setSeries({
          ...series,
          name: data.sName,
          id: data._id
        })
      } else {
        setSeries({
          ...series,
          name: seriesList[0].sName,
          id: seriesList[0]._id
        })
      }
    }
  }, [seriesList])

  function ChangeSeries (seriesData) {
    setSeries({
      ...series,
      name: seriesData.sName,
      id: seriesData._id
    })
    setCurrSeries(seriesData?._id)
  }

  return (
    <>
      <Nav className="d-flex justify-content-around flex-nowrap align-items-center match-links sports m-0">
        {
          activeSports && activeSports.length &&
            activeSports.sort((a, b) => ((a.nPosition > b.nPosition) ? 1 : -1)).map((data, index) => (
              <NavItem key={data.sKey}>
                <NavLink
                  className={classnames({ active: activeSport === data.sKey.toLowerCase() })}
                  onClick={() => {
                    setActiveSports(data.sKey.toLowerCase())
                  }}
                >
                  <img
                    alt={data.sName}
                    src={data.sKey === 'CRICKET' ? Cricket : data.sKey === 'FOOTBALL' ? Football : data.sKey === 'KABADDI' ? Kabaddi : data.sKey === 'BASKETBALL' ? BasketBall : data.sKey === 'BASEBALL' ? BaseBall : Cricket}
                  />
                  <div
                    className="sportsText"
                  >
                    {data.sName.charAt(0).toUpperCase()}
                    {data.sName.slice(1).toLowerCase()}
                  </div>
                </NavLink>
              </NavItem>
            ))
}
      </Nav>
      <div className="home-container">
        <TabContent activeTab={1}>
          <TabPane tabId={1}>
            {
              (isActiveSportLoading || isSeriesListLoading || isCategoryListLoading)
                ? <Loading length={4} />
                : seriesList && seriesList.length > 0
                  ? (
                    <>
                      <div className="series-top">
                        <FormattedMessage id="Select_Series" />
                        <UncontrolledButtonDropdown>
                          <DropdownToggle caret>
                            {' '}
                            {series.name}
                            {' '}
                          </DropdownToggle>
                          <DropdownMenu>
                            {
                            seriesList && seriesList.length > 0
                              ? seriesList.map((seriesData) => (
                                <Fragment key={seriesData._id}>
                                  <DropdownItem onClick={() => ChangeSeries(seriesData)}>
                                    {' '}
                                    {seriesData.sName}
                                    {' '}
                                  </DropdownItem>
                                </Fragment>
                              ))
                              : (
                                <div className="no-team d-flex align-items-center justify-content-center fullHeightHalfMargin">
                                  <div className="">
                                    <i className="icon-trophy" />
                                    <h6 className="m-3"><FormattedMessage id="No_data_found_Please_check_back_after_while" /></h6>
                                  </div>
                                </div>
                                )
                          }
                          </DropdownMenu>
                        </UncontrolledButtonDropdown>
                      </div>
                      {
                      categoryList && categoryList.length > 0
                        ? categoryList.map((category) => (
                          <Fragment key={category._id}>
                            <LeaderboardCard leaderboardCard {...props} activeSport={activeSport} currSeries={currSeries} data={category} leaderboardTitle={series?.name} round />
                          </Fragment>
                        ))
                        : (
                          <div className="no-team d-flex align-items-center justify-content-center fullHeightHalfMargin">
                            <div className="">
                              <i className="icon-trophy" />
                              <h6 className="m-3"><FormattedMessage id="No_data_found_Please_check_back_after_while" /></h6>
                            </div>
                          </div>
                          )
                    }
                    </>
                    )
                  : (
                    <div className="no-team d-flex align-items-center justify-content-center fullHeightHalfMargin">
                      <div className="">
                        <i className="icon-trophy" />
                        <h6 className="m-3"><FormattedMessage id="No_data_found_Please_check_back_after_while" /></h6>
                      </div>
                    </div>
                    )
            }
          </TabPane>
        </TabContent>
      </div>
    </>
  )
}

export default GameLeaderboardPage
