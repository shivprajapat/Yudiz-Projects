import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { getEmployeeList } from 'Query/Employee/employee.query'
import Wrapper from 'Components/wrapper'
import PageTitle from 'Components/Page-Title'
import TablePagination from 'Components/Table-pagination'
import Divider from 'Components/Divider'
import DataTable from 'Components/DataTable'
import { appendParams, cell, getSortedColumns, parseParams } from 'helpers'

const EmployeeManagementProjects = () => {
  const parsedData = parseParams(location.search)

  function getParams() {
    return {
      page: Number(parsedData?.page) * Number(parsedData?.limit) || 0,
      limit: Number(parsedData?.limit) || 10,
      search: parsedData?.search || '',
      sort: parsedData.sort || '',
      order: parsedData.order || '',
    }
  }
  const [requestParams, setRequestParams] = useState(getParams())

  const { isLoading, isFetching, data } = useQuery(
    ['employee' + requestParams?.sort + requestParams?.order + requestParams?.page + requestParams?.limit, requestParams],
    () => getEmployeeList(requestParams),
    {
      select: (data) => data.data.data,
      staleTime: 10000,
    }
  )

  const [columns, setColumns] = useState(
    getSortedColumns(
      [
        { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
        { name: 'Project Name', connectionName: 'sName', isSorting: true, sort: 0 },
        { name: 'Client Name', connectionName: 'sClientName', isSorting: true, sort: 0 },
        { name: 'Completion Date', connectionName: 'nEndDate', isSorting: true, sort: 0 },
        { name: 'Technology', connectionName: 'technology', isSorting: false, sort: 0 },
        { name: 'Project Tag', connectionName: 'projecttag', isSorting: false, sort: 0 },
      ],
      parsedData
    )
  )

  const navigate = useNavigate()

  function gotoDetail(id) {
    navigate('/employee-management/detail/' + id)
  }

  function changePage(page) {
    setRequestParams({ ...requestParams, page, limit: requestParams?.limit || 5 })
    appendParams({ ...requestParams, page: page / requestParams?.limit, limit: requestParams?.limit || 5 })
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
        <PageTitle title="All Projects" />
        <Divider height="1px" className="mt-2" />
        <DataTable
          columns={columns}
          align="left"
          totalData={data?.Employees?.length}
          isLoading={isLoading || isFetching}
          handleSorting={(data) => handleSorting(data)}
          disableActions
        >
          {data?.Employees?.map((item, i) => {
            return (
              <tr key={i} className="cursor-pointer" onClick={() => gotoDetail(item._id)}>
                <td>{cell(requestParams.page + (i + 1))}</td>
                <td>{cell(item.sName)}</td>
                <td>{cell(item.nExperience)}</td>
                <td>{cell(item.eGrade)}</td>
                <td>{cell(item.eGrade)}</td>
                <td>{cell(item.eGrade)}</td>
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
    </>
  )
}

export default EmployeeManagementProjects
