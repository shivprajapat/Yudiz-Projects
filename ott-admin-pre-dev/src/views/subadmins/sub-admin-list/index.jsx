import { toaster } from 'helper/helper'
import { getSubAdminList, updateSubAdminById } from 'query/sub-admin/subAdmin.query'
import React, { useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import DataTable from 'shared/components/data-table'
import SubAdminItemRow from 'shared/components/sub-admin-item-row'
import TopBar from 'shared/components/top-bar'
import { route } from 'shared/constants/AllRoutes'
import { appendParams, parseParams } from 'shared/utils'

export default function SubAdmins() {
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
  const [subAdminData, setSubAdminData] = useState([])
  useQuery('subadmin', () => getSubAdminList(paramsData), {
    select: (data) => data.data.data,
    onSuccess: (response) => {
      setSubAdminData(response)
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
  const statusMutaion = useMutation(['updateUser', requestParams], updateSubAdminById, {
    onSuccess: (response) => {
      query.invalidateQueries('customer')
      toaster(response?.data?.message)
    }
  })

  const handleStatusUpdateUser = (id, status) => {
    statusMutaion.mutate({ id, eStatus: status ? 'y' : 'n' })
  }

  const tableColumns = [
    { name: <FormattedMessage id='userName' />, internalName: 'sTitle', type: 0 },
    { name: <FormattedMessage id='Email' />, internalName: 'author', type: 0 },
    { name: <FormattedMessage id='Mobile No' />, internalName: 'categories', type: 0 },
    { name: <FormattedMessage id='Added By' />, internalName: 'categories', type: 0 }
  ]

  const [columns] = useState(tableColumns)
  const navigate = useNavigate()

  function handleBtnEvent(eventName) {
    switch (eventName) {
      case 'newSubAdmin':
        navigate(route.addSubAdmins)
        break
      default:
        break
    }
  }

  return (
    <>
      <TopBar
        buttons={[
          {
            text: <FormattedMessage id='add sub-admin' />,
            icon: 'icon-add',
            type: 'primary',
            clickEventName: 'newSubAdmin',
            isAllowedTo: 'C',
            isAllowedToModule: 'SUBADMIN'
          }
        ]}
        btnEvent={handleBtnEvent}
      />
      <DataTable columns={columns}>
        {subAdminData?.subAdmins?.map((user, index) => {
          return (
            <SubAdminItemRow
              key={user._id}
              index={index}
              user={user}
              // selectedUser={selectedUser}
              // onDelete={handleDelete}
              // onStatusChange={handleStatusChange}
              // onSelect={handleCheckbox}
              // actionPermission={actionColumnPermission}
              // bulkPermission={bulkActionPermission}
            />
          )
        })}
      </DataTable>
    </>
  )
}
