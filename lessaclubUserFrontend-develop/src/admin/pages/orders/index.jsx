import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DataTable from 'admin/shared/components/data-table'
import { appendParams } from 'shared/utils'
import Drawer from 'admin/shared/components/drawer'
import { useSearchParams } from 'react-router-dom'
import { adminGetOrders } from 'admin/modules/orders/redux/service'
import OrderItemRow from './order-row'
import OrderFilter from './order-filter'
import './style.scss'

const AdminOrders = () => {
  const dispatch = useDispatch()

  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams()
  const [requestParams, setRequestParams] = useState({ page: 1, perPage: 10 })
  const [orderData, setOrderData] = useState()
  const [totalRecord, setTotalRecord] = useState(0)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const adminOrderStore = useSelector((state) => state.adminOrders)

  const [columns, setColumns] = useState([
    { name: 'Buyer', internalName: 'buyer', type: 0 },
    { name: 'Name', internalName: 'name', type: 0 },
    { name: 'Order Type', internalName: 'orderType', type: 0 },
    { name: 'Status', internalName: 'statusName', type: 0 },
    { name: 'Payment Type', internalName: 'paymentCurrencyType', type: 0 }
  ])

  useEffect(() => {
    dispatch(adminGetOrders(requestParams))
  }, [requestParams])

  useEffect(() => {
    if (adminOrderStore?.orders) {
      setOrderData(adminOrderStore?.orders?.order)
      setTotalRecord(adminOrderStore?.orders?.metaData?.totalItems)
    }
  }, [adminOrderStore])

  function handleHeaderEvent(name, value) {
    switch (name) {
      case 'rows':
        setRequestParams({ ...requestParams, perPage: Number(value) })
        break
      case 'search':
        setRequestParams({ ...requestParams, name: value })
        break
      case 'filter':
        setIsFilterOpen(value)
        break
      default:
        break
    }
  }

  const setSortType = (data, fieldName) => {
    return data.map((data) => {
      if (data.internalName === fieldName) {
        data.type = data.type === 1 ? -1 : 1
      } else {
        data.type = 0
      }
      return data
    })
  }

  function handleSort(field) {
    if (field.internalName === 'name') {
      setRequestParams({ ...requestParams, sortColumn: field.internalName, sortOrder: field.type === 1 ? -1 : 1 })
      const data = setSortType(columns, field.internalName)
      setColumns(data)
    }
  }

  function handlePageEvent(page) {
    setRequestParams({ ...requestParams, page: page })
  }

  const handleFilterChange = (data) => {
    let reqParams = { ...requestParams }
    let searchParams = {}
    Object.keys(data).forEach(key => {
      if (data[key]) {
        const obj = {}
        if (data[key].value) {
          obj[key] = data[key].value
        } else {
          obj[key] = data[key]
        }
        searchParams = { ...searchParams, ...obj }
      } else {
        delete reqParams[key]
      }
    })
    reqParams = { ...reqParams, ...searchParams }
    setSearchParams('')
    appendParams(reqParams)
    setRequestParams(reqParams)
    setIsFilterOpen(!isFilterOpen)
  }

  useEffect(() => {
    if (window.performance) {
      if (performance.navigation.type === 1) {
        setSearchParams('')
      }
    }
  }, [])

  return (
    <>
      <h2 className="admin-heading">Orders</h2>
      <div className="order-section">
        <DataTable
          className="order-list"
          columns={columns}
          sortEvent={handleSort}
          totalRecord={totalRecord}
          header={{
            left: {
              rows: true
            },
            right: {
              search: true,
              filter: true
            }
          }}
          headerEvent={(name, value) => handleHeaderEvent(name, value)}
          pageChangeEvent={handlePageEvent}
          pagination={{ currentPage: requestParams.page, pageSize: requestParams.perPage }}
          actionColumn={true}
        >
          {!orderData || orderData.length === 0 ? (
            <div className="data-not-available-container">Sorry, no orders matches your query.</div>
          ) : (
            orderData?.map((order, index) => {
              return <OrderItemRow key={order.id} order={order} />
            })
          )}
        </DataTable>
        <Drawer className="drawer" isOpen={isFilterOpen} onClose={() => setIsFilterOpen(!isFilterOpen)} title="filter">
          <OrderFilter
            filterChange={handleFilterChange}
            defaultValue={requestParams}
            onReset
            setRequestParams={setRequestParams}
            className="order-filter"
          />
        </Drawer>
      </div>
    </>
  )
}

export default AdminOrders
