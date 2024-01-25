import React, {
  Fragment,
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle
} from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import moment from 'moment'
import { useQueryState } from 'react-router-use-location-state'
import qs from 'query-string'
import { CustomInput, UncontrolledAlert, Modal, ModalBody, Row, Col, Button } from 'reactstrap'
import {
  ExcelExport,
  ExcelExportColumn
} from '@progress/kendo-react-excel-export'
import viewIcon from '../../../assets/images/view-icon.svg'
import SkeletonTable from '../../../components/SkeletonTable'
import PropTypes from 'prop-types'
import { updateSetting } from '../../../actions/setting'
import warningIcon from '../../../assets/images/warning-icon.svg'
import PaginationComponent from '../../../components/PaginationComponent'
import { alertClass, modalMessageFunc } from '../../../helpers/helper'

const SettingManagementContent = forwardRef((props, ref) => {
  const { getList, settingList } = props
  const exporter = useRef(null)
  const dispatch = useDispatch()
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [search, setSearch] = useQueryState('search', '')
  const [sort] = useQueryState('sortBy', 'sTitle')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [listLength, setListLength] = useState('10 entries')
  const [type, setType] = useState('')
  const [selectedData, setSelectedData] = useState({})
  const [close, setClose] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)

  const adminPermission = useSelector(state => state.auth.adminPermission)
  const token = useSelector(state => state.auth.token)
  const resStatus = useSelector((state) => state.setting.resStatus)
  const resMessage = useSelector((state) => state.setting.resMessage)
  const searchProp = props.search
  const previousProps = useRef({
    resMessage,
    resStatus,
    settingList,
    searchProp,
    start,
    offset
  }).current
  const paginationFlag = useRef(false)

  useEffect(() => {
    if (props.location.state) {
      if (props.location.state.message) {
        setMessage(props.location.state.message)
        setStatus(true)
        setModalMessage(true)
      }
      props.history.replace()
    }
    let page = 1
    let limit = offset
    const obj = qs.parse(props.location.search)
    if (obj) {
      if (obj.page) {
        page = obj.page
        setPageNo(page)
      }
      if (obj.pageSize) {
        limit = obj.pageSize
        setOffset(limit)
        setListLength(`${limit} entries`)
      }
    }
    const startFrom = (page - 1) * offset
    setStart(startFrom)
    getList(startFrom, limit, sort, 'asc', search)
    setLoading(true)
  }, [])

  useEffect(() => {
    if (previousProps.settingList !== settingList) {
      if (settingList) {
        if (settingList.results) {
          const userArrLength = settingList.results.length
          const startFrom = (activePageNo - 1) * offset + 1
          const end = startFrom - 1 + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(settingList.results ? settingList.results : [])
        setIndex(activePageNo)
        setTotal(settingList.total ? settingList.total : 0)
      }
      setLoading(false)
    }
    return () => {
      previousProps.settingList = settingList
    }
  }, [settingList])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = (activePageNo - 1) * offset
          const limit = offset
          getList(startFrom, limit, sort, 'asc', search)
          setMessage(resMessage)
          setStatus(resStatus)
          setModalWarning(false)
          setModalMessage(true)
          setPageNo(activePageNo)
        } else {
          setMessage(resMessage)
          setStatus(resStatus)
          setModalWarning(false)
          setModalMessage(true)
          setLoading(false)
        }
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    let data = localStorage.getItem('queryParams')
      ? JSON.parse(localStorage.getItem('queryParams'))
      : {}
    data === {}
      ? (data = {
          SettingManagement: props.location.search
        })
      : (data.SettingManagement = props.location.search)
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [props.location.search])

  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, 'asc', props.search)
      setSearch(searchProp.trim())
      setStart(startFrom)
      setPageNo(1)
      setLoading(true)
    }
    if (previousProps.searchProp !== searchProp && props.flag) {
      const debouncer = setTimeout(() => {
        callSearchService()
      }, 1000)
      return () => {
        clearTimeout(debouncer)
        previousProps.searchProp = searchProp
      }
    }
    return () => {
      previousProps.searchProp = searchProp
    }
  }, [searchProp])

  useEffect(() => {
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) {
      getList(start, offset, sort, 'asc', search)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  function warningWithConfirmMessage (data, eType) {
    setType(eType)
    setSelectedData(data)
    setModalWarning(true)
  }

  function onCancel () {
    toggleWarning()
  }

  function onStatusUpdate () {
    const statuss = selectedData.eStatus === 'Y' ? 'N' : 'Y'
    const updatedSettingData = {
      Title: selectedData.sTitle,
      Key: selectedData.sKey,
      Max: selectedData.nMax,
      Min: selectedData.nMin,
      settingStatus: statuss,
      token,
      settingId: selectedData._id
    }
    dispatch(updateSetting(updatedSettingData))
    setLoading(true)
    toggleWarning()
  }

  const processExcelExportData = (data) =>
    data.map((PromoCodeList) => {
      let dCreatedAt = moment(PromoCodeList.dCreatedAt).local().format('lll')
      let eStatus = PromoCodeList.eStatus
      dCreatedAt = dCreatedAt === 'Invalid date' ? ' - ' : dCreatedAt
      eStatus = eStatus === 'Y' ? 'Active' : 'InActive'
      const nMin = PromoCodeList.nMin ? PromoCodeList.nMin : '--'
      const nMax = PromoCodeList.nMax ? PromoCodeList.nMax : '--'

      return {
        ...PromoCodeList,
        dCreatedAt,
        nMin,
        nMax,
        eStatus
      }
    })

  function onExport () {
    const { length } = list
    if (length !== 0) {
      exporter.current.props = {
        ...exporter.current.props,
        data: processExcelExportData(list),
        fileName: 'Setting.xlsx'
      }
      exporter.current.save()
    }
  }

  useImperativeHandle(ref, () => ({
    onExport
  }))

  return (
    <Fragment>
      <ExcelExport data={list} fileName='Setting.xlsx' ref={exporter}>
        <ExcelExportColumn field='sTitle' title='Title' />
        <ExcelExportColumn field='sKey' title='Key' />
        <ExcelExportColumn field='nMin' title='Minimum' />
        <ExcelExportColumn field='nMax' title='Maximum' />
        <ExcelExportColumn field='dCreatedAt' title='Time' />
        <ExcelExportColumn field='eStatus' title='Status' />
      </ExcelExport>
      <div className='table-responsive'>
        {modalMessage && message && (
          <UncontrolledAlert color='primary' className={alertClass(status, close)}>{message}</UncontrolledAlert>
        )}
        <table className='common-rule-table'>
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Title</th>
              <th>Description</th>
              <th>Min</th>
              <th>Max</th>
              <th>Value</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? (
              <SkeletonTable numberOfColumns={8} />
                )
              : (
              <Fragment>
                {list &&
                  list.length !== 0 &&
                  list.map((data, i) => (
                    <tr key={data._id}>
                      <td>{(index - 1) * offset + (i + 1)}</td>
                      <td>{data.sTitle}</td>
                      <td>{data.sDescription ? data.sDescription : '-'}</td>
                      <td>{((data.sKey === 'PCF') || (data.sKey === 'PCS') || (data.sKey === 'PUBC') || (data.sKey === 'Deposit') || (data.sKey === 'Withdraw')) ? (data?.nMin || '--') : '--'}</td>
                      <td>{((data.sKey === 'PCF') || (data.sKey === 'PCS') || (data.sKey === 'PUBC') || (data.sKey === 'Deposit') || (data.sKey === 'Withdraw')) ? (data?.nMax || '--') : '--'}</td>
                      <td>{((data.sKey === 'BonusExpireDays') || (data.sKey === 'UserDepositRateLimit') || (data.sKey === 'UserDepositRateLimitTimeFrame') || (data.sKey === 'TDS') || (data.sKey === 'UserWithdrawRateLimit') || (data.sKey === 'UserWithdrawRateLimitTimeFrame')) ? (data.nMax || '--') : '--'}</td>
                      <td><CustomInput
                          type='switch'
                          id={`${data._id}`}
                          name={`${data._id}`}
                          onClick={() =>
                            warningWithConfirmMessage(
                              data,
                              data.eStatus === 'Y' ? 'Inactivate' : 'activate'
                            )
                          }
                          checked={data.eStatus === 'Y'}
                          disabled={(adminPermission?.SETTING === 'R') || (data.sKey === 'PCF') || (data.sKey === 'PCS') || (data.sKey === 'PUBC')}
                        />
                      </td>
                      <td>
                        <ul className='action-list mb-0 d-flex'>
                          <li>
                            <NavLink
                              color='link'
                              className='view'
                              to={`/settings/setting-details/${data._id}`}
                            >
                              <img src={viewIcon} alt='View' />
                              <span>View</span>
                            </NavLink>
                          </li>
                        </ul>
                      </td>
                    </tr>
                  ))}
              </Fragment>
                )}
          </tbody>
        </table>
      </div>
      {!loading && list.length === 0 && (
        <div className='text-center'>
          <h3>No Settings available</h3>
        </div>
      )}
      <PaginationComponent
        activePageNo={activePageNo}
        startingNo={startingNo}
        endingNo={endingNo}
        total={total}
        listLength={listLength}
        setOffset={setOffset}
        setStart={setStart}
        setLoading={setLoading}
        setListLength={setListLength}
        setPageNo={setPageNo}
        offset={offset}
        paginationFlag={paginationFlag}
      />

      <Modal isOpen={modalWarning} toggle={toggleWarning} className="modal-confirm">
        <ModalBody className='text-center'>
          <img className='info-icon' src={warningIcon} alt='check' />
          <h2>{`Are you sure you want to ${type} it?`}</h2>
          <Row className='row-12'>
            <Col>
              <Button
                type='submit'
                className='theme-btn outline-btn full-btn'
                onClick={onCancel}
              >
                Cancel
              </Button>
            </Col>
            <Col>
              <Button
                type='submit'
                className='theme-btn danger-btn full-btn'
                onClick={onStatusUpdate}
              >
                {`Yes, ${type} it`}
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
})

SettingManagementContent.propTypes = {
  search: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
  flag: PropTypes.bool,
  getList: PropTypes.func,
  settingList: PropTypes.object
}

SettingManagementContent.displayName = SettingManagementContent

export default connect(null, null, null, { forwardRef: true })(
  SettingManagementContent
)
