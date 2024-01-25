import React, { Fragment, useState, useEffect, useRef } from 'react'
import qs from 'query-string'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import moment from 'moment'
import NavbarComponent from '../../../components/Navbar'
import SystemUser from './SystemUser'
import UserListHeader from '../../Users/Component/UsersListHeader'
import { Button, Col, Form, FormGroup, Input, Label, Modal, ModalBody, Row, UncontrolledAlert } from 'reactstrap'
import { alertClass, isPositive } from '../../../helpers/helper'
import { addSystemUsers, getSystemUserList, getSystemUsersTotalCount } from '../../../actions/systemusers'

function SystemUsers (props) {
  const dispatch = useDispatch()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const [modalMessage, setModalMessage] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [close, setClose] = useState(false)
  const [resModalMessage, setResModalMessage] = useState(false)
  const [systemUser, setSystemUser] = useState(0)
  const [systemUserErr, setSystemUserErr] = useState(' ')
  const toggleMessage = () => setModalMessage(!modalMessage)
  const resStatus = useSelector(state => state.systemusers.resStatus)
  const resMessage = useSelector(state => state.systemusers.resMessage)
  const token = useSelector(state => state.auth.token)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const permission = (Auth && Auth === 'SUPER') || (adminPermission?.SYSTEM_USERS === 'W')
  const systemUserList = useSelector(state => state.systemusers.systemUserList)
  const systemUsersTotalCount = useSelector(state => state.systemusers.systemUsersTotalCount)
  const content = useRef()
  const previousProps = useRef({ resMessage, resStatus }).current

  useEffect(() => {
    const obj = qs.parse(props.location.search)
    if (obj.searchvalue) {
      setSearch(obj.searchvalue)
    }
    if (obj.datefrom && obj.dateto) {
      setDateRange([new Date(obj.datefrom), new Date(obj.dateto)])
    }
    if (obj.filterBy) {
      setFilter(obj.filterBy)
    }
  }, [])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        if (resStatus) {
          setResModalMessage(true)
        }
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if (resModalMessage) {
      setTimeout(() => {
        setResModalMessage(false)
        setClose(false)
      }, 3000)
      setTimeout(() => {
        setClose(true)
      }, 2500)
    }
  }, [resModalMessage])

  function handleOtherFilter (e) {
    setFilter(e.target.value)
  }

  function onHandleSearch (e) {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
    setSearch(e.target.value)
    setinitialFlag(true)
  }

  function handleAddSystemUser (e, type) {
    if (type === 'systemUser') {
      if (e.target.value && !isPositive(e.target.value)) {
        setSystemUserErr('Value must be positive')
      } else {
        setSystemUserErr('')
      }
      setSystemUser(e.target.value)
    } else {
      if (e.key === 'Enter') {
        e.preventDefault()
      }
      setinitialFlag(true)
    }
  }

  function getSystemUsersTotalCountFunc (searchvalue, filterBy, startDate, endDate) {
    const dateFrom = startDate ? new Date(moment(startDate).startOf('day').format()) : ''
    const dateTo = endDate ? new Date(moment(endDate).endOf('day').format()) : ''
    const usersData = {
      searchvalue, filterBy, startDate: dateFrom ? new Date(dateFrom).toISOString() : '', endDate: dateTo ? new Date(dateTo).toISOString() : '', token
    }
    dispatch(getSystemUsersTotalCount(usersData))
  }

  function getList (start, limit, sort, order, searchvalue, filterBy, startDate, endDate, isFullResponse) {
    const dateFrom = startDate ? new Date(moment(startDate).startOf('day').format()) : ''
    const dateTo = endDate ? new Date(moment(endDate).endOf('day').format()) : ''
    const usersData = {
      start, limit, sort, order, searchvalue: searchvalue.trim(), filterBy, startDate: dateFrom ? new Date(dateFrom).toISOString() : '', endDate: dateTo ? new Date(dateTo).toISOString() : '', isFullResponse, token
    }
    dispatch(getSystemUserList(usersData))
  }

  function onExport () {
    content.current.onExport()
  }

  function cancel (e) {
    e.preventDefault()
    toggleMessage()
  }

  function addSystemUsersFunc (e) {
    e.preventDefault()
    if (!systemUserErr) {
      dispatch(addSystemUsers(systemUser, token))
      toggleMessage()
    }
  }

  function onRefreshFun () {
    content.current.onRefresh()
  }

  return (
    <Fragment>
    {
      resModalMessage && message &&
      (
      <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
      )
    }
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <UserListHeader
            heading="System Users"
            handleSearch={onHandleSearch}
            search={search}
            onExport={onExport}
            list={systemUserList}
            buttonText='Add system user'
            setModalMessage={setModalMessage}
            users
            systemUsers
            refresh
            totalCount={systemUsersTotalCount}
            filter={filter}
            onRefresh={onRefreshFun}
            permission={permission}
            startDate={startDate}
            endDate={endDate}
            dateRange={dateRange}
            setDateRange={setDateRange}
            handleOtherFilter={handleOtherFilter}
            enExport={onExport}
          />
          <SystemUser
            {...props}
            ref={content}
            List={systemUserList}
            search={search}
            getList={getList}
            flag={initialFlag}
            systemUsersTotalCount={systemUsersTotalCount}
            viewLink="/users/system-user/system-user-details"
            resMessage={resMessage}
            resStatus={resStatus}
            startDate={startDate}
            endDate={endDate}
            filter={filter}
            getSystemUsersTotalCountFunc={getSystemUsersTotalCountFunc}
          />
        </section>
      </main>
      <Modal isOpen={modalMessage} toggle={toggleMessage} className="modal-confirm-bot">
        <ModalBody className="text-center">
          <Form>
            <FormGroup>
              <Row>
                <Col md='5' className='align-self-center'>
                  <Label for="systemUser">System User</Label>
                </Col>
                <Col md='7'>
                  <Input type="number" name="systemUser" id="systemUser" placeholder="Add Teams" value={systemUser} onChange={event => handleAddSystemUser(event, 'systemUser')} />
                  <p className='error-text'>{systemUserErr}</p>
                </Col>
              </Row>
            </FormGroup>
              <Row className='buttons'>
                <Col md='6'>
                  <Button type="submit" className="theme-btn outline-btn full-btn" onClick={(e) => cancel(e)}>Cancel</Button>
                </Col>
                <Col md='6'>
                  <Button type="submit" className="theme-btn success-btn full-btn" disabled={!systemUser} onClick={(e) => addSystemUsersFunc(e)}>Add</Button>
                </Col>
              </Row>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

SystemUsers.propTypes = {
  location: PropTypes.object
}

export default SystemUsers
