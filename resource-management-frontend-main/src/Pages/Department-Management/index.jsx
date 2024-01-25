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
import Button from 'Components/Button'
import Select from 'Components/Select'
import Search from 'Components/Search'
import Input from 'Components/Input'

//query
import { getDepartmentList, getDepartmentSummery } from 'Query/Department/department.query'
import { addDepartment, deleteDepartment, updateDepartment } from 'Query/Department/department.mutation'
import { useMutation, useQuery, useQueryClient } from 'react-query'


//helper
import { appendParams, cell, ExcelModules, getSortedColumns, handleErrors, isGranted, mapFilter, parseParams, permissionsName, toaster } from 'helpers'


import { ReactComponent as SearchIcon } from 'Assets/Icons/search.svg'
import { downloadCsv } from 'Query/Employee/employee.mutation'
import { Controller, useForm } from 'react-hook-form'
import { Col, Form, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { debounce } from 'Hooks/debounce'
import { route } from 'Routes/route'
import useResourceDetails from 'Hooks/useResourceDetails'

export default function DepartmentManagement() {

  const parsedData = parseParams(location.search)
  const queryClient = useQueryClient()
  const navigate = useNavigate()


  const [modal, setModal] = useState({ open: false, deleteOpen: false })
  const [requestParams, setRequestParams] = useState(getParams())
  const [search, setSearch] = useState(parsedData?.search)
  const [ExcelFields, setExcelFields] = useState([])
  const [columns, setColumns] = useState(
    getSortedColumns(
      [
        { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
        { name: 'Departments', connectionName: 'sName', isSorting: true, sort: 0 },
        { name: 'Total Employee', connectionName: 'nTotal', isSorting: true, sort: 0 }
      ],
      parsedData
    )
  )

  const rules = {
    global: (value = 'This field is Required') => ({ required: value })
  }

  //controler
  const { control, handleSubmit, reset, setError } = useForm()

  const {
    resourceDetail,
    handleScroll,
    handleSearch: handleSearchDetail,
    data: d,
  } = useResourceDetails(['employee', 'department'])

  function getDetail(property) {
    return { ...d[property], data: resourceDetail?.[property] }
  }

  //get department
  const { data, isLoading, isFetching } = useQuery(
    ['departments/', requestParams],
    () => getDepartmentList(requestParams), {
    select: (data) => data.data.data,
    staleTime: 10000,
  })

  //get department by id
  const { data: departmentById, isFetching: fetchGetById } = useQuery({
    queryKey: ['getDeparmentById', modal?.id],
    queryFn: () => getDepartmentSummery(modal?.id),
    enabled: !!modal?.id,
    select: (data) => data?.data?.data,
    onSuccess: (d) => {
      reset({
        sName: d?.department?.sName,
        aHead: d?.department?.aHeadId,
        aDepartment: d?.childDepartment,
        sDescription: d?.department?.sDescription
      })
    }
  })

  //post Department
  const addMutation = useMutation(addDepartment, {
    onSuccess: () => {
      queryClient.invalidateQueries('departments/')
      reset(control)
      setModal({ open: false })
      toaster('Department added successfully')
    },
    onError: (error) => {
      handleErrors(error.response.data.errors, setError)
    }
  })

  //Update Department
  const editMutation = useMutation(updateDepartment, {
    onSuccess: () => {
      queryClient.invalidateQueries('departments/')
      reset(control)
      setModal({ open: false })
      toaster('Department updated successfully')
    },
    onError: (error) => {
      handleErrors(error.response.data.errors, setError)
    }
  })

  //delete Department
  const deleteMutation = useMutation(deleteDepartment, {
    onSuccess: () => {
      queryClient.invalidateQueries('departments/')
      reset(control)
      setModal({ deleteOpen: false })
      toaster('Department deleted successfully')
    },
    onError: (error) => {
      reset(control)
      setModal({ deleteOpen: false })
      handleErrors(error.response.data.errors, setError)
    }
  })

  //modal close
  function handleModalClose() {
    reset(control)
    setModal({ open: false })
  }

  function handleCloseDeleteModal() {
    reset(control)
    setModal({ deleteOpen: false })
  }

  function handleClearDeleteModal() {
    reset(control)
    setModal({ deleteOpen: false })
  }

  //modal data submit
  function modalOnSubmit(e) {
    const { sName, aHead, aDepartment, sDescription } = e
    const data = {
      sName,
      aDepartmentId: aDepartment?.length ? aDepartment.map(item => item._id) : undefined,
      aHeadId: aHead?.length ? aHead.map(item => item?._id) : undefined,
      sDescription: sDescription
    }

    if (modal?.id) {
      editMutation.mutate({
        id: modal?.id,
        data
      })
    }
    else {
      addMutation.mutate(data)
    }
  }

  function onDelete(id) {
    reset(control)
    setModal({ deleteOpen: true, id })
  }

  function gotoDetail(id) {
    navigate(route.departmentManagementDetail(id))
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



  function changePageSize(pageSize) {
    setRequestParams({ ...requestParams, page: 0, limit: pageSize })
    appendParams({ ...requestParams, page: 0, limit: pageSize })
  }

  function getParams() {
    return {
      page: Number(parsedData?.page) * Number(parsedData?.limit) || 0,
      limit: parsedData?.limit === 'all' ? 'all' : (Number(parsedData?.limit) || 10),
      search: parsedData?.search || '',
      sort: parsedData.sort || '',
      order: parsedData.order || '',
    }
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

  function changePage(page) {
    setRequestParams({ ...requestParams, page, limit: requestParams?.limit || 5 })
    appendParams({ ...requestParams, page: page / requestParams?.limit, limit: requestParams?.limit || 5 })
  }

  const ExcelMutation = useMutation(downloadCsv, {
    onSuccess: (data) => {
      toaster(data.data.message)
      setModal({ Excel: false })
    },
  })

  function handleDownloadExcel() {
    ExcelMutation.mutate({
      sModule: 'Department',
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
    setExcelFields(ExcelModules.Department)
  }
  function handleDownloadExcelClose() {
    setModal({ Excel: false })
  }

  const permissions = {
    CREATE: permissionsName.CREATE_DEPARTMENT,
    READ: permissionsName.VIEW_DEPARTMENT,
    UPDATE: permissionsName.UPDATE_DEPARTMENT,
    DELETE: permissionsName.DELETE_DEPARTMENT,
    EXCEL: permissionsName.DOWNLOAD_DEPARTMENT_EXCEL,
    get ALL() {
      return [this.READ, this.UPDATE, this.DELETE]
    },
  }




  return (
    <>
      <Wrapper>
        <PageTitle
          title="Department Management"
          BtnText={isGranted(permissions.CREATE) ? 'Add New Department' : null}
          handleExcelEvent={isGranted(permissions.EXCEL) ? handleDownloadExcelOpen : null}
          handleButtonEvent={() => setModal({ open: true })}
          add
        />
        <div className="w-100 d-flex justify-content-between align-items-center mt-3">
          <div className="d-flex flex-end">
            <Search
              startIcon={<SearchIcon className="mb-1" />}
              style={{ width: '250px', height: '40px' }}
              placeholder="Search Departments"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
        <Divider />
        <DataTable
          columns={columns}
          align="left"
          disableActions={!isGranted(permissions.ALL)}
          totalData={data?.departments?.length}
          isLoading={isLoading || isFetching}
          handleSorting={(data) => handleSorting(data)}
          actionPadding="25px"
        >
          {data?.departments?.map((item, i) => {
            return (
              <tr key={i}>
                <td>{cell(requestParams.page + (i + 1))}</td>
                <td>{cell(item.sName)}</td>
                <td>{(item.nTotal)}</td>
                <ActionColumn
                  permissions={permissions}
                  handleView={() => gotoDetail(item._id)}
                  handleEdit={() => setModal({ open: true, id: item._id, data: item })}
                  handleDelete={() => onDelete(item._id)}
                />
              </tr>
            )
          })}
        </DataTable>
      </Wrapper>
      <Wrapper
        className={'py-2'}
      >
        <TablePagination
          currentPage={requestParams?.page || 0}
          totalCount={data?.count || 0}
          pageSize={requestParams?.limit || 10}
          onPageChange={(page) => changePage(page)}
          onLimitChange={(limit) => changePageSize(limit)}
        />
      </Wrapper>

      <ConfirmationModal
        open={modal.deleteOpen}
        title='are you sure'
        handleClose={handleCloseDeleteModal}
        handleCancel={handleClearDeleteModal}
        handleConfirm={() => deleteMutation.mutate(modal.id)}
      >
        <h6>Are you sure you want to delete?</h6>
      </ConfirmationModal>


      <CustomModal
        open={modal.open}
        handleClose={handleModalClose}
        size='md'
        title={modal?.id ? "Edit Department" : "Add New Department"}
        isLoading={addMutation?.isLoading || editMutation?.isLoading || fetchGetById}>

        <div className=' w-100'>

          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Controller
                name="sName"
                control={control}
                rules={rules.global()}
                render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                  <Input
                    onChange={onChange}
                    value={value || ''}
                    ref={ref}
                    labelText={'Departmant Name*'}
                    placeholder={'Enter departmant name'}
                    id={'sName'}
                    errorMessage={error?.message}
                    disabled={modal?.data?.bIsSystem}
                  />
                )}
              />
            </Col>
          </Row>

          <Row>
            <Col xs={12} sm={12} md={12} lg={12} className='mt-2'>
              <Controller
                name='aHead'
                control={control}
                render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                  <Select
                    labelText="Heads of department"
                    placeholder="Select heads of department"
                    id='aHead'
                    ref={ref}
                    value={value}
                    onChange={onChange}
                    getOptionLabel={(option) => option?.sName}
                    getOptionValue={(option) => option?._id}
                    options={getDetail('employee')?.data}
                    isLoading={getDetail('employee')?.isLoading}
                    fetchMoreData={() => handleScroll('employee')}
                    onInputChange={(s) => handleSearchDetail('employee', s)}
                    errorMessage={error?.message}
                    isMulti
                  />
                )}
              />
            </Col>
          </Row>

          <Row>
            <Col xs={12} sm={12} md={12} lg={12} className='mt-3'>
              <Controller
                name='aDepartment'
                control={control}
                render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                  <Select
                    labelText="Sub departments"
                    placeholder="Select sub departments"
                    id='aDepartment'
                    ref={ref}
                    value={value}
                    onChange={onChange}
                    getOptionLabel={(option) => option?.sName}
                    getOptionValue={(option) => option?._id}
                    options={getDetail('department')?.data?.filter((element) => element._id !== departmentById?.department?._id )}
                    isLoading={getDetail('department')?.isLoading}
                    fetchMoreData={() => handleScroll('department')}
                    onInputChange={(s) => handleSearchDetail('department', s)}
                    errorMessage={error?.message}
                    isMulti
                  />
                )}
              />
            </Col>
          </Row>

          <Row>
            <Col xs={12} sm={12} md={12} lg={12} className='mt-3'>
              <Form.Label>Description</Form.Label>
              <Controller
                name='sDescription'
                control={control}
                render={({ field: { onChange, value, ref } }) => (
                  <Form.Control
                    as="textarea"
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    maxLength={500}
                    placeholder="Enter description"
                    className="p-2 text-dark mt-1"
                  />
                )}
              />
            </Col>
          </Row>
          <div className="mt-5 d-flex justify-content-end" >
            <Button onClick={handleSubmit(modalOnSubmit)}>
              {modal?.id ? "Update" : "Add"}
            </Button>
          </div>
        </div>

      </CustomModal >

      <CustomModal modalBodyClassName="p-0 py-2" open={modal.Excel} handleClose={handleDownloadExcelClose} title="Download Excel">
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
            <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={handleDownloadExcelClose}>
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
