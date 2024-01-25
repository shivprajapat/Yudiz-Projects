import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { TableRow, TableCell, Typography, Button, Avatar } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import PageTitle from 'components/PageTitle'
import DataTable from 'components/DataTable'
import { GetUsers } from 'state/actions/users'
import { getQueryVariable } from 'utils/helper'

const OpenSnackbar = React.lazy(() => import('components/Snackbar'))

function UsersList() {
  const pageNumber = getQueryVariable('page')

  const history = useHistory()
  const dispatch = useDispatch()
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalRecords, setTotalRecords] = useState(0)
  const [requestParams, setRequestParams] = useState({
    offset: (pageNumber && Number(pageNumber) - 1) || 0,
    limit: 10,
    searchValue: '',
    sortField: 'firstName',
    sortOrder: 1
  })
  const [columnItems, setColumnItems] = useState([
    { name: 'id', internalName: 'id', type: 0 },
    { name: 'Profile Image', internalName: 'image', type: 0 },
    { name: 'Full name', internalName: 'firstName', type: 0 },
    { name: 'User Name', internalName: 'userName', type: 0 },
    { name: 'Email', internalName: 'emailId', type: 0 },
    { name: 'Is Test', internalName: 'isTest', type: 0 }
  ])

  const allUsers = useSelector((state) => state.users.users)
  const resStatus = useSelector((state) => state.users.resStatus)
  const resMessage = useSelector((state) => state.users.resMessage)

  useEffect(() => {
    setIsLoading(true)
    dispatch(GetUsers(requestParams))
  }, [])

  useEffect(() => {
    if (allUsers && allUsers.rows) {
      setUsers(allUsers.rows)
      setTotalRecords(allUsers.count)
      setIsLoading(false)
    }
  }, [allUsers])

  useEffect(() => {
    if (!resStatus && resMessage) {
      setIsLoading(false)
    }
  }, [resStatus, resMessage])

  function handleAdd() {
    history.push('/users/add')
  }

  function handleSearch(text) {
    const data = {
      ...requestParams,
      searchValue: text,
      offset: 0
    }
    setRequestParams(data)
    setIsLoading(true)
    dispatch(GetUsers(data))
  }

  function handleRowChangeEvent(event) {
    const data = {
      ...requestParams,
      offset: 0,
      limit: +event.target.value
    }
    setRequestParams(data)
    setIsLoading(true)
    dispatch(GetUsers(data))
  }

  function handlePageChangeEvent(event, page) {
    const data = {
      ...requestParams,
      offset: page
    }

    window.history.pushState({}, null, `/users?page=${page + 1}`)

    setRequestParams(data)
    setIsLoading(true)
    dispatch(GetUsers(data))
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
    dispatch(GetUsers(data))
  }

  function goToDetail(id) {
    history.push('/users/detail/' + id)
  }
  function goToEdit(e, id) {
    e.stopPropagation()
    e.preventDefault()
    history.push('/users/edit/' + id)
  }

  return (
    <>
      {!resStatus && resMessage && <OpenSnackbar isOpen={true} message={resMessage} />}
      <PageTitle title="Users" />
      <DataTable
        columnItems={columnItems}
        isLoading={isLoading}
        searchEvent={(e) => handleSearch(e)}
        addBtnEvent={() => handleAdd()}
        addBtnTxt="Add User"
        totalRecord={totalRecords}
        rowsPerPage={requestParams.limit}
        currentPage={requestParams.offset}
        pageChangeEvent={(e, p) => handlePageChangeEvent(e, p)}
        rowChangeEvent={(e, p) => handleRowChangeEvent(e, p)}
        filterEvent={(e) => handleFilterEvent(e)}
      >
        {users.map((user) => {
          return (
            <TableRow onClick={() => goToDetail(user.id)} hover key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>
                <Avatar
                  variant="rounded"
                  alt={user.firstName}
                  src={user.avatarUrl.replace('cdn.loanhood.com/', 'ik.imagekit.io/w6paupmag1w/').concat('?tr=w-40,h-40')}
                />
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" noWrap>
                  {user.firstName} {user.lastName}
                </Typography>
              </TableCell>
              <TableCell>{user.userName}</TableCell>
              <TableCell>{user.emailId}</TableCell>
              <TableCell>{user.isTest ? 'Yes' : 'No'}</TableCell>
              <TableCell align="right">
                <Button onClick={(e) => goToEdit(e, user.id)} color="primary" startIcon={<EditIcon />}>
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

export default UsersList
