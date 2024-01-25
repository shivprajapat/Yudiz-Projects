/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-vars */
import { toaster } from 'helper/helper'
import { getCategory } from 'query/category-menagement /category.query'
import { getUser, updateUserById } from 'query/user/user.query'
import React, { useEffect, useRef, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import CategoryManagementItemRow from 'shared/components/category-management-list-row'
import CustomerManagementItemRow from 'shared/components/customer-management-item-row'
import CustomerFilters from 'shared/components/customers-Filters'
import DataTable from 'shared/components/data-table'
import Drawer from 'shared/components/drawer'
import TopBar from 'shared/components/top-bar'
import { appendParams, parseParams } from 'shared/utils'

export default function CategoryManagement() {
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
  //   const [userList, setUserList] = useState()
  const [CategoryList, setCategoryList] = useState()
  useQuery(['category', requestParams], () => getCategory(), {
    select: (data) => data.data.data,
    onSuccess: (response) => {
      setCategoryList(response)
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
    { name: 'Category Name', internalName: 'sName', type: 0 },
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
        totalRecord={CategoryList?.count?.total ? CategoryList?.count?.total : 0}
        pagination={{ currentPage: requestParams.pageNumber, pageSize: requestParams.size }}
        pageChangeEvent={handlePageEvent}
      >
        {CategoryList?.categories?.map((user, index) => {
          return <CategoryManagementItemRow key={user._id} index={index} user={user} onStatusChange={handleStatusUpdateUser} />
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
