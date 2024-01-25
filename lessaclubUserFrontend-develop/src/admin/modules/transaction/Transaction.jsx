import DataTable from 'admin/shared/components/data-table'
import Drawer from 'admin/shared/components/drawer'
import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { appendParams, getParams } from 'shared/utils'
import { listTransactionsData } from './redux/service'
import Row from './Row'
import TransactionFilter from './TransactionFilter'
import ExportModal from '../export/ExportModal'
import { apiPaths } from 'shared/constants/apiPaths'

const Transaction = () => {
  const [requestParams, setRequestParams] = useState({ page: 1, perPage: 10 })
  const [totalRecord, setTotalRecord] = useState(0)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [showModal, setShowModal] = useState(false)
  const columns = [
    { name: 'ID', internalName: 'ID', type: 0 },
    { name: 'Date', internalName: 'Date', type: 0 },
    { name: 'Amount (GBP)', internalName: 'Amount', type: 0 },
    { name: 'Payment Method', internalName: 'PaymentMethod', type: 0 },
    { name: 'Type', internalName: 'type', type: 0 },
    { name: 'From', internalName: 'From', type: 0 },
    { name: 'To', internalName: 'To', type: 0 },
    { name: 'Status', internalName: 'Status', type: 0 }
  ]

  const toggleExportModal = () => {
    setShowModal((prev) => !prev)
  }

  useEffect(() => {
    getTransactions()
  }, [requestParams])

  const getTransactions = async () => {
    const params = getParams(window.location.search)
    try {
      const response = await listTransactionsData({ ...requestParams, ...params })
      if (response.status === 200) {
        setTransactions(response.data.result.userTransactions)
        setTotalRecord(response.data.result.metaData?.totalItems || 0)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleSort = () => { }
  const handleHeaderEvent = (name, value) => {
    switch (name) {
      case 'rows':
        setRequestParams({ ...requestParams, perPage: Number(value) })
        break
      case 'search':
        setRequestParams({ ...requestParams, id: value })
        break
      case 'filter':
        setIsFilterOpen(value)
        break
      default:
        break
    }
  }
  const handlePageEvent = (page) => {
    setRequestParams({ ...requestParams, page: page })
  }
  const handleFilterChange = (data) => {
    let reqParams = { ...requestParams }

    if (data?.fromDate) {
      reqParams = { ...reqParams, fromDate: data.fromDate }
      appendParams({ fromDate: data.fromDate })
    }
    if (data?.toDate) {
      reqParams = { ...reqParams, toDate: data.toDate }
      appendParams({ toDate: data.toDate })
    }
    if (data?.status) {
      reqParams = { ...reqParams, status: data.status.value }
      appendParams({ status: data.status.value })
    }
    if (data?.paymentMode) {
      reqParams = { ...reqParams, paymentMode: data.paymentMode.value }
      appendParams({ paymentMode: data.paymentMode.value })
    }
    if (data?.orderType) {
      reqParams = { ...reqParams, type: data.orderType.value }
      appendParams({ type: data.orderType.value })
    }
    if (data?.orderId) {
      reqParams = { ...reqParams, orderId: data.orderId }
      appendParams({ orderId: data.orderId })
    }
    if (data?.assetId) {
      reqParams = { ...reqParams, assetId: data.assetId }
      appendParams({ assetId: data.assetId })
    }
    if (data?.transactionId) {
      reqParams = { ...reqParams, transactionId: data.transactionId }
      appendParams({ transactionId: data.transactionId })
    }
    if (data?.minPrice) {
      reqParams = { ...reqParams, minPrice: data.minPrice }
      appendParams({ minPrice: data.minPrice })
    }
    if (data?.maxPrice) {
      reqParams = { ...reqParams, maxPrice: data.maxPrice }
      appendParams({ maxPrice: data.maxPrice })
    }
    setRequestParams(reqParams)
    setIsFilterOpen(!isFilterOpen)
  }

  return (
    <div className="assets-section">
      <h4 className='px-2 py-4'>Transactions</h4>
      <div className='d-flex justify-content-end'>
          <Button className='bg-success text-light approve-btn border-0 mb-4' onClick={() => setShowModal(true)}>EXPORT</Button>
      </div>
      <DataTable
        className="asset-list"
        columns={columns}
        sortEvent={handleSort}
        totalRecord={totalRecord}
        header={{
          left: {
            rows: true
          },
          right: {
            search: true,
            filter: true
          }
        }}
        headerEvent={(name, value) => handleHeaderEvent(name, value)}
        pageChangeEvent={handlePageEvent}
        pagination={{ currentPage: requestParams.page, pageSize: requestParams.perPage }}
        actionColumn={true}
      >
        {
          transactions && transactions.length > 0 ? (
            transactions?.map((transaction, index) => {
              return <Row key={transaction.id} index={index} transaction={transaction} />
            })
          ) : null
        }
      </DataTable>
      <Drawer className="drawer" isOpen={isFilterOpen} onClose={() => setIsFilterOpen(!isFilterOpen)} title="filter">
          <TransactionFilter
            filterChange={handleFilterChange}
            defaultValue={requestParams}
            onReset
            requestParams={requestParams}
            setRequestParams={setRequestParams}
          />
        </Drawer>
        <ExportModal
        title={'Export Confirmation'}
        show={showModal}
        handleClose={toggleExportModal}
        requestParams={requestParams}
        api={apiPaths.userTransactionExport}
      />
    </div>
  )
}

export default Transaction
