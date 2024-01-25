import React, { useCallback, useState } from 'react'
import PageTitle from 'Components/Page-Title'
import Search from 'Components/Search'
import Wrapper from 'Components/wrapper'
import { appendParams, cell, isGranted, parseParams, toaster } from 'helpers'
import { ReactComponent as SearchIcon } from 'Assets/Icons/search.svg'
import Divider from 'Components/Divider'
import DataTable from 'Components/DataTable'
import ActionColumn from 'Components/ActionColumn'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { route } from 'Routes/route'
import { debounce } from 'Hooks/debounce'
import TablePagination from 'Components/Table-pagination'
import CustomModal from 'Components/Modal'
import Button from 'Components/Button'
import { getBatchScheduleList } from 'Query/BatchSchedule/batchschedule.query'
import { deleteBatchSchedule } from 'Query/BatchSchedule/batchschedule.mutation'
import './_batch.scss'

function BatchScheduleList() {
  const queryClient = useQueryClient()
  const parsedData = parseParams(location.search)

  const [modal, setModal] = useState({ open: false })
  const [search, setSearch] = useState(parsedData?.search)

  function getParams() {
    return {
      page: Number(parsedData?.page) * Number(parsedData?.limit) || 0,
      limit: Number(parsedData?.limit) || 10,
      search: parsedData?.search || '',
      sort: parsedData?.sort || '',
      order: parsedData.order || '',
    }
  }
  const [requestParams, setRequestParams] = useState(getParams())

  const { isLoading, isFetching, data } = useQuery(['batchschedules', requestParams], () => getBatchScheduleList(requestParams), {
    select: (data) => data.data.data,
    staleTime: 240000,
  })

  const mutation = useMutation(deleteBatchSchedule, {
    onSuccess: (data) => {
      toaster(data.data.message)
      queryClient.invalidateQueries('batchschedules')
      queryClient.invalidateQueries('customers')
      queryClient.invalidateQueries('customersDetails')
      setModal({ open: false })
    },
  })

  const [columns, setColumns] = useState(
    [
      { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
      { name: 'Title', connectionName: 'sTitle', isSorting: false, sort: 0 },
      { name: 'Description', connectionName: 'sDescription', isSorting: false, sort: 0 },
      { name: 'Start Time', connectionName: 'sStartTime', isSorting: true, sort: 0 },
      { name: 'End Time', connectionName: 'sEndTime', isSorting: true, sort: 0 },
    ],
  )

  const navigate = useNavigate()

  function gotoAddBatch() {
    navigate(route.batchSchedulesAddViewEdit('add'))
  }

  function gotoEdit(id) {
    navigate(route.batchSchedulesAddViewEdit('edit', id))
  }

  function onDelete(id) {
    setModal({ open: true, id })
  }

  const debouncedSearch = useCallback(
    debounce((trimmed) => {
      setRequestParams({ ...requestParams, page: 0, search: trimmed })
      appendParams({ ...requestParams, page: 0, search: trimmed })
    }),
    []
  )

  function handleSearch(e) {
    e.preventDefault()
    setSearch(e.target.value)
    const trimmed = e.target.value.trim()
    debouncedSearch(trimmed)
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

  const permissions = {
    CREATE: 'noRole',
    READ: 'noRole',
    UPDATE: 'noRole',
    DELETE: 'noRole',
    EXCEL: 'noRole',
    get ALL() {
      return [this.READ, this.UPDATE, this.DELETE]
    },
  }

  return (
    <>
      <Wrapper>
        <PageTitle
          title="Batch Schedule's List"
          BtnText={isGranted(permissions.CREATE) ? 'Add Batch Schedule' : null}
          handleButtonEvent={gotoAddBatch}
          add
        />
        <div className="w-100 d-flex justify-content-between flex-wrap gap-2 mt-4">
          <div className="d-flex align-items-center">
            <Search
              startIcon={<SearchIcon className="mb-1" />}
              style={{ width: '250px', height: '40px' }}
              placeholder="Search Batch Schedule"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
        <Divider width={'155%'} height="1px" />

        <DataTable
          columns={columns}
          align="left"
          totalData={data?.aBatchSchedule?.length}
          handleSorting={handleSorting}
          isLoading={isLoading || mutation.isLoading || isFetching}
          // disableActions={!isGranted(permissions.ALL)}
        >
          {data?.aBatchSchedule?.map((item, i) => {
            return (
              <tr key={i}>
                <td>{cell(requestParams.page + (i + 1))}</td>
                <td className='d-flex flex-column display'>
                  {item.oBranch ? <>
                    <span>{cell(item.sTitle)}</span> <span className='subtitle'>Branch: {item?.oBranch?.sName}</span>
                  </> :
                    <>
                      <span>
                        {cell(item.sTitle)}</span><span className='subtitle'>Branch: <span className='deleted-data'>Branch Not Found</span>
                      </span>
                    </>
                  }
                </td>
                <td className="text-truncate">{cell(item.sDescription)}</td>
                <td className='start'>{cell(item.sStartTime)}</td>
                <td className='end'>{cell(item.sEndTime)}</td>
                <ActionColumn
                  permissions={permissions}
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
      <CustomModal modalBodyClassName="p-0 py-2" open={modal.open} handleClose={() => setModal({ open: false })} title="Are you Sure?">
        <h6>Are you sure you want to delete this Batch?</h6>
        <div className="d-flex justify-content-between">
          <div></div>
          <div className="mt-4">
            <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={() => setModal({ open: false })}>
              Cancel
            </Button>
            <Button className='bg-danger' onClick={() => mutation.mutate(modal.id)} loading={mutation.isLoading}>
              Delete
            </Button>
          </div>
        </div>
      </CustomModal>
    </>
  )
}

export default BatchScheduleList 
