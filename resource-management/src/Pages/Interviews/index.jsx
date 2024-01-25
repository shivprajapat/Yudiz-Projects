import DataTable from 'Components/DataTable'
import React, { useState } from 'react'
import { useMutation, useQueries, useQuery, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { ReactComponent as SearchIcon } from 'Assets/Icons/search.svg'

import PageTitle from 'Components/Page-Title'
import Wrapper from 'Components/wrapper'
import TablePagination from 'Components/Table-pagination'

import CustomModal from 'Components/Modal'
import Select from 'Components/Select'

import Divider from 'Components/Divider'
import { appendParams, formatDate, getSortedColumns, interviewStatus, parseParams, toaster } from 'helpers/helper'
import Button from 'Components/Button'
import Search from 'Components/Search'
import { getInterviewList, TechnologyList } from 'Query/Interview/interviews.query'
import ActionColumn from 'Components/ActionColumn'
import { deleteInterview } from 'Query/Interview/interview.mutation'

const InterViews = () => {
  const queryClient = useQueryClient()
  const parsedData = parseParams(location.search)
  const AvailabilityStatus = [{ sName: 'Interviewing' }, { sName: 'Not Selected' }, { sName: 'Selected' }, { sName: 'Profile Shared' }]

  const [data, setData] = useState([])
  const [modal, setModal] = useState({ open: false })
  const [search, setSearch] = useState(parsedData?.search)
  const [filters, setFilters] = useState({
    Technology: parsedData['Technology'] ? { _id: parsedData['Technology'], sName: parsedData['Technology']?.replace('+', ' ') } : null,
    eInterviewStatus: parsedData['eInterviewStatus'] ? { sName: parsedData['eInterviewStatus']?.replace('+', ' ') } : null,
  })

  function getParams() {
    return {
      page: Number(parsedData?.page) || 0,
      limit: Number(parsedData?.limit) || 5,
      search: parsedData?.search || '',
      sort: parsedData.sort || '',
      order: parsedData.order || '',
      Technology: parsedData['Technology'] || '',
      eInterviewStatus: parsedData['eInterviewStatus']?.replace('+', ' ') || '',
    }
  }
  const [requestParams, setRequestParams] = useState(getParams())

  const { isLoading, isFetching } = useQuery(
    [
      'interviews' +
        requestParams?.sort +
        requestParams?.order +
        requestParams?.page +
        requestParams?.limit +
        requestParams?.search +
        requestParams.Technology +
        requestParams.eInterviewStatus,
      requestParams,
    ],
    () => getInterviewList(requestParams),
    {
      onSuccess: (data) => {
        setData(data.data?.data)
      },
    }
  )

  const mutation = useMutation(deleteInterview, {
    onSuccess: (data) => {
      toaster(data.data.message)

      queryClient.invalidateQueries(
        'interviews' +
          requestParams?.sort +
          requestParams?.order +
          requestParams?.page +
          requestParams?.limit +
          requestParams?.search +
          requestParams.Technology +
          requestParams.eInterviewStatus
      )
      setModal({ open: false })
    },
  })

  const filterValues = useQueries([
    { queryKey: 'empTechnologies', queryFn: TechnologyList },
    { queryKey: 'empSkill', queryFn: () => {} },
  ])

  const technologyArray = filterValues[0]?.data?.data?.data?.result

  const [columns, setColumns] = useState(
    getSortedColumns(
      [
        { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
        { name: 'Employee Name', connectionName: 'sEmpName', isSorting: true, sort: 0 },
        { name: 'Client Name', connectionName: 'sClientName', isSorting: true, sort: 0 },
        { name: 'Interview Status', connectionName: 'eInterviewStatus', isSorting: true, sort: 0 },
        { name: 'Date', connectionName: 'dInterviewDate', isSorting: true, sort: 0 },
        { name: 'Technology', connectionName: 'sTechnology', isSorting: false, sort: 0 },
        { name: 'Project ', connectionName: 'sProjectName', isSorting: true, sort: 0 },
      ],
      parsedData
    )
  )

  const navigate = useNavigate()

  function gotoAddEmployee() {
    navigate('/interviews/add')
  }

  function gotoEdit(id) {
    navigate('/interviews/edit/' + id)
  }

  function gotoDetail(id) {
    navigate('/interviews/detail/' + id)
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
    } else {
      setFilters({ ...filters, [fName]: e })
      setRequestParams({ ...requestParams, page: 0, [fName]: e?.sName })
      appendParams({ ...requestParams, page: 0, [fName]: e?.sName })
    }
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
        <PageTitle title="Interview List" BtnText="Create Interview" handleButtonEvent={gotoAddEmployee} add />
        <div className="w-100 d-flex justify-content-between mt-4">
          <div className="d-flex flex-start ">
            <Select
              className="me-4"
              placeholder={'Technology'}
              value={filters['Technology'] === null ? null : filters['Technology']}
              options={technologyArray}
              getOptionLabel={(option) => option.sName}
              getOptionValue={(option) => option._id}
              isClearable
              errorDisable
              onChange={(e, options) => handleFilter(e, 'Technology', options)}
            />
            <Select
              className="me-2"
              placeholder={'Status '}
              value={filters['eInterviewStatus'] === null ? null : filters['eInterviewStatus']}
              options={AvailabilityStatus}
              getOptionLabel={(option) => option.sName}
              getOptionValue={(option) => option.sName}
              isClearable
              errorDisable
              onChange={(e, options) => handleFilter(e, 'eInterviewStatus', options)}
            />
          </div>
          <div className="d-flex align-items-center">
            <Search
              startIcon={<SearchIcon className="mb-1" />}
              style={{ width: '250px', height: '40px' }}
              placeholder="Search"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
        <Divider width={'155%'} height="1px" />
        <DataTable
          columns={columns}
          align="left"
          totalData={data?.interviews?.length}
          isLoading={isLoading || mutation.isLoading || isFetching}
          handleSorting={(data) => handleSorting(data)}
        >
          {data?.interviews?.map((item, i) => {
            return (
              <tr key={i}>
                <td>{requestParams?.limit * requestParams.page + (i + 1)}</td>
                <td>{item.sEmpName}</td>
                <td>{item.sClientName}</td>
                <td>
                  <span className={interviewStatus(item?.eInterviewStatus)}>{item?.eInterviewStatus}</span>
                </td>
                <td>{formatDate(item.dInterviewDate)}</td>
                <td>{String(item.aTechnologyName)}</td>

                <td>{item.sProjectName}</td>
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

export default InterViews
