import React, { useCallback, useMemo, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { route } from 'Routes/route'

// component
import TablePagination from 'Components/Table-pagination'
import ActionColumn from 'Components/ActionColumn'
import PageTitle from 'Components/Page-Title'
import DataTable from 'Components/DataTable'
import CustomModal from 'Components/Modal'
import Wrapper from 'Components/wrapper'
import Divider from 'Components/Divider'
import Search from 'Components/Search'
import Select from 'Components/Select'
import Button from 'Components/Button'

// query
import { getEmployeeList } from 'Query/Employee/employee.query'
import { deleteEmployee } from 'Query/Employee/employee.mutation'

// helper
import { UserType, appendParams, cell, isGranted, parseParams, toaster } from 'helpers'

// icons
import { ReactComponent as SearchIcon } from 'Assets/Icons/search.svg'

// hook
import { debounce } from 'Hooks/debounce'

function EmployeeList() {

  const navigate = useNavigate()
  const { state } = useLocation()
  const queryClient = useQueryClient()
  const parsedData = parseParams(location.search)

  const [requestParams, setRequestParams] = useState(getParams())
  const [search, setSearch] = useState(parsedData?.search)
  const [modal, setModal] = useState({ open: false })
  const [filters, setFilters] = useState({
    eUserType: parsedData['eUserType']
      ? { value: parsedData['eUserType'], label: parsedData['eUserTypeLabel'] }
      : state?.value
        ? { value: state?.value, label: state?.label }
        : null
  })

  const columns = useMemo(() =>
    [
      { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
      { name: 'Name', connectionName: 'sName', isSorting: false, sort: 0 },
      { name: 'Employee Type', connectionName: 'eUserType', isSorting: false, sort: 0 },
      { name: 'Designation', connectionName: 'sDesignation', isSorting: false, sort: 0 },
      { name: 'Contact Number', connectionName: 'sMobile', isSorting: false, sort: 0 },
      { name: 'Email ID', connectionName: 'sEmail', isSorting: false, sort: 0 },
    ],
    []
  )

  // get employee
  const { isLoading, isFetching, data } = useQuery(['employees', requestParams], () => getEmployeeList(requestParams), {
    select: (data) => data.data.data,
    staleTime: 240000,
  })

  // delete employee
  const mutation = useMutation(deleteEmployee, {
    onSuccess: (data) => {
      toaster(data.data.message)
      queryClient.invalidateQueries('employees')
      queryClient.invalidateQueries('inquiryFollowup')
      queryClient.invalidateQueries(['followUpListDetail', data])
      setModal({ open: false })
    },
  })


  function gotoAddEmployee() {
    navigate(route.employeesAddViewEdit('add'))
  }

  function gotoEdit(id) {
    navigate(route.employeesAddViewEdit('edit', id))
  }

  function onDelete(id) {
    setModal({ open: true, id })
  }

  const debouncedSearch = useCallback(
    debounce((trimmed) => {
      setRequestParams({ ...requestParams, page: 0, search: trimmed, sort: 'sMobile' })
      appendParams({ ...requestParams, page: 0, search: trimmed, sort: 'sMobile' })
    }),
    []
  )

  function handleSearch(e) {
    e.preventDefault()
    setSearch(e.target.value)
    const trimmed = e.target.value.trim()
    debouncedSearch(trimmed)
  }

  function handleFilter(e, fName, opt) {
    if (opt.action === 'clear') {
      setFilters((f) => ({ ...f, [fName]: null }))
      setRequestParams({ ...requestParams, page: 0, [fName]: null, [fName + 'Label']: '' })
      appendParams({ ...requestParams, page: 0, [fName]: null, [fName + 'Label']: '' })
    } else {
      setFilters((f) => ({ ...f, [fName]: e }))
      setRequestParams({ ...requestParams, page: 0, [fName]: e.value, [fName + 'Label']: e.label })
      appendParams({ ...requestParams, page: 0, [fName]: e.value, [fName + 'Label']: e.label })
    }
  }

  function changePage(page) {
    setRequestParams({ ...requestParams, page, limit: requestParams?.limit || 10 })
    appendParams({ ...requestParams, page: page / requestParams?.limit, limit: requestParams?.limit || 10 })
    // setSelectedRows([{ changingPage: true }])
  }

  function changePageSize(pageSize) {
    setRequestParams({ ...requestParams, page: 0, limit: pageSize })
    appendParams({ ...requestParams, page: 0, limit: pageSize })
    // setSelectedRows([{ changingPage: true }])
  }

  function getParams() {
    return {
      page: Number(parsedData?.page) * Number(parsedData?.limit) || 0,
      limit: Number(parsedData?.limit) || 10,
      search: parsedData?.search || '',
      sort: parsedData?.sort || '',
      order: parsedData.order || '',
      eUserType: parsedData?.eUserType || state?.value || '',
      eUserTypeLabel: parsedData?.eUserTypeLabel || state?.label || ''
    }
  }

  const permissions = {
    CREATE: 'noRole',
    READ: 'noRole',
    UPDATE: 'noRole',
    DELETE: 'noRole',
    EXCEL: 'noRole',
    get ALL() {
      return [this.READ, this.UPDATE, this.DELETE]
    },
  }

  return (
    <>
      <Wrapper>
        <PageTitle
          title="Employees List"
          BtnText={isGranted(permissions.CREATE) ? 'Add Employee' : null}
          handleButtonEvent={gotoAddEmployee}
          add
        />

        <div className="w-100 d-flex justify-content-between flex-wrap gap-2 mt-4">
          <div className="d-flex align-items-center">
            <Search
              startIcon={<SearchIcon className="mb-1" />}
              style={{ width: '250px', height: '40px' }}
              placeholder="Search Employee"
              value={search}
              onChange={handleSearch}
            />
          </div>
          <Select
            placeholder={'Emp. Type'}
            value={filters['eUserType']}
            options={UserType}
            isClearable
            errorDisable
            width={150}
            onChange={(e, options) => handleFilter(e, 'eUserType', options)}
          />
        </div>
        <Divider width={'155%'} height="1px" />

        <DataTable
          columns={columns}
          align="left"
          totalData={data?.aEmployeeList?.length}
          isLoading={isLoading || mutation.isLoading || isFetching}
          // disableActions={!isGranted(permissions.ALL)}
        >
          {data?.aEmployeeList?.map((item, i) => {
            return (
              <tr key={i}>
                <td>{cell(requestParams.page + (i + 1))}</td>
                <td>{cell(item?.sName)}</td>
                <td>{cell(item?.eUserType === 'T' ? 'Trainer' : 'Staff')}</td>
                <td>{cell(item?.sDesignation)}</td>
                <td>{cell(item?.sMobile)}</td>
                <td>{cell(item?.sEmail)}</td>
                <ActionColumn
                  permissions={permissions}
                  // handleView={() => gotoDetail(item._id)}
                  handleEdit={() => gotoEdit(item._id)}
                  handleDelete={() => onDelete(item._id)}
                />
              </tr>
            )
          })}
        </DataTable>
      </Wrapper>
      <Wrapper transparent>
        <TablePagination
          currentPage={Number(requestParams?.page)}
          totalCount={data?.count || 0}
          pageSize={requestParams?.limit || 5}
          onPageChange={(page) => changePage(page)}
          onLimitChange={(limit) => changePageSize(limit)}
        />
      </Wrapper>
      <CustomModal modalBodyClassName="p-0 py-2" open={modal.open} handleClose={() => setModal({ open: false })} title="Are you Sure?">
        <h6>Are you sure you want to delete this Employee?</h6>
        <div className="d-flex justify-content-between">
          <div></div>
          <div className="mt-4">
            <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={() => setModal({ open: false })}>
              Cancel
            </Button>
            <Button className='bg-danger' onClick={() => mutation.mutate(modal.id)} loading={mutation.isLoading}>
              Delete
            </Button>
          </div>
        </div>
      </CustomModal>
    </>
  )
}

export default EmployeeList
