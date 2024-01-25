import React, { useCallback, useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { Form } from 'react-bootstrap'
import { getCrList } from 'Query/CR/cr.query'
import { deleteCr } from 'Query/CR/cr.mutation'
import { downloadCsv } from 'Query/Employee/employee.mutation'
import Wrapper from 'Components/wrapper'
import PageTitle from 'Components/Page-Title'
import TablePagination from 'Components/Table-pagination'
import CustomModal from 'Components/Modal'
import Select from 'Components/Select'
import Divider from 'Components/Divider'
import Button from 'Components/Button'
import DataTable from 'Components/DataTable'
import Search from 'Components/Search'
import ActionColumn from 'Components/ActionColumn'
import useResourceDetails from 'Hooks/useResourceDetails'
import { debounce } from 'Hooks/debounce'
import { ReactComponent as SearchIcon } from 'Assets/Icons/search.svg'
import { appendParams, cell, ExcelModules, getSortedColumns, isGranted, mapFilter, parseParams, permissionsName, toaster } from 'helpers'

export default function ChangeRequest() {
  const queryClient = useQueryClient()
  const parsedData = parseParams(location.search)
  const [ExcelFields, setExcelFields] = useState([])
  const [modal, setModal] = useState({ open: false })
  const [search, setSearch] = useState(parsedData?.search)
  const [filters, setFilters] = useState({
    iProjectId: parsedData['iProjectId'] ? { _id: parsedData['iProjectId'], sName: parsedData['iProjectIdLabel'] } : null,
  })

  function getParams() {
    return {
      page: Number(parsedData?.page) * Number(parsedData?.limit) || 0,
      limit: parsedData?.limit === 'all' ? 'all' : (Number(parsedData?.limit) || 10),
      search: parsedData?.search || '',
      sort: parsedData.sort || '',
      order: parsedData.order || '',
      iDepartmentId: parsedData['iDepartmentId'] || '',
      eAvailabilityStatus: parsedData['eAvailabilityStatus'] || '',
    }
  }
  const [requestParams, setRequestParams] = useState(getParams())

  const { isLoading, isFetching, data } = useQuery(['cr', requestParams], () => getCrList(requestParams), {
    select: (data) => data.data.data,
    staleTime: 10000,
  })

  const mutation = useMutation(deleteCr, {
    onSuccess: (data) => {
      toaster(data.data.message)
      queryClient.invalidateQueries('cr')
      queryClient.invalidateQueries('employee')
      setModal({ open: false })
    },
  })

  const { resourceDetail, handleScroll, handleSearch: handleSearchDetail, data: d } = useResourceDetails(['FixedProjects'])

  function getDetail(property) {
    return { ...d[property], data: resourceDetail?.[property] }
  }

  const [columns, setColumns] = useState(
    getSortedColumns(
      [
        { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
        { name: 'CR', connectionName: 'sName', isSorting: true, sort: 0 },
        { name: 'Project', connectionName: 'sProjectName', isSorting: true, sort: 0 },
        { name: 'Timeline', connectionName: 'nTimeLineDays', isSorting: true, sort: 0 },
        { name: 'status', connectionName: 'eProjectStatus', isSorting: true, sort: 0 },
      ],
      parsedData
    )
  )

  const navigate = useNavigate()

  function gotoAddCR() {
    navigate('/change-request/add')
  }

  function gotoEdit(id) {
    navigate('/change-request/edit/' + id)
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
      setFilters({ ...filters, [fName]: null })
      setRequestParams({ ...requestParams, page: 0, [fName]: '', [fName + 'Label']: '' })
      appendParams({ ...requestParams, page: 0, [fName]: '', [fName + 'Label']: '' })
    } else {
      setFilters({ ...filters, [fName]: e })
      setRequestParams({ ...requestParams, page: 0, [fName]: e?._id, [fName + 'Label']: e?.sName })
      appendParams({ ...requestParams, page: 0, [fName]: e?._id, [fName + 'Label']: e?.sName })
    }
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

  const ExcelMutation = useMutation(downloadCsv, {
    onSuccess: (data) => {
      toaster(data.data.message)
      setModal({ Excel: false })
    },
  })

  function handleDownloadExcel() {
    ExcelMutation.mutate({
      sModule: 'ChangeRequest',
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
    setExcelFields(ExcelModules.ChangeRequest)
  }
  function handleDownloadExcelClose() {
    setModal({ Excel: false })
  }

  useEffect(() => {
    queryClient.invalidateQueries('cr')
  }, [])

  const permissions = {
    CREATE: permissionsName.CREATE_CHANGE_REQUEST,
    READ: permissionsName.VIEW_CHANGE_REQUEST,
    UPDATE: permissionsName.UPDATE_CHANGE_REQUEST,
    DELETE: permissionsName.DELETE_CHANGE_REQUEST,
    EXCEL: permissionsName.DOWNLOAD_CHANGE_REQUEST_EXCEL,
    get ALL() {
      return [this.READ, this.UPDATE, this.DELETE]
    },
  }

  return (
    <>
      <Wrapper>
        <PageTitle
          title="Change Request"
          BtnText={isGranted(permissions.CREATE) ? 'Add Change Request' : null}
          handleExcelEvent={isGranted(permissions.EXCEL) ? handleDownloadExcelOpen : null}
          handleButtonEvent={gotoAddCR}
          add
        />
        <div className="w-100 d-flex justify-content-between mt-4">
          <div className="d-flex flex-start ">
            <Select
              placeholder="Project"
              value={filters['iProjectId']}
              tooltip={(v) => v?.sName}
              width={180}
              options={getDetail('FixedProjects')?.data}
              isLoading={getDetail('FixedProjects')?.isLoading}
              getOptionLabel={(option) => option.sName}
              getOptionValue={(option) => option._id}
              fetchMoreData={() => handleScroll('FixedProjects')}
              onInputChange={(s) => handleSearchDetail('FixedProjects', s)}
              isClearable
              errorDisable
              onChange={(e, options) => handleFilter(e, 'iProjectId', options)}
            />
          </div>
          <div className="d-flex align-items-center">
            <Search
              startIcon={<SearchIcon className="mb-1" />}
              style={{ width: '250px', height: '40px' }}
              placeholder="Search CR"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
        <Divider width={'155%'} height="1px" />
        <DataTable
          columns={columns}
          align="left"
          totalData={data?.crs?.length}
          isLoading={isLoading || mutation.isLoading || isFetching}
          handleSorting={(data) => handleSorting(data)}
          actionPadding="25px"
        >
          {data?.crs?.map((item, i) => {
            return (
              <tr key={i}>
                <td>{cell(requestParams.page + (i + 1))}</td>
                <td>{cell(item?.sName)}</td>
                <td>{cell(item?.sProjectName)}</td>
                <td>{cell(item?.nTimeLineDays)} </td>
                <td>{cell(item?.eCrStatus)}</td>
                <ActionColumn permissions={permissions} handleEdit={() => gotoEdit(item._id)} handleDelete={() => onDelete(item._id)} />
              </tr>
            )
          })}
        </DataTable>
      </Wrapper>
      <Wrapper transparent>
        <TablePagination
          currentPage={Number(requestParams?.page)}
          totalCount={data?.count || 0}
          pageSize={requestParams?.limit || 10}
          onPageChange={(page) => changePage(page)}
          onLimitChange={(limit) => changePageSize(limit)}
        />
      </Wrapper>
      <CustomModal modalBodyClassName="p-0 py-2" open={modal.open} handleClose={() => setModal({ open: false })} title="Are you Sure?">
        <h6>Are you sure you want to delete?</h6>
        <div className="d-flex justify-content-between">
          <div></div>
          <div className="mt-4">
            <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={() => setModal({ open: false })}>
              Cancel
            </Button>
            <Button onClick={() => mutation.mutate(modal.id)} loading={mutation.isLoading}>
              Delete
            </Button>
          </div>
        </div>
      </CustomModal>
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
