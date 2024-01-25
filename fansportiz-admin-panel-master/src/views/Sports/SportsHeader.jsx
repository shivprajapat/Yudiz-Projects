import React, { useState, useEffect, forwardRef } from 'react'
import { Link, useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Button, Card, CardBody, CardSubtitle, CardText, CardTitle, Col, Form, FormGroup, Input, Row } from 'reactstrap'
import { useSelector } from 'react-redux'
import addlIcon from '../../assets/images/add-white-icon.svg'
import generateIcon from '../../assets/images/generate-icon.svg'
import fetchIcon from '../../assets/images/fetch-icon.svg'
import refreshIcon from '../../assets/images/refresh.svg'
import backIcon from '../../assets/images/left-theme-arrow.svg'
import calendarIcon from '../../assets/images/calendar-icon.svg'
import excelIcon from '../../assets/images/excel-icon.svg'
import DatePicker from 'react-datepicker'

// Common header component for sports tab(cricket, football, etc.)

function SportsHeader (props) {
  const {
    fetchMatchPlayerList,
    fetchPlaying11,
    lineupsOut,
    botUser,
    userLeagueList,
    MatchPageLink,
    generateScorePoint,
    setModalMessage,
    prizeDistributionFunc,
    winPrizeDistributionFunc,
    rankCalculate,
    pointCalculate,
    startDate,
    endDate,
    matchLeaguePage,
    seasonPoint,
    MatchDetails,
    leagueCount,
    matchLeague,
    seasonListPage,
    onExport,
    usersListInSeason,
    matchPlayerManagement,
    matchLeagueManagement,
    matchManagement,
    dateRange,
    setDateRange,
    fetchPlayingSevenFunc,
    fetchPlayingFiveFunc,
    status,
    userLeaguePage,
    matchLeagueList,
    promoUsageList,
    clearPendingReq
  } = props
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const resStatus = useSelector(state => state.matchleague.resStatus)
  const [Lineupsout, setLineupsout] = useState(false)
  const history = useHistory()
  const page = JSON.parse(localStorage.getItem('queryParams'))

  const [totalLeagueCount, setTotalLeagueCount] = useState(0)
  const [totalJoinedUser, setTotalJoinedUser] = useState(0)
  const [pointCalc, setPointCalc] = useState(0)
  const [rankCalc, setRankCalc] = useState(0)
  const [prizeCalc, setPrizeCalc] = useState(0)
  const [winPrizeCalc, setWinPrizeCalc] = useState(0)

  useEffect(() => {
    if (resStatus) {
      setTotalJoinedUser(leagueCount?.nJoinedUsers || 0)
      setTotalLeagueCount(leagueCount?.nLeagueCount || 0)
      setPointCalc(leagueCount?.nPointCalculated || 0)
      setRankCalc(leagueCount?.nRankCalculated || 0)
      setPrizeCalc(leagueCount?.nPrizeCalculated || 0)
      setWinPrizeCalc(leagueCount?.nWinDistributed || 0)
    }
  }, [leagueCount])

  useEffect(() => {
    if (MatchDetails && MatchDetails.bLineupsOut) {
      setLineupsout(MatchDetails && MatchDetails.bLineupsOut ? MatchDetails.bLineupsOut : '')
    }

    return () => {
      setTotalJoinedUser('-')
      setTotalLeagueCount('-')
      setPointCalc('-')
      setRankCalc('-')
      setPrizeCalc('-')
      setWinPrizeCalc('-')
    }
  }, [MatchDetails])

  function lineupOut () {
    setLineupsout(!Lineupsout)
    lineupsOut(!Lineupsout)
  }

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className='form-control date-range' onClick={onClick}>
      <Input className='mx-2' value={value} placeholder='Select Date Range' ref={ref} readOnly />
      <img src={calendarIcon} alt="calendar" />
    </div>
  ))
  ExampleCustomInput.displayName = ExampleCustomInput

  return (
    <div className="header-block">
      <div className="filter-block d-flex justify-content-between align-items-start">
        <div className='d-flex inline-input'>
          {props.MatchPageLink && <img src={backIcon} className='custom-go-back' height='24' width='24' onClick={() => MatchPageLink ? (clearPendingReq && clearPendingReq(), history.push(`${MatchPageLink}`)) : history.goBack()}></img>}
          {props.seasonListPage && <img src={backIcon} className='custom-go-back' height='24' width='24' onClick={() => seasonListPage ? history.push(`${seasonListPage}${page?.SeasonList || ''}`) : history.goBack()}></img>}
          {props.matchLeaguePage && <img src={backIcon} className='custom-go-back' height='24' width='24' onClick={() => (props?.goBack === true || props?.location?.state?.goBack) ? history.goBack() : history.push({ pathname: `${matchLeaguePage}`, search: page?.MatchLeagueManagement || '' })}></img>}
          {props.userLeaguePage && <img src={backIcon} className='custom-go-back' height='24' width='24' onClick={() => history.push(`${userLeaguePage}`)}></img>}
          <h2 className='ml-2 font-size-14-480'>{props.heading}</h2>
        </div>
        <div className='btn-list'>
          {
            onExport && ((matchLeagueList?.total !== 0 && status === 'CMP') || ((usersListInSeason?.total > 0) || (userLeagueList?.data && userLeagueList.data[0].total > 0)) || (promoUsageList?.results?.length > 0)) &&
            <img src={excelIcon} alt="excel" onClick={props.onExport} title="Export" className="header-button" style={{ cursor: 'pointer' }}/>
          }
          {props.refresh && (
            <Button color="link" onClick={props.onRefresh}>
              <img src={refreshIcon} alt="Users" height="24" width="24" />
            </Button>
          )}
        </div>
      </div>

      <Row>
        <Col xl='2' lg='4' md='6' className='ml-10px-480'>
          {matchLeague && (adminPermission?.MATCHLEAGUE !== 'N') && (<FormGroup>
            <Input type="search" className="search-box" name="search" value={props.search} placeholder='Search' onChange={props.handleSearch} />
          </FormGroup>)}
        </Col>
        {(props.permission && props.isShow && status && (status === 'U' || status === 'P'))
          ? <Col xl='2' lg='4' md='2'></Col>
          : <Col xl='2' lg='8' md='6'></Col> }
        {(props.permission && props.isShow && status && (status === 'U' || status === 'P')) && (
          <Col xl='8' lg='4' md='4' className='text-right text-align-left-480'>
            {(props.normalBotTeamsTrue) && status && status === 'U' && (adminPermission?.SYSTEM_USERS === 'W' || Auth === 'SUPER') && (
              <Button type="submit" className="theme-btn ml-2 ml-0-480" onClick={props.editNormalBotTeams}>
                EDIT NORMAL BOT TEAMS
              </Button>
            )}
            <Button className="theme-btn icon-btn ml-2" tag={Link} to={props.setUrl}>
              <img src={addlIcon} alt="add" />
              {props.buttonText}
            </Button>
          </Col>
        )}
        {props.otherButton && (adminPermission?.MATCHLEAGUE !== 'N') && status && status === 'I' && (
          <Col xl='2' lg='3' md='6' className='calculation-card'>
              <Card>
                <CardBody>
                  <div className='d-flex justify-content-between'>
                    <div>
                      <CardTitle>Points</CardTitle>
                      <CardSubtitle>{pointCalc} / {totalJoinedUser}</CardSubtitle>
                    </div>
                    <CardText>
                      <Button onClick={pointCalculate} className='calculate-button' disabled={(pointCalc && rankCalc && prizeCalc && winPrizeCalc) || (pointCalc === totalJoinedUser) || (adminPermission?.MATCHLEAGUE === 'R') || (totalJoinedUser === 0)}>
                        Calculate
                      </Button>
                    </CardText>
                  </div>
                </CardBody>
              </Card>
          </Col>
        )}
        {props.otherButton && (adminPermission?.MATCHLEAGUE !== 'N') && status && status === 'I' && (
          <Col xl='2' lg='3' md='6' className='calculation-card'>
              <Card>
                <CardBody>
                  <div className='d-flex justify-content-between'>
                    <div>
                      <CardTitle>Rank</CardTitle>
                      <CardSubtitle>{rankCalc} / {totalJoinedUser}</CardSubtitle>
                    </div>
                    <CardText>
                      <Button className="calculate-button" onClick={rankCalculate} disabled={(pointCalc === 0 && totalJoinedUser === 0) || (pointCalc !== totalJoinedUser) || (rankCalc === totalJoinedUser) || (pointCalc && rankCalc && prizeCalc && winPrizeCalc) || (adminPermission?.MATCHLEAGUE === 'R')}>
                        Calculate
                      </Button>
                    </CardText>
                  </div>
                </CardBody>
              </Card>
          </Col>
        )}
        {props.otherButton && (adminPermission?.MATCHLEAGUE !== 'N') && status && status === 'I' && (
          <Col xl='2' lg='3' md='6' className='calculation-card'>
              <Card>
                <CardBody>
                  <div className='d-flex justify-content-between'>
                    <div>
                      <CardTitle>Prize</CardTitle>
                      <CardSubtitle>{prizeCalc} / {totalLeagueCount}</CardSubtitle>
                    </div>
                    <CardText>
                      <Button className="calculate-button" onClick={prizeDistributionFunc} disabled={((rankCalc !== totalJoinedUser) || (!rankCalc)) || (prizeCalc === totalLeagueCount) || (pointCalc && rankCalc && prizeCalc && winPrizeCalc) || (adminPermission?.MATCHLEAGUE === 'R')}>
                        Calculate
                      </Button>
                    </CardText>
                  </div>
                </CardBody>
              </Card>
          </Col>
        )}
        {props.otherButton && (adminPermission?.MATCHLEAGUE !== 'N') && status && status === 'I' && (
          <Col xl='2' lg='3' md='6' className='calculation-card'>
            <Card>
              <CardBody>
                <div className='d-flex justify-content-between'>
                  <div>
                    <CardTitle>Win Prize</CardTitle>
                    <CardSubtitle>{winPrizeCalc} / {totalLeagueCount}</CardSubtitle>
                  </div>
                  <CardText>
                    <Button className="calculate-button" onClick={winPrizeDistributionFunc} disabled={(prizeCalc !== totalLeagueCount || !rankCalc || !prizeCalc) || (pointCalc && rankCalc && prizeCalc && (winPrizeCalc === totalLeagueCount)) || (adminPermission?.MATCHLEAGUE === 'R')}>
                      Distribute
                    </Button>
                  </CardText>
                </div>
              </CardBody>
            </Card>
          </Col>
        )}
      </Row>

      {matchLeagueManagement &&
      <Row>
        <Col lg='3' md='4'>
          <Form className='d-flex'>
            {props.hidden &&
              <FormGroup>
                <Input type="search" className="search-box" name="search" value={props.search} placeholder='Search' onChange={props.handleSearch} />
              </FormGroup>}
          </Form>
        </Col>
        <Col lg='9' md='8' className='text-right text-align-left-480'>
          {(userLeagueList && userLeagueList.matchLeague && userLeagueList.matchLeague.bBotCreate) && status && status === 'U' && (
              <Button type="submit" className="theme-btn" onClick={() => botUser(false)} disabled={adminPermission?.MATCHPLAYER === 'R'}>
                STOP SYSTEM TEAM
              </Button>
          )}
          {props.AddSystemTeam && props.permission && (userLeagueList && userLeagueList.matchLeague && (!userLeagueList.matchLeague.bPrivateLeague)) && (status && status === 'U') && (
            <Button className="theme-btn icon-btn ml-2 ml-0-480" onClick={() => setModalMessage(true)}>
              <img src={addlIcon} alt="add" />
              {props.AddSystemTeam}
            </Button>
          )}
          {(userLeagueList && status && status === 'L')
            ? <>
            <marquee width="100%" direction="left">
              <h5 className='text-danger pt-4'>Disclaimer : Rank and Points are not Accurate in Live Match</h5>
            </marquee></>
            : ''}
        </Col>
      </Row>}

      {matchPlayerManagement &&
      <Row>
        <Col xl='3' md={(status && status === 'U') ? 12 : 4}>
          <Form className='d-flex'>
            {props.hidden &&
              <FormGroup>
                <Input type="search" className="search-box" name="search" value={props.search} placeholder='Search' onChange={props.handleSearch} />
              </FormGroup>}
          </Form>
        </Col>
        <Col xl='9' md={(status && status === 'U') ? 12 : 8} className={(window.innerWidth > 968) ? 'text-right text-align-left-480 btn-list' : (window.innerWidth <= 768 && status && status !== 'U') ? 'text-right text-align-left-480 btn-list' : 'text-align-left-480 btn-list'}>
          {seasonPoint && status && status === 'U' &&
          <Button className="theme-btn" onClick={seasonPoint} disabled={adminPermission?.MATCHPLAYER === 'R'}>
          Season point</Button>
          }
          {props.LineUpsOut && MatchDetails?.eProvider !== 'CUSTOM' && status && (status === 'U') && (
            <Button style={{ background: 'none' }} onClick={lineupOut} disabled={adminPermission?.MATCHPLAYER === 'R'} className="ml-2 button-section button-section-outline section-btn">
              Lineups Out - {Lineupsout === false ? 'NO' : 'YES'}
            </Button>
          )}
          {props.scorePoint && (adminPermission?.SCORE_POINT !== 'N') && status && (status === 'I' || status === 'L') && (
            <Button className="theme-btn icon-btn ml-2" onClick={generateScorePoint} disabled={adminPermission?.SCORE_POINT === 'R'}>
              <img src={generateIcon} alt="add" />
              Generate Score Points
            </Button>
          )}

          {props.fetchPlayingEleven && MatchDetails?.eProvider !== 'CUSTOM' && status && (status === 'U') && (
            <Button className="theme-btn icon-btn ml-2" onClick={fetchPlaying11} disabled={adminPermission?.MATCHPLAYER === 'R'}>
              <img src={fetchIcon} alt="add" />
              Fetch Playing 11
            </Button>
          )}
          {props.fetchPlayingSeven && status && (status === 'U') && (
            <Button className="theme-btn icon-btn ml-2" onClick={fetchPlayingSevenFunc} disabled={adminPermission?.MATCHPLAYER === 'R'}>
              <img src={fetchIcon} alt="add" />
              Fetch Playing 7
            </Button>
          )}
          {props.fetchPlayingFive && status && (status === 'U') && (
            <Button className="theme-btn icon-btn ml-2" onClick={fetchPlayingFiveFunc} disabled={adminPermission?.MATCHPLAYER === 'R'}>
              <img src={fetchIcon} alt="add" />
              Fetch Playing 5
            </Button>
          )}
          {props.fetchMatchPlayer && MatchDetails?.eProvider !== 'CUSTOM' && status && (status === 'U' || status === 'P') && (
            <Button className="theme-btn icon-btn ml-2" onClick={fetchMatchPlayerList} disabled={adminPermission?.MATCHPLAYER === 'R'}>
              <img src={fetchIcon} alt="Fetch Match Player" />
              Fetch Match Player
            </Button>
          )}
          {(props.permission && props.isShowAddButton && status && (status === 'U' || status === 'P')) && (
            <Button className="theme-btn icon-btn ml-2" tag={Link} to={props.setUrl}>
              <img src={addlIcon} alt="add" />
              {props.buttonText}
            </Button>
          )}
        </Col>
      </Row>}
      <Row>
        <Col xl='10' lg='8' md={matchManagement ? 12 : 9}>
          <Form className='d-flex fdc-480'>
          {!props.hidden &&
            <FormGroup>
              <Input type="search" className="search-box" name="search" value={props.search} placeholder='Search' onChange={props.handleSearch} />
              {leagueCount && <div className='total-text'>Total Leagues : <b>{leagueCount.nLeagueCount ? leagueCount.nLeagueCount : 0}</b></div>}
              {totalLeagueCount ? <div className='total-text'>Total User Leagues : <b>{totalLeagueCount}</b></div> : ''}
            </FormGroup>
          }
          {props.searchDateBox && (
            <FormGroup>
              <DatePicker
                value={dateRange}
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => {
                  setDateRange(update)
                }}
                isClearable={true}
                placeholderText='Select Date Range'
                customInput={<ExampleCustomInput />}
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
              >
              </DatePicker>
            </FormGroup>
          )}
          {props.handleDatePicker && props.permission && (
            <FormGroup>
              <Button className="form-control" name="date-range" onClick={props.handleDatePicker}>{props.selectedDate ? `${props.selectedDate}` : props.DateText ? `${props.DateText}` : 'Select Match  Date'}</Button>
            </FormGroup>
          )}
          </Form>
        </Col>
        <Col xl='2' lg='4' md={matchManagement ? 12 : 3} className='text-right text-left-480'>
          {(props.extButton && props.permission) && <Button className="theme-btn icon-btn" tag={Link} to={props.setUrl}>
          <img src={addlIcon} alt="add" />
            {props.buttonText}
          </Button>}
        </Col>
      </Row>
    </div>
  )
}

SportsHeader.propTypes = {
  handleSearch: PropTypes.func,
  heading: PropTypes.string,
  prizeDistributionFunc: PropTypes.func,
  selectedDate: PropTypes.string,
  setUrl: PropTypes.string,
  buttonText: PropTypes.string,
  otherButton: PropTypes.bool,
  fetchPlaying11: PropTypes.func,
  generateScorePoint: PropTypes.func,
  setModalMessage: PropTypes.func,
  rankCalculate: PropTypes.func,
  pointCalculate: PropTypes.func,
  fetchMatchPlayerList: PropTypes.func,
  permission: PropTypes.bool,
  extButton: PropTypes.any,
  isShow: PropTypes.bool,
  leagueCount: PropTypes.object,
  hidden: PropTypes.any,
  searchDateBox: PropTypes.bool,
  lineupsOut: PropTypes.func,
  botUser: PropTypes.func,
  userLeagueList: PropTypes.object,
  MatchPageLink: PropTypes.string,
  winPrizeDistributionFunc: PropTypes.func,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  matchLeaguePageLink: PropTypes.string,
  seasonPoint: PropTypes.func,
  MatchDetails: PropTypes.object,
  matchLeague: PropTypes.bool,
  fetchPlayingEleven: PropTypes.bool,
  fetchMatchPlayer: PropTypes.bool,
  AddSystemTeam: PropTypes.any,
  onRefresh: PropTypes.func,
  handleDatePicker: PropTypes.func,
  LineUpsOut: PropTypes.bool,
  scorePoint: PropTypes.bool,
  refresh: PropTypes.bool,
  DateText: PropTypes.string,
  search: PropTypes.string,
  seasonListPage: PropTypes.string,
  onExport: PropTypes.func,
  usersListInSeason: PropTypes.object,
  matchManagement: PropTypes.bool,
  matchPlayerManagement: PropTypes.bool,
  matchLeagueManagement: PropTypes.bool,
  setDateRange: PropTypes.func,
  dateRange: PropTypes.array,
  onClick: PropTypes.func,
  value: PropTypes.string,
  isShowAddButton: PropTypes.bool,
  fetchPlayingSevenFunc: PropTypes.func,
  fetchPlayingSeven: PropTypes.bool,
  fetchPlayingFiveFunc: PropTypes.func,
  fetchPlayingFive: PropTypes.bool,
  status: PropTypes.string,
  matchLeaguePage: PropTypes.string,
  userLeaguePage: PropTypes.bool,
  matchLeagueList: PropTypes.object,
  promoUsageList: PropTypes.object,
  goBack: PropTypes.bool,
  location: PropTypes.object,
  clearPendingReq: PropTypes.func,
  editNormalBotTeams: PropTypes.func,
  normalBotTeamsTrue: PropTypes.bool
}

export default SportsHeader
