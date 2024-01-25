import Button from 'Components/Button'
import DataTable from 'Components/DataTable'
import Divider from 'Components/Divider'
import CustomModal from 'Components/Modal'
import PageTitle from 'Components/Page-Title'
import Search from 'Components/Search'
import TablePagination from 'Components/Table-pagination'
import Wrapper from 'Components/wrapper'
import { appendParams, countries, getFlagImage, getSortedColumns, parseParams } from 'helpers/helper'
import React from 'react'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { ReactComponent as SearchIcon } from 'Assets/Icons/search.svg'
import { getClientList } from 'Query/Client/client.query'
import { deleteClient } from 'Query/Client/client.mutation'
import { useNavigate } from 'react-router-dom'
import ActionColumn from 'Components/ActionColumn'

export default function ClientManagement() {
  const navigate = useNavigate()
  const parsedData = parseParams(location.search)
  // const [data, setData] = useState([])
  const [addValue, setAddValue] = useState()
  const [modal, setModal] = useState({ open: false })
  const [search, setSearch] = useState(parsedData?.search)

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

  const deleteMutation = useMutation(deleteClient, {
    onSuccess: () => {
      queryClient.invalidateQueries(
        'clients/' + requestParams?.sort + requestParams?.order + requestParams?.page + requestParams?.limit + requestParams?.search
      )
      setModal({ deleteOpen: false })
    },
  })

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
  const { isLoading, isFetching, data } = useQuery(
    [
      'clients/' + requestParams?.sort + requestParams?.order + requestParams?.page + requestParams?.limit + requestParams?.search,
      requestParams,
    ],
    () => getClientList(requestParams),
    {
      select: (data) => data.data.data,
      // onSuccess: (data) => {
      //   setData(data.data.data)
      // },
      staleTime: Infinity,
      // refetchInterval: (data) => {
      //   if (data?.data?.data) {
      //     setData(data?.data?.data)
      //   }
      // },
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
    appendParams({ ...requestParams, page, limit: requestParams?.limit || 5 })
  }

  function handleClose() {
    setModal({})
    setAddValue('')
  }

  function changePageSize(pageSize) {
    setRequestParams({ ...requestParams, page: 0, limit: pageSize })
    appendParams({ ...requestParams, page: 0, limit: pageSize })
  }

  return (
    <>
      <Wrapper>
        <PageTitle title="Client Management" BtnText="Add New Client" handleButtonEvent={handleAdd} add />
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
          isLoading={isLoading || isFetching}
          handleSorting={(data) => handleSorting(data)}
        >
          {data?.clients?.map((item, i) => {
            return (
              <tr key={i}>
                <td>{requestParams?.limit * requestParams.page + (i + 1)}</td>
                <td>{item.sName}</td>
                <td>{item.sEmail}</td>
                <td>
                  {getFlagImage(item.sCode || countries[item.sCountry])} {item.sCountry}
                </td>
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
          currentPage={requestParams?.page || 0}
          totalCount={data?.count || 0}
          pageSize={requestParams?.limit || 2}
          onPageChange={(page) => changePage(page)}
          onLimitChange={(limit) => changePageSize(limit)}
        />
      </Wrapper>
      <CustomModal
        open={modal?.deleteOpen}
        handleClose={handleClose}
        actionButton={() => deleteMutation.mutate(modal.id)}
        title="are you sure?"
      >
        <h6>are you sure you want to delete?</h6>
        <div className="d-flex justify-content-between">
          <div></div>
          <div className="mt-5">
            <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={() => deleteMutation.mutate({ id: modal.id, sName: addValue })} loading={deleteMutation.isLoading}>
              Delete
            </Button>
          </div>
        </div>
      </CustomModal>
    </>
  )
}
