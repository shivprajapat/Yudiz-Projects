import React, { useState, Fragment, useRef, useEffect, forwardRef } from 'react'
import { connect } from 'react-redux'
import { Button, Form, FormGroup, Input, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle, UncontrolledPopover, PopoverBody, CustomInput } from 'reactstrap'
import PropTypes from 'prop-types'
import excelIcon from '../../../assets/images/excel-icon.svg'
import { Link, useHistory } from 'react-router-dom'
import addlIcon from '../../../assets/images/add-white-icon.svg'
import calendarIcon from '../../../assets/images/calendar-icon.svg'
import backIcon from '../../../assets/images/left-theme-arrow.svg'
import DatePicker from 'react-datepicker'
import closeIcon from '../../../assets/images/close-icon.svg'
import maintenance from '../../../assets/images/maintenance.png'
import refreshIcon from '../../../assets/images/refresh.svg'
import infoIcon from '../../../assets/images/info2.svg'

// Common header component for settings tab

function Heading (props) {
  const {
    heading,
    format,
    handleChange,
    list,
    startDate,
    endDate,
    feedback,
    FormatsList,
    promocode,
    version,
    recommendedList,
    promocodeStatistics,
    setModalOpen,
    modalOpen,
    permission,
    sliderStatistics,
    dateRange,
    setDateRange,
    notificationFilter,
    getMaintenanceModeFunc,
    maintenancePermission,
    dateFlag,
    automatedNotification
  } = props

  const history = useHistory()
  const [show, setShow] = useState(false)
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const previousProps = useRef({ recommendedList }).current

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className='form-control date-range' onClick={onClick}>
      <Input className='mx-2' value={value} placeholder='Select Date Range' ref={ref} readOnly />
      <img src={calendarIcon} alt="calendar" />
    </div>
  ))
  ExampleCustomInput.displayName = ExampleCustomInput

  useEffect(() => {
    if ((previousProps.recommendedList !== recommendedList) && recommendedList) {
      setShow(true)
    }
    return () => {
      previousProps.recommendedList = recommendedList
    }
  }, [recommendedList])

  return (
    <div className='header-block'>
      <div className='d-flex justify-content-between'>
        <div className='d-flex inline-input'>
          {promocodeStatistics ? <img height='24' width='24' src={backIcon} className='custom-go-back' onClick={() => history.push(`/settings/promocode-management${page?.PromoCodeManagement || ''}`)}></img> : ''}
          {automatedNotification ? <img height='24' width='24' src={backIcon} className='custom-go-back' onClick={() => history.push(`/users/push-notification${page?.PushNotificationManagement || ''}`)}></img> : ''}
          {sliderStatistics ? <img height='24' width='24' src={backIcon} className='custom-go-back' onClick={() => history.push(`/settings/slider-management${page?.SliderManagement || ''}`)}></img> : ''}
          <h2 className='ml-2'>{heading}{props.info && <Fragment><img className='custom-info' src={infoIcon} id='info'></img>
          <UncontrolledPopover trigger="legacy" placement="bottom" target='info'>
            <PopoverBody>
              <p>After updating anything from here, It will take some time to reflect on the app.</p>
            </PopoverBody>
          </UncontrolledPopover></Fragment>}</h2>
        </div>
        <div className='btn-list'>
          {props.onExport && list && (list.total > 0 || list.length >= 1 || list?.nTotal >= 1) && (
            <img
              src={excelIcon}
              alt='excel'
              onClick={props.onExport}
              title='Export'
              className='header-button'
            />
          )}
          {props.refresh && (
            <Button color="link" onClick={props.onRefresh}>
              <img src={refreshIcon} alt="Users" height="20px" width="20px" />
            </Button>
          )}
          {maintenancePermission && <img src={maintenance} onClick={getMaintenanceModeFunc} height='30' width='30' alt="maintenance" title='Maintenance' />}
        </div>

          {props.onExport && FormatsList && (FormatsList.total > 0 || FormatsList.length !== 0)
            ? (
            <img
              src={excelIcon}
              alt='excel'
              onClick={props.onExport}
              title='Export'
              className='header-button'
              style={{ cursor: 'pointer' }}
            />
              )
            : ''}
          </div>

          <div className='d-flex justify-content-between align-items-start fdc-480'>
          <Form className='d-flex fdc-480'>
            {props.handleSearch
              ? <FormGroup>
            <Input
              autoComplete='off'
              type='search'
              className='search-box'
              name='search'
              placeholder='Search'
              value={props.search}
              onChange={props.handleSearch}
            />
          </FormGroup>
              : ''}
          {props.handleRecommendedSearch && <FormGroup>
            <UncontrolledDropdown>
              <DropdownToggle nav caret className='searchList w-100'>
                <Input
                  type='text'
                  autoComplete="off"
                  className='search-box'
                  name='search'
                  placeholder='Search'
                  value={props.search || props.complaintSearch}
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
              {(props.search || props.complaintSearch)
                ? <img src={closeIcon} className='custom-close-img' alt="close"
                  onClick={(e) => {
                    props.handleRecommendedSearch(e, '')
                    props.handleChangeSearch(e, '')
                  }
                }/>
                : ''}
              {(list?.nTotal >= 1 || list?.aData?.length >= 1)
                ? <DropdownMenu open={show} className={recommendedList?.length >= 1 ? 'recommended-search-dropdown' : ''}>
                {(recommendedList?.length >= 1)
                  ? ((typeof (props.complaintSearch) === 'number')
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
                        ))
                  : <DropdownItem>
                User not found
            </DropdownItem>}
            </DropdownMenu>
                : ''}
            </UncontrolledDropdown>
          </FormGroup>}
            {(feedback || promocode || notificationFilter) && (
              <FormGroup>
                <DatePicker
                  value={dateRange}
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => {
                    setDateRange(update)
                    dateFlag && (dateFlag.current = true)
                  }}
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  isClearable={true}
                  placeholderText='Select Date Range'
                  customInput={<ExampleCustomInput />}
                >
                </DatePicker>
              </FormGroup>
            )}
          </Form>
          {/* <Row>
            <Col lg='9' md='8' className='text-right'>
              {(permission && props.aNotification) && <Button onClick={() => setModalOpen(!modalOpen)} className={`theme-btn icon-btn ${version} && mb-3`}>
                <img src={addlIcon} alt="add" />
                  {props.aNotification}
              </Button>}
              {(permission && props.notification) && <Button onClick={() => setModalOpen(!modalOpen)} className={`theme-btn icon-btn ${version} && mb-3`}>
                <img src={addlIcon} alt="add" />
                  {props.notification}
              </Button>}
              {(props.buttonText && permission) && <Button tag={Link} to={props.setUrl} className={`theme-btn icon-btn ${version} && mb-3`}>
                <img src={addlIcon} alt="add" />
                {props.buttonText}
              </Button>}
            </Col>
          </Row> */}
          <FormGroup>
            {(permission && props.aNotification) && <Button tag={Link} to='/users/push-notification/automated-notification' className={`theme-btn mr-3 ${version} && mb-3`}>
                {props.aNotification}
            </Button>}
            {(permission && props.notification) && <Button onClick={() => setModalOpen(!modalOpen)} className={`theme-btn icon-btn ${version} && mb-3`}>
              <img src={addlIcon} alt="add" />
                {props.notification}
            </Button>}
            {(props.buttonText && permission) && <Button tag={Link} to={props.setUrl} className={`theme-btn icon-btn ${version} && mb-3`}>
              <img src={addlIcon} alt="add" />
              {props.buttonText}
            </Button>}
          </FormGroup>
          {(format || props.pointSystem) && (
            <FormGroup>
              <CustomInput
                type='select'
                name='select'
                id='matchFormat'
                value={format}
                onChange={handleChange}
              >
                {FormatsList &&
                  FormatsList.length !== 0 &&
                  FormatsList.map((data, i) => {
                    return (
                      <option value={data} key={data}>
                        {data}
                      </option>
                    )
                  })}
              </CustomInput>
            </FormGroup>
          )}
      </div>
    </div>
  )
}

Heading.propTypes = {
  search: PropTypes.string,
  heading: PropTypes.string,
  handleSearch: PropTypes.func,
  onExport: PropTypes.func,
  buttonText: PropTypes.string,
  setUrl: PropTypes.string,
  format: PropTypes.string,
  handleChange: PropTypes.func,
  list: PropTypes.arrayOf(PropTypes.object),
  feedback: PropTypes.string,
  FormatsList: PropTypes.object,
  promocode: PropTypes.any,
  version: PropTypes.string,
  recommendedList: PropTypes.object,
  complaintSearch: PropTypes.string,
  handleRecommendedSearch: PropTypes.func,
  handleChangeSearch: PropTypes.func,
  sliderStatistics: PropTypes.bool,
  promocodeStatistics: PropTypes.any,
  notification: PropTypes.string,
  aNotification: PropTypes.string,
  setModalOpen: PropTypes.func,
  modalOpen: PropTypes.bool,
  permission: PropTypes.bool,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  setDateRange: PropTypes.func,
  dateRange: PropTypes.array,
  onClick: PropTypes.func,
  value: PropTypes.string,
  notificationFilter: PropTypes.bool,
  getMaintenanceModeFunc: PropTypes.func,
  maintenancePermission: PropTypes.bool,
  dateFlag: PropTypes.bool,
  refresh: PropTypes.bool,
  onRefresh: PropTypes.func,
  info: PropTypes.bool,
  automatedNotification: PropTypes.bool,
  pointSystem: PropTypes.bool
}

export default connect()(Heading)
