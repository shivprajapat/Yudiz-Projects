import { toaster } from 'helper/helper'
import { getUser, updateUserById } from 'query/user/user.query'
import React, { useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useLocation } from 'react-router-dom'
import CustomerManagementItemRow from 'shared/components/customer-management-item-row'
import CustomerFilters from 'shared/components/customers-Filters'
import DataTable from 'shared/components/data-table'
import Drawer from 'shared/components/drawer'
import { appendParams, parseParams } from 'shared/utils'

export default function CustomerManagement() {
  const location = useLocation()
  const params = useRef(parseParams(location.search))
  const paramsData = {
    size: params?.current?.size ? Number(params?.current?.size.toString()) : 10,
    search: params?.current?.search ? params?.current?.search.toString() : '',
    pageNumber: params?.current?.pageNumber ? Number(params?.current?.pageNumber.toString()) : 1,
    eStatus: '',
    startDate: '',
    endDate: '',
    date: '',
    sort: '',
    column: '',
    orderBy: 1
  }
  const [requestParams, setRequestParams] = useState(paramsData)
  const query = useQueryClient()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [userList, setUserList] = useState()
  useQuery(['customer', requestParams], () => getUser(requestParams), {
    select: (data) => data.data.data,
    onSuccess: (response) => {
      setUserList(response)
    }
  })

  function handleFilterChange(e) {
    if (e?.data?.eStatusFilters?.value) {
      setRequestParams({ ...requestParams, eStatus: e.data.eStatusFilters.value })
    } else {
      setRequestParams({ ...requestParams, eStatus: '' })
    }
  }

  function handlePageEvent(page) {
    setRequestParams({ ...requestParams, pageNumber: page })
    appendParams({ pageNumber: page })
  }

  async function handleHeaderEvent(name, value) {
    switch (name) {
      case 'rows':
        setRequestParams({ ...requestParams, size: Number(value) })
        appendParams({ size: value })
        break
      case 'search':
        setRequestParams({ ...requestParams, search: value })
        appendParams({ search: value })
        break
      case 'filter':
        setIsFilterOpen(value)
        break
      default:
        break
    }
  }
  const statusMutaion = useMutation(['updateUser', requestParams], updateUserById, {
    onSuccess: (response) => {
      query.invalidateQueries('customer')
      toaster(response?.data?.message)
    }
  })

  const handleStatusUpdateUser = (id, status) => {
    statusMutaion.mutate({ id, eStatus: status ? 'y' : 'n' })
  }

  const tableColumns = [
    { name: 'FullName', internalName: 'sFullName', type: 0 },
    { name: 'Email', internalName: 'sEmail', type: 0 },
    { name: 'Mobile No', internalName: 'sMobile', type: 0 },
    { name: 'Gender', internalName: 'eGender', type: 0 },
    { name: 'Created At', internalName: 'dCreatedDate', type: 0 },
    { name: 'Actions', internalName: '', type: 0 }
  ]

  const [columns] = useState(tableColumns)
  return (
    <div>
      <DataTable
        columns={columns}
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
        totalRecord={userList?.count?.total ? userList?.count?.total : 0}
        pagination={{ currentPage: requestParams.pageNumber, pageSize: requestParams.size }}
        pageChangeEvent={handlePageEvent}
      >
        {userList?.users?.map((user, index) => {
          return <CustomerManagementItemRow key={user._id} index={index} user={user} onStatusChange={handleStatusUpdateUser} />
        })}
        <Drawer isOpen={isFilterOpen} onClose={() => setIsFilterOpen(!isFilterOpen)} title={useIntl().formatMessage({ id: 'filterUser' })}>
          <CustomerFilters
            filterChange={handleFilterChange}
            closeDrawer={() => setIsFilterOpen(!isFilterOpen)}
            defaultValue={requestParams}
          />
        </Drawer>
      </DataTable>
    </div>
  )
}
