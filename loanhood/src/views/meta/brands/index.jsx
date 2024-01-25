import React, { useEffect, useState } from 'react'
import { TableRow, TableCell, Typography, Button } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { GetBrands } from 'state/actions/brand'
import PageTitle from 'components/PageTitle'
import DataTable from 'components/DataTable'
import EditIcon from '@material-ui/icons/Edit'
import { useHistory } from 'react-router-dom'

const OpenSnackbar = React.lazy(() => import('components/Snackbar'))

function Brands() {
  const history = useHistory()
  const dispatch = useDispatch()
  const [allBrands, setAllBrands] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalBrands, setTotalBrands] = useState(0)
  const [requestParams, setRequestParams] = useState({
    offset: 0,
    limit: 10,
    searchValue: '',
    sortField: 'name',
    sortOrder: 1
  })
  const [columnItems, setColumnItems] = useState([
    { name: 'id', internalName: 'id', type: 0 },
    { name: 'name', internalName: 'name', type: 0 }
  ])

  const brands = useSelector((state) => state.brand.brands)
  const resStatus = useSelector((state) => state.brand.resStatus)
  const resMessage = useSelector((state) => state.brand.resMessage)

  useEffect(() => {
    setIsLoading(true)
    dispatch(GetBrands(requestParams))
  }, [])

  useEffect(() => {
    if (brands && brands.rows) {
      setAllBrands(brands.rows)
      setTotalBrands(brands.count)
      setIsLoading(false)
    }
  }, [brands])

  useEffect(() => {
    if (!resStatus && resMessage) {
      setIsLoading(false)
    }
  }, [resStatus, resMessage])

  function handleAdd() {
    history.push('/brands/add')
  }

  function handleSearch(text) {
    const data = {
      ...requestParams,
      searchValue: text,
      offset: 0
    }
    setRequestParams(data)
    setIsLoading(true)
    dispatch(GetBrands(data))
  }

  function handleRowChangeEvent(event) {
    const data = {
      ...requestParams,
      offset: 0,
      limit: +event.target.value
    }
    setRequestParams(data)
    setIsLoading(true)
    dispatch(GetBrands(data))
  }

  function handlePageChangeEvent(event, page) {
    const data = {
      ...requestParams,
      offset: page
    }
    setRequestParams(data)
    setIsLoading(true)
    dispatch(GetBrands(data))
  }

  function handleFilterEvent(name) {
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
      sortField: selectedFilter.name,
      sortOrder: selectedFilter.type
    }
    setRequestParams(data)
    setIsLoading(true)
    dispatch(GetBrands(data))
  }

  function goToDetail(id) {
    history.push('/brands/detail/' + id)
  }
  function goToEdit(e, id) {
    e.stopPropagation()
    e.preventDefault()
    history.push('/brands/edit/' + id)
  }

  return (
    <>
      {!resStatus && resMessage && <OpenSnackbar isOpen={true} message={resMessage} />}
      <PageTitle title="Brands" />
      <DataTable
        columnItems={columnItems}
        isLoading={isLoading}
        searchEvent={(e) => handleSearch(e)}
        addBtnEvent={() => handleAdd()}
        addBtnTxt="Add Brand"
        totalRecord={totalBrands}
        rowsPerPage={requestParams.limit}
        currentPage={requestParams.offset}
        pageChangeEvent={(e, p) => handlePageChangeEvent(e, p)}
        rowChangeEvent={(e, p) => handleRowChangeEvent(e, p)}
        filterEvent={(e) => handleFilterEvent(e)}
      >
        {allBrands.map((item) => {
          return (
            <TableRow onClick={() => goToDetail(item.id)} hover key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>
                <Typography variant="subtitle2" noWrap>
                  {item.name}
                </Typography>
              </TableCell>
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

export default Brands
