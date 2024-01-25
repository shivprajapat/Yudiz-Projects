import React, { forwardRef, Fragment, useEffect, useImperativeHandle, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useQueryState } from 'react-router-use-location-state'
import moment from 'moment'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import { Button, UncontrolledAlert } from 'reactstrap'
import { alertClass, modalMessageFunc } from '../../../../../helpers/helper'
import { useSelector } from 'react-redux'
import PaginationComponent from '../../../../../components/PaginationComponent'
import qs from 'query-string'
import SkeletonTable from '../../../../../components/SkeletonTable'
import check from '../../../../../assets/images/checked-icon.svg'
import { Link } from 'react-router-dom'

const UserReferrals = forwardRef((props, ref) => {
  const { getList, referredList, search } = props
  const exporter = useRef(null)
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [sort] = useQueryState('sortBy', 'dCreatedAt')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [listLength, setListLength] = useState('10 entries')
  const [close, setClose] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)

  const resStatus = useSelector((state) => state.users.resStatus)
  const resMessage = useSelector((state) => state.users.resMessage)
  const searchProp = props.search
  const previousProps = useRef({
    resMessage,
    resStatus,
    referredList,
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
    if (previousProps.referredList !== referredList) {
      if (referredList) {
        if (referredList.results) {
          const userArrLength = referredList.results.length
          const startFrom = (activePageNo - 1) * offset + 1
          const end = startFrom - 1 + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(referredList.results ? referredList.results : [])
        setIndex(activePageNo)
        setTotal(referredList.count ? referredList.count : 0)
      }
      setLoading(false)
    }
    return () => {
      previousProps.referredList = referredList
    }
  }, [referredList])

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
          setModalMessage(true)
          setPageNo(activePageNo)
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

  const processExcelExportData = (data) =>
    data.map((referralsList) => {
      let dCreatedAt = moment(referralsList.dCreatedAt).local().format('lll')
      dCreatedAt = dCreatedAt === 'Invalid date' ? ' - ' : dCreatedAt
      const sUsername = referralsList.sUsername ? referralsList.sUsername : '--'
      const sEmail = referralsList.sEmail ? referralsList.sEmail : '--'
      const sName = referralsList.sName ? referralsList.sName : '--'

      return {
        ...referralsList,
        sUsername,
        sEmail,
        sName,
        dCreatedAt
      }
    })

  function onExport () {
    const { length } = list
    if (length !== 0) {
      exporter.current.props = {
        ...exporter.current.props,
        data: processExcelExportData(list),
        fileName: 'ReferralsList.xlsx'
      }
      exporter.current.save()
    }
  }

  useImperativeHandle(ref, () => ({
    onExport
  }))

  return (
    <Fragment>
      <ExcelExport data={list} fileName='ReferralsList.xlsx' ref={exporter}>
        <ExcelExportColumn field='sUsername' title='Username' />
        <ExcelExportColumn field='sEmail' title='Email' />
        <ExcelExportColumn field='sMobNum' title='Mobile No.' />
        <ExcelExportColumn field='dCreatedAt' title='Registered Date' />
      </ExcelExport>
      <div className='table-responsive'>
        {modalMessage && message && (
          <UncontrolledAlert color='primary' className={alertClass(status, close)}>{message}</UncontrolledAlert>
        )}
        <table className='table'>
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Username</th>
              <th>Email</th>
              <th>Mobile No.</th>
              <th>Registered Date</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? (
              <SkeletonTable numberOfColumns={5} />
                )
              : (
              <Fragment>
                {list &&
                  list.length !== 0 &&
                  list.map((data, i) => (
                    <tr key={data._id}>
                      <td>{(index - 1) * offset + (i + 1)}</td>
                      <td>{data.sUsername ? <Button color="link" className="view" tag={Link} to={`/users/user-management/user-details/${data._id}`}>{data.sUsername}</Button> : '--'}{data.bIsInternalAccount ? <b className='account-text'>(Internal)</b> : ''}</td>
                      <td>{(data && data.sEmail) || '--'}{data && data.bIsEmailVerified ? <img src={check} className='mx-2'></img> : ''}</td>
                      <td>{data && data.sMobNum}{data && data.bIsMobVerified ? <img src={check} className="mx-2"></img> : ''}</td>
                      <td>{moment(data.dCreatedAt).format('lll')}</td>
                    </tr>
                  ))}
              </Fragment>
                )}
          </tbody>
        </table>
      </div>
      {!loading && list.length === 0 && (
        <div className='text-center'>
          <h3>No Referred User available</h3>
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
      </Fragment>
  )
})

UserReferrals.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  search: PropTypes.string,
  referredList: PropTypes.object,
  getList: PropTypes.func,
  flag: PropTypes.bool
}

UserReferrals.displayName = UserReferrals

export default UserReferrals
