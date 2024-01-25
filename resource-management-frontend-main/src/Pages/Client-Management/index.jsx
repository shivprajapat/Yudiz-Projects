import React, { useCallback, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { Form } from 'react-bootstrap'
import { downloadCsv } from 'Query/Employee/employee.mutation'
import { getClientList } from 'Query/Client/client.query'
import { deleteClient } from 'Query/Client/client.mutation'
import Button from 'Components/Button'
import DataTable from 'Components/DataTable'
import Divider from 'Components/Divider'
import CustomModal from 'Components/Modal'
import PageTitle from 'Components/Page-Title'
import Search from 'Components/Search'
import TablePagination from 'Components/Table-pagination'
import Wrapper from 'Components/wrapper'
import ActionColumn from 'Components/ActionColumn'
import { debounce } from 'Hooks/debounce'
import { ReactComponent as SearchIcon } from 'Assets/Icons/search.svg'
import {
  appendParams,
  cell,
  countries,
  ExcelModules,
  getFlagImage,
  getSortedColumns,
  isGranted,
  mapFilter,
  parseParams,
  permissionsName,
  toaster,
} from 'helpers'
import ConfirmationModal from 'Components/ConfirmationModal'

export default function ClientManagement() {
  const navigate = useNavigate()
  const parsedData = parseParams(location.search)
  // const [data, setData] = useState([])

  const [ExcelFields, setExcelFields] = useState([])
  const [modal, setModal] = useState({ open: false })
  const [search, setSearch] = useState(parsedData?.search)

  const queryClient = useQueryClient()
  function getParams() {
    return {
      page: Number(parsedData?.page) * Number(parsedData?.limit) || 0,
      limit: parsedData?.limit === 'all' ? 'all' : (Number(parsedData?.limit) || 10),
      search: parsedData?.search || '',
      sort: parsedData.sort || '',
      order: parsedData.order || '',
    }
  }
  const [requestParams, setRequestParams] = useState(getParams())

  const deleteMutation = useMutation(deleteClient, {
    onSuccess: () => {
      toaster('Client Deleted Successfully')
      queryClient.invalidateQueries('clients/')
      setModal({ deleteOpen: false })
    },
  })
  function handleDeleteMutation() {
    deleteMutation.mutate(modal.id)
  }
  const [columns, setColumns] = useState(
    getSortedColumns(
      [
        { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
        { name: 'Client Name', connectionName: 'sName', isSorting: true, sort: 0 },
        { name: 'Email Id', connectionName: 'sEmail', isSorting: true, sort: 0 },
        { name: 'Country', connectionName: 'sCountry', isSorting: true, sort: 0 },
      ],
      parsedData
    )
  )
  const { isLoading, isFetching, data } = useQuery(['clients/', requestParams], () => getClientList(requestParams), {
    select: (data) => data.data.data,
    staleTime: 10000,
  })

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

  function onDelete(id) {
    setModal({ deleteOpen: true, id })
  }
  function gotoEdit(id) {
    navigate('/client-management/edit/' + id)
  }
  function gotoDetail(id) {
    navigate('/client-management/detail/' + id)
  }
  function handleAdd() {
    navigate('/client-management/add')
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

  function handleClose() {
    setModal({})
  }

  function changePageSize(pageSize) {
    setRequestParams({ ...requestParams, page: 0, limit: pageSize })
    appendParams({ ...requestParams, page: 0, limit: pageSize })
  }

  const ExcelMutation = useMutation(downloadCsv, {
    onSuccess: (data) => {
      toaster(data.data.message)
      setModal({ Excel: false })
    },
  })

  function handleDownloadExcel() {
    ExcelMutation.mutate({
      sModule: 'Client',
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
    setExcelFields(ExcelModules.Client)
  }
  function handleDownloadExcelClose() {
    setModal({ Excel: false })
  }
  const permissions = {
    CREATE: permissionsName.CREATE_CLIENT,
    READ: permissionsName.VIEW_CLIENT,
    UPDATE: permissionsName.UPDATE_CLIENT,
    DELETE: permissionsName.DELETE_CLIENT,
    EXCEL: permissionsName.DOWNLOAD_CLIENT_EXCEL,
    get ALL() {
      return [this.READ, this.UPDATE, this.DELETE]
    },
  }

  return (
    <>
      <Wrapper>
        <PageTitle
          title="Client Management"
          BtnText={isGranted(permissions.CREATE) ? 'Add New Client' : null}
          handleExcelEvent={isGranted(permissions.EXCEL) ? handleDownloadExcelOpen : null}
          handleButtonEvent={handleAdd}
          add
        />
        <div className="w-100 d-flex justify-content-between align-items-center mt-3">
          <div className="d-flex flex-end">
            <Search
              startIcon={<SearchIcon className="mb-1" />}
              style={{ width: '250px', height: '40px' }}
              placeholder="Search Client"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
        <Divider />

        <DataTable
          columns={columns}
          align="left"
          totalData={data?.clients?.length}
          disableActions={!isGranted(permissions.ALL)}
          isLoading={isLoading || isFetching}
          handleSorting={(data) => handleSorting(data)}
        >
          {data?.clients?.map((item, i) => {
            return (
              <tr key={i}>
                <td>{cell(requestParams.page + (i + 1))}</td>
                <td>{item.sName}</td>
                <td>{item.sEmail}</td>
                <td>
                  {getFlagImage(item.sCode || countries[item.sCountry])} {item.sCountry}
                </td>
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
        open={modal?.deleteOpen}
        title='Are sure you?'
        handleClose={handleClose}
        handleCancel={handleClose}
        handleConfirm={() => handleDeleteMutation()}
      >
        <h6>Are you sure you want to delete?</h6>
      </ConfirmationModal>


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
