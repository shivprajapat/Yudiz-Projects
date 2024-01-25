import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import './style.scss'
import DataTable from 'admin/shared/components/data-table'
import CustomerItemRow from './customer-item-row'
import { adminGetUsers } from 'admin/modules/user/redux/service'
import Drawer from 'admin/shared/components/drawer'
import CustomerFilter from './customer-filter'
import { appendParams } from 'shared/utils'
import { useSearchParams } from 'react-router-dom'
import UserCreateModal from './user-create/UserCreateModal'
import { Button } from 'react-bootstrap'
import ExportModal from 'admin/modules/export/ExportModal'
import { apiPaths } from 'shared/constants/apiPaths'

const AdminCustomers = () => {
  const dispatch = useDispatch()

  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams()
  const [requestParams, setRequestParams] = useState({ page: 1, perPage: 10 })
  const [customerData, setCustomerData] = useState()
  const [totalRecord, setTotalRecord] = useState(0)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [newUser, setnewUser] = useState(null)
  const [showExportModal, setShowExportModal] = useState(false)
  const adminUserStore = useSelector((state) => state.adminUser.getAdminUsers)

  const [columns, setColumns] = useState([
    { name: 'name', internalName: 'firstName', type: 0 },
    { name: 'email', internalName: 'email', type: 0 },
    { name: 'userName', internalName: 'userName', type: 0 }
  ])

  useEffect(() => {
    dispatch(adminGetUsers(requestParams))
  }, [
    requestParams.role,
    requestParams.kycStatus,
    requestParams.page,
    requestParams.isBlocked,
    requestParams.perPage,
    requestParams.referralCode,
    requestParams.searchContent
  ])

  useEffect(() => {
    if (newUser) {
      dispatch(adminGetUsers(requestParams))
      setnewUser(null)
    }
  }, [newUser])

  useEffect(() => {
    if (adminUserStore?.users) {
      setCustomerData(adminUserStore?.users)
      setTotalRecord(adminUserStore?.metaData?.totalItems)
    }
  }, [adminUserStore])

  function handleHeaderEvent(name, value) {
    switch (name) {
      case 'rows':
        setRequestParams({ ...requestParams, perPage: Number(value) })
        break
      case 'search':
        setRequestParams({ ...requestParams, searchContent: value })
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
    setRequestParams({ ...requestParams, sortColumn: field.internalName, sortOrder: field.type === 1 ? -1 : 1 })
    const data = setSortType(columns, field.internalName)
    setColumns(data)
  }
  function handlePageEvent(page) {
    setRequestParams({ ...requestParams, page: page })
  }

  const handleFilterChange = (data) => {
    let reqParams = { ...requestParams }

    if (data?.role?.value) {
      reqParams = { ...reqParams, role: data?.role?.value }
      appendParams({ role: data?.role?.value })
    } else {
      reqParams = { ...reqParams, role: '' }
      appendParams({ role: '' })
    }

    if (data?.isMarketing !== undefined) {
      reqParams = { ...reqParams, isMarketing: data?.isMarketing }
      appendParams({ isMarketing: data?.isMarketing })
    } else {
      reqParams = { ...reqParams, isMarketing: '' }
      appendParams({ isMarketing: '' })
    }

    if (data?.isBlocked !== null) {
      reqParams = { ...reqParams, isBlocked: data.isBlocked }
      appendParams({ isBlocked: data.isBlocked })
    } else {
      reqParams = { ...reqParams, isBlocked: '' }
      appendParams({ isBlocked: '' })
    }

    if (data?.referralCode !== '') {
      reqParams = { ...reqParams, referralCode: data.referralCode }
      appendParams({ referralCode: data.referralCode })
    } else {
      appendParams({ referralCode: '' })
      reqParams = { ...reqParams, referralCode: '' }
    }

    if (data?.kycStatus?.value !== ('' || undefined)) {
      reqParams = { ...reqParams, kycStatus: data?.kycStatus?.value }
      appendParams({ kycStatus: data?.kycStatus?.value })
    } else {
      reqParams = { ...reqParams, kycStatus: '' }
      appendParams({ kycStatus: '' })
    }

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

  const toggleUserCreateModal = () => {
    setShowModal((prev) => !prev)
  }

  const toggleExportModal = () => {
    setShowExportModal((prev) => !prev)
  }

  return (
    <>
      <div className="content-headers">
        <h2 className="admin-heading">Customers</h2>
        <button onClick={() => setShowModal(true)}>Create New Customer</button>
      </div>
      <div className="d-flex justify-content-end">
        <Button className="bg-success text-light approve-btn border-0 mt-1" onClick={() => setShowExportModal(true)}>
          EXPORT
        </Button>
      </div>
      <div className="admin-customers">
        <DataTable
          className="customer-list"
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
          {!customerData || customerData.length === 0 ? (
            <div className="data-not-available-container">Sorry, no customers matches your query.</div>
          ) : (
            customerData?.map((customer, index) => {
              return <CustomerItemRow key={customer.id} index={index} customer={customer} />
            })
          )}
        </DataTable>
        <Drawer className="drawer" isOpen={isFilterOpen} onClose={() => setIsFilterOpen(!isFilterOpen)} title="filter">
          <CustomerFilter
            filterChange={handleFilterChange}
            defaultValue={requestParams}
            onReset
            requestParams={requestParams}
            setRequestParams={setRequestParams}
          />
        </Drawer>
      </div>
      <UserCreateModal title={'Create user'} show={showModal} handleClose={toggleUserCreateModal} setnewUser={setnewUser} />
      <ExportModal
        title={'Export Confirmation'}
        show={showExportModal}
        handleClose={toggleExportModal}
        requestParams={requestParams}
        // TODO Send the correct API through this request
        api={apiPaths.userTransactionExport}
      />
    </>
  )
}

export default AdminCustomers
