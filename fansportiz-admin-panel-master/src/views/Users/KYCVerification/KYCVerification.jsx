import React, { Fragment, useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import {
  Button, UncontrolledAlert, CustomInput
} from 'reactstrap'
import { useQueryState } from 'react-router-use-location-state'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import moment from 'moment'
import viewIcon from '../../../assets/images/view-icon.svg'
import SkeletonTable from '../../../components/SkeletonTable'
import PropTypes from 'prop-types'
import qs from 'query-string'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import PaginationComponent from '../../../components/PaginationComponent'
import { alertClass, modalMessageFunc } from '../../../helpers/helper'
import Loading from '../../../components/Loading'

const KYCVerification = forwardRef((props, ref) => {
  const {
    getList, viewUser, flag, kycList, startDate, endDate, recommendedList, pendingKycCount, getPendingKycCountFunc, dateFlag
  } = props
  const exporter = useRef(null)
  const [start, setStart] = useState(0)
  const [list, setList] = useState([])
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [PanStatus, setPanStatus] = useQueryState('panstatus', '')
  const [AadhaarStatus, setAadhaarStatus] = useQueryState('aadhaarstatus', '')
  const [index, setIndex] = useState(1)
  const [close, setClose] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loader, setLoader] = useState(false)
  const [listLength, setListLength] = useState('10 entries')
  const [isFullResponse] = useState(false)
  const [fullList, setFullList] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [dateFrom, setDateFrom] = useQueryState('datefrom', '')
  // eslint-disable-next-line no-unused-vars
  const [dateTo, setDateTo] = useQueryState('dateto', '')
  const searchProp = props.search
  const resStatus = useSelector(state => state.kyc.resStatus)
  const resMessage = useSelector(state => state.kyc.resMessage)
  const isFullList = useSelector(state => state.kyc.isFullResponse)
  const isSendId = useSelector(state => state.users.isSendId)
  const obj = qs.parse(props.location.search)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({
    pendingKycCount, searchProp, resMessage, resStatus, kycList, start, offset, startDate, endDate, PanStatus, AadhaarStatus
  }).current
  const paginationFlag = useRef(false)

  const [modalMessage, setModalMessage] = useState(false)

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
      if (!obj.search) {
        const startFrom = (page - 1) * offset
        setStart(startFrom)
        getList(startFrom, limit, searchProp, obj.datefrom ? new Date(obj.datefrom) : startDate, obj.dateto ? new Date(obj.dateto) : endDate, PanStatus, AadhaarStatus, isFullResponse)
        getPendingKycCountFunc(PanStatus, AadhaarStatus)
      }
    }
    setLoading(true)
  }, [])

  useEffect(() => {
    if (isSendId && recommendedList && recommendedList.length > 0 && searchProp) {
      getList(start, offset, searchProp, startDate, endDate, PanStatus, AadhaarStatus, isFullResponse)
      getPendingKycCountFunc(PanStatus, AadhaarStatus)
      setLoading(true)
    }
  }, [isSendId, searchProp])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.kycList !== kycList) {
      if (kycList && !isFullList) {
        if (kycList.data) {
          const userArrLength = kycList.data.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(kycList.data ? kycList.data : [])
        setIndex(activePageNo)
        setTotal(kycList.total ? kycList.total : 0)
      } else if (kycList?.total === kycList?.data?.length && isFullList) {
        setFullList(kycList.data ? kycList.data : [])
        setLoading(false)
        exporter.current.props = {
          ...exporter.current.props,
          data: processExcelExportData(kycList.data ? kycList.data : []),
          fileName: 'KycVerifications.xlsx'
        }
        exporter.current.save()
        setLoader(false)
      }
      setLoading(false)
    }
    return () => {
      previousProps.kycList = kycList
    }
  }, [kycList])

  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, props.search, startDate, endDate, PanStatus, AadhaarStatus, isFullResponse)
      getPendingKycCountFunc(PanStatus, AadhaarStatus)
      setStart(startFrom)
      setPageNo(1)
      setLoading(true)
    }
    if (previousProps.searchProp !== searchProp && flag) {
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
    if (previousProps.startDate !== startDate || previousProps.endDate !== endDate) {
      if (props.startDate && props.endDate && dateFlag.current) {
        const startFrom = (obj && obj.datefrom && obj.dateto && obj.page) ? (obj.page - 1) * offset : 0
        const limit = offset
        getList(startFrom, limit, searchProp, props.startDate, props.endDate, PanStatus, AadhaarStatus, isFullResponse)
        getPendingKycCountFunc(PanStatus, AadhaarStatus)
        setDateFrom(moment(props.startDate).format('MM-DD-YYYY'))
        setDateTo(moment(props.endDate).format('MM-DD-YYYY'))
        if ((obj && obj.datefrom && obj.dateto && obj.page)) {
          setPageNo(obj.page)
        } else {
          setPageNo(1)
        }
        setLoading(true)
      } else if ((!props.startDate) && (!props.endDate)) {
        const startFrom = 0
        const limit = offset
        getList(startFrom, limit, searchProp, props.startDate, props.endDate, PanStatus, AadhaarStatus, isFullResponse)
        getPendingKycCountFunc(PanStatus, AadhaarStatus)
        setDateFrom('')
        setDateTo('')
        setPageNo(1)
        setLoading(true)
      }
    }
    return () => {
      previousProps.startDate = startDate
      previousProps.endDate = endDate
    }
  }, [startDate, endDate])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = 0
          const limit = offset
          getList(startFrom, limit, searchProp, startDate, endDate, PanStatus, AadhaarStatus, isFullResponse)
          getPendingKycCountFunc(PanStatus, AadhaarStatus)
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          setPageNo(1)
        } else {
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          setLoading(false)
          setLoader(false)
        }
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if (previousProps.PanStatus !== PanStatus || previousProps.AadhaarStatus !== AadhaarStatus) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, searchProp, startDate, endDate, PanStatus, AadhaarStatus, isFullResponse)
      getPendingKycCountFunc(PanStatus, AadhaarStatus)
      setPageNo(1)
    }
    return () => {
      previousProps.PanStatus = PanStatus
      previousProps.AadhaarStatus = AadhaarStatus
    }
  }, [PanStatus, AadhaarStatus])

  function onFiltering (event, FilterType) {
    FilterType === 'PAN' ? setPanStatus(event.target.value) : setAadhaarStatus(event.target.value)
  }

  useEffect(() => {
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) {
      getList(start, offset, searchProp, startDate, endDate, PanStatus, AadhaarStatus, isFullResponse)
      getPendingKycCountFunc(PanStatus, AadhaarStatus)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  const processExcelExportData = (data) =>
    data.map((kycVerificationList) => {
      const sUsername = kycVerificationList.iUserId.sUsername ? kycVerificationList.iUserId.sUsername : '--'
      let panCreatedAt = kycVerificationList.oPan && kycVerificationList.oPan.dCreatedAt ? kycVerificationList.oPan.dCreatedAt : ''
      let panStatus = kycVerificationList.oPan && kycVerificationList.oPan.eStatus
      let aadhaarCreatedAt = kycVerificationList.oAadhaar && kycVerificationList.oAadhaar.dCreatedAt ? kycVerificationList.oAadhaar.dCreatedAt : ''
      let aadhaarStatus = kycVerificationList.oAadhaar && kycVerificationList.oAadhaar.eStatus
      panCreatedAt = panCreatedAt ? moment(panCreatedAt).local().format('lll') : '-'
      panStatus = panStatus === 'P' ? 'Pending' : panStatus === 'A' ? 'Accepted' : panStatus === 'R' ? 'Rejected' : panStatus === 'N' ? 'Not uploaded' : '--'
      aadhaarCreatedAt = aadhaarCreatedAt ? moment(aadhaarCreatedAt).local().format('lll') : '-'
      aadhaarStatus = aadhaarStatus === 'P' ? 'Pending' : aadhaarStatus === 'A' ? 'Accepted' : aadhaarStatus === 'R' ? 'Rejected' : aadhaarStatus === 'N' ? 'Not uploaded' : '--'

      return {
        ...kycVerificationList,
        sUsername,
        oPan: {
          ...kycVerificationList.oPan,
          dCreatedAt: panCreatedAt,
          eStatus: panStatus
        },
        oAadhaar: {
          ...kycVerificationList.oAadhaar,
          dCreatedAt: aadhaarCreatedAt,
          eStatus: aadhaarStatus
        }
      }
    })

  async function onExport () {
    if (startDate && endDate) {
      await getList(start, offset, searchProp, startDate, endDate, PanStatus, AadhaarStatus, true)
      setLoader(true)
    } else {
      setMessage('Please Select Date Range')
      setModalMessage(true)
      setStatus(false)
    }
  }

  useImperativeHandle(ref, () => ({
    onExport,
    onRefresh
  }))

  function onRefresh () {
    const startFrom = 0
    getList(startFrom, offset, searchProp, startDate, endDate, PanStatus, AadhaarStatus, isFullResponse)
    getPendingKycCountFunc(PanStatus, AadhaarStatus)
    setLoading(true)
    setPageNo(1)
  }

  return (
    <Fragment>
      {
        modalMessage && message &&
        (
          <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
        )
      }
      <ExcelExport data={fullList && fullList.length > 0 ? fullList : list} fileName='KycVerifications.xlsx' ref={exporter}>
        <ExcelExportColumn field='iUserId.sUsername' title='Username' />
        <ExcelExportColumn field='oPan.dCreatedAt' title='Pan Submitted Date' />
        <ExcelExportColumn field='oPan.eStatus' title='Pan Verification Status' />
        <ExcelExportColumn field='oAadhaar.dCreatedAt' title='Aadhaar Submitted Date' />
        <ExcelExportColumn field='oAadhaar.eStatus' title='Aadhaar Verification Status' />
      </ExcelExport>
      {loader && <Loading />}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Username</th>
              <th>Pan Submitted Date</th>
              <th>
                <div>PAN Card Status<b className='total-text'>(Pending: {pendingKycCount?.nPendingPan || 0})</b></div>
                <CustomInput
                  type="select"
                  name="panStatus"
                  id="panStatus"
                  value={PanStatus}
                  className={`mt-2 ${window.innerWidth <= 768 ? 'custom-selection' : 'w-75'}`}
                  onChange={(event) => onFiltering(event, 'PAN')}
                >
                  <option value="">All</option>
                  <option value="p">Pending</option>
                  <option value="a">Accepted</option>
                  <option value='r'>Rejected</option>
                  <option value="n">Not Uploaded</option>
                </CustomInput>
              </th>
              <th>Aadhaar Submitted Date</th>
              <th>
                <div>Aadhaar Card Status<b className='total-text'>(Pending: {pendingKycCount?.nPendingAadhar || 0})</b></div>
                <CustomInput
                  type="select"
                  name="aadhaarStatus"
                  id="aadhaarStatus"
                  value={AadhaarStatus}
                  className={`mt-2 ${window.innerWidth <= 768 ? 'custom-selection' : 'w-75'}`}
                  onChange={(event) => onFiltering(event, 'AADHAAR')}
                >
                  <option value="">All</option>
                  <option value="p">Pending</option>
                  <option value="a">Accepted</option>
                  <option value='r'>Rejected</option>
                  <option value="n">Not Uploaded</option>
                </CustomInput>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={7} />
              : (
                <Fragment>
                  {
                  list && list.length !== 0 &&
                    list.map((data, i) => (
                      <tr key={data._id}>
                        <td>{(((index - 1) * offset) + (i + 1))}</td>
                        <td>{data.iUserId && data.iUserId.sUsername ? data.iUserId.sUsername : '--'}</td>
                        <td>{data.oPan && data.oPan.dCreatedAt ? moment(data.oPan.dCreatedAt).format('DD/MM/YYYY hh:mm A') : '--'}</td>
                        <td>{data.oPan.eStatus === 'P' ? 'Pending' : data.oPan.eStatus === 'A' ? 'Accepted' : data.oPan.eStatus === 'R' ? 'Rejected' : 'Not Uploaded'}</td>
                        <td>{data.oAadhaar && data.oAadhaar.dCreatedAt ? moment(data.oAadhaar.dCreatedAt).format('DD/MM/YYYY hh:mm A') : '--'}</td>
                        <td>{data.oAadhaar.eStatus === 'P' ? 'Pending' : data.oAadhaar.eStatus === 'A' ? 'Accepted' : data.oAadhaar.eStatus === 'R' ? 'Rejected' : 'Not Uploaded'}</td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <Button color="link" className="view" tag={Link} to={`${viewUser}/${data.iUserId && data.iUserId._id ? data.iUserId._id : ''}`} disabled={(!data.iUserId) || (adminPermission?.USERS === 'N')}>
                                <img src={viewIcon} alt="View" />
                                View
                              </Button>
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
      {
       !loading && list.length === 0 &&
        (
          <div className="text-center">
            <h3>No Kyc available</h3>
          </div>
        )
      }

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

    </Fragment>
  )
})

KYCVerification.propTypes = {
  getList: PropTypes.func,
  viewUser: PropTypes.string,
  flag: PropTypes.bool,
  search: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
  kycList: PropTypes.arrayOf(PropTypes.object),
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  openDatePicker: PropTypes.bool,
  recommendedList: PropTypes.arrayOf(PropTypes.object),
  pendingKycCount: PropTypes.object,
  getPendingKycCountFunc: PropTypes.func,
  dateFlag: PropTypes.bool
}

KYCVerification.displayName = KYCVerification

export default KYCVerification
