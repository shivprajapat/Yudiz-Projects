import React, { useCallback, useState } from 'react'

// component
import SubscriptionMultipleFilter from 'Components/Offcanvas/Subscription-Multipule-Filter/SubscriptionMultipleFilter '
import TablePagination from 'Components/Table-pagination'
import AddTransaction from 'Components/Add-Transaction'
import ActionColumn from 'Components/ActionColumn'
import CustomToolTip from 'Components/TooltipInfo'
import PageTitle from 'Components/Page-Title'
import DataTable from 'Components/DataTable'
import CustomModal from 'Components/Modal'
import Wrapper from 'Components/wrapper'
import Divider from 'Components/Divider'
import Button from 'Components/Button'
import Search from 'Components/Search'

// query
import { getSubscriptionList } from 'Query/Subscription/subscription.query'
import { deleteSubscription } from 'Query/Subscription/subscription.mutation'
import { addTransaction } from 'Query/Transaction/transaction.mutation'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getSetting } from 'Query/Setting/setting.query'

// icons
import { ReactComponent as SearchIcon } from 'Assets/Icons/search.svg'
import { BiFilter } from 'react-icons/bi'

// helper 
import { appendParams, cell, eStatus, formatDate, isGranted, parseParams, toaster } from 'helpers'

// hook
import { debounce } from 'Hooks/debounce'
import { useForm } from 'react-hook-form'

import { useLocation, useNavigate } from 'react-router-dom'
import { route } from 'Routes/route'
import './_subscription.scss'

function SubscriptionList() {

  const parsedData = parseParams(location.search)
  const { state } = useLocation()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { control, handleSubmit, setError, clearErrors, reset } = useForm()

  const [requestParams, setRequestParams] = useState(getParams())
  const [modal, setModal] = useState({ open: false, type: '' })
  const [search, setSearch] = useState(parsedData?.search)
  const [show, setShow] = useState(false)
  const [filters, setFilters] = useState({
    eStatus: parsedData['eStatus']
      ? { value: parsedData['eStatus'], label: parsedData['eStatusLabel'] }
      : state?.value
        ? { value: state?.value, label: state?.label }
        : null,
    ePaymentStatus: parsedData['ePaymentStatus'] ? { value: parsedData['ePaymentStatus'], label: parsedData['ePaymentStatusLabel'] } : null,
  })

  const [columns, setColumns] = useState(
    [
      { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
      { name: 'Customer Name', connectionName: 'sCustomerName', isSorting: false, sort: 0 },
      { name: 'Start Date', connectionName: 'dStartDate', isSorting: true, sort: 0 },
      { name: 'End Date', connectionName: 'dEndDate', isSorting: true, sort: 0 },
      { name: 'Paid Amount', connectionName: 'nPaidAmount', isSorting: false, sort: 0 },
      { name: 'Payment Status', connectionName: 'ePaymentStatus', isSorting: false, sort: 0 },
      { name: 'Status', connectionName: 'eStatus', isSorting: false, sort: 0 },
    ]
  )

  // get subscription
  const { isLoading, isFetching, data } = useQuery(['subscription', requestParams], () => getSubscriptionList(requestParams), {
    select: (data) => data.data.data,
    staleTime: 240000,
  })


  // get settings data
  const { data: setting } = useQuery('setting', () => getSetting(), {
    select: (data) => data.data.data,
    staleTime: 240000,
  })

  // post transaction amount
  const { mutate: mutateAddTransaction } = useMutation((data) => addTransaction(data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries('transaction')
      queryClient.invalidateQueries('subscription')
      queryClient.invalidateQueries('subscriptionDetails')
      toaster(res.data.message)
      setModal({ open: false, type: 'payment' })
    },
  })

  // delete subscription
  const mutation = useMutation(deleteSubscription, {
    onSuccess: (res) => {
      queryClient.invalidateQueries('subscription')
      toaster(res.data.message)
      setModal({ open: false, type: 'delete' })
    },
  })

  function gotoPayment(id) {
    reset()
    setModal({ open: true, type: 'payment', id })
  }

  function gotoAdd() {
    navigate(route.subscriptionsAddViewEdit('add'))
  }

  function gotoEdit(id) {
    navigate(route.subscriptionsAddViewEdit('edit', id))
  }

  function onDelete(id) {
    setModal({ open: true, type: 'delete', id })
  }

  function onPaymentSubmit(data) {
    const addData = {
      dTransactionDate: data?.dTransactionDate,
      nPrice: parseInt(data?.nPrice),
      iSubscriptionId: modal?.id
    }

    mutateAddTransaction(addData)
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

  const debouncedSearch = useCallback(
    debounce((trimmed) => {
      setRequestParams({ ...requestParams, page: 0, search: trimmed })
      appendParams({ ...requestParams, page: 0, search: trimmed })
    }),
    []
  )

  function filterActive() {
    return requestParams?.eStatus || requestParams?.ePaymentStatus ? '#e64c3b' : false
  }

  function handleShow() {
    // setFilters({
    //   ...filters,
    //   eStatus: parsedData['eStatus'] ? { value: parsedData['eStatus'], label: parsedData['eStatusLabel'] } : null,
    //   ePaymentStatus: parsedData['ePaymentStatus'] ? { value: parsedData['ePaymentStatus'], label: parsedData['ePaymentStatusLabel'] } : null,
    // })
    setShow(true)
  }

  function handleShowClose() {
    setShow(false)
  }

  function handleFilter(pendingFilters) {
    setRequestParams({ ...requestParams, page: 0, ...pendingFilters })
    appendParams({ ...requestParams, page: 0, ...pendingFilters })
  }

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

  function getParams() {
    return {
      page: Number(parsedData?.page) * Number(parsedData?.limit) || 0,
      limit: Number(parsedData?.limit) || 10,
      search: parsedData?.search || '',
      sort: parsedData.sort || '',
      order: parsedData.order || '',
      eStatus: parsedData['eStatus'] || state?.value || '',
      ePaymentStatus: parsedData['ePaymentStatus'] || ''
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
          title="Subscriptions List"
          BtnText={isGranted(permissions.CREATE) ? 'Add Subscription' : null}
          handleButtonEvent={gotoAdd}
          add
        />
        <div className="w-100 d-flex justify-content-between flex-wrap gap-2 mt-4">

          <div className='d-flex'>
            <Search
              startIcon={<SearchIcon className="mb-1" />}
              style={{ width: '250px', height: '40px' }}
              placeholder="Search Subscription"
              value={search}
              onChange={handleSearch}
            />
            <CustomToolTip tooltipContent={'Filter'}>
              {({ target }) => (
                <span ref={target} onClick={handleShow} className='filter'>
                  <div className={`dot`} style={{ background: filterActive() }}></div>
                  <BiFilter className={`biFilter`} />
                </span>
              )}
            </CustomToolTip>
          </div>

          {/* <div style={{ height: '50px', position: 'relative' }} >
            <div className={`dot`} style={{ background: filterActive() }}></div>
            <Button style={{ width: '169px' }} onClick={handleShow}>
              <BiFilter className={`filter`} /> Filter
            </Button>
          </div> */}

        </div>

        <Divider width={'155%'} height="1px" />

        <DataTable
          columns={columns}
          align="left"
          totalData={data?.aSubscriptionList?.length}
          isLoading={isLoading || mutation.isLoading || isFetching}
          handleSorting={handleSorting}
        >
          {data?.aSubscriptionList?.map((item, i) => {
            const disabled = item?.ePaymentStatus === 'C' || item?.eStatus === 'F'
            return (
              <tr key={i}>
                <td>{cell(requestParams.page + (i + 1))}</td>
                <td className='d-flex flex-column display'>
                  {item?.oCustomer ? <>
                    <span>{cell(item?.oCustomer?.sName)}</span> <span className='subtitle'>Branch: {item?.oBranch ? cell(item?.oBranch?.sName) : <span className='deleted-data'>Branch was deleted</span>}</span>
                  </>
                    : <span className='deleted-data'>Customer Deleted</span>}
                </td>

                <td>{cell(formatDate(item?.dStartDate))}</td>
                <td>{cell(formatDate(item?.dEndDate))}</td>
                <td>{cell(setting?.oWebSettings?.sCurrency)}{cell(item?.nPaidAmount)} / {cell(setting?.oWebSettings?.sCurrency)}{cell(item?.nPrice)}</td>
                <td className='status'>{cell(item?.ePaymentStatus) === 'P' ? <span className='pending'>Pending</span> : <span className='paid'>Fully Paid</span>}</td>
                <td className={`eStatus-${item?.eStatus}`}><span>{cell(eStatus?.find(data => data?.value === item?.eStatus)?.label)}</span></td>
                <ActionColumn
                  permissions={permissions}
                  handlePayment={() => gotoPayment(item._id)}
                  handleEdit={() => gotoEdit(item._id)}
                  handleDelete={() => onDelete(item._id)}
                  paymentButtonDisabled={disabled}
                  paymentButtonToolTip={
                    (!disabled
                      ? 'Payment'
                      : ((item?.ePaymentStatus === 'C' && item?.eStatus === 'F') || item?.eStatus === 'F')
                        ? 'Your status is freezed'
                        : 'Your payment status is fully paid')
                  }
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
      <CustomModal modalBodyClassName="p-0 py-2" open={modal?.type === 'delete' && modal.open} handleClose={() => setModal({ open: false, type: 'delete' })} title="Are you Sure?">
        <h6>Are you sure you want to delete this Subscription?</h6>
        <div className="d-flex justify-content-between">
          <div></div>
          <div className="mt-4">
            <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={() => setModal({ open: false, type: 'delete' })}>
              Cancel
            </Button>
            <Button className='bg-danger' onClick={() => mutation.mutate(modal.id)} loading={mutation.isLoading}>
              Delete
            </Button>
          </div>
        </div>
      </CustomModal>

      {
        modal?.id &&
        <AddTransaction
          modal={modal}
          setModal={setModal}
          control={control}
          setError={setError}
          clearErrors={clearErrors}
          handleSubmit={handleSubmit}
          onSubmit={onPaymentSubmit}
        />
      }

      <SubscriptionMultipleFilter
        show={show}
        filters={filters}
        setFilters={setFilters}
        handleFilter={handleFilter}
        handleShowClose={handleShowClose}
      />

    </>
  )
}

export default SubscriptionList
