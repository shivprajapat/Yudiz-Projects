import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import EditIcon from '@material-ui/icons/Edit'
import { Button, TableCell, TableRow, Typography } from '@material-ui/core'
import PageTitle from 'components/PageTitle'
import DataTable from 'components/DataTable'
import { GetSubCategories } from 'state/actions/subCategory'

const OpenSnackbar = React.lazy(() => import('components/Snackbar'))

function SubCategories() {
  const { id } = useParams()
  const history = useHistory()
  const dispatch = useDispatch()
  const [allSubCategories, setAllSubCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalRecords, setTotalRecords] = useState(0)
  const [requestParams, setRequestParams] = useState({
    offset: 0,
    limit: 10,
    searchValue: '',
    sortField: 'name',
    sortOrder: 1,
    id: parseInt(id)
  })
  const [columnItems, setColumnItems] = useState([
    { name: 'id', internalName: 'id', type: 0 },
    { name: 'name', internalName: 'name', type: 0 }
  ])
  const subCategories = useSelector((state) => state.subCategory.subCategories)
  const resStatus = useSelector((state) => state.subCategory.resStatus)
  const resMessage = useSelector((state) => state.subCategory.resMessage)

  useEffect(() => {
    setIsLoading(true)
    dispatch(GetSubCategories(requestParams))
  }, [])

  useEffect(() => {
    if (subCategories && subCategories.rows) {
      setAllSubCategories(subCategories.rows)
      setTotalRecords(subCategories.count)
      setIsLoading(false)
    }
  }, [subCategories])

  useEffect(() => {
    if (!resStatus && resMessage) {
      setIsLoading(false)
    }
  }, [resStatus, resMessage])

  function handleAdd() {
    history.push(`/categories/${id}/sub-categories/add`)
  }

  function handleSearch(text) {
    const data = {
      ...requestParams,
      searchValue: text,
      offset: 0
    }
    setRequestParams(data)
    setIsLoading(true)
    dispatch(GetSubCategories(data))
  }

  function handleRowChangeEvent(event) {
    const data = {
      ...requestParams,
      offset: 0,
      limit: +event.target.value
    }
    setRequestParams(data)
    setIsLoading(true)
    dispatch(GetSubCategories(data))
  }

  function handlePageChangeEvent(event, page) {
    const data = {
      ...requestParams,
      offset: page
    }
    setRequestParams(data)
    setIsLoading(true)
    dispatch(GetSubCategories(data))
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
    dispatch(GetSubCategories(data))
  }

  function goToDetail(subCategoryId) {
    history.push(`/categories/${id}/sub-categories/detail/${subCategoryId}`)
  }
  function goToEdit(e, subCategoryId) {
    e.stopPropagation()
    e.preventDefault()
    history.push(`/categories/${id}/sub-categories/edit/${subCategoryId}`)
  }

  return (
    <>
      {!resStatus && resMessage && <OpenSnackbar isOpen={true} message={resMessage} />}
      <PageTitle title="Sub Categories" />
      <DataTable
        columnItems={columnItems}
        isLoading={isLoading}
        searchEvent={(e) => handleSearch(e)}
        addBtnEvent={() => handleAdd()}
        addBtnTxt="Add Sub Category"
        totalRecord={totalRecords}
        rowsPerPage={requestParams.limit}
        currentPage={requestParams.offset}
        pageChangeEvent={(e, p) => handlePageChangeEvent(e, p)}
        rowChangeEvent={(e, p) => handleRowChangeEvent(e, p)}
        filterEvent={(e) => handleFilterEvent(e)}
      >
        {allSubCategories.map((item) => {
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

export default SubCategories
