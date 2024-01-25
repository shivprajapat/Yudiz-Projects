import React, { useCallback, useMemo, useState } from 'react'

// component
import TablePagination from 'Components/Table-pagination'
import ActionColumn from 'Components/ActionColumn'
import PageTitle from 'Components/Page-Title'
import DataTable from 'Components/DataTable'
import CustomModal from 'Components/Modal'
import Divider from 'Components/Divider'
import Wrapper from 'Components/wrapper'
import Search from 'Components/Search'
import Button from 'Components/Button'

// query
import { deleteTransaction } from 'Query/Transaction/transaction.mutation'
import { getTransactionList } from 'Query/Transaction/transaction.query'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getSetting } from 'Query/Setting/setting.query'

// icons
import { ReactComponent as SearchIcon } from 'Assets/Icons/search.svg'

// helper
import { appendParams, cell, formatDate, isGranted, parseParams, toaster } from 'helpers'

// hook
import { debounce } from 'Hooks/debounce'

import { useNavigate } from 'react-router-dom'
import { route } from 'Routes/route'
import './_transaction.scss'

function TransactionList() {

  const parsedData = parseParams(location.search)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [requestParams, setRequestParams] = useState(getParams())
  const [search, setSearch] = useState(parsedData?.search)
  const [modal, setModal] = useState({ open: false })

  const columns = useMemo(() =>
    [
      { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
      { name: 'Customer Name', connectionName: 'sCustomerName', isSorting: false, sort: 0 },
      { name: 'Subscription (Start Date - End Date)', connectionName: 'dStartDate', isSorting: false, sort: 0 },
      { name: 'Transaction Date', connectionName: 'dTransactionDate', isSorting: false, sort: 0 },
      { name: 'Amount', connectionName: 'nPrice', isSorting: false, sort: 0 },
    ],
    []
  )

  // get transaction
  const { isLoading, isFetching, data } = useQuery(['transaction', requestParams], () => getTransactionList(requestParams), {
    select: (data) => data.data.data,
    staleTime: 240000,
  })

  // get settings
  const { data: setting } = useQuery('setting', () => getSetting(), {
    select: (data) => data.data.data,
    staleTime: 240000,
  })

  // delete transaction
  const mutation = useMutation(deleteTransaction, {
    onSuccess: (res) => {
      queryClient.invalidateQueries('transaction')
      queryClient.invalidateQueries('subscription')
      toaster(res.data.message)
      setModal({ open: false })
    },
  })

  function gotoAdd() {
    navigate(route.transactionsAddViewEdit('add'))
  }

  function gotoDetail(id) {
    navigate(route.transactionsAddViewEdit('view', id))
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
    // setSelectedRows([{ changingPage: true }])
  }

  function getParams() {
    return {
      page: Number(parsedData?.page) * Number(parsedData?.limit) || 0,
      limit: Number(parsedData?.limit) || 10,
      search: parsedData?.search || '',
      sort: parsedData.sort || '',
      order: parsedData.order || '',
    }
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
          title="Transactions List"
          BtnText={isGranted(permissions.CREATE) ? 'Add Transaction' : null}
          handleButtonEvent={gotoAdd}
          add
        />
        <div className="w-100 d-flex justify-content-between flex-wrap gap-2 mt-4">
          <div className="d-flex align-items-center">
            <Search
              startIcon={<SearchIcon className="mb-1" />}
              style={{ width: '250px', height: '40px' }}
              placeholder="Search Transaction"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
        <Divider width={'155%'} height="1px" />

        <DataTable
          columns={columns}
          align="left"
          totalData={data?.transactions?.length}
          isLoading={isLoading || mutation.isLoading || isFetching}
        // disableActions={!isGranted(permissions.ALL)}
        >
          {data?.transactions?.map((item, i) => {
            return (
              <tr key={i}>
                <td>{cell(requestParams.page + (i + 1))}</td>
                <td>{item?.oSubscription?.oCustomer?.sName || <span className='deleted-data' >Customer Deleted</span>}</td>
                <td >
                  {
                    (item?.oSubscription?.dStartDate && item?.oSubscription?.dEndDate) ?
                      <><span className='start'>{(formatDate(item?.oSubscription?.dStartDate))}</span> -  <span className='end'>{(formatDate(item?.oSubscription?.dEndDate))}</span></>
                      : <span className='deleted-data' >Subscription Deleted</span>
                  }
                </td>
                <td>{cell(formatDate(item?.dTransactionDate))}</td>
                <td>{cell(setting?.oWebSettings?.sCurrency)} {cell(item?.nPrice)}</td>
                <ActionColumn
                  permissions={permissions}
                  handleView={() => gotoDetail(item._id)}
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
        <h6>Are you sure you want to delete this Transaction?</h6>
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

export default TransactionList
