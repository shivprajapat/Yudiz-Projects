import React, { Fragment, useState, useEffect, useRef, lazy, Suspense } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  Button, Card, CardBody, CardFooter, CardHeader, Nav, NavItem, NavLink, TabContent, TabPane, Alert, Table
} from 'reactstrap'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { useQueryState } from 'react-router-use-location-state'
import { FormattedMessage } from 'react-intl'
import qs from 'query-string'
import CreateContestIcon from '../../../assests/images/create_contest_icon.svg'
import JoinContestIcon from '../../../assests/images/join_contest_icon.svg'
import IconSettings from '../../../assests/images/icon-settings.svg'
import addTeam from '../../../assests/images/addTeam.svg'
import Loading from '../../../component/Loading'
// import { isUpperCase } from '../../../utils/helper'
import { viewMatchTips } from '../../../utils/Analytics.js'
import LeaguesList from '../../../HOC/SportsLeagueList/LeaguesList'
import useGetCurrency from '../../../api/settings/queries/useGetCurrency'
const classNames = require('classnames')
const MyContact = lazy(() => import('../components/MyContast'))
const LeagueContest = lazy(() => import('../../Home/components/LeagueContest'))
const MyAllTeams = lazy(() => import('../components/MyAllTeams'))

function LeaguesPage (props) {
  const {
    activeTab,
    getMyContestsList,
    getMyTeamList,
    leagueList,
    message,
    modalMessage,
    toggle,
    filterSlide,
    setFilterSlide,
    sortSlide,
    setSortSlide,
    Sort,
    Filter,
    setFilter,
    setSort,
    match,
    listed,
    Filterd, FilterdEntry, FilterdNoOfTeam, FilterdPrizePool, FilterdCategory,
    sorted,
    type,
    ApplyFilter,
    changeType,
    close,
    loading,
    amountData,
    teamList,
    matchDetails,
    matchTipsDetails,
    VideoStream,
    paymentSlide,
    setPaymentSlide,
    FilterEntry,
    setFilterEntry,
    FilterNoOfTeam,
    setFilterNoOfTeam,
    FilterPrizePool,
    setFilterPrizePool,
    FilterCategory,
    setFilterCategory,
    onGetUserProfile,
    userInfo,
    // currencyLogo,
    list,
    iconIsActive
  } = props

  const { sMatchId, sportsType } = useParams()
  const [searchParams] = useSearchParams()
  const homePage = searchParams.get('homePage')
  const activeTabSearch = searchParams.get('activeTab')
  const navigate = useNavigate()
  const location = useLocation()
  const { data: currencyLogo } = useGetCurrency()

  const [filterData, setFilterData] = useState([])
  const [alert, setAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  // eslint-disable-next-line no-unused-vars
  const [activeTabs, setActiveState] = useQueryState('activeTab', '1')
  const previousProps = useRef({
    amountData
  }).current
  let active = 1

  useEffect(() => { // handle the response
    if (location && location.state && location.state.tab) {
      toggle(parseInt(location.state.tab))
      setActiveState(location.state.tab)
    }
    if (location && location.state && location.state.message) {
      if (location.state.message) {
        setAlert(true)
        setAlertMessage(location.state.message)
        setTimeout(() => {
          setAlert(false)
        }, 2000)
      }
    }
    if (activeTabSearch) {
      if (activeTabSearch) {
        active = activeTabSearch
        setActiveState(parseInt(active))
        toggle(parseInt(active))
      }
    }
    // if (sportsType) {
    //   const sport = sportsType
    //   isUpperCase(sport) && navigate(`/upcoming-match/leagues/${sport.toLowerCase()}/${sMatchId}`)
    // }
    // !userInfo && onGetUserProfile()
  }, [])

  function handleRefresh () {
    leagueList()
  }

  useEffect(() => { // set the response
    if (previousProps.amountData !== amountData) {
      if (amountData && amountData?.oValue?.nAmount > 0) {
        navigate('/deposit',
          {
            state: {
              amountData: amountData?.oValue,
              message: 'Insufficient Balance'
            }
          })
      }
    }
    return () => {
      previousProps.amountData = amountData
    }
  }, [amountData])

  useEffect(() => {
    if (paymentSlide) {
      !userInfo && onGetUserProfile()
    }
  }, [paymentSlide])
  function myContestList () {
    getMyContestsList()
  }

  function myTeamList () {
    getMyTeamList()
  }

  return (
    <>
      {alert && alertMessage && alertMessage.length ? <Alert color="primary" isOpen={alert}>{alertMessage}</Alert> : ''}
      {
                modalMessage
                  ? (
                    <Fragment>
                      <Alert color="primary" isOpen={modalMessage}>{message}</Alert>
                    </Fragment>
                    )
                  : ''
              }
      <Fragment >
        <Nav className={`live-tabs justify-content-around ${matchDetails && matchDetails.sFantasyPost && 'four-tabs'}`}>
          <NavItem className='text-center'>
            <NavLink className={classnames({ active: activeTab === 1 })}
              onClick={() => {
                toggle(1)
                setActiveState(1)
              }}
            >
              <FormattedMessage id="Contest" />

            </NavLink>
          </NavItem>
          <NavItem className='text-center'>
            <NavLink className={classnames({ active: activeTab === 2 })}
              onClick={() => {
                toggle(2)
                setActiveState(2)
              }}
            >
              <FormattedMessage id="My_Contest" />

            </NavLink>
          </NavItem>
          <NavItem className='text-center'>
            <NavLink className={classnames({ active: activeTab === 3 })}
              onClick={() => {
                toggle(3)
                setActiveState(3)
              }}
            >
              <FormattedMessage id="My_Teams" />

            </NavLink>
          </NavItem>
          {
              matchDetails && matchDetails.sFantasyPost && (
              <Fragment>
                <NavItem className='text-center'>
                  <NavLink className={classnames({ active: activeTab === 4 })}
                    onClick={() => {
                      if (matchDetails && matchDetails.sName && matchDetails._id && location.pathname) {
                        viewMatchTips(matchDetails.sName, matchDetails._id, location.pathname)
                      } else {
                        matchDetails && matchDetails.sName && matchDetails._id && viewMatchTips(matchDetails.sName, matchDetails._id, '')
                      }
                      toggle(4)
                      setActiveState(4)
                    }}
                  >
                    <FormattedMessage id="Match_Tips" />

                  </NavLink>
                </NavItem>
              </Fragment>
              )
          }
        </Nav>
        <div className='league-container'
          onClick={() => {
            if (filterSlide) setFilterSlide(false)
            if (sortSlide) setSortSlide(false)
          }}
        >
          {
            !VideoStream && (
            <TabContent activeTab={activeTab}>
              <TabPane tabId={1}>
                <div className='d-flex contest-btn align-items-center justify-content-between'>
                  <Link className='d-flex align-items-center f-btn justify-content-between'
                    to={{
                      pathname: `/join-contest/${(sportsType).toLowerCase()}/${sMatchId}`,
                      search: `?${qs.stringify({
                            homePage: homePage ? 'yes' : undefined
                          })}`
                    }}
                  >
                    <FormattedMessage id="Join_contest" />
                    {' '}
                    <img alt={<FormattedMessage id='Join_Contest' />} src={JoinContestIcon} />
                  </Link>
                  <Link className='d-flex align-items-center f-btn justify-content-between'
                    to={{
                      pathname: `/create-contest/${(sportsType).toLowerCase()}/${sMatchId}`,
                      search: `?${qs.stringify({
                        homePage: homePage ? 'yes' : undefined
                    })}`
                    }}
                  >
                    <FormattedMessage id="Create_a_contest" />
                    {' '}
                    <img alt={<FormattedMessage id='Create_Contest' />} src={CreateContestIcon} />
                  </Link>
                </div>
                {/* <div className='hidden-feild'> */}
                {
                  ((list?.length > 0) || (listed?.length > 0)) && (
                    <>
                      <p className='sort_by_text'><FormattedMessage id="Sort_by" /></p>
                      <div className='new-sort-box d-flex align-items-center justify-content-between pt-0'>
                        <div className={`d-flex justify-content-center filter ${sorted === 'Popularity' ? 'actived' : ''}`}
                          onClick={() => {
                            changeType('Popularity')
                          }}
                        >
                          <Button className={`${sorted === 'Popularity' ? 'selected' : ''}`}><FormattedMessage id="Popularity" /></Button>
                        </div>
                        <div className={`d-flex justify-content-center filter ${sorted === 'Prize-Pool' ? 'actived' : ''}`}
                          onClick={() => {
                            changeType('Prize-Pool')
                          }}
                        >
                          <Button className={`${sorted === 'Prize-Pool' ? 'selected' : ''}`}><FormattedMessage id="Prize_Pool" /></Button>
                          {
                            sorted === 'Prize-Pool' && <i className={classNames('asc-dsc', { 'icon-up-arrow': !type, 'icon-down-arrow': type })}> </i>
                          }
                        </div>
                        <div className={`d-flex justify-content-center filter ${sorted === 'Spots' ? 'actived' : ''}`}
                          onClick={() => {
                            changeType('Spots')
                          }}
                        >
                          <Button className={`${sorted === 'Spots' ? 'selected' : ''}`} ><FormattedMessage id="Spots" /></Button>
                          {
                            sorted === 'Spots' && <i className={classNames('asc-dsc', { 'icon-up-arrow': !type, 'icon-down-arrow': type })}> </i>
                          }
                        </div>
                        <div className={`d-flex justify-content-center filter ${sorted === 'Winner' ? 'actived' : ''}`}
                          onClick={() => {
                            changeType('Winner')
                          }}
                        >
                          <Button className={`${sorted === 'Winner' ? 'selected' : ''}`}><FormattedMessage id="Winners" /></Button>
                          {
                            sorted === 'Winner' && <i className={classNames('asc-dsc', { 'icon-up-arrow': !type, 'icon-down-arrow': type })}> </i>
                          }
                        </div>
                        <div className={`d-flex justify-content-center filter ${sorted === 'Entry' ? 'actived' : ''}`}
                          onClick={() => {
                            changeType('Entry')
                          }}
                        >
                          <Button className={`${sorted === 'Entry' ? 'selected' : ''}`}><FormattedMessage id="Entry" /></Button>
                          {
                            sorted === 'Entry' && <i className={classNames('asc-dsc', { 'icon-up-arrow': !type, 'icon-down-arrow': type })}> </i>
                          }
                        </div>
                      </div>
                    </>
                  )
                }
                {/* </div> */}
                {/* <div className='sort-box d-flex align-items-end justify-content-between pt-0'>
                  <div className='sort-i position-relative'>
                    <label className='d-block'><FormattedMessage id="Sort" /> </label>
                    <button onClick={() => { setSortSlide(true) }} className='w-100 d-flex align-items-center justify-content-between f-btn'><i className='icon-caret-down'></i>{sorted}
                    </button>
                    {
                      !(sorted === 'Popularity')
                        ? <button className={classNames('asc-dsc', { 'icon-up-arrow': type, 'icon-down-arrow': !type })} onClick={changeType}> </button>
                        : ''
                    }
                  </div>
                  <button onClick={() => { setFilterSlide(true) }} className='d-flex align-items-center justify-content-between f-btn'><i className='icon-sound-mixer'></i>{Filterd && Filterd.length !== 0 ? Filterd && Filterd.join(', ') : <FormattedMessage id="Select_Filters" />}</button>
                </div> */}
                <Suspense fallback={<Loading />}>
                  <LeagueContest handleRefreshFun={handleRefresh} listed={listed} matchType='upcoming' setFilterData={setFilterData} tab={1} {...props} Filterd={Filterd} FilterdCategory={FilterdCategory} FilterdEntry={FilterdEntry} FilterdNoOfTeam={FilterdNoOfTeam} FilterdPrizePool={FilterdPrizePool} sortBy={sorted} />
                </Suspense>
              </TabPane>
              <TabPane tabId={2}>
                <Suspense fallback={<Loading />}>
                  <MyContact {...props}
                    matchType='upcoming'
                    myContestList={myContestList}
                    setTab={() => {
                      setActiveState(1)
                      toggle(1)
                    }
                  }
                    tab={2}
                  />
                </Suspense>
              </TabPane>
              {activeTab === 3 && (
              <TabPane tabId={3}>
                <Suspense fallback={<Loading />}>
                  <MyAllTeams {...props} loadingList={loading} match={match} matchType='upcoming' myTeamList={myTeamList} notCalling onLinesUp={matchDetails && matchDetails.bLineupsOut} onPreviewTeam params={sMatchId}/>
                </Suspense>
                {
                  teamList && teamList.length > 0 && (
                    <Link className='add-team'
                      state={ { activeTab: activeTab, referUrl: `/upcoming-match/leagues/${(sportsType).toLowerCase()}/${sMatchId}` }}
                      to={{
                        pathname: `/create-team/${(sportsType).toLowerCase()}/${sMatchId}`,
                        search: `?${qs.stringify({
                      homePage: homePage ? 'yes' : undefined
                    })}`
                      }}
                    >
                      <img src={addTeam} />
                    </Link>
                  )
                }
              </TabPane>
              )}
              <TabPane tabId={4}>
                {loading && <Loading />}
                <div className="cms backWhite">
                  <h1>
                    {' '}
                    {matchTipsDetails && matchTipsDetails.sTitle}
                    {' '}
                  </h1>
                  {
                    matchTipsDetails && matchTipsDetails.sContent && (
                      <div dangerouslySetInnerHTML={{ __html: matchTipsDetails && matchTipsDetails.sContent && matchTipsDetails.sContent }} className="offer-d-txt" />
                    )
                  }
                </div>
              </TabPane>
            </TabContent>
            )}
        </div>
        {filterSlide
          ? (
            <>
              <div className="s-team-bg" onClick={() => setFilterSlide(false)} />
              <Card className={classNames('filter-card small-screen-filter', { show: filterSlide })}>
                <CardHeader className='d-flex align-items-center justify-content-between filter-header-sticky'>
                  <button>
                    <i className="icon-left"
                      onClick={() => {
                        setFilterSlide(false)
                        // ApplyFilter(Filter, FilterEntry, FilterNoOfTeam, FilterPrizePool)
                      }}
                    />
                    <FormattedMessage id="Filter_by" />
                  </button>
                  <button className='red-clear-btn'
                    onClick={() => {
                      setFilterEntry([])
                      setFilterNoOfTeam([])
                      setFilterPrizePool([])
                      setFilter([])
                      setFilterCategory([])
                      // setFilterSlide(false)
                      // ApplyFilter(Filter, FilterEntry, FilterNoOfTeam, FilterPrizePool)
                    }}
                  >
                    <FormattedMessage id="Clear_All" />
                  </button>
                </CardHeader>
                <CardBody className={classNames({ 'text-end': document.dir === 'rtl', 'filter-box': true })}>
                  <h3 className='me-2'><FormattedMessage id="Entry" /></h3>
                  <ul className='m-0 d-flex align-item-center flex-wrap'>
                    <li>
                      <input checked={FilterEntry.includes('1-50')} className='d-none' id='FilterData' name='filter' type='checkbox' />
                      <label htmlFor='FilterData' onClick={() => FilterEntry.includes('1-50') ? setFilterEntry(FilterEntry.filter(fData => fData !== '1-50')) : setFilterEntry([...FilterEntry, '1-50'])}>{`${currencyLogo}1 - ${currencyLogo}50`}</label>
                    </li>
                    <li>
                      <input checked={FilterEntry.includes('51-100')} className='d-none' id='FilterData' name='filter' type='checkbox' />
                      <label htmlFor='FilterData' onClick={() => FilterEntry.includes('51-100') ? setFilterEntry(FilterEntry.filter(fData => fData !== '51-100')) : setFilterEntry([...FilterEntry, '51-100'])}>{`${currencyLogo}51 - ${currencyLogo}100`}</label>
                    </li>
                    <li>
                      <input checked={FilterEntry.includes('101-1000')} className='d-none' id='FilterData' name='filter' type='checkbox' />
                      <label htmlFor='FilterData' onClick={() => FilterEntry.includes('101-1000') ? setFilterEntry(FilterEntry.filter(fData => fData !== '101-1000')) : setFilterEntry([...FilterEntry, '101-1000'])}>{`${currencyLogo}101 - ${currencyLogo}1000`}</label>
                    </li>
                    <li>
                      <input checked={FilterEntry.includes('1001-above')} className='d-none' id='FilterData' name='filter' type='checkbox' />
                      <label htmlFor='FilterData' onClick={() => FilterEntry.includes('1001-above') ? setFilterEntry(FilterEntry.filter(fData => fData !== '1001-above')) : setFilterEntry([...FilterEntry, '1001-above'])}>{`${currencyLogo}1001 & above`}</label>
                    </li>
                  </ul>
                </CardBody>
                <CardBody className={classNames({ 'text-end': document.dir === 'rtl', 'filter-box': true })}>
                  <h3 className='me-2'><FormattedMessage id="Number_of_Teams" /></h3>
                  <ul className='m-0 d-flex align-item-center flex-wrap'>
                    <ul className='m-0 d-flex align-item-center flex-wrap'>
                      <li>
                        <input checked={FilterNoOfTeam.includes('2')} className='d-none' id='FilterData' name='filter' type='checkbox' />
                        <label htmlFor='FilterData' onClick={() => FilterNoOfTeam.includes('2') ? setFilterNoOfTeam(FilterNoOfTeam.filter(fData => fData !== '2')) : setFilterNoOfTeam([...FilterNoOfTeam, '2'])}>2</label>
                      </li>
                      <li>
                        <input checked={FilterNoOfTeam.includes('3-10')} className='d-none' id='FilterData' name='filter' type='checkbox' />
                        <label htmlFor='FilterData' onClick={() => FilterNoOfTeam.includes('3-10') ? setFilterNoOfTeam(FilterNoOfTeam.filter(fData => fData !== '3-10')) : setFilterNoOfTeam([...FilterNoOfTeam, '3-10'])}>3 - 10</label>
                      </li>
                      <li>
                        <input checked={FilterNoOfTeam.includes('11-100')} className='d-none' id='FilterData' name='filter' type='checkbox' />
                        <label htmlFor='FilterData' onClick={() => FilterNoOfTeam.includes('11-100') ? setFilterNoOfTeam(FilterNoOfTeam.filter(fData => fData !== '11-100')) : setFilterNoOfTeam([...FilterNoOfTeam, '11-100'])}>11 - 100</label>
                      </li>
                      <li>
                        <input checked={FilterNoOfTeam.includes('101-1000')} className='d-none' id='FilterData' name='filter' type='checkbox' />
                        <label htmlFor='FilterData' onClick={() => FilterNoOfTeam.includes('101-1000') ? setFilterNoOfTeam(FilterNoOfTeam.filter(fData => fData !== '101-1000')) : setFilterNoOfTeam([...FilterNoOfTeam, '101-1000'])}>101 - 1000</label>
                      </li>
                      <li>
                        <input checked={FilterNoOfTeam.includes('1001-above')} className='d-none' id='FilterData' name='filter' type='checkbox' />
                        <label htmlFor='FilterData' onClick={() => FilterNoOfTeam.includes('1001-above') ? setFilterNoOfTeam(FilterNoOfTeam.filter(fData => fData !== '1001-above')) : setFilterNoOfTeam([...FilterNoOfTeam, '1001-above'])}>1001 - above</label>
                      </li>
                    </ul>
                  </ul>
                </CardBody>
                <CardBody className={classNames({ 'text-end': document.dir === 'rtl', 'filter-box': true })}>
                  <h3 className='me-2'><FormattedMessage id="Prize_Pool" /></h3>
                  <ul className='m-0 d-flex align-item-center flex-wrap'>
                    <ul className='m-0 d-flex align-item-center flex-wrap'>
                      <li>
                        <input checked={FilterPrizePool.includes('1-10000')} className='d-none' id='FilterData' name='filter' type='checkbox' />
                        <label htmlFor='FilterData' onClick={() => FilterPrizePool.includes('1-10000') ? setFilterPrizePool(FilterPrizePool.filter(fData => fData !== '1-10000')) : setFilterPrizePool([...FilterPrizePool, '1-10000'])}>{`${currencyLogo}1 to ${currencyLogo}10,000`}</label>
                      </li>
                      <li>
                        <input checked={FilterPrizePool.includes('10000-100000')} className='d-none' id='FilterData' name='filter' type='checkbox' />
                        <label htmlFor='FilterData' onClick={() => FilterPrizePool.includes('10000-100000') ? setFilterPrizePool(FilterPrizePool.filter(fData => fData !== '10000-100000')) : setFilterPrizePool([...FilterPrizePool, '10000-100000'])}>{`${currencyLogo}10,000 to ${currencyLogo}1 Lakh`}</label>
                      </li>
                      <li>
                        <input checked={FilterPrizePool.includes('100000-1000000')} className='d-none' id='FilterData' name='filter' type='checkbox' />
                        <label htmlFor='FilterData' onClick={() => FilterPrizePool.includes('100000-1000000') ? setFilterPrizePool(FilterPrizePool.filter(fData => fData !== '100000-1000000')) : setFilterPrizePool([...FilterPrizePool, '100000-1000000'])}>{`${currencyLogo}1 Lakh to ${currencyLogo}10 Lakh`}</label>
                      </li>
                      <li>
                        <input checked={FilterPrizePool.includes('1000000-2500000')} className='d-none' id='FilterData' name='filter' type='checkbox' />
                        <label htmlFor='FilterData' onClick={() => FilterPrizePool.includes('1000000-2500000') ? setFilterPrizePool(FilterPrizePool.filter(fData => fData !== '1000000-2500000')) : setFilterPrizePool([...FilterPrizePool, '1000000-2500000'])}>{`${currencyLogo}10 Lakh to ${currencyLogo}25 Lakh`}</label>
                      </li>
                      <li>
                        <input checked={FilterPrizePool.includes('2500000')} className='d-none' id='FilterData' name='filter' type='checkbox' />
                        <label htmlFor='FilterData' onClick={() => FilterPrizePool.includes('2500000') ? setFilterPrizePool(FilterPrizePool.filter(fData => fData !== '2500000')) : setFilterPrizePool([...FilterPrizePool, '2500000'])}>{`${currencyLogo}25 Lakh & above`}</label>
                      </li>
                    </ul>
                  </ul>
                </CardBody>
                <CardBody className={classNames({ 'text-end': document.dir === 'rtl', 'filter-box': true })}>
                  <h3 className='me-2'><FormattedMessage id="Contest_type" /></h3>
                  <ul className='m-0 d-flex align-item-center flex-wrap'>
                    <li>
                      <input checked={FilterCategory.includes('SingleEntry')} className='d-none' id='FilterData' name='filter' type='checkbox' />
                      <label htmlFor='FilterData' onClick={() => FilterCategory.includes('SingleEntry') ? setFilterCategory(FilterCategory.filter(fData => fData !== 'SingleEntry')) : setFilterCategory([...FilterCategory, 'SingleEntry'])}><FormattedMessage id='Single_Entry' /></label>
                    </li>
                    <li>
                      <input checked={FilterCategory.includes('MultiEntry')} className='d-none' id='FilterData' name='filter' type='checkbox' />
                      <label htmlFor='FilterData' onClick={() => FilterCategory.includes('MultiEntry') ? setFilterCategory(FilterCategory.filter(fData => fData !== 'MultiEntry')) : setFilterCategory([...FilterCategory, 'MultiEntry'])}><FormattedMessage id='Multi_Entry' /></label>
                    </li>
                    <li>
                      <input checked={FilterCategory.includes('SingleWinner')} className='d-none' id='FilterData' name='filter' type='checkbox' />
                      <label htmlFor='FilterData' onClick={() => FilterCategory.includes('SingleWinner') ? setFilterCategory(FilterCategory.filter(fData => fData !== 'SingleWinner')) : setFilterCategory([...FilterCategory, 'SingleWinner'])}><FormattedMessage id='Single_Winner' /></label>
                    </li>
                    <li>
                      <input checked={FilterCategory.includes('MultiWinner')} className='d-none' id='FilterData' name='filter' type='checkbox' />
                      <label htmlFor='FilterData' onClick={() => FilterCategory.includes('MultiWinner') ? setFilterCategory(FilterCategory.filter(fData => fData !== 'MultiWinner')) : setFilterCategory([...FilterCategory, 'MultiWinner'])}><FormattedMessage id='Multi_Winner' /></label>
                    </li>
                    <li>
                      <input checked={FilterCategory.includes('Guranteed')} className='d-none' id='FilterData' name='filter' type='checkbox' />
                      <label htmlFor='FilterData' onClick={() => FilterCategory.includes('Guranteed') ? setFilterCategory(FilterCategory.filter(fData => fData !== 'Guranteed')) : setFilterCategory([...FilterCategory, 'Guranteed'])}><FormattedMessage id='Guaranteed' /></label>
                    </li>
                  </ul>
                </CardBody>
                <CardBody className={classNames({ 'text-end': document.dir === 'rtl', 'filter-box': true })}>
                  <h3 className={document.dir === 'rtl' ? 'me-2' : ''}>
                    {' '}
                    <FormattedMessage id="League_Type" />
                    {' '}
                  </h3>
                  <ul className='m-0 d-flex align-item-center flex-wrap'>
                    {
                      filterData && filterData.length !== 0
                        ? filterData.map(data => {
                          return (
                            <li key={data._id}>
                              <input checked={Filter.includes(data)} className='d-none' id='FilterData' name='filter' type='checkbox' />
                              <label htmlFor='FilterData' onClick={() => Filter.includes(data) ? setFilter(Filter.filter(fData => fData !== data)) : setFilter([...Filter, data])}>{data}</label>
                            </li>
                          )
                        })
                        : (
                          <h3 className={document.dir === 'rtl' ? 'me-2' : ''}>
                            {' '}
                            <FormattedMessage id="Fair_play_is_not_available" />
                            {' '}
                          </h3>
                          )
                    }
                  </ul>
                </CardBody>
                <CardFooter className='p-0 border-0 bg-trnsparent'>
                  <Button className='w-100' color='primary-two' onClick={() => ApplyFilter(Filter, FilterEntry, FilterNoOfTeam, FilterPrizePool, FilterCategory)}>
                    <FormattedMessage id="Apply" />
                    {' '}
                  </Button>
                </CardFooter>
              </Card>
            </>
            )
          : ''
        }
        {paymentSlide
          ? (
            <>
              <div className="s-team-bg" onClick={() => setPaymentSlide(false)} />
              <Card className={classNames('filter-card', { show: filterSlide })}>
                <CardHeader className='d-flex align-items-center justify-content-between'>
                  <button onClick={() => { setPaymentSlide(false) }}><FormattedMessage id='Wallet_Details' /></button>
                  <button className='red-close-btn' onClick={() => setPaymentSlide(false)}><FormattedMessage id='Close' /></button>
                </CardHeader>
                <CardBody className='payment-box'>

                  <Table className="m-0 bg-white payment">
                    <thead>
                      <tr className='text-center'>
                        {' '}
                        <th colSpan='2'><FormattedMessage id="Total_Balance" /></th>
                        {' '}
                      </tr>
                      <tr className='text-center'>
                        {' '}
                        <th colSpan='2'>
                          {currencyLogo}
                          {userInfo && userInfo.nCurrentTotalBalance}
                          {' '}

                        </th>
                        {' '}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className={document.dir === 'rtl' ? 'text-end' : 'text-start'}><FormattedMessage id="Deposit_Balance" /></td>
                        <td className={document.dir === 'rtl' ? 'text-start' : 'text-end'}>
                          {currencyLogo}
                          {userInfo && userInfo.nCurrentDepositBalance}
                        </td>
                      </tr>
                      <tr>
                        <td className={document.dir === 'rtl' ? 'text-end' : 'text-start'}><FormattedMessage id="Win_Balance" /></td>
                        <td className={document.dir === 'rtl' ? 'text-start' : 'text-end'}>
                          {currencyLogo}
                          {userInfo && userInfo.nCurrentWinningBalance}
                        </td>
                      </tr>
                      <tr>
                        <td className={document.dir === 'rtl' ? 'text-end' : 'text-start'}><FormattedMessage id="Cash_Bonus" /></td>
                        <td className={document.dir === 'rtl' ? 'text-start' : 'text-end'}>
                          {currencyLogo}
                          {userInfo && userInfo.nCurrentBonus}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </CardBody>
                <CardFooter className='p-0 border-0 bg-white'>
                  <Button className='w-100' color='primary-two' onClick={() => navigate('/deposit')}><FormattedMessage id="Add_Cash" /></Button>
                </CardFooter>
              </Card>
            </>
            )
          : ''
        }
        {sortSlide
          ? (
            <>
              <div className="s-team-bg" onClick={() => setSortSlide(false)} />
              <Card className={classNames('filter-card', { show: sortSlide })}>
                <CardHeader className='d-flex align-items-center justify-content-between'>
                  <button onClick={() => {
                    setSortSlide(false)
                    setSort(Sort)
                  }}
                  >
                    <i className='icon-left' />
                    <FormattedMessage id="Sort_by" />
                  </button>
                </CardHeader>
                <CardBody>
                  <ul className='m-0 d-flex align-item-center flex-wrap'>
                    <li>
                      <input className='d-none' defaultChecked={Sort === 'Popularity'} id='Popularity' name='sort' type='radio' />
                      <label htmlFor='Popularity' onClick={() => setSort('Popularity')} value='Popularity'>
                        <FormattedMessage id="Popularity" />
                        <i className='icon-checked' />
                      </label>
                    </li>
                    <li>
                      <input className='d-none' defaultChecked={Sort === 'Spots'} id='Spots' name='sort' type='radio' />
                      <label htmlFor='Spots' onClick={() => setSort('Spots')} value='Spots'>
                        <FormattedMessage id="Spots" />
                        <i className='icon-checked' />
                      </label>
                    </li>
                    <li>
                      <input className='d-none' defaultChecked={Sort === 'Winner'} id='Winner' name='sort' type='radio' />
                      <label htmlFor='Winner' onClick={() => setSort('Winner')} value='Winner'>
                        <FormattedMessage id="Winners" />
                        <i className='icon-checked' />
                      </label>
                    </li>
                    <li>
                      <input className='d-none' defaultChecked={Sort === 'Entry'} id='Entry' name='sort' type='radio' />
                      <label htmlFor='Entry' onClick={() => setSort('Entry')} value='Entry'>
                        <FormattedMessage id="Entry" />
                        <i className='icon-checked' />
                      </label>
                    </li>
                    <li>
                      <input className='d-none' defaultChecked={Sort === 'Prize-Pool'} id='PrizePool' name='sort' type='radio' />
                      <label htmlFor='PrizePool' onClick={() => setSort('Prize-Pool')} value='Prize Pool'>
                        <FormattedMessage id="Prize_Pool" />
                        <i className='icon-checked' />
                      </label>
                    </li>
                  </ul>
                </CardBody>
                <CardFooter className='p-0 border-0 bg-trnsparent'>
                  <Button className='w-100' color='primary' onClick={() => close(Sort)}><FormattedMessage id="Apply_now" /></Button>
                </CardFooter>
              </Card>
            </>
            )
          : ''
        }
        {
          activeTab === 1 && (
            <button className='bottomRight-btn'
              onClick={() => {
                setFilterSlide(true)

                setFilter(Filterd)
                setFilterEntry(FilterdEntry)
                setFilterNoOfTeam(FilterdNoOfTeam)
                setFilterPrizePool(FilterdPrizePool)
                setFilterCategory(FilterdCategory)
              }}
            >
              <img src={IconSettings} />
              {iconIsActive && <div className='active' />}

            </button>
          )
        }
      </Fragment>
    </>
  )
}
LeaguesPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      sportsType: PropTypes.string
    })
  }),
  location: PropTypes.shape({
    state: PropTypes.shape({
      activeTab: PropTypes.number,
      tab: PropTypes.number,
      message: PropTypes.string
    }),
    search: PropTypes.string,
    pathname: PropTypes.string
  }),
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  resStatus: PropTypes.bool,
  resMessage: PropTypes.string,
  leagueList: PropTypes.func,
  list: PropTypes.array,
  listed: PropTypes.array,
  Filterd: PropTypes.array,
  FilterdEntry: PropTypes.array,
  FilterdNoOfTeam: PropTypes.array,
  FilterdPrizePool: PropTypes.array,
  FilterdCategory: PropTypes.array,
  sorted: PropTypes.string,
  Sort: PropTypes.string,
  Filter: PropTypes.array,
  sortSlide: PropTypes.bool,
  loading: PropTypes.bool,
  filterSlide: PropTypes.bool,
  setFilterSlide: PropTypes.func,
  onGetUserProfile: PropTypes.func,
  userInfo: PropTypes.object,
  FilterEntry: PropTypes.array,
  setFilterEntry: PropTypes.func,
  FilterNoOfTeam: PropTypes.array,
  setFilterNoOfTeam: PropTypes.func,
  FilterPrizePool: PropTypes.array,
  setFilterPrizePool: PropTypes.func,
  FilterCategory: PropTypes.array,
  setFilterCategory: PropTypes.func,
  setSortSlide: PropTypes.func,
  setPaymentSlide: PropTypes.func,
  setSort: PropTypes.func,
  type: PropTypes.bool,
  ApplyFilter: PropTypes.func,
  changeType: PropTypes.func,
  close: PropTypes.func,
  activeTab: PropTypes.number,
  message: PropTypes.string,
  modalMessage: PropTypes.bool,
  paymentSlide: PropTypes.bool,
  toggle: PropTypes.func,
  setFilter: PropTypes.func,
  getMyTeamList: PropTypes.func,
  getMyContestsList: PropTypes.func,
  amountData: PropTypes.shape({
    oValue: PropTypes.shape({
      nAmount: PropTypes.number
    })
  }),
  matchDetails: PropTypes.shape({
    bLineupsOut: PropTypes.bool,
    sFantasyPost: PropTypes.string,
    _id: PropTypes.string,
    sName: PropTypes.string
  }),
  matchTipsDetails: PropTypes.shape({
    sTitle: PropTypes.string,
    sContent: PropTypes.string
  }),
  teamList: PropTypes.array,
  VideoStream: PropTypes.bool,
  currencyLogo: PropTypes.string,
  iconIsActive: PropTypes.bool
}
export default LeaguesList(LeaguesPage)
