import React, { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { TableRow, TableCell, Button } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import PageTitle from 'components/PageTitle'
import DataTable from 'components/DataTable'
import { formateDateTime, getQueryVariable } from 'utils/helper'
import { GetAccessCodes, DeleteAccessCode } from 'state/actions/accessCodes'
import DeleteIcon from '@material-ui/icons/Delete'
import ConfirmDialog from 'components/ConfirmDialog'

const OpenSnackbar = React.lazy(() => import('components/Snackbar'))

function AccessCodes() {
  const pageNumber = getQueryVariable('page')
  const history = useHistory()
  const dispatch = useDispatch()
  const [codes, setCodes] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalRecords, setTotalRecords] = useState(0)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const deletedCode = useRef()
  const [requestParams, setRequestParams] = useState({
    offset: (pageNumber && Number(pageNumber) - 1) || 0,
    limit: 10,
    searchValue: '',
    sortField: 'id',
    sortOrder: 1
  })
  const [columnItems, setColumnItems] = useState([
    { name: 'id', internalName: 'id', type: 0 },
    { name: 'code', internalName: 'aCode', type: 0 },
    { name: 'Max uses', internalName: 'maxUses', type: 0 },
    { name: 'Number of times used', internalName: 'numberUsed', type: 0 },
    { name: 'Expiry Date And Time', internalName: 'expiryDate', type: 0 }
  ])

  const allCodes = useSelector((state) => state.accessCodes.codes)
  const resStatus = useSelector((state) => state.accessCodes.resStatus)
  const resMessage = useSelector((state) => state.accessCodes.resMessage)
  useEffect(() => {
    setIsLoading(true)
    dispatch(GetAccessCodes(requestParams))
  }, [])

  useEffect(() => {
    if (allCodes && allCodes) {
      setCodes(allCodes.rows)
      setTotalRecords(allCodes.count)
      setIsLoading(false)
    }
  }, [allCodes])

  useEffect(() => {
    if (!resStatus && resMessage) {
      setIsLoading(false)
    }
  }, [resStatus, resMessage])

  function handleAdd() {
    history.push('/access-codes/add')
  }

  function handleSearch(text) {
    const data = {
      ...requestParams,
      searchValue: text,
      offset: 0
    }
    setRequestParams(data)
    setIsLoading(true)
    dispatch(GetAccessCodes(data))
  }

  function handleRowChangeEvent(event) {
    const data = {
      ...requestParams,
      offset: 0,
      limit: +event.target.value
    }
    setRequestParams(data)
    setIsLoading(true)
    dispatch(GetAccessCodes(data))
  }

  function handlePageChangeEvent(event, page) {
    const data = {
      ...requestParams,
      offset: page
    }
    window.history.pushState({}, null, `/access-codes?page=${page + 1}`)
    setRequestParams(data)
    setIsLoading(true)
    dispatch(GetAccessCodes(data))
  }

  function handleFilterEvent(name) {
    if (name === 'expiryDate') return
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
    dispatch(GetAccessCodes(data))
  }

  function goToDetail(id) {
    history.push('/access-codes/detail/' + id)
  }
  function goToEdit(e, id) {
    e.stopPropagation()
    e.preventDefault()
    history.push('/access-codes/edit/' + id)
  }
  function deleteAccessCode(e, id) {
    if (e) {
      dispatch(DeleteAccessCode(id))
    }
    setIsConfirmOpen(false)
  }
  function deleteCode(e, id) {
    e.stopPropagation()
    e.preventDefault()
    deletedCode.current = id
    setIsConfirmOpen(true)
  }

  return (
    <>
      {!resStatus && resMessage && <OpenSnackbar isOpen={true} message={resMessage} />}
      {isConfirmOpen && (
        <ConfirmDialog
          open={isConfirmOpen}
          message={'Are you sure that you want to delete this code?'}
          handleResponse={(e) => deleteAccessCode(e, deletedCode.current)}
        />
      )}
      <PageTitle title="Access Codes" />
      <DataTable
        columnItems={columnItems}
        isLoading={isLoading}
        searchEvent={(e) => handleSearch(e)}
        addBtnEvent={() => handleAdd()}
        addBtnTxt="Add Access Code"
        totalRecord={totalRecords}
        rowsPerPage={requestParams.limit}
        currentPage={requestParams.offset}
        pageChangeEvent={(e, p) => handlePageChangeEvent(e, p)}
        rowChangeEvent={(e, p) => handleRowChangeEvent(e, p)}
        filterEvent={(e) => handleFilterEvent(e)}
      >
        {codes.map((code) => {
          return (
            <TableRow onClick={() => goToDetail(code?.id)} hover key={code?.id}>
              <TableCell>{code?.id}</TableCell>
              <TableCell>{code?.aCode}</TableCell>
              <TableCell>{code?.maxUses}</TableCell>
              <TableCell>{code?.numberUsed || 0}</TableCell>
              <TableCell>{formateDateTime(code?.expiryDate)}</TableCell>
              <TableCell align="right">
                <Button onClick={(e) => goToEdit(e, code?.id)} color="primary" startIcon={<EditIcon />}>
                  Edit
                </Button>
              </TableCell>
              <TableCell align="left">
                <Button
                  onClick={(e) => deleteCode(e, code?.id)}
                  color="secondary"
                  startIcon={<DeleteIcon />}
                  style={{
                    color: !code.isCodeExpired && code.numberUsed !== 0 ? '' : '#ff0000'
                  }}
                  disabled={!code.isCodeExpired && code.numberUsed !== 0}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          )
        })}
      </DataTable>
    </>
  )
}

export default AccessCodes
