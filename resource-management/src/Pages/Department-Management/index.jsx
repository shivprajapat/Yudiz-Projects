import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'

import DataTable from 'Components/DataTable'
import Divider from 'Components/Divider'
import Input from 'Components/Input'
import CustomModal from 'Components/Modal'
import PageTitle from 'Components/Page-Title'
import TablePagination from 'Components/Table-pagination'
import Wrapper from 'Components/wrapper'
import { appendParams, checkLength, getSortedColumns, parseParams } from 'helpers/helper'
import { addDepartment, deleteDepartment, updateDepartment } from 'Query/Department/department.mutation'
import { getDepartmentList } from 'Query/Department/department.query'
import Button from 'Components/Button'
import { ReactComponent as SearchIcon } from 'Assets/Icons/search.svg'
import Search from 'Components/Search'
import ActionColumn from 'Components/ActionColumn'

export default function DepartmentManagement() {
  const parsedData = parseParams(location.search)
  const [data, setData] = useState([])
  const [addValue, setAddValue] = useState()
  const [search, setSearch] = useState(parsedData?.search)
  const [modal, setModal] = useState({ deleteOpen: false, editOpen: false, addOpen: false })

  const queryClient = useQueryClient()

  function getParams() {
    return {
      page: Number(parsedData?.page) || 0,
      limit: Number(parsedData?.limit) || 5,
      search: parsedData?.search || '',
      sort: parsedData.sort || '',
      order: parsedData.order || '',
    }
  }
  const [requestParams, setRequestParams] = useState(getParams())

  const deleteMutation = useMutation(deleteDepartment, {
    onSuccess: () => {
      queryClient.invalidateQueries(
        'departments/' + requestParams?.sort + requestParams?.order + requestParams?.page + requestParams?.limit + requestParams?.search
      )
      setModal({ deleteOpen: false })
    },
  })
  const editMutation = useMutation(updateDepartment, {
    onSuccess: () => {
      queryClient.invalidateQueries(
        'departments/' + requestParams?.sort + requestParams?.order + requestParams?.page + requestParams?.limit + requestParams?.search
      )
      setModal({ editOpen: false })
      setAddValue('')
    },
  })
  const addMutation = useMutation(addDepartment, {
    onSuccess: () => {
      queryClient.invalidateQueries(
        'departments/' + requestParams?.sort + requestParams?.order + requestParams?.page + requestParams?.limit + requestParams?.search
      )
      setModal({ addOpen: false })
      setAddValue('')
    },
  })

  const [columns, setColumns] = useState(
    getSortedColumns(
      [
        { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
        { name: 'departments', connectionName: 'sName', isSorting: true, sort: 0 },
      ],
      parsedData
    )
  )
  const { isLoading, isFetching } = useQuery(
    [
      'departments/' + requestParams?.sort + requestParams?.order + requestParams?.page + requestParams?.limit + requestParams?.search,
      requestParams,
    ],
    () => getDepartmentList(requestParams),
    {
      onSuccess: (data) => {
        setData(data.data.data)
      },
      staleTime: Infinity,
      refetchInterval: (data) => {
        if (data?.data?.data) {
          setData(data?.data?.data)
        }
      },
    }
  )

  function handleSearch(e) {
    e.preventDefault()
    setSearch(e.target.value)
    const TimeOut = setTimeout(function fetchFilteredData() {
      setRequestParams({ ...requestParams, page: 0, search: e.target.value })
      appendParams({ ...requestParams, page: 0, search: e.target.value })
    }, 2000)
    return () => clearTimeout(TimeOut)
  }

  function onDelete(id) {
    setModal({ deleteOpen: true, id })
  }
  function onEdit(id, value) {
    setModal({ editOpen: true, id, value })
    setAddValue(value)
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

  function changePage(page) {
    setRequestParams({ page, limit: requestParams?.limit || 5 })
    appendParams({ page, limit: requestParams?.limit || 5 })
  }

  return (
    <>
      <Wrapper>
        <PageTitle title="Department Management" BtnText="Add New Department" handleButtonEvent={() => setModal({ addOpen: true })} add />
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
          totalData={data?.departments?.length}
          isLoading={isLoading || isFetching}
          handleSorting={(data) => handleSorting(data)}
          actionPadding="35px"
        >
          {data?.departments?.map((item, i) => {
            return (
              <tr key={i}>
                <td>{requestParams?.limit * requestParams.page + (i + 1)}</td>
                <td>{item.sName}</td>
                <ActionColumn handleEdit={() => onEdit(item._id, item.sName)} handleDelete={() => onDelete(item._id)} />
              </tr>
            )
          })}
        </DataTable>
      </Wrapper>
      <Wrapper transparent>
        <TablePagination
          currentPage={requestParams?.page || 0}
          totalCount={data?.count || 0}
          pageSize={requestParams?.limit || 2}
          onPageChange={(page) => changePage(page)}
          onLimitChange={(limit) => changePageSize(limit)}
        />
      </Wrapper>
      <CustomModal
        open={modal.deleteOpen}
        handleClose={() => setModal({ deleteOpen: false })}
        actionButton={() => deleteMutation.mutate(modal.id)}
        title="are you sure?"
      >
        <h6>are you sure you want to delete?</h6>
        <div className="d-flex justify-content-between">
          <div></div>
          <div className="mt-5">
            <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={() => setModal({ deleteOpen: false })}>
              Cancel
            </Button>
            <Button onClick={() => deleteMutation.mutate(modal.id)} loading={deleteMutation.isLoading}>
              Delete
            </Button>
          </div>
        </div>
      </CustomModal>
      <CustomModal open={modal.editOpen} handleClose={() => setModal({ editOpen: false })} title="Edit Department">
        <Input
          labelText={'department name'}
          placeholder="Enter Department Name"
          value={addValue}
          errorMessage={checkLength(addValue) && 'required'}
          onChange={(e) => setAddValue(e.target.value)}
        />
        <div className="d-flex align-items-center justify-content-between">
          <div></div>
          <Button onClick={() => !checkLength(addValue) && editMutation.mutate({ id: modal.id, sName: addValue })}>Add</Button>
        </div>
      </CustomModal>
      <CustomModal open={modal.addOpen} handleClose={() => setModal({ addOpen: false })} title="Add New Department">
        <Input
          labelText={'department name'}
          placeholder="Enter Department Name"
          value={addValue}
          onChange={(e) => setAddValue(e.target.value)}
        />
        <div className="d-flex align-items-center justify-content-between">
          <div></div>
          <Button onClick={() => !checkLength(addValue) && addMutation.mutate(addValue)}>Add</Button>
        </div>
      </CustomModal>
    </>
  )
}
