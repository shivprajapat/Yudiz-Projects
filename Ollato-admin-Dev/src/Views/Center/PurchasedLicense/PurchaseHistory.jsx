import React, { useEffect, useRef, useState } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import moment from 'moment'
import { useSnackbar } from 'react-notistack'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import paginationFactory from 'react-bootstrap-table2-paginator'
import orderdefault from '../../../assets/images/order-default.svg'
import orderup from '../../../assets/images/order-up.svg'
import orderdown from '../../../assets/images/order-down.svg'

// Components
// import TitleHeader from '../../Components/TitleHeader'

// images
import pdficon from '../../../assets/images/pdf-icon.fabb62686713f9197af19486235c9f22.svg'
import { getAllPackageHistoryDataAction } from '../../../Actions/Center/purchaseLicense'
import TitleHeader from '../../../Components/TitleHeader'
import Header from '../../../Components/Header'
import { Spinner } from 'react-bootstrap'

// Action-File

const PackageHistory = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const pagePerLimitArray = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 30, label: '30' }
  ]

  // token
  const token = localStorage.getItem('token')

  // useState
  const [pageNo, setPageNo] = useState(1)
  const [limit, setLimit] = useState(10)
  const [start, setStart] = useState(0)
  const [sort] = useState('purchase_date')
  const [search, setSearch] = useState('')
  const [order] = useState()
  const [packageHistoryDataSet, setPackageHistoryDataSet] = useState([])

  // useSelector
  const packageHistoryData = useSelector(
    (state) => state.centerPackages.packageHistoryArray
  )
  const packageHistoryCount = useSelector(
    (state) => state.centerPackages.packageHistoryCount
  )
  const isLoading = useSelector(
    (state) => state.centerPackages.isLoading
  )
  const responseStatus = useSelector((state) => state.centerPackages.resStatus)
  const responseMessage = useSelector(
    (state) => state.centerPackages.resMessage
  )
  const previousProps = useRef({
    packageHistoryData,
    responseStatus,
    responseMessage
  }).current

  useEffect(() => {
    if (responseStatus === 401) {
      localStorage.removeItem('token')
      enqueueSnackbar(`${responseMessage}`, {
        variant: 'error',
        autoHide: true,
        hide: 3000
      })
      navigate('/')
    }
  }, [responseStatus])

  useEffect(() => {
    if (token) {
      dispatch(getAllPackageHistoryDataAction(start, limit, sort, order, search, token))
    }
  }, [token])

  useEffect(() => {
    if (previousProps?.packageHistoryData !== packageHistoryData) {
      if (packageHistoryData) {
        setPackageHistoryDataSet(packageHistoryData)
      }
    }
    return () => {
      previousProps.packageHistoryData = packageHistoryData
    }
  }, [packageHistoryData])

  // Downlaod Invoice Button
  const invoicebutton = (row, cell, rowIndex) => {
    return (
      <div className='button-box'>
        <a
          href={`${process.env.REACT_APP_AXIOS_BASE_URL}api/v1/center/purchased-package/invoice/${cell.package_custom_id}`}
        >
          <button className='outline-btn withicon' type='button'>
            <img src={pdficon} alt='' /> <span>Download</span>
          </button>
        </a>
      </div>
    )
  }

  // Search
  const handleCallback = (childData) => {
    setSearch(childData)
    if (childData) {
      dispatch(getAllPackageHistoryDataAction(0, limit, sort, order, childData, token))
    } else {
      dispatch(getAllPackageHistoryDataAction(0, limit, sort, order, '', token))
    }
  }

  // Table-Columns
  const columns = [
    {
      dataField: 'Sr.no',
      text: 'Sr. No',
      formatter: (cell, row, rowIndex) => {
        const rowNumber = rowIndex + 1
        return <span>{rowNumber}</span>
      }
    },
    {
      dataField: 'package_name',
      text: 'Package Name'
    },
    {
      dataField: 'purchase_date',
      text: 'Package Purchased',
      formatter: (cell, row, rowIndex) => {
        // const data = moment(cell?.purchase_date).local().format('YYYY-MM-DD HH:mm:ss')
        //
        return <span>{moment(cell).format('YYYY-MM-DD HH:mm:ss')}</span>
      },
      sort: true,
      sortCaret: (order, column) => {
        if (!order) {
          return (
            <span className='sort-box'>
              <img src={orderdefault} alt='order-up' />
            </span>
          )
        } else if (order === 'asc') {
          return (
            <span className='sort-box'>
              <img src={orderup} alt='order-up' />
            </span>
          )
        } else if (order === 'desc') {
          return (
            <span className='sort-box'>
              <img src={orderdown} alt='order-down' />
            </span>
          )
        }
        return null
      }
    },
    {
      dataField: 'total_packages',
      text: 'Quantity'
    },
    {
      dataField: 'package-invoice',
      text: 'Package Invoice',
      formatter: invoicebutton
    }
  ]

  const handleTablechange = (type, { page, sortField, sortOrder }) => {
    if (type === 'sort') {
      if (sortOrder) {
        dispatch(getAllPackageHistoryDataAction(start, limit, sort, sortOrder, search, token))
      }
    }
  }

  const onPageChange = (page, sizePerPage) => {
    setPageNo(page)
    setStart(limit * (page - 1) - 1 < 0 ? 0 : limit * (page - 1))
    if (page === 1) {
      dispatch(getAllPackageHistoryDataAction(0, limit, sort, order, search, token))
    } else {
      dispatch(
        getAllPackageHistoryDataAction(
          limit * (page - 1) - 1 < 0 ? 0 : limit * (page - 1),
          limit,
          sort,
          order,
          search,
          token
        )
      )
    }
  }

  const options = {
    sizePerPage: limit,
    hideSizePerPage: true,
    hidePageListOnlyOnePage: false,
    alwaysShowAllBtns: true,
    totalSize: packageHistoryCount,
    remote: { pagination: true },
    onPageChange,
    page: +pageNo
  }

  // pagePerLimit
  const handlePagePerLimit = (e) => {
    setLimit(e.value)
    dispatch(getAllPackageHistoryDataAction(start, e.value, sort, order, search, token))
  }

  return (
    <>
      <div className=''>
      <Header name="dgdgd" parentCallback={handleCallback} />
        <TitleHeader title='Your Active Package' name='Package History' />
        <div className="col-md-12 text-end filterboxcontent">
              <div className="categoryfilterbtn text-center sizeperpagebtn">
                <Select
                  classNamePrefix="filter-custom"
                  className="filter-time-btn withrightimg"
                  isSearchable={false}
                  options={pagePerLimitArray}
                  defaultValue={{ value: 10, label: 10 }}
                  onChange={e => handlePagePerLimit(e)}
                />
              </div>
            </div>
        <div className='main-layout whitebox-layout table-student'>
          <BootstrapTable
            keyField='id'
            data={packageHistoryDataSet || []}
            columns={columns}
            responsive='md'
            remote={true}
            defaultSorted={[
              {
                dataField: 'purchase_date',
                order: 'desc'
              }
            ]}
            pagination={paginationFactory(options)}
            onTableChange={handleTablechange}
            options={options}
            noDataIndication={() => (
              isLoading
                ? <Spinner className='text-center' animation='border' />
                : 'No data'
            )}
          />
        </div>
      </div>
    </>
  )
}

export default PackageHistory
