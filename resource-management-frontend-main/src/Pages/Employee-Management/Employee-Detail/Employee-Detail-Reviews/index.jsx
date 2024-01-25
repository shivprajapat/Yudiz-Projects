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

const EmployeeManagementReviews = () => {
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
        <PageTitle title="All Interviews" />
        <Divider width={'155%'} height="1px" className="mb-1" />
        <DataTable
          columns={columns}
          align="left"
          totalData={data?.Employees?.length}
          isLoading={isLoading || isFetching}
          handleSorting={(data) => handleSorting(data)}
        >
          {data?.Employees?.map((item, i) => {
            return (
              <tr key={i} onClick={() => gotoDetail(item._id)}>
                <td>{cell(requestParams.page + (i + 1))}</td>
                <td>{cell(item.sName)}</td>
                <td>{cell(item.nExperience)}</td>
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

export default EmployeeManagementReviews
