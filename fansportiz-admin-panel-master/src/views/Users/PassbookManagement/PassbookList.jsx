import React, {
  Fragment, useState, useRef, useEffect, useImperativeHandle, forwardRef
} from 'react'
import { useSelector } from 'react-redux'
import {
  Button, UncontrolledAlert, CustomInput
} from 'reactstrap'
import qs from 'query-string'
import moment from 'moment'
import PropTypes from 'prop-types'
import { useQueryState } from 'react-router-use-location-state'
import SkeletonTable from '../../../components/SkeletonTable'
import sortIcon from '../../../assets/images/sorting-icon.svg'
import { Link } from 'react-router-dom'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import PaginationComponent from '../../../components/PaginationComponent'
import { alertClass, modalMessageFunc } from '../../../helpers/helper'
import Loading from '../../../components/Loading'

const PassbookList = forwardRef((props, ref) => {
  const exporter = useRef(null)
  const {
    getList,
    List,
    startDate,
    endDate,
    flag,
    getTransactionsTotalCountFunc,
    searchType,
    isLeaguePassbook,
    leaguePassbookList,
    leagueTransactionsTotalCountFunc
  } = props
  const searchProp = props.search
  const [isFullResponse] = useState(false)
  const [fullList, setFullList] = useState([])
  const [start, setStart] = useState(0)
  const [loading, setLoading] = useState(false)
  const [loader, setLoader] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [particulars, setParticulars] = useQueryState('particulars', '')
  const [eType, setEType] = useQueryState('etype', '')
  const [searchTypeBy, setSearchTypeBy] = useQueryState('searchType', '')
  const [transactionStatus, setTransactionStatus] = useQueryState('transactionStatus', '')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState([])
  const [nameOrder, setNameOrder] = useState('asc')
  const [createdOrder, setCreatedOrder] = useState('asc')
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [order, setOrder] = useQueryState('order', 'desc')
  const [offset, setOffset] = useQueryState('pageSize', 10)
  // eslint-disable-next-line no-unused-vars
  const [dateFrom, setDateFrom] = useQueryState('datefrom', '')
  // eslint-disable-next-line no-unused-vars
  const [dateTo, setDateTo] = useQueryState('dateto', '')
  const [sort, setSort] = useQueryState('sortBy', 'id')
  const [search, setSearch] = useQueryState('searchValue', '')
  const [listLength, setListLength] = useState('10 entries')
  const [close, setClose] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)

  const adminPermission = useSelector(state => state.auth.adminPermission)
  const transactionsTotalCount = useSelector(state => state.passbook.transactionsTotalCount)
  const isFullList = useSelector(state => state.passbook.isFullResponse)
  const resStatus = useSelector(state => state.passbook.resStatus)
  const resMessage = useSelector(state => state.passbook.resMessage)
  const obj = qs.parse(props.location.search)
  const previousProps = useRef({
    resStatus, resMessage, List, startDate, endDate, particulars, eType, start, offset, transactionsTotalCount, transactionStatus, searchType, searchProp
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
    if (props?.location?.state?.passbookId) {
      setSearch(props.location.state.passbookId)
    }
    if (props.location.state && props.location.state.userId) {
      setSearch(props.location.state.userId)
      if (isLeaguePassbook) {
        leaguePassbookList(startFrom, limit, sort, order, props.location.state.userId, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
        leagueTransactionsTotalCountFunc(props.location.state.userId, startDate, endDate, particulars, eType, transactionStatus)
      } else {
        getList(startFrom, limit, sort, order, props.location.state.userId, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
        getTransactionsTotalCountFunc(props.location.state.userId, startDate, endDate, particulars, eType, transactionStatus)
      }
    } else if (!(obj.datefrom && obj.dateto)) {
      if (isLeaguePassbook) {
        leaguePassbookList(startFrom, limit, sort, order, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
        leagueTransactionsTotalCountFunc(search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus)
      } else {
        getList(startFrom, limit, sort, order, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
        getTransactionsTotalCountFunc(search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus)
      }
    }
    setLoading(true)
  }, [])

  useEffect(() => {
    if (props.isUserToPassbook) {
      setSearch(props.userToPassbookId)
    }
  }, [props.userToPassbookId])

  // useEffect(() => {
  //   if (props.location.state) {
  //     console.log('[]')
  //   }
  // }, [])

  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      if (isLeaguePassbook) {
        leaguePassbookList(startFrom, limit, sort, order, props.search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
        leagueTransactionsTotalCountFunc(props.search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus)
      } else {
        getList(startFrom, limit, sort, order, props.search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
        getTransactionsTotalCountFunc(props.search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus)
      }
      setSearch(searchProp.trim())
      setStart(startFrom)
      setPageNo(1)
      setLoading(true)
    }
    if (previousProps.searchProp !== searchProp && flag) {
      if (!props?.isTdsToPassbook) {
        const debouncer = setTimeout(() => {
          callSearchService()
        }, 1000)
        return () => {
          clearTimeout(debouncer)
          previousProps.searchProp = searchProp
        }
      }
    }
    return () => {
      previousProps.searchProp = searchProp
    }
  }, [searchProp])

  useEffect(() => {
    if (previousProps.searchType !== searchType) {
      if (searchType === 'NAME' || searchType === 'USERNAME' || searchType === 'MOBILE' || searchType === 'PASSBOOK' || searchType === '') {
        if (!props?.isTdsToPassbook) {
          const startFrom = 0
          const limit = offset
          if (isLeaguePassbook) {
            leaguePassbookList(startFrom, limit, sort, order, search, props.searchType, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
            leagueTransactionsTotalCountFunc(search, props.searchType, startDate, endDate, particulars, eType, transactionStatus)
          } else {
            getList(startFrom, limit, sort, order, search, props.searchType, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
            getTransactionsTotalCountFunc(search, props.searchType, startDate, endDate, particulars, eType, transactionStatus)
          }
          setPageNo(1)
          setStart(startFrom)
          setLoading(true)
        }
        setSearchTypeBy(props.searchType)
      }
    }
    return () => {
      previousProps.searchType = searchType
    }
  }, [searchType])

  useEffect(() => {
    if (previousProps.startDate !== startDate || previousProps.endDate !== endDate) {
      if (props.startDate && props.endDate) {
        const startFrom = (obj && obj.datefrom && obj.dateto && obj.page) ? (obj.page - 1) * offset : 0
        const limit = offset
        if (isLeaguePassbook) {
          leaguePassbookList(startFrom, limit, sort, order, search, searchTypeBy, props.startDate, props.endDate, particulars, eType, transactionStatus, isFullResponse)
          leagueTransactionsTotalCountFunc(search, searchTypeBy, props.startDate, props.endDate, particulars, eType, transactionStatus)
        } else {
          getList(startFrom, limit, sort, order, search, searchTypeBy, props.startDate, props.endDate, particulars, eType, transactionStatus, isFullResponse)
          getTransactionsTotalCountFunc(search, searchTypeBy, props.startDate, props.endDate, particulars, eType, transactionStatus)
        }
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
        if (isLeaguePassbook) {
          leaguePassbookList(startFrom, limit, sort, order, search, searchTypeBy, props.startDate, props.endDate, particulars, eType, transactionStatus, isFullResponse)
          leagueTransactionsTotalCountFunc(search, searchTypeBy, props.startDate, props.endDate, particulars, eType, transactionStatus)
        } else {
          getList(startFrom, limit, sort, order, search, searchTypeBy, props.startDate, props.endDate, particulars, eType, transactionStatus, isFullResponse)
          getTransactionsTotalCountFunc(search, searchTypeBy, props.startDate, props.endDate, particulars, eType, transactionStatus)
        }
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
    if (previousProps.eType !== eType) {
      const startFrom = 0
      const limit = offset
      if (isLeaguePassbook) {
        leaguePassbookList(startFrom, limit, sort, order, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
        leagueTransactionsTotalCountFunc(search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus)
      } else {
        getList(startFrom, limit, sort, order, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
        getTransactionsTotalCountFunc(search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus)
      }
      setPageNo(1)
    }
    return () => {
      previousProps.eType = eType
    }
  }, [eType])

  useEffect(() => {
    if (previousProps.transactionStatus !== transactionStatus) {
      const startFrom = 0
      const limit = offset
      if (isLeaguePassbook) {
        leaguePassbookList(startFrom, limit, sort, order, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
        leagueTransactionsTotalCountFunc(search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus)
      } else {
        getList(startFrom, limit, sort, order, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
        getTransactionsTotalCountFunc(search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus)
      }
      setPageNo(1)
    }
    return () => {
      previousProps.transactionStatus = transactionStatus
    }
  }, [transactionStatus])

  useEffect(() => {
    if (previousProps.particulars !== particulars) {
      const startFrom = 0
      const limit = offset
      if (isLeaguePassbook) {
        leaguePassbookList(startFrom, limit, sort, order, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
        leagueTransactionsTotalCountFunc(search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus)
      } else {
        getList(startFrom, limit, sort, order, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
        getTransactionsTotalCountFunc(search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus)
      }
      setPageNo(1)
    }
    return () => {
      previousProps.particulars = particulars
    }
  }, [particulars])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.List !== List) {
      if (List && !isFullList) {
        const userArrLength = List.rows ? List.rows.length : List.length
        const startFrom = ((activePageNo - 1) * offset) + 1
        const end = (startFrom - 1) + userArrLength
        setStartingNo(startFrom)
        setEndingNo(end)
        setList(List?.rows ? List?.rows : List)
      } else if (transactionsTotalCount?.count === List?.rows?.length && isFullList) {
        setFullList(List.rows ? List.rows : [])
        setLoading(false)
        exporter.current.props = {
          ...exporter.current.props,
          data: processExcelExportData(List.rows ? List.rows : []),
          fileName: 'Transactions.xlsx'
        }
        exporter.current.save()
        setLoader(false)
      }
      setLoading(false)
    }
    if (previousProps.transactionsTotalCount !== transactionsTotalCount && transactionsTotalCount) {
      setTotal(transactionsTotalCount?.count ? transactionsTotalCount?.count : 0)
    }
    return () => {
      previousProps.List = List
      previousProps.transactionsTotalCount = transactionsTotalCount
    }
  }, [List, transactionsTotalCount])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = 0
          const limit = offset
          if (isLeaguePassbook) {
            leaguePassbookList(startFrom, limit, sort, order, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
            leagueTransactionsTotalCountFunc(search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus)
          } else {
            getList(startFrom, limit, sort, order, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
            getTransactionsTotalCountFunc(search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus)
          }
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          setPageNo(1)
        } else {
          setMessage(resMessage)
          setStatus(resStatus)
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
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current && start) {
      if (isLeaguePassbook) {
        leaguePassbookList(start, offset, sort, order, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      } else {
        getList(start, offset, sort, order, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      }
      setLoading(true)
    } else if (previousProps.offset !== offset) {
      if (isLeaguePassbook) {
        leaguePassbookList(start, offset, sort, order, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
        leagueTransactionsTotalCountFunc(search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus)
      } else {
        getList(start, offset, sort, order, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
        getTransactionsTotalCountFunc(search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus)
      }
      setLoading(true)
    } else if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) {
      if (isLeaguePassbook) {
        leaguePassbookList(0, offset, sort, order, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      } else {
        getList(0, offset, sort, order, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      }
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  function onSorting (sortingBy) {
    const Order = sortingBy === 'dActivityDate' ? nameOrder : createdOrder
    if (Order === 'asc') {
      const startFrom = 0
      const limit = offset
      if (isLeaguePassbook) {
        leaguePassbookList(startFrom, limit, sortingBy, 'desc', search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      } else {
        getList(startFrom, limit, sortingBy, 'desc', search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      }
      setOrder('desc')
      setPageNo(1)
      setLoading(true)
      if (sortingBy === 'dActivityDate') {
        setNameOrder('desc')
        setSort(sortingBy)
      } else {
        setCreatedOrder('desc')
        setSort(sortingBy)
      }
    } else {
      const startFrom = 0
      const limit = offset
      if (isLeaguePassbook) {
        leaguePassbookList(startFrom, limit, sortingBy, 'asc', search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      } else {
        getList(startFrom, limit, sortingBy, 'asc', search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      }
      setOrder('asc')
      setPageNo(1)
      setLoading(true)
      if (sortingBy === 'dActivityDate') {
        setNameOrder('asc')
        setSort(sortingBy)
      } else {
        setCreatedOrder('asc')
        setSort(sortingBy)
      }
    }
  }

  function onFiltering (event, type) {
    if (type === 'Particulars') {
      setParticulars(event.target.value)
    } else if (type === 'eType') {
      setEType(event.target.value)
    } else if (type === 'TransactionStatus') {
      setTransactionStatus(event.target.value)
    }
    setLoading(true)
  }

  const processExcelExportData = data => data.map((passbookList) => {
    const sUsername = passbookList.sUsername ? passbookList.sUsername : '--'
    const sName = passbookList.sName ? passbookList.sName : '--'
    const sEmail = passbookList.sEmail ? passbookList.sEmail : '--'
    const sMobNum = passbookList.sMobNum ? passbookList.sMobNum : '--'
    const sPromocode = passbookList.Promocode || '--'
    const matchName = passbookList.sMatchName || '--'
    const matchDateTime = passbookList.dMatchStartDate ? moment(passbookList.dMatchStartDate).format('DD/MM/YYYY hh:mm A') : '--'
    const sRemarks = passbookList.sRemarks ? passbookList.sRemarks : '--'
    let dActivityDate = moment(passbookList.dActivityDate).local().format('lll')
    const type = passbookList.eType === 'Cr' ? 'Credited' : passbookList.eType === 'Dr' ? 'Debited' : '--'
    dActivityDate = dActivityDate === 'Invalid date' ? ' - ' : dActivityDate
    const iTransactionId = passbookList.iTransactionId || '--'
    const eTransactionType = passbookList.eTransactionType || '--'
    const nLoyaltyPoint = passbookList.nLoyaltyPoint || '--'
    return {
      ...passbookList,
      sUsername,
      sName,
      sEmail,
      sMobNum,
      dActivityDate,
      sPromocode,
      iTransactionId,
      eTransactionType,
      matchName,
      matchDateTime,
      type,
      sRemarks,
      nLoyaltyPoint
    }
  })

  async function onExport () {
    if (startDate && endDate) {
      if (isLeaguePassbook) {
        await leaguePassbookList(start, offset, sort, order, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, true)
        await leagueTransactionsTotalCountFunc(search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus)
      } else {
        await getList(start, offset, sort, order, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, true)
        await getTransactionsTotalCountFunc(search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus)
      }
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
    if (isLeaguePassbook) {
      leaguePassbookList(startFrom, offset, sort, order, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      leagueTransactionsTotalCountFunc(search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus)
    } else {
      getList(startFrom, offset, sort, order, search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus, isFullResponse)
      getTransactionsTotalCountFunc(search, searchTypeBy, startDate, endDate, particulars, eType, transactionStatus)
    }
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
      <ExcelExport
        data={fullList && fullList.length > 0 ? fullList : list}
        fileName={props.isUserToPassbook ? `Transactions - ${list[0]?.sUsername}.xlsx` : 'Transactions.xlsx'}
        ref={exporter}
      >
        <ExcelExportColumn field="id" title="ID" />
        <ExcelExportColumn field="sUsername" title="Username" />
        <ExcelExportColumn field="sEmail" title="Email" />
        <ExcelExportColumn field="sMobNum" title="Mobile No" />
        <ExcelExportColumn field="nAmount" title="Amount" />
        <ExcelExportColumn field="nLoyaltyPoint" title="Loyalty Point" />
        <ExcelExportColumn field="nNewTotalBalance" title="Available Total Balance" />
        <ExcelExportColumn field="nNewBonus" title="Available Bonus" />
        <ExcelExportColumn field="sPromocode" title="Promocode" />
        <ExcelExportColumn field="type" title="Type" />
        <ExcelExportColumn field="eTransactionType" title="Transaction Type" />
        <ExcelExportColumn field="iTransactionId" title="Transaction ID" />
        <ExcelExportColumn field="matchName" title="Match" />
        <ExcelExportColumn field="matchDateTime" title="Match Date & Time" />
        <ExcelExportColumn field="dActivityDate" title="Activity Date" />
        <ExcelExportColumn field="sRemarks" title="Remarks" />
      </ExcelExport>
      {loader && <Loading />}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Passbook ID</th>
              <th>Username</th>
              <th>Mobile No.</th>
              <th>Amount<br></br>(Cash + Bonus)</th>
              <th>Loyalty Point</th>
              <th>Available Total Balance<br></br>(Available Deposit Balance <br></br>+ Available Winning Balance)</th>
              <th>Promocode</th>
              <th>Available Bonus</th>
              <th>
                <div>Status</div>
                <CustomInput
                  type="select"
                  name="transactionStatus"
                  id="transactionStatus"
                  value={transactionStatus}
                  className="mt-2 custom-input-transaction"
                  onChange={(event) => onFiltering(event, 'TransactionStatus')}
                >
                  <option value="">All</option>
                  <option value="CMP">Completed</option>
                  <option value="R">Refunded</option>
                  <option value="CNCL">Cancelled</option>
                </CustomInput>
              </th>
              <th>
                <div>Type</div>
                <CustomInput
                  type="select"
                  name="eType"
                  id="eType"
                  value={eType}
                  className="mt-2 custom-input-transaction"
                  onChange={(event) => onFiltering(event, 'eType')}
                >
                  <option value="">All</option>
                  <option value="Cr">Credited</option>
                  <option value="Dr">Debited</option>
                </CustomInput>
              </th>
              <th>
                <div>Transaction Type</div>
                <CustomInput
                  type="select"
                  name="Particulars"
                  id="Particulars"
                  value={particulars}
                  className="mt-2"
                  onChange={(event) => onFiltering(event, 'Particulars')}
                >
                  <option value="">All</option>
                  <option value="Bonus">Bonus</option>
                  <option value="Refer-Bonus">Refer Bonus</option>
                  <option value="Bonus-Expire">Bonus Expire</option>
                  <option value="Deposit">Deposit </option>
                  <option value="Withdraw">Withdraw </option>
                  <option value="Withdraw-Return">Withdraw Return</option>
                  <option value="Play">Play</option>
                  <option value="Play-Return">Play Return</option>
                  <option value="Win">Win </option>
                  <option value="Cashback-Contest">Cashback Contest</option>
                  <option value="Cashback-Return">Cashback Return</option>
                  <option value="Creator-Bonus">Creator Bonus</option>
                  <option value='Loyalty-Point'>Loyalty Point</option>
                </CustomInput>
              </th>
              <th>Transaction ID</th>
              <th>
                Request Date & Time
                <Button color="link" className="sort-btn" onClick={() => onSorting('dActivityDate')}><img src={sortIcon} className="m-0" alt="sorting" /></Button>
              </th>
              <th>
                Approval Date & Time
                <Button color="link" className="sort-btn" onClick={() => onSorting('dProcessedDate')}><img src={sortIcon} className="m-0" alt="sorting" /></Button>
              </th>
              <th>Match</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={16} />
              : (
                <Fragment>
                  {
                    list && list.length !== 0 && list.map((data, i) => (
                      <tr key={i}>
                        <td>{data.id ? data.id : '--'}</td>

                          {(adminPermission && adminPermission.USERS !== 'N' && adminPermission.SYSTEM_USERS === 'N' && data.eUserType === 'U')
                            ? <td><Button color="link" className="view" tag={Link} to={`/users/user-management/user-details/${data.iUserId}`}>{data.sUsername || '--'}</Button></td>
                            : (adminPermission && adminPermission.USERS === 'N' && adminPermission.SYSTEM_USERS !== 'N' && data.eUserType !== 'U')
                                ? <td><Button color="link" className="view" tag={Link} to={`/users/system-user/system-user-details/${data.iUserId}`}>{data.sUsername || '--'}</Button></td>
                                : (adminPermission && (adminPermission.USERS !== 'N' && adminPermission.SYSTEM_USERS !== 'N'))
                                    ? <td><Button color="link" className="view" tag={Link} to={data.eUserType === 'U' ? `/users/user-management/user-details/${data.iUserId}` : `/users/system-user/system-user-details/${data.iUserId}`}>{data.sUsername || '--'}</Button></td>
                                    : <td>{data.sUsername || '--'}</td>}

                        <td>{data.sMobNum || '--'}</td>
                        <td>{data.nAmount ? data.nAmount : 0}<br></br><b>{data.nCash !== 0 || data.nBonus !== 0 ? `(${data.nCash} + ${data.nBonus})` : ''}</b></td>
                        <td>{data.nLoyaltyPoint || '--'}</td>
                        <td>{data.nNewTotalBalance ? data.nNewTotalBalance : 0}<br></br><b>{data.nNewDepositBalance !== 0 || data.nNewWinningBalance !== 0 ? `(${data.nNewDepositBalance} + ${data.nNewWinningBalance})` : ''}</b></td>
                        <td>{data.sPromocode || '--'}</td>
                        <td>{data.nNewBonus ? data.nNewBonus : 0}</td>
                        <td>{data.eStatus ? (data.eStatus === 'CMP' ? 'Completed' : data.eStatus === 'R' ? 'Refunded' : data.eStatus === 'CNCL' ? 'Cancelled' : '--') : '--'}</td>
                        <td>{data.eType && data.eType === 'Cr' ? 'Credited' : data.eType === 'Dr' ? 'Debited' : '--'}</td>
                        <td>{data.eTransactionType ? data.eTransactionType : '--'}</td>
                        <td>{data.iTransactionId || '--'}</td>
                        <td>{data.dActivityDate ? moment(data.dActivityDate).format('DD/MM/YYYY hh:mm A') : ' - '}</td>
                        <td>{data.dProcessedDate ? moment(data.dProcessedDate).format('DD/MM/YYYY hh:mm A') : ' - '}</td>
                        <td>{data.sMatchName || '--'}<br />{data.dMatchStartDate ? moment(data.dMatchStartDate).format('DD/MM/YYYY hh:mm A') : ''}</td>
                        <td>{data.sRemarks ? data.sRemarks : '-'}</td>
                      </tr>
                    ))
                  }
                </Fragment>
                )
            }
          </tbody>
        </table>
      </div>
      {
        !loading && list.length === 0 &&
        (
          <div className="text-center">
            <h3>No Transactions available</h3>
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

PassbookList.propTypes = {
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  flag: PropTypes.bool,
  getList: PropTypes.func,
  List: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
  search: PropTypes.string,
  openPicker: PropTypes.bool,
  getTransactionsTotalCountFunc: PropTypes.func,
  searchType: PropTypes.string,
  isLeaguePassbook: PropTypes.string,
  leaguePassbookList: PropTypes.array,
  leagueTransactionsTotalCountFunc: PropTypes.func,
  userToPassbookId: PropTypes.string,
  tdsToPassbookId: PropTypes.number,
  isUserToPassbook: PropTypes.bool,
  isTdsToPassbook: PropTypes.bool
}

PassbookList.displayName = PassbookList

export default PassbookList
