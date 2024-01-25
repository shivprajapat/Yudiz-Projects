import React, { useEffect, useState } from 'react'
import { Button, TableCell, TableRow } from '@material-ui/core'
import DataTable from 'components/DataTable'
import PageTitle from 'components/PageTitle'
import EditIcon from '@material-ui/icons/Edit'
import { GetReports } from 'state/actions/report'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import OpenSnackbar from 'components/Snackbar'
import { getQueryVariable } from 'utils/helper'

function Reports() {
  const pageNumber = getQueryVariable('page')
  const history = useHistory()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)

  const [reports, setReports] = useState([])
  const [totalRecords, setTotalRecords] = useState(0)
  const [columnItems, setColumnItems] = useState([
    { name: 'id', internalName: 'id', type: 0 },
    { name: 'reporting user', internalName: 'reportedUserId', type: 0 },
    { name: 'reported user', internalName: 'userId', type: 0 },
    { name: 'reported rental', internalName: 'reportedRentalId', type: 0 },
    { name: 'isBlocked', internalName: 'isBlocked', type: 0 },
    { name: 'isActive', internalName: 'isActive', type: 0 }
  ])
  const [requestParams, setRequestParams] = useState({
    offset: (pageNumber && Number(pageNumber) - 1) || 0,
    limit: 10
  })

  const allReports = useSelector((state) => state.report.report)
  const resMessage = useSelector((state) => state.report.resMessage)
  const resStatus = useSelector((state) => state.report.resStatus)

  useEffect(() => {
    if (!resStatus && resMessage) {
      setIsLoading(false)
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    setIsLoading(true)
    dispatch(GetReports({ offset: 0, limit: 10 }))
  }, [])

  useEffect(() => {
    if (allReports) {
      setReports(allReports.rows)
      setTotalRecords(allReports.count)
      setIsLoading(false)
    }
  }, [allReports])

  function goToDetail(id) {
    history.push('/reports/detail/' + id)
  }

  function goToEdit(e, id) {
    e.stopPropagation()
    e.preventDefault()
    history.push('/reports/edit/' + id)
  }

  function handlePageChangeEvent(event, page) {
    const data = {
      ...requestParams,
      offset: page
    }
    setRequestParams(data)
    window.history.pushState({}, null, `/reports?page=${page + 1}`)
    setIsLoading(true)
    dispatch(GetReports(data))
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
      sortField: selectedFilter.internalName,
      sortOrder: selectedFilter.type
    }
    setRequestParams(data)
    setIsLoading(true)
    dispatch(GetReports(data))
  }

  function handleRowChangeEvent(event) {
    const data = {
      ...requestParams,
      offset: 0,
      limit: +event.target.value
    }
    setRequestParams(data)
    setIsLoading(true)
    dispatch(GetReports(data))
  }

  return (
    <>
      {!resStatus && resMessage && <OpenSnackbar isOpen={true} message={resMessage} />}

      <PageTitle title="Reports" />
      <DataTable
        columnItems={columnItems}
        isLoading={isLoading}
        totalRecord={totalRecords}
        rowsPerPage={requestParams.limit}
        currentPage={requestParams.offset}
        pageChangeEvent={(e, p) => handlePageChangeEvent(e, p)}
        rowChangeEvent={(e, p) => handleRowChangeEvent(e, p)}
        filterEvent={(e) => handleFilterEvent(e)}
      >
        {reports.map((report) => {
          return (
            <TableRow onClick={() => goToDetail(report.id)} hover key={report.id}>
              <TableCell>{report.id}</TableCell>
              <TableCell>{report.reportedUserId}</TableCell>
              <TableCell>{report.userId}</TableCell>
              <TableCell>{report.reportedRentalId}</TableCell>
              <TableCell>{report.isBlocked ? 'Yes' : 'No'}</TableCell>
              <TableCell>{report.isActive ? 'Yes' : 'No'}</TableCell>
              <TableCell align="right">
                <Button onClick={(e) => goToEdit(e, report.id)} color="primary" startIcon={<EditIcon />}>
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

export default Reports
