import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import EditIcon from '@material-ui/icons/Edit'
import { GetMaterials } from 'state/actions/material'
import { Button, TableCell, TableRow, Typography } from '@material-ui/core'
import PageTitle from 'components/PageTitle'
import DataTable from 'components/DataTable'

const OpenSnackbar = React.lazy(() => import('components/Snackbar'))

function Materials() {
  const history = useHistory()
  const dispatch = useDispatch()
  const [allMaterials, setAllMaterials] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalRecords, setTotalRecords] = useState(0)
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
  const material = useSelector((state) => state.material.materials)
  const resStatus = useSelector((state) => state.material.resStatus)
  const resMessage = useSelector((state) => state.material.resMessage)

  useEffect(() => {
    setIsLoading(true)
    dispatch(GetMaterials(requestParams))
  }, [])

  useEffect(() => {
    if (material && material.rows) {
      setAllMaterials(material.rows)
      setTotalRecords(material.count)
      setIsLoading(false)
    }
  }, [material])

  useEffect(() => {
    if (!resStatus && resMessage) {
      setIsLoading(false)
    }
  }, [resStatus, resMessage])

  function handleAdd() {
    history.push('/materials/add')
  }

  function handleSearch(text) {
    const data = {
      ...requestParams,
      searchValue: text,
      offset: 0
    }
    setRequestParams(data)
    setIsLoading(true)
    dispatch(GetMaterials(data))
  }

  function handleRowChangeEvent(event) {
    const data = {
      ...requestParams,
      offset: 0,
      limit: +event.target.value
    }
    setRequestParams(data)
    setIsLoading(true)
    dispatch(GetMaterials(data))
  }

  function handlePageChangeEvent(event, page) {
    const data = {
      ...requestParams,
      offset: page
    }
    setRequestParams(data)
    setIsLoading(true)
    dispatch(GetMaterials(data))
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
    dispatch(GetMaterials(data))
  }

  function goToDetail(id) {
    history.push('/materials/detail/' + id)
  }
  function goToEdit(e, id) {
    e.stopPropagation()
    e.preventDefault()
    history.push('/materials/edit/' + id)
  }

  return (
    <>
      {!resStatus && resMessage && <OpenSnackbar isOpen={true} message={resMessage} />}
      <PageTitle title="Materials" />
      <DataTable
        columnItems={columnItems}
        isLoading={isLoading}
        searchEvent={(e) => handleSearch(e)}
        addBtnEvent={() => handleAdd()}
        addBtnTxt="Add Material"
        totalRecord={totalRecords}
        rowsPerPage={requestParams.limit}
        currentPage={requestParams.offset}
        pageChangeEvent={(e, p) => handlePageChangeEvent(e, p)}
        rowChangeEvent={(e, p) => handleRowChangeEvent(e, p)}
        filterEvent={(e) => handleFilterEvent(e)}
      >
        {allMaterials.map((item) => {
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

export default Materials
