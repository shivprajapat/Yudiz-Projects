import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import DataTable from './DataTable'
import { TableCell, TableRow } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

function RentalTransactions({ id, api, storeName, selectorName, search, isFromUser }) {
  const history = useHistory()
  const dispatch = useDispatch()
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalRecords, setTotalRecords] = useState(0)
  const [requestParams, setRequestParams] = useState(
    search ? { offset: 0, limit: 10, searchValue: '', sortField: 'startAt', sortOrder: 1 } : { offset: 0, limit: 10 }
  )
  const records = useSelector((state) => state[storeName][selectorName])
  const resStatus = useSelector((state) => state[storeName].resStatus)
  const resMessage = useSelector((state) => state[storeName].resMessage)
  const [columnItems, setColumnItems] = useState([
    { name: 'id', internalName: 'id', type: 0 },
    { name: 'Start Date', internalName: 'endDate', type: 0 },
    { name: 'End Date', internalName: 'startDate', type: 0 },
    { name: 'State', internalName: 'State', type: 0 }
  ])

  useEffect(() => {
    if (!resStatus && resMessage) {
      setIsLoading(false)
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if (records && records.rows) {
      setTransactions(records.rows)
      setTotalRecords(records.count)
      setIsLoading(false)
    }
  }, [records])

  useEffect(() => {
    if (isFromUser) {
      setIsLoading(true)
      dispatch(api(id, requestParams))
    }
  }, [])
  function goToDetail(id) {
    history.push('/rentals/transaction/detail/' + id)
  }

  function handleRowChangeEvent(event) {
    const data = {
      ...requestParams,
      offset: 0,
      limit: +event.target.value
    }
    setRequestParams(data)
    setIsLoading(true)
    dispatch(api(id, data))
  }

  function handlePageChangeEvent(event, page) {
    const data = {
      ...requestParams,
      offset: page
    }
    setRequestParams(data)
    setIsLoading(true)
    dispatch(api(id, data))
  }

  function handleSearch(text) {
    const data = {
      ...requestParams,
      searchValue: text,
      offset: 0
    }
    setRequestParams(data)
    setIsLoading(true)
    dispatch(api(id, data))
  }

  function handleFilterEvent(name) {
    if (name === 'image') return
    let selectedFilter
    const filter = columnItems.map((data) => {
      if (data.internalName === name) {
        data.type = data.type === 1 ? -1 : 1
        selectedFilter = data
      } else {
        data.type = 0
      }
      return data
    })
    setColumnItems(filter)
    const data = {
      ...requestParams,
      offset: 0,
      sortField: selectedFilter.internalName,
      sortOrder: selectedFilter.type
    }
    setRequestParams(data)
    setIsLoading(true)
    dispatch(api(id, data))
  }

  return (
    <DataTable
      columnItems={columnItems}
      isLoading={isLoading}
      totalRecord={totalRecords}
      rowsPerPage={requestParams.limit}
      currentPage={requestParams.offset}
      pageChangeEvent={(e, p) => handlePageChangeEvent(e, p)}
      rowChangeEvent={(e, p) => handleRowChangeEvent(e, p)}
      filterEvent={search ? (e) => handleFilterEvent(e) : (e) => console.log(e)}
      isActionColumn={true}
      searchEvent={search ? (e) => handleSearch(e) : null}
    >
      {transactions.map((item, index) => {
        return (
          <TableRow onClick={() => goToDetail(item.id)} hover key={index}>
            <TableCell>{item.id}</TableCell>
            <TableCell>{item.startAt}</TableCell>
            <TableCell>{item.endAt}</TableCell>
            <TableCell>
              {item.rentaltransactionstates[0] && item.rentaltransactionstates[item.rentaltransactionstates.length - 1].state}
            </TableCell>
          </TableRow>
        )
      })}
    </DataTable>
  )
}

RentalTransactions.propTypes = {
  id: PropTypes.string,
  api: PropTypes.func,
  storeName: PropTypes.string,
  selectorName: PropTypes.string,
  search: PropTypes.bool,
  isFromUser: PropTypes.bool
}

export default RentalTransactions
