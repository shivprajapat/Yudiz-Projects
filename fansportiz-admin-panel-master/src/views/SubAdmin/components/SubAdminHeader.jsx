import React, { forwardRef, Fragment, useEffect, useRef, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {
  Button, FormGroup, Input, Form, CustomInput, UncontrolledDropdown, DropdownToggle, DropdownItem, DropdownMenu
} from 'reactstrap'
import PropTypes from 'prop-types'
import addIcon from '../../../assets/images/add-icon.svg'
import addlIcon from '../../../assets/images/add-white-icon.svg'
import excelIcon from '../../../assets/images/excel-icon.svg'
import DatePicker from 'react-datepicker'
import calendarIcon from '../../../assets/images/calendar-icon.svg'
import closeIcon from '../../../assets/images/close-icon.svg'
import refreshIcon from '../../../assets/images/refresh.svg'
import backIcon from '../../../assets/images/left-theme-arrow.svg'
import { useSelector } from 'react-redux'

// Common header component for sub admin tab
function SubAdminHeader (props) {
  const { isMatchLog, isLeagueLog, dateFlag, recommendedList, permission, permissionComponent, List, adminLogs, adminsList, adminSearch, handleAdminSearch, handleOtherFilter, searchType, startDate, endDate, dateRange, setDateRange, matchApiLogUrl } = props
  const history = useHistory()
  const [show, setShow] = useState(false)
  const previousProps = useRef({ recommendedList }).current
  const Auth = useSelector((state) => state?.auth?.adminData?.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)

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
      <div className="filter-block d-flex justify-content-between align-items-start">
        <div className='d-flex inline-input'>
          {(isMatchLog || isLeagueLog) && <img src={backIcon} className='custom-go-back' height='24' width='24' onClick={() => history.goBack()}></img>}
          <h2>{props.header}</h2>
        </div>
        <div className="btn-list">
        {props.onExport && List && (List.total > 0 || List.length >= 1) && (
          <img
            src={excelIcon}
            alt='excel'
            onClick={props.onExport}
            title='Export'
            className='header-button'
            style={{ cursor: 'pointer' }}
          />
        )}
          {permission && permissionComponent &&
            <img src={addIcon} alt="add" className="header-button" title={props.buttonText} onClick={() => history.push(props.addLink)} style={{ cursor: 'pointer' }}/>
          }
          {props.refresh && (
            <Button color="link" onClick={props.onRefresh}>
              <img src={refreshIcon} alt="AdminLogs" height="20px" width="20px" />
            </Button>
          )}
        </div>
      </div>
      <div className="filter-block d-flex justify-content-between align-items-start fdc-480">
        <Form className="d-flex fdc-480">
          {adminLogs && <FormGroup>
            <CustomInput
              type="select"
              name="type"
              id="type"
              value={searchType}
              className="mt-1"
              onChange={handleOtherFilter}
            >
              <option value=''>Search Type</option>
              <option value='D'>Process Deposit</option>
              <option value='W'>Process Withdraw</option>
              <option value='KYC'>KYC</option>
              <option value='BD'>Bank Details</option>
              <option value='SUB'>Sub Admin</option>
              <option value='AD'>Deposit</option>
              <option value="AW">Withdraw</option>
              <option value="P">Profile</option>
              <option value="PC">Promo Code</option>
              <option value="L">League</option>
              <option value="PB">League Prize Breakup</option>
              <option value="M">Match</option>
              <option value="ML">Match League</option>
              <option value="S">Settings</option>
              <option value="CR">Common Rules</option>
            </CustomInput>
          </FormGroup>}
          {(props.Searchable || (props.adminLogs && (!isMatchLog) && (!isLeagueLog) && (searchType !== 'AW' && searchType !== 'AD' && searchType !== 'D' && searchType !== 'W' && searchType !== 'KYC' && searchType !== 'P' && searchType !== 'BD' && searchType !== ''))) && (
            <FormGroup>
              {props.adminLogs && <Input type="search" className="search-box" name="search" placeholder='Search' value={props.search}
                onChange={(e) => {
                  props.handleNormalSearch(e.target.value)
                }}
                close />}
              {!props.adminLogs && <Input type="search" className="search-box" name="search" placeholder='Search' value={props.search} onChange={props.handleSearch} close />}
            </FormGroup>
          )}
          {props.adminLogs && (!isMatchLog) && (!isLeagueLog) && (searchType === 'AW' || searchType === 'AD' || searchType === 'D' || searchType === 'W' || searchType === 'KYC' || searchType === 'P' || searchType === 'BD' || searchType === '') &&
            <FormGroup>
                <UncontrolledDropdown>
                  <DropdownToggle nav caret className='searchList w-100'>
                    <Input
                      type='text'
                      autoComplete="off"
                      className='search-box'
                      name='search'
                      placeholder='Search'
                      value={props.search || props.userSearch}
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
                  {(props.search || props.userSearch)
                    ? <img src={closeIcon} className='custom-close-img' alt="close"
                      onClick={(e) => {
                        props.handleRecommendedSearch(e, '')
                        props.handleChangeSearch(e, '')
                      }
                    }/>
                    : ''}
                  {(List?.total >= 1 || List?.aResult?.length >= 1) && <DropdownMenu open={show} className={recommendedList?.length >= 1 ? 'recommended-search-dropdown' : ''}>
                      {recommendedList?.length >= 1
                        ? (typeof (props.userSearch) === 'number')
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
          {adminLogs && (!isMatchLog) && (!isLeagueLog) &&
            <FormGroup>
              <CustomInput
                type="select"
                name="type"
                id="type"
                value={adminSearch}
                className="mt-1"
                onChange={(event) => handleAdminSearch(event)}
              >
                <option key='' value=''>Select Admin</option>
                {adminsList && adminsList.length !== 0 && adminsList.map((data, i) => {
                  return (
                    <option key={data._id} value={data._id}>{data.sUsername}</option>
                  )
                })}
              </CustomInput>
              </FormGroup>
          }
          {adminLogs && (!isMatchLog) && (!isLeagueLog) && <FormGroup>
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
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              maxDate={new Date()}
            >
            </DatePicker>
          </FormGroup>}
        </Form>
        <div className="btn-list">
          {/* props.otherButton && ((Auth && Auth === 'SUPER') || (adminPermission?.PERMISSION !== 'N')) && (
          <Button className="theme-btn icon-btn" tag={Link} to={props.permissionLink}>
            <img src={fetchIcon} alt="Permission Management" />
            Permissions
          </Button>) */
          }
          {isMatchLog && adminLogs && ((Auth && Auth === 'SUPER') || (adminPermission?.SUBADMIN !== 'N')) &&
            <Button className="theme-btn ml-2" tag={Link} to={matchApiLogUrl}>
              Match API Logs
            </Button>
          }
          {
            permission && (
              <Fragment>
                <Button tag={Link} to={props.addLink} className="theme-btn icon-btn">
                  <img src={addlIcon} alt="add" />
                  {props.addText}
                </Button>
              </Fragment>
            )
          }
        </div>
      </div>
    </div>
  )
}

SubAdminHeader.propTypes = {
  search: PropTypes.string,
  handleSearch: PropTypes.func,
  onExport: PropTypes.func,
  permission: PropTypes.bool,
  permissionComponent: PropTypes.any,
  Searchable: PropTypes.bool,
  addLink: PropTypes.string,
  buttonText: PropTypes.string,
  header: PropTypes.string,
  addText: PropTypes.string,
  List: PropTypes.object,
  adminLogs: PropTypes.any,
  adminsList: PropTypes.array,
  handleAdminSearch: PropTypes.func,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  setDateRange: PropTypes.func,
  dateRange: PropTypes.array,
  onClick: PropTypes.func,
  value: PropTypes.string,
  adminSearch: PropTypes.string,
  userSearch: PropTypes.string,
  recommendedList: PropTypes.arrayOf(PropTypes.object),
  handleRecommendedSearch: PropTypes.func,
  handleChangeSearch: PropTypes.func,
  dateFlag: PropTypes.bool,
  refresh: PropTypes.bool,
  onRefresh: PropTypes.func,
  isMatchLog: PropTypes.string,
  isLeagueLog: PropTypes.string,
  matchApiLogUrl: PropTypes.string,
  matchApiLogs: PropTypes.bool,
  handleOtherFilter: PropTypes.func,
  searchType: PropTypes.string,
  handleNormalSearch: PropTypes.func
}

export default SubAdminHeader
