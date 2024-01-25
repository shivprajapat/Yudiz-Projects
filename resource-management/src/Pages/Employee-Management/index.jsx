import DataTable from 'Components/DataTable'
import React, { useState } from 'react'
import { useMutation, useQueries, useQuery, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { ReactComponent as SearchIcon } from 'Assets/Icons/search.svg'
import PageTitle from 'Components/Page-Title'
import { departmentList, getEmployeeList } from '../../Query/Employee/employee.query'
import Wrapper from 'Components/wrapper'
import TablePagination from 'Components/Table-pagination'

import { deleteEmployee } from 'Query/Employee/employee.mutation'
import CustomModal from 'Components/Modal'
import Select from 'Components/Select'

import Divider from 'Components/Divider'
import { appendParams, getSortedColumns, parseParams, toaster } from 'helpers/helper'
import Button from 'Components/Button'
import Search from 'Components/Search'
import ActionColumn from 'Components/ActionColumn'

const EmployeeManagement = () => {
  const queryClient = useQueryClient()
  const parsedData = parseParams(location.search)
  const AvailabilityStatus = [
    { label: 'Available', value: 'Available' },
    { label: 'Not Available', value: 'Not Available' },
    { label: 'Partially Available', value: 'Partially Available' },
  ]

  const [modal, setModal] = useState({ open: false })
  const [search, setSearch] = useState(parsedData?.search)
  const [filters, setFilters] = useState({
    iDepartmentId: parsedData['iDepartmentId']
      ? { _id: parsedData['iDepartmentId'], sName: parsedData['iDepartmentIdLabel']?.replace('+', ' ') }
      : null,
    eAvailabilityStatus: parsedData['eAvailabilityStatus']
      ? { label: parsedData['eAvailabilityStatus']?.replace('+', ' '), value: parsedData['eAvailabilityStatus']?.replace('+', ' ') }
      : null,
  })

  function getParams() {
    return {
      page: Number(parsedData?.page) || 0,
      limit: Number(parsedData?.limit) || 5,
      search: parsedData?.search || '',
      sort: parsedData.sort || '',
      order: parsedData.order || '',
      iDepartmentId: parsedData['iDepartmentId'] || '',
      eAvailabilityStatus: parsedData['eAvailabilityStatus']?.replace('+', ' ') || '',
    }
  }
  const [requestParams, setRequestParams] = useState(getParams())

  const { isLoading, isFetching, data } = useQuery(
    [
      'employee' + requestParams?.sort + requestParams?.order + requestParams?.page + requestParams?.limit + requestParams?.search,
      requestParams,
    ],
    () => getEmployeeList(requestParams),
    {
      select: (data) => data.data,
      staleTime: Infinity,
    }
  )

  const mutation = useMutation(deleteEmployee, {
    onSuccess: (data) => {
      toaster(data.data.message)

      queryClient.invalidateQueries(
        'employee' + requestParams?.sort + requestParams?.order + requestParams?.page + requestParams?.limit + requestParams?.search
      )
      setModal({ open: false })
    },
  })

  const [lazyLoad, setLazyLoad] = useState({
    department: {
      page: 0,
      limit: 10,
      next: true,
    },
  })
  const [departmentArray, setDepartmentArray] = useState([])

  useQueries([
    {
      queryKey: ['empDepartment', lazyLoad.department.page],
      queryFn: () => departmentList(lazyLoad.department),
      select: (data) => data.data.data.departments,
      onSuccess: (data) => {
        if (data?.length) {
          setDepartmentArray((p) => [...p, ...data])
        } else {
          setLazyLoad({ ...lazyLoad, department: { ...lazyLoad.department, next: false } })
        }
      },
    },
  ])

  function handleScroll() {
    setLazyLoad({ ...lazyLoad, department: { ...lazyLoad.department, page: lazyLoad.department.page + 1 } })
  }

  const [columns, setColumns] = useState(
    getSortedColumns(
      [
        { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
        { name: 'Employee Name', connectionName: 'sName', isSorting: true, sort: 0 },
        { name: 'Department', connectionName: 'sDepartment', isSorting: true, sort: 0 },
        { name: 'Expe.', connectionName: 'nExperience', isSorting: true, sort: 0 },
        { name: 'Availablity Hours', connectionName: 'nAvailabilityHours', isSorting: true, sort: 0 },
        { name: 'Projects', connectionName: 'project', isSorting: true, sort: 0 },
        { name: 'Grade', connectionName: 'eGrade', isSorting: true, sort: 0 },
      ],
      parsedData
    )
  )

  const navigate = useNavigate()

  function gotoAddEmployee() {
    navigate('/employee-management/add')
  }

  function gotoEdit(id) {
    navigate('/employee-management/edit/' + id)
  }

  function gotoDetail(id) {
    navigate('/employee-management/detail/' + id)
  }

  function onDelete(id) {
    setModal({ open: true, id })
  }

  function handleSearch(e) {
    e.preventDefault()
    setSearch(e.target.value)
    const TimeOut = setTimeout(function fetchFilteredData() {
      setRequestParams({ ...requestParams, page: 0, search: e.target.value })
      appendParams({ ...requestParams, page: 0, search: e.target.value })
    }, 2000)
    return () => clearTimeout(TimeOut)
  }

  function handleFilter(e, fName, opt) {
    if (opt.action === 'clear') {
      setFilters({ ...filters, [fName]: null })
      setRequestParams({ ...requestParams, page: 0, [fName]: '' })
      appendParams({ ...requestParams, page: 0, [fName]: '' })
    }
    setFilters({ ...filters, [fName]: e })
    setRequestParams({ ...requestParams, page: 0, [fName]: e._id })
    appendParams({ ...requestParams, page: 0, [fName]: e._id, [fName + 'Label']: e.sName })
  }

  function changePage(page) {
    setRequestParams({ ...requestParams, page, limit: requestParams?.limit || 5 })
    appendParams({ ...requestParams, page, limit: requestParams?.limit || 5 })
  }

  function changePageSize(pageSize) {
    setRequestParams({ ...requestParams, page: 0, limit: pageSize })
    appendParams({ ...requestParams, page: 0, limit: pageSize })
  }

  function handleSorting(name) {
    let selectedFilter
    const filter = columns.map((data) => {
      if (data.connectionName === name) {
        data.sort = data.sort === 1 ? -1 : data.sort === -1 ? 0 : 1
        selectedFilter = data
      } else {
        data.sort = 0
      }
      return data
    })
    setColumns(filter)
    const params = {
      ...requestParams,
      page: 0,
      sort: selectedFilter.sort !== 0 ? selectedFilter.connectionName : '',
      order: selectedFilter.sort === 1 ? 'asc' : selectedFilter.sort === -1 ? 'desc' : '',
    }
    setRequestParams(params)
    appendParams(params)
  }

  return (
    <>
      <Wrapper>
        <PageTitle title="Employee Management" BtnText="Add Employee" handleButtonEvent={gotoAddEmployee} add />
        <div className="w-100 d-flex justify-content-between mt-4">
          <div className="d-flex flex-start ">
            <Select
              className="me-4"
              placeholder={'Department'}
              value={filters['iDepartmentId'] === null ? null : filters['iDepartmentId']}
              width={180}
              options={departmentArray}
              getOptionLabel={(option) => option.sName}
              getOptionValue={(option) => option._id}
              fetchMoreData={lazyLoad.department.next && handleScroll}
              isClearable
              errorDisable
              onChange={(e, options) => handleFilter(e, 'iDepartmentId', options)}
            />
            <Select
              className="me-2"
              placeholder={'Availability '}
              value={
                filters['eAvailabilityStatus'] === null
                  ? null
                  : {
                      label: filters['eAvailabilityStatus']?.label || '',
                      value: filters['eAvailabilityStatus']?.value,
                    }
              }
              width={180}
              options={AvailabilityStatus}
              isClearable
              errorDisable
              onChange={(e, options) => handleFilter(e, 'eAvailabilityStatus', options)}
            />
          </div>
          <div className="d-flex align-items-center">
            <Search
              startIcon={<SearchIcon className="mb-1" />}
              style={{ width: '250px', height: '40px' }}
              placeholder="Search Employee"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
        <Divider width={'155%'} height="1px" />
        <DataTable
          columns={columns}
          align="left"
          totalData={data?.Employees?.length}
          isLoading={isLoading || mutation.isLoading || isFetching}
          handleSorting={(data) => handleSorting(data)}
        >
          {data?.Employees?.map((item, i) => {
            return (
              <tr key={i}>
                <td>{requestParams?.limit * requestParams.page + (i + 1)}</td>
                <td>{item.sName}</td>
                <td>{item.sDepartment?.sName}</td>
                <td>{item.nExperience}</td>
                <td>{item.nAvailabilityHours && item.nAvailabilityHours + ' hrs | ' + item.eAvailabilityStatus} </td>
                <td>{item.project}</td>
                <td>{item.eGrade}</td>
                <ActionColumn
                  view
                  handleView={() => gotoDetail(item._id)}
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
      <CustomModal open={modal.open} handleClose={() => setModal({ open: false })} title="are you sure?">
        <h6>are you sure you want to delete?</h6>
        <div className="d-flex justify-content-between">
          <div></div>
          <div className="mt-5">
            <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={() => setModal({ open: false })}>
              Cancel
            </Button>
            <Button onClick={() => mutation.mutate(modal.id)} loading={mutation.isLoading}>
              Delete
            </Button>
          </div>
        </div>
      </CustomModal>
    </>
  )
}

export default EmployeeManagement
