import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState, Fragment } from 'react'
import PropTypes from 'prop-types'
import { useQueryState } from 'react-router-use-location-state'
import qs from 'query-string'
import {
  Input, UncontrolledAlert,
  FormGroup, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle, Button
} from 'reactstrap'
import SkeletonTable from '../../../../components/SkeletonTable'
import moment from 'moment'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import PaginationComponent from '../../../../components/PaginationComponent'
import { Link, useHistory } from 'react-router-dom'
import { alertClass } from '../../../../helpers/helper'
import { useSelector } from 'react-redux'
import closeIcon from '../../../../assets/images/close-icon.svg'

const PromocodeStatistics = forwardRef((props, ref) => {
  const { match, promocodeStatisticsDetails, getList, recommendedList } = props
  const exporter = useRef(null)
  const searchProp = props.search
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [show, setShow] = useState(false)
  const [total] = useState(0)
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [order, setOrder] = useQueryState('order', 'desc')
  const [search, setSearch] = useQueryState('search', '')
  const [sort] = useQueryState('sortBy', 'dCreatedAt')
  const [startingNo] = useState(0)
  const [endingNo] = useState(0)
  const [index] = useState(1)
  const [listLength, setListLength] = useState('10 entries')
  const [message] = useState('')
  const [close] = useState(false)
  const [status] = useState(false)
  const [Loading, setLoading] = useState(false)
  const [TotalBonusGiven, setTotalBonusGiven] = useState(0)
  const [PromoUsage, setPromoUsage] = useState([])
  const [modalMessage] = useState(false)
  const isSendId = useSelector(state => state.users.isSendId)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({ promocodeStatisticsDetails, searchProp, start, offset }).current
  const paginationFlag = useRef(false)
  const history = useHistory()

  useEffect(() => {
    let page = 1
    let limit = offset
    let orderBy = 'desc'
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
      if (obj.order) {
        orderBy = obj.order
        setOrder(orderBy)
      }
      if (obj.search) {
        setSearch(obj.search)
      }
      if ((!obj.search) && (!obj.datefrom)) {
        const startFrom = (page - 1) * offset
        setStart(startFrom)
        if (match && match.params && match.params.id) {
          getList(startFrom, limit, sort, order, search)
          setLoading(true)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (isSendId && recommendedList && recommendedList.length > 0 && searchProp) {
      getList(start, offset, sort, order, search)
      setLoading(true)
    }
  }, [isSendId, searchProp])

  useEffect(() => {
    if (previousProps.recommendedList !== recommendedList && recommendedList) {
      setShow(true)
    }
    return () => {
      previousProps.recommendedList = recommendedList
    }
  }, [recommendedList])

  useEffect(() => {
    if (promocodeStatisticsDetails && previousProps.promocodeStatisticsDetails !== promocodeStatisticsDetails) {
      setTotalBonusGiven(promocodeStatisticsDetails.ntotalBonusGiven)
      setPromoUsage(promocodeStatisticsDetails.data)
      setLoading(false)
    }
    return () => {
      previousProps.promocodeStatisticsDetails = promocodeStatisticsDetails
    }
  }, [promocodeStatisticsDetails])

  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, props.search)

      setSearch(searchProp.trim())
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
      getList(start, offset, sort, order, search)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  const processExcelExportData = data => data.map((PromoUsageList) => {
    const sUsername = PromoUsageList?.iUserId?.sUsername
    const sMobNum = PromoUsageList?.iUserId?.sMobNum
    const idepositId = PromoUsageList.idepositId || '--'
    let dCreatedAt = moment(PromoUsageList.dCreatedAt).local().format('lll')
    let eStatus = PromoUsageList.eStatus
    dCreatedAt = dCreatedAt === 'Invalid date' ? ' - ' : dCreatedAt
    eStatus = eStatus === 'Y' ? 'Active' : 'InActive'

    return {
      ...PromoUsageList,
      sUsername,
      sMobNum,
      idepositId,
      dCreatedAt,
      eStatus
    }
  })

  function onExport () {
    const { length } = PromoUsage
    if (length !== 0) {
      exporter.current.props = { ...exporter.current.props, data: processExcelExportData(PromoUsage), fileName: 'PromoUsageList.xlsx' }
      exporter.current.save()
    }
  }

  function onRefresh () {
    const startFrom = 0
    getList(startFrom, offset, sort, order, search)
    setLoading(true)
    setPageNo(1)
  }

  useImperativeHandle(ref, () => ({
    onExport,
    onRefresh
  }))

  return (
    <Fragment>
    {
      modalMessage && message &&
      (
      <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
      )
    }
    <ExcelExport
      data={PromoUsage}
      fileName="Promocode.xlsx"
      ref={exporter}
    >
      <ExcelExportColumn field="sUsername" title="Username" />
      <ExcelExportColumn field="sTransactionType" title="Transaction Type" />
      <ExcelExportColumn field="sMobNum" title="Mobile Number" />
      <ExcelExportColumn field="nAmount" title="Amount" />
      <ExcelExportColumn field="idepositId" title="Deposit Id" />
      <ExcelExportColumn field="eStatus" title="Status" />
      <ExcelExportColumn field="dCreatedAt" title="Creation Time" />
    </ExcelExport>
    <div className="table-responsive">
     <div className="d-flex justify-content-between mb-3 fdc-480">
      <FormGroup>
        <UncontrolledDropdown>
          <DropdownToggle nav caret className='searchList'>
            <Input
              type='text'
              autoComplete="off"
              className='search-box'
              name='search'
              placeholder='Search'
              value={props.search || props.userSearch}
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
          {PromoUsage?.length >= 1 && <DropdownMenu open={show} className={recommendedList?.length >= 1 ? 'recommended-search-dropdown' : ''}>
              {recommendedList?.length >= 1
                ? (typeof (props.userSearch) === 'number')
                    ? (
                  <Fragment>
                    {
                      recommendedList?.length > 0 && recommendedList.map((recommendedData, index1) => {
                        return (
                          <DropdownItem key={index1} onClick={(e) => {
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
                      recommendedList?.length > 0 && recommendedList.map((recommendedData, index2) => {
                        return (
                          <DropdownItem key={index2} onClick={(e) => {
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
          </FormGroup>
      <h3 className='success-text'>Total Bonus Given : {TotalBonusGiven || 0}</h3>
    </div>
    <table className="table">
      <thead>
        <tr>
          <th>Sr No.</th>
          <th>Username</th>
          <th>Mobile Number</th>
          <th>Amount</th>
          <th>Transaction Type</th>
          <th>Match Name</th>
          <th>Deposit ID</th>
          <th>Created Time</th>
        </tr>
      </thead>
      <tbody>
        {Loading
          ? <SkeletonTable numberOfColumns={8} />
          : (
            <Fragment>
              {
                PromoUsage && PromoUsage.length !== 0 &&
                PromoUsage.map((data, i) => (
                  <tr key={data._id}>
                    <td>{(((index - 1) * offset) + (i + 1))}</td>
                    <td>{(adminPermission && (adminPermission.USERS !== 'N' && adminPermission.SYSTEM_USERS !== 'N')) && data?.iUserId?.eType && data?.iUserId?._id
                      ? <Button color="link" className="view" tag={Link} to={(data.iUserId.eType === 'U') ? `/users/user-management/user-details/${data?.iUserId?._id}` : `/users/system-user/system-user-details/${data?.iUserId?._id}`}>{data?.iUserId?.sUsername || '--'}</Button>
                      : data?.iUserId?.sUsername || '--'}</td>
                    <td>{data.iUserId && data.iUserId.sMobNum ? data.iUserId.sMobNum : '--'}</td>
                    <td>{data.nAmount}</td>
                    <td>{data.sTransactionType ? data.sTransactionType : '--'}</td>
                    <td>{data?.iMatchId?.sName ? <Button color='link' className='btn-link' onClick={() => history.push('/cricket/match-management/match-league-management/match-league-promo-usage-list/' + data?.iMatchId?._id + '/' + data?.iMatchLeagueId, { goBack: true }) }>{data?.iMatchId?.sName}</Button> : '--'}
                    </td>
                    <td>{data.idepositId ? data.idepositId : '--'}</td>
                    <td>{moment(data.dCreatedAt).format('lll')}</td>
                  </tr>
                ))}
            </Fragment>
            )}
      </tbody>
    </table>
  </div>
      {
       !Loading && !PromoUsage &&
        (
          <div className="text-center">
            <h3>No promocode statistics list available</h3>
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

PromocodeStatistics.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object,
  search: PropTypes.string,
  userSearch: PropTypes.string,
  recommendedList: PropTypes.array,
  flag: PropTypes.bool,
  handleChangeSearch: PropTypes.func,
  handleRecommendedSearch: PropTypes.func,
  promocodeStatisticsDetails: PropTypes.object,
  getList: PropTypes.func
}

PromocodeStatistics.displayName = PromocodeStatistics

export default PromocodeStatistics
