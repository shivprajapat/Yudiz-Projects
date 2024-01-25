import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { TableRow, TableCell, Typography, Button, Avatar } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import DataTable from 'components/DataTable'
import { formateDateTime, getQueryVariable } from 'utils/helper'

function RentalListing({ id, api, storeName, selectorName, extraFilter, addButton, changeUrl }) {
  const history = useHistory()
  const dispatch = useDispatch()
  const [rentalsList, setRentalsList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalRecords, setTotalRecords] = useState(0)
  const filtered = localStorage.getItem('filteredData')
  const pageNumber = getQueryVariable('page')
  const [requestParams, setRequestParams] = useState({
    offset: (pageNumber && Number(pageNumber) - 1) || 0,
    limit: 10,
    searchValue: '',
    sortField: 'createdAt',
    sortOrder: -1,
    filter: (filtered && [JSON.parse(filtered)]) || []
  })
  const [columnItems, setColumnItems] = useState([
    { name: 'id', internalName: 'id', type: 0 },
    { name: 'Image', internalName: 'image', type: 0 },
    { name: 'Title', internalName: 'title', type: 0 },
    { name: 'State', internalName: 'state', type: 0 },
    { name: 'Was Updated', internalName: 'wasUpdated', type: 0 },
    { name: 'Create At', internalName: 'createdAt', type: 0 }
  ])

  const allRentals = useSelector((state) => state[storeName][selectorName])
  const resStatus = useSelector((state) => state[storeName].resStatus)
  const resMessage = useSelector((state) => state[storeName].resMessage)

  useEffect(() => {
    if (!allRentals) {
      setIsLoading(true)
      id ? dispatch(api(id, requestParams)) : dispatch(api(requestParams))
    }
  }, [])

  useEffect(() => {
    if (allRentals && allRentals.rows) {
      setRentalsList(allRentals.rows)
      setTotalRecords(allRentals.count)
      setIsLoading(false)
    }
  }, [allRentals])

  useEffect(() => {
    if (!resStatus && resMessage) {
      setIsLoading(false)
    }
  }, [resStatus, resMessage])

  function handleSearch(text) {
    const data = {
      ...requestParams,
      searchValue: text,
      offset: 0
    }
    setRequestParams(data)
    setIsLoading(true)
    id ? dispatch(api(id, data)) : dispatch(api(data))
  }

  function handleRowChangeEvent(event) {
    const data = {
      ...requestParams,
      offset: 0,
      limit: +event.target.value
    }
    setRequestParams(data)
    setIsLoading(true)
    id ? dispatch(api(id, data)) : dispatch(api(data))
  }

  function handlePageChangeEvent(event, page) {
    const data = {
      ...requestParams,
      offset: page,
      filter: (filtered && [JSON.parse(filtered)]) || []
    }
    setRequestParams(data)
    setIsLoading(true)
    if (changeUrl) {
      window.history.pushState({}, null, `/rentals?page=${page + 1}`)
    }
    id ? dispatch(api(id, data)) : dispatch(api(data))
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
    id ? dispatch(api(id, data)) : dispatch(api(data))
  }

  function handleExtraFilter(e) {
    const data = {
      ...requestParams,
      offset: 0,
      filter: e
    }
    setRequestParams(data)
    setIsLoading(true)
    id ? dispatch(api(id, data)) : dispatch(api(data))
  }

  function goToDetail(id) {
    history.push('/rentals/detail/' + id)
  }
  function goToEdit(e, id) {
    e.stopPropagation()
    e.preventDefault()
    history.push('/rentals/edit/' + id)
  }

  function handleAdd() {
    history.push('/rentals/add')
  }

  return (
    <>
      <DataTable
        api={api}
        columnItems={columnItems}
        isLoading={isLoading}
        searchEvent={(e) => handleSearch(e)}
        addBtnEvent={() => handleAdd()}
        addBtnTxt={addButton && 'Add Rental'}
        totalRecord={totalRecords}
        rowsPerPage={requestParams.limit}
        currentPage={requestParams.offset}
        pageChangeEvent={(e, p) => handlePageChangeEvent(e, p)}
        rowChangeEvent={(e, p) => handleRowChangeEvent(e, p)}
        filterEvent={(e) => handleFilterEvent(e)}
        extraFilter={extraFilter}
        extraFilterEvent={(e) => handleExtraFilter(e)}
      >
        {rentalsList.map((item) => {
          return (
            <TableRow onClick={() => goToDetail(item.id)} hover key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>
                <Avatar
                  variant="rounded"
                  alt={item.title}
                  src={item.rentalImages[0]?.imageUrl.replace('cdn.loanhood.com/', 'ik.imagekit.io/w6paupmag1w/').concat('?tr=w-40,h-40')}
                />
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">{item.title}</Typography>
              </TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>{item.wasUpdated ? 'Yes' : 'No'}</TableCell>
              <TableCell>{formateDateTime(item.createdAt)}</TableCell>
              <TableCell align="right">
                <Button onClick={(e) => goToEdit(e, item.id)} color="primary" startIcon={<EditIcon />}>
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          )
        })}
      </DataTable>
    </>
  )
}

RentalListing.propTypes = {
  id: PropTypes.string,
  api: PropTypes.func,
  storeName: PropTypes.string,
  selectorName: PropTypes.string,
  extraFilter: PropTypes.bool,
  addButton: PropTypes.bool,
  changeUrl: PropTypes.bool
}

export default RentalListing
