import React, { useState } from 'react'

//component
import PageTitle from 'Components/Page-Title'
import Wrapper from 'Components/wrapper'

//query
import { getDepartmentSummery, getDepartmentSummeryEmployee } from 'Query/Department/department.query'
import { useQuery } from 'react-query'


import { useParams, useNavigate } from 'react-router-dom'
import { Col, Row } from 'react-bootstrap'
import './department-details.scss'
import DataTable from 'Components/DataTable'
import { cell, parseParams, appendParams, toaster } from 'helpers'
import TablePagination from 'Components/Table-pagination'

function DepartmentManagementDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const parsedData = parseParams(location.search)

  const [requestParams, setRequestParams] = useState(getParams())

  //department summary
  const { data: departmentSummery } = useQuery({
    queryKey: ['departmentsummery', id],
    queryFn: () => getDepartmentSummery(id),
    select: (data) => data?.data?.data
  })

  //Department Summery Employee
  const { data: departmentSummeryEmployee, isLoading: isDepartmentEmployeeLoading } = useQuery({
    queryKey: ['departmentsummeryemployee', id, requestParams],
    queryFn: () => getDepartmentSummeryEmployee(id, requestParams),
    select: (data) => data?.data?.data
  })

  function getParams() {
    return {
      page: Number(parsedData?.page) * Number(parsedData?.limit) || 0,
      limit: Number(parsedData?.limit) || 5,
      search: parsedData?.search || '',
      sort: parsedData.sort || '',
      order: parsedData.order || '',
    }
  }

  function navigateToSubDepartment(item) {
    navigate(`/department-management/detail/${item?._id}`)
    toaster(`Now you are navigated to Sub Department "${item?.sName}"`)
  }

  function changePage(page) {
    setRequestParams({ ...requestParams, page, limit: requestParams?.limit || 10 })
    appendParams({ ...requestParams, page: page / requestParams?.limit, limit: requestParams?.limit || 10 })
  }

  function changePageSize(pageSize) {
    setRequestParams({ ...requestParams, page: 0, limit: pageSize })
    appendParams({ ...requestParams, page: 0, limit: pageSize })
  }

  return (
    <>
      <Wrapper className="mx-5">
        <PageTitle title='Department Summary' />
        <div className="w-100 m-4 d-flex">
          <div>{`Department Name : ${departmentSummery?.department?.sName || ''}`}</div>
        </div>
        <div className="w-100 m-4 d-flex">
          <div>{`Total Employees : ${departmentSummery?.department?.nTotal || 0}`}</div>
        </div>
        <div className="w-100 m-4">
          <h5 className="page-title">Description</h5>
          <p className="mt-4 description">{departmentSummery?.department?.sDescription || 'Not yet added description'}</p>
        </div>
      </Wrapper>

      <Row className="m-3">
        <Col xs={12} sm={12} md={12} lg={6}>
          <Wrapper>
            <h5 className="page-title">Head Of The Department</h5>
            {departmentSummery?.department?.aHeadId?.length ? (
              <ul className="list-items mt-4">
                {departmentSummery?.department?.aHeadId?.map((item, index) => {
                  return (
                    <li key={index} onClick={() => navigate(`/employee-management/detail/${item?._id}`)}>
                      {item?.sName}
                    </li>
                  )
                })}
              </ul>
            ) : (
              <div className="mt-4">Department head not assigned yet</div>
            )}
          </Wrapper>
        </Col>

        <Col xs={12} sm={12} md={12} lg={6}>
          <Wrapper>
            <h5 className="page-title">Sub Department (Employee Count)</h5>
            {departmentSummery?.childDepartment?.length ? (
              <ul className="list-items mt-4">
                {departmentSummery?.childDepartment?.map((item, index) => {
                  return (
                    <li key={index} onClick={() => navigateToSubDepartment(item)}>{`${item?.sName}  (${item?.nTotal || 0
                      })`}</li>
                  )
                })}
              </ul>
            ) : (
              <div className="mt-4">Sub Department not assigned yet</div>
            )}
          </Wrapper>
        </Col>
      </Row>
      <Wrapper>
        <h5 className="page-title">Employees</h5>
        <DataTable
          columns={[
            { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
            { name: 'Employee Name', connectionName: 'sName', isSorting: true, sort: 0 },
            { name: 'Job Profile', connectionName: 'sJobProfile.sName', isSorting: true, sort: 0 },
            { name: 'Department', connectionName: 'sDepartment.sName', isSorting: true, sort: 0 },
            { name: 'Branch', connectionName: 'branch.sName', isSorting: true, sort: 0 },
          ]}
          align="left"
          totalData={departmentSummeryEmployee?.Employees?.length}
          isLoading={isDepartmentEmployeeLoading}
          disableActions={true}
        >
          {departmentSummeryEmployee?.Employees?.map((item, i) => {
            return (
              <tr key={i}>
                <td>{cell(requestParams.page + (i + 1))}</td>
                <td>{cell(item.sName)}</td>
                <td>
                  {cell(
                    item?.sJobProfile?.sPrefix ? item?.sJobProfile?.sPrefix + ' ' + item?.sJobProfile?.sName : item?.sJobProfile?.sName
                  )}
                </td>
                <td>{cell(item.sDepartment?.sName)}</td>
                <td>{cell(item.branch?.sName)}</td>
              </tr>
            )
          })}
        </DataTable>
      </Wrapper>
      <Wrapper transparent>
        <TablePagination
          currentPage={Number(requestParams?.page)}
          totalCount={departmentSummeryEmployee?.count || 0}
          pageSize={requestParams?.limit || 5}
          onPageChange={(page) => changePage(page)}
          onLimitChange={(limit) => changePageSize(limit)}
        />
      </Wrapper>
    </>
  )
}

export default DepartmentManagementDetail