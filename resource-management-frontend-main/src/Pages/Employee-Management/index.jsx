import React, { useCallback, useState } from 'react'

//component
import ConfirmationModal from 'Components/ConfirmationModal'
import TablePagination from 'Components/Table-pagination'
import ActionColumn from 'Components/ActionColumn'
import PageTitle from 'Components/Page-Title'
import DataTable from 'Components/DataTable'
import CustomModal from 'Components/Modal'
import Divider from 'Components/Divider'
import Wrapper from 'Components/wrapper'
import Select from 'Components/Select'
import Button from 'Components/Button'
import Search from 'Components/Search'

//query
import { deleteEmployee, downloadCsv } from 'Query/Employee/employee.mutation'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getEmployeeList } from 'Query/Employee/employee.query'

//hooks
import useResourceDetails from 'Hooks/useResourceDetails'
import { debounce } from 'Hooks/debounce'

//helper
import { appendParams, cell, employeeManagementAvailabilityStatus, ExcelModules, getSortedColumns, isGranted, mapFilter, parseParams, permissionsName, toaster } from 'helpers'

import { ReactComponent as SearchIcon } from 'Assets/Icons/search.svg'
import { useNavigate } from 'react-router-dom'
import { Form } from 'react-bootstrap'
import './_employeeManagement.scss'

const EmployeeManagement = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const parsedData = parseParams(location.search)

  const AvailabilityStatus = [
    { sName: 'Available', _id: 'Available' },
    { sName: 'Not Available', _id: 'Not Available' },
    { sName: 'Partially Available', _id: 'Partially Available' },
  ]

  const [modal, setModal] = useState({ open: false })
  const [ExcelFields, setExcelFields] = useState([])
  const [requestParams, setRequestParams] = useState(getParams())
  const [search, setSearch] = useState(parsedData?.search)
  const [filters, setFilters] = useState({
    iDepartmentId: parsedData['iDepartmentId'] ? { _id: parsedData['iDepartmentId'], sName: parsedData['iDepartmentIdLabel'] } : null,
    eAvailabilityStatus: parsedData['eAvailabilityStatus'] ? { sName: parsedData['eAvailabilityStatus'], _id: parsedData['eAvailabilityStatus'] } : null,
  })
  const [columns, setColumns] = useState(
    getSortedColumns(
      [
        { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
        { name: 'Employee Name', connectionName: 'sName', isSorting: true, sort: 0 },
        { name: 'Email', connectionName: 'sEmail', isSorting: true, sort: 0 },
        { name: 'Department', connectionName: 'sDepartment', isSorting: true, sort: 0 },
        { name: 'Expe.', connectionName: 'nExperience', isSorting: true, sort: 0, align: 'center' },
        { name: 'Availablity Hours', connectionName: 'nAvailabilityHours', isSorting: true, sort: 0 },
        { name: 'Grade', connectionName: 'eGrade', isSorting: true, sort: 0 },
      ],
      parsedData
    )
  )

  const { resourceDetail, handleScroll, handleSearch: handleSearchDetail, data: d } = useResourceDetails(['department'])

  // get employees
  const { isLoading, isFetching, data } = useQuery(['employee', requestParams], () => getEmployeeList(requestParams), {
    select: (data) => data.data.data,
    staleTime: 10000,
  })

  //delete employee
  const mutation = useMutation(deleteEmployee, {
    onSuccess: (data) => {
      toaster(data.data.message)
      queryClient.invalidateQueries('employee')
      setModal({ open: false })
    },
    onError: () => {
      setModal({ open: false })
    }
  })

  // add excel data(download)
  const ExcelMutation = useMutation(downloadCsv, {
    onSuccess: (data) => {
      toaster(data.data.message)
      setModal({ Excel: false })
    },
  })



  function getDetail(property) {
    return { ...d[property], data: resourceDetail?.[property] }
  }

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

  const debouncedSearch = useCallback(
    debounce((trimmed, params) => {
      setRequestParams({ ...params, page: 0, search: trimmed })
      appendParams({ ...params, page: 0, search: trimmed })
    }),
    []
  )

  function handleSearch(e) {
    e.preventDefault()
    setSearch(e.target.value)
    const trimmed = e.target.value.trim()
    debouncedSearch(trimmed, requestParams)
  }

  function handleFilter(e, fName, opt) {
    if (opt.action === 'clear') {
      setFilters((f) => ({ ...f, [fName]: null }))
      setRequestParams({ ...requestParams, page: 0, [fName]: null, [fName + 'Label']: '' })
      appendParams({ ...requestParams, page: 0, [fName]: null, [fName + 'Label']: '' })
    } else {
      setFilters((f) => ({ ...f, [fName]: e }))
      setRequestParams({ ...requestParams, page: 0, [fName]: e._id, [fName + 'Label']: e.sName })
      appendParams({ ...requestParams, page: 0, [fName]: e._id, [fName + 'Label']: e.sName })
    }
  }

  function changePage(page) {
    setRequestParams({ ...requestParams, page, limit: requestParams?.limit || 10 })
    appendParams({ ...requestParams, page: page / requestParams?.limit, limit: requestParams?.limit || 10 })
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

  function round(hour, status) {
    return (
      <div className='d-flex'>
        <div className='status-dot' style={{ background: employeeManagementAvailabilityStatus(status), marginTop: '6px' }}></div>
        <div style={{ marginLeft: '10px' }}>{hour && hour + ' hr'} </div>
      </div>
    )
  }

  function checkAvailabilityHours(hour, status) {
    return hour && status ? round(hour, status) : hour ? hour + ' hr' : status ? round(hour, status) : '-'
  }


  function handleDownloadExcel() {
    ExcelMutation.mutate({
      sModule: 'Employee',
      requiredFields: mapFilter(
        ExcelFields,
        (f) => f.value,
        (f) => f.isSelected
      ),
      query: mapFilter(requestParams, null, (data) => data !== ''),
    })
  }

  function handleDownloadExcelOpen() {
    setModal({ Excel: true })
    setExcelFields(ExcelModules.Employee)
  }
  const permissions = {
    CREATE: permissionsName.CREATE_EMPLOYEE,
    READ: permissionsName.VIEW_EMPLOYEE,
    UPDATE: permissionsName.UPDATE_EMPLOYEE,
    DELETE: permissionsName.DELETE_EMPLOYEE,
    EXCEL: permissionsName.DOWNLOAD_EMPLOYEE_EXCEL,
    get ALL() {
      return [this.READ, this.UPDATE, this.DELETE]
    },
  }

  function getParams() {
    return {
      page: Number(parsedData?.page) * Number(parsedData?.limit) || 0,
      limit: parsedData?.limit === 'all' ? 'all' : (Number(parsedData?.limit) || 10),
      search: parsedData?.search || '',
      sort: parsedData.sort || '',
      order: parsedData.order || '',
      iDepartmentId: parsedData['iDepartmentId'] || '',
      iDepartmentIdLabel: parsedData['iDepartmentIdLabel'] || '',
      eAvailabilityStatus: parsedData['eAvailabilityStatus'] || '',
      eAvailabilityStatusLabel: parsedData['eAvailabilityStatusLabel'] || '',
    }
  }

  return (
    <>
      <Wrapper>
        <PageTitle
          title="Employee Management"
          BtnText={isGranted(permissions.CREATE) ? 'Add Employee' : null}
          handleExcelEvent={isGranted(permissions.EXCEL) ? handleDownloadExcelOpen : null}
          handleButtonEvent={gotoAddEmployee}
          add
        />
        <div className="w-100 d-flex justify-content-between flex-wrap gap-2 mt-4">
          <div className="d-flex flex-start flex-wrap gap-2">
            <Select
              placeholder={'Department'}
              value={filters['iDepartmentId']}
              tooltip={(v) => v?.sName}
              options={getDetail('department')?.data}
              isLoading={getDetail('department')?.isLoading}
              getOptionLabel={(option) => option.sName}
              getOptionValue={(option) => option._id}
              fetchMoreData={() => handleScroll('department')}
              onInputChange={(s) => handleSearchDetail('department', s)}
              isClearable
              errorDisable
              onChange={(e, options) => handleFilter(e, 'iDepartmentId', options)}
            />
            <Select
              placeholder={'Availability '}
              value={filters['eAvailabilityStatus']}
              tooltip={(v) => v?.sName}
              getOptionLabel={(option) => option.sName}
              getOptionValue={(option) => option._id}
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
          handleSorting={handleSorting}
          disableActions={!isGranted(permissions.ALL)}
        >
          {data?.Employees?.map((item, i) => {
            return (
              <tr key={i}>
                <td>{cell(requestParams.page + (i + 1))}</td>
                <td>{cell(item.sName)}</td>
                <td>{cell(item.sEmail)}</td>
                <td>{cell(item.sDepartment?.sName)}</td>
                <td>{cell(item.nExperience)}</td>
                <td>{checkAvailabilityHours(item.nAvailabilityHours, item.eAvailabilityStatus)} </td>
                <td>{cell(item.eGrade)}</td>
                <ActionColumn
                  permissions={permissions}
                  handleView={() => gotoDetail(item._id)}
                  handleEdit={() => gotoEdit(item._id)}
                  handleDelete={() => onDelete(item._id)}
                />
              </tr>
            )
          })}
        </DataTable>
      </Wrapper>

      <Wrapper className="p-2">
        <div className="d-flex flex-wrap">
          <div className="d-flex align-items-center my-2 me-3">
            <div className="status-dot mx-2" style={{ backgroundColor: employeeManagementAvailabilityStatus('Available') }}></div>
            Available
          </div>
          <div className="d-flex align-items-center my-2 me-3">
            <div className="status-dot mx-2" style={{ backgroundColor: employeeManagementAvailabilityStatus('Not Available') }}></div>
            Not Available
          </div>
          <div className="d-flex align-items-center my-2 me-3">
            <div className="status-dot mx-2" style={{ backgroundColor: employeeManagementAvailabilityStatus('Partially Available') }}></div>
            Partially Available
          </div>
        </div>
      </Wrapper>

      <Wrapper
        className={'py-2'}
      >
        <TablePagination
          currentPage={Number(requestParams?.page)}
          totalCount={data?.count || 0}
          pageSize={requestParams?.limit || 10}
          onPageChange={(page) => changePage(page)}
          onLimitChange={(limit) => changePageSize(limit)}
        />
      </Wrapper>

      <ConfirmationModal
        open={modal.open}
        title='Are you Sure?'
        handleClose={() => setModal({ open: false })}
        handleCancel={() => setModal({ open: false })}
        handleConfirm={() => mutation.mutate(modal.id)}
      >
        <h6>Are you sure you want to delete?</h6>
      </ConfirmationModal>

      <CustomModal modalBodyClassName="p-0 py-2" open={modal.Excel} handleClose={() => setModal({ Excel: false })} title="Download Excel">
        <DataTable
          columns={[
            { name: 'Fields', connectionName: 'sName' },
            { name: ' ', connectionName: '' },
          ]}
          disableActions
          totalData={ExcelFields.length}
        >
          {ExcelFields.map((field, i) => (
            <tr key={i}>
              <td>{field?.label}</td>
              <td>
                <Form.Check
                  className="form-check"
                  onChange={({ target }) => {
                    setExcelFields((fields) =>
                      fields.map((field, fIndex) => (i === fIndex ? { ...field, isSelected: target.checked } : field))
                    )
                  }}
                  checked={field.isSelected}
                />
              </td>
            </tr>
          ))}
        </DataTable>
        <div className="d-flex justify-content-between">
          <div></div>
          <div className="mt-4">
            <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={() => setModal({ Excel: false })}>
              Cancel
            </Button>
            <Button onClick={handleDownloadExcel} loading={ExcelMutation.isLoading}>
              Send
            </Button>
          </div>
        </div>
      </CustomModal>
    </>
  )
}

export default EmployeeManagement

