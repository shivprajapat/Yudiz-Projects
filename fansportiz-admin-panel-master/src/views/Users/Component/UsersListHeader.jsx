import React, { useState, Fragment, useEffect, useRef, forwardRef } from 'react'
import { Button, Form, FormGroup, Input, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle, CustomInput } from 'reactstrap'
import PropTypes from 'prop-types'
import excelIcon from '../../../assets/images/excel-icon.svg'
import calendarIcon from '../../../assets/images/calendar-icon.svg'
import addlIcon from '../../../assets/images/add-white-icon.svg'
import refreshIcon from '../../../assets/images/refresh.svg'
import DatePicker from 'react-datepicker'
import closeIcon from '../../../assets/images/close-icon.svg'
import backIcon from '../../../assets/images/left-theme-arrow.svg'
import { useHistory } from 'react-router-dom'

// Common header for users tab
function UserListHeader (props) {
  const {
    hidden, users, handleOtherFilter, filter, dateRange, dateFlag, setDateRange, permission, recommendedList, list, heading, search, handleSearch, startDate, endDate, searchComplaint, setModalMessage, searchType, passbook
  } = props
  const history = useHistory()
  const [show, setShow] = useState(false)
  const previousProps = useRef({ recommendedList }).current
  const page = JSON.parse(localStorage.getItem('queryParams'))

  useEffect(() => {
    if (previousProps.recommendedList !== recommendedList && recommendedList) {
      setShow(true)
    }
    return () => {
      previousProps.recommendedList = recommendedList
    }
  }, [recommendedList])

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className='form-control date-range' onClick={onClick}>
      <Input className='mx-2' value={value} placeholder='Select Date Range' ref={ref} readOnly />
      <img src={calendarIcon} alt="calendar" />
    </div>
  ))
  ExampleCustomInput.displayName = ExampleCustomInput

  return (
    <div className="header-block">
      <div className="d-flex justify-content-between">
        <div className='d-flex inline-input'>
          {props.userDetailsPage && <img src={backIcon} className='custom-go-back' height='24' width='24' onClick={() => history.push(`${props.userDetailsPage}`, { userList: true })}></img>}
          {props.isUserToPassbook && <img src={backIcon} className='custom-go-back' height='24' width='24' onClick={() => history.push(`user-management/user-details/${props.userToPassbookId}`, { userList: true })}></img>}
          {props.isSystemUserToPassbook && <img src={backIcon} className='custom-go-back' height='24' width='24' onClick={() => history.push(`/users/system-user/system-user-details/${props.userToPassbookId}`, { userList: true })}></img>}
          {props.isTdsToPassbook && <img src={backIcon} className='custom-go-back' height='24' width='24' onClick={() => history.push('tds-management', { userList: true })}></img>}
          {props.isLeagueToPassbook && <img src={backIcon} className='custom-go-back' height='24' width='24' onClick={() => history.push({ pathname: `/cricket/match-management/match-league-management/${props.leagueToPassbookId}`, search: page?.MatchLeagueManagement || '' }, { userList: true })}></img>}
          {props.isLeagueToTds && <img src={backIcon} className='custom-go-back' height='24' width='24' onClick={() => history.push({ pathname: `/cricket/match-management/match-league-management/${props.leagueToTdsId}`, search: page?.MatchLeagueManagement || '' }, { userList: true })}></img>}
          {window.innerWidth <= 480
            ? <div><h3 className='mb-0'>{heading}</h3> <p>{props.leagueToTdsMatch && `(${props?.leagueToTdsMatch} - ${props.leagueToTdsLeague})`} {props.leagueToPassbookMatch && `(${props?.leagueToPassbookMatch} - ${props.leagueToPassbookLeague})`}</p></div>
            : <h2>{heading} {props.leagueToTdsMatch && `(${props?.leagueToTdsMatch} - ${props.leagueToTdsLeague})`} {props.leagueToPassbookMatch && `(${props?.leagueToPassbookMatch} - ${props.leagueToPassbookLeague})`}</h2>}
        </div>
      <div className="btn-list">
        {props.onExport && list && ((list.rows && list.rows.length > 0) || (list.results && list.results.length > 0) || (list.total > 0) || (list.length > 0)) &&
          <img src={excelIcon} alt="excel" onClick={props.onExport} title="Export" className="header-button" style={{ cursor: 'pointer' }}/>
        }
        {props.refresh && (
          <Button color="link" onClick={props.onRefresh}>
            <img src={refreshIcon} alt="SystemUsers" height="20px" width="20px" />
          </Button>
        )}
        </div>
        </div>
      <div className="filter-block d-flex justify-content-between align-items-start fdc-480">
        <Form className="d-flex fdc-480">
        {(!searchComplaint && !hidden && !props?.isUserToPassbook && !props?.isTdsToPassbook && !props?.isSystemUserToPassbook) && <FormGroup>
            <Input type="search" className="search-box" name="search" placeholder="Search" value={search} onKeyPress={handleSearch} onChange={handleSearch} />
          </FormGroup>}
          {searchComplaint &&
            <FormGroup>
                <UncontrolledDropdown>
                  <DropdownToggle nav caret className='searchList w-100'>
                    <Input
                      type='text'
                      autoComplete="off"
                      className='search-box'
                      name='search'
                      placeholder='Search'
                      value={props.search || props.kycSearch}
                      onKeyPress={(e) => {
                        props.handleRecommendedSearch(e, e.target.value)
                        props.handleChangeSearch(e, '')
                      }}
                      onChange={(e) => {
                        props.handleRecommendedSearch(e, e.target.value)
                        props.handleChangeSearch(e, '')
                        setShow(true)
                      }}
                    />
                  </DropdownToggle>
                  {(props.search || props.kycSearch)
                    ? <img src={closeIcon} className='custom-close-img' alt="close"
                      onClick={(e) => {
                        props.handleRecommendedSearch(e, '')
                        props.handleChangeSearch(e, '')
                      }
                    }/>
                    : ''}
                  {(list?.total >= 1 || list?.length >= 1) && <DropdownMenu open={show} className={recommendedList?.length >= 1 ? 'recommended-search-dropdown' : ''}>
                      {recommendedList?.length >= 1
                        ? (typeof (props.kycSearch) === 'number')
                            ? (
                          <Fragment>
                            {
                              recommendedList?.length > 0 && recommendedList.map((recommendedData, index) => {
                                return (
                                  <DropdownItem key={index} onClick={(e) => {
                                    props.handleChangeSearch(e, recommendedData.sMobNum)
                                  }}>
                                    {recommendedData.sMobNum}
                                  </DropdownItem>
                                )
                              })
                            }
                          </Fragment>
                              )
                            : (
                          <Fragment>
                            {
                              recommendedList?.length > 0 && recommendedList.map((recommendedData, index) => {
                                return (
                                  <DropdownItem key={index} onClick={(e) => {
                                    props.handleChangeSearch(e, recommendedData.sEmail)
                                  }}>
                                    {recommendedData.sEmail}
                                  </DropdownItem>
                                )
                              })
                            }
                          </Fragment>
                              )
                        : <DropdownItem>
                        User not found
                      </DropdownItem>
                    }
                  </DropdownMenu>}
                </UncontrolledDropdown>
              </FormGroup>}
          {passbook && !props?.isUserToPassbook && !props?.isTdsToPassbook && !props?.isSystemUserToPassbook && <FormGroup>
            <CustomInput
              type="select"
              name="type"
              id="type"
              value={searchType}
              className="mt-1"
              onChange={handleOtherFilter}
            >
              <option value=''>Search by</option>
              <option key='NAME' value='NAME'>Name</option>
              <option key='USERNAME' value='USERNAME'>Username</option>
              <option key='MOBILE' value='MOBILE'>Mobile No</option>
              <option key='PASSBOOK' value='PASSBOOK'>Passbook ID</option>
            </CustomInput>
          </FormGroup>}
          {users && <FormGroup>
            <CustomInput
              type="select"
              name="type"
              id="type"
              value={filter}
              className="mt-1"
              onChange={handleOtherFilter}
            >
              <option value=''>Filter by</option>
              <option key='EMAIL_VERIFIED' value='EMAIL_VERIFIED'>Email Verified</option>
              <option key='MOBILE_VERIFIED' value='MOBILE_VERIFIED'>Mobile Verified</option>
              <option key='INTERNAL_ACCOUNT' value='INTERNAL_ACCOUNT'>Internal Account</option>
            </CustomInput>
          </FormGroup>}
          {!props.hideDateBox && <FormGroup>
            <DatePicker
              value={dateRange}
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                setDateRange(update)
                dateFlag && (dateFlag.current = true)
              }}
              isClearable={true}
              placeholderText='Select Date Range'
              customInput={<ExampleCustomInput />}
              peekNextMonth
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              maxDate={new Date()}
            >
            </DatePicker>
          </FormGroup>}
        </Form>
        {props.normalUser && list && (<div className='total-text'>Total Users : <b>{props.totalCount?.count || 0}</b></div>)}
        {props.buttonText && permission &&
        <div>
          <Button onClick={setModalMessage} className="theme-btn icon-btn">
              <img src={addlIcon} alt="add" />
              {props.buttonText}
            </Button>
          {props.systemUsers && list && (<div className='total-text'>Total System Users : <b>{props.totalCount?.count || 0}</b></div>)}
        </div>}
      </div>
    </div>
  )
}

UserListHeader.defaultProps = {
  history: {}
}

UserListHeader.propTypes = {
  handleSearch: PropTypes.func,
  onExport: PropTypes.func,
  search: PropTypes.string,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  heading: PropTypes.string,
  isDateRangeSelect: PropTypes.bool,
  searchBox: PropTypes.bool,
  handleModalOpen: PropTypes.func,
  recommendedList: PropTypes.arrayOf(PropTypes.object),
  list: PropTypes.object,
  user: PropTypes.bool,
  passBookID: PropTypes.string,
  isOpenDateModal: PropTypes.bool,
  onHandlePassBookID: PropTypes.func,
  PassbookID: PropTypes.string,
  commonSearch: PropTypes.string,
  searchComplaint: PropTypes.bool,
  setModalMessage: PropTypes.func,
  buttonText: PropTypes.string,
  kycSearch: PropTypes.string,
  refresh: PropTypes.bool,
  handleRecommendedSearch: PropTypes.func,
  handleChangeSearch: PropTypes.func,
  searchValue: PropTypes.string,
  onRefresh: PropTypes.func,
  normalUser: PropTypes.bool,
  permission: PropTypes.bool,
  setDateRange: PropTypes.func,
  dateRange: PropTypes.array,
  onClick: PropTypes.func,
  value: PropTypes.string,
  filter: PropTypes.string,
  handleOtherFilter: PropTypes.func,
  users: PropTypes.bool,
  systemUsers: PropTypes.bool,
  totalCount: PropTypes.object,
  hidden: PropTypes.bool,
  dateFlag: PropTypes.func,
  hideDateBox: PropTypes.bool,
  userDetailsPage: PropTypes.string,
  searchType: PropTypes.string,
  passbook: PropTypes.bool,
  isUserToPassbook: PropTypes.bool,
  isSystemUserToPassbook: PropTypes.bool,
  userToPassbookId: PropTypes.string,
  isTdsToPassbook: PropTypes.bool,
  isLeagueToPassbook: PropTypes.bool,
  leagueToPassbookId: PropTypes.string,
  isLeagueToTds: PropTypes.bool,
  leagueToTdsId: PropTypes.string,
  leagueToTdsMatch: PropTypes.String,
  leagueToTdsLeague: PropTypes.string,
  leagueToPassbookMatch: PropTypes.String,
  leagueToPassbookLeague: PropTypes.string
}

export default UserListHeader
