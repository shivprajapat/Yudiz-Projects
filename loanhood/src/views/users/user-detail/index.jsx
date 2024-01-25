import React, { Suspense, useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, Divider, Tab, Tabs } from '@material-ui/core'
import TabPanel from 'components/TabPanel'
import PageTitle from 'components/PageTitle'
import { GetUserBorrowerRentals, GetUserDetail, GetUserLoanRentals, GetUserRentals, DeleteUser } from 'state/actions/users'
import OpenSnackbar from 'components/Snackbar'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import AddressListing from 'components/AddressListing'
import { GetAddressOfUser } from 'state/actions/address'

const UserForm = React.lazy(() => import('views/users/user-form'))
const RentalListing = React.lazy(() => import('components/RentalListing'))
const RentalTransactions = React.lazy(() => import('components/RentalTransactions'))
const ConfirmDialog = React.lazy(() => import('components/ConfirmDialog'))

function UserDetail() {
  const { id, type } = useParams()
  const history = useHistory()
  const dispatch = useDispatch()
  const [value, setValue] = useState(0)
  const [user, setUser] = useState({})
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const userDetails = useSelector((state) => state.users.userDetail)
  // const resStatus = useSelector((state) => state.users.resStatus)
  const resMessage = useSelector((state) => state.users.resMessage)
  const userRentals = useSelector((state) => state.users.userRentals)
  const requestParams = {
    offset: 0,
    limit: 10,
    searchValue: '',
    sortField: 'createdAt',
    sortOrder: -1,
    filter: []
  }
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  useEffect(() => {
    if (id) {
      dispatch(GetUserDetail(id))
      dispatch(GetUserRentals(id, requestParams))
    }
  }, [])

  useEffect(() => {
    userDetails && setUser(userDetails)
  }, [userDetails])

  function deleteUser(e) {
    if (e) {
      userDetails.userStatus = 'n'
      dispatch(DeleteUser(id, userDetails))
      history.push('/users')
    } else {
      setIsConfirmOpen(false)
    }
  }
  function handleEditInDetail() {
    history.push('/users/edit/' + id)
  }
  return (
    <>
      {resMessage && <OpenSnackbar isOpen={true} message={resMessage} />}

      {userRentals?.count === 0 ? (
        <PageTitle
          title="User Detail"
          rightButton={type === 'edit' ? 'Delete' : ''}
          icon={<DeleteIcon />}
          EditIcon={<EditIcon />}
          handleBtnEvent={() => setIsConfirmOpen(true)}
          EditBtnInDetail={type === 'detail' ? 'Edit' : ''}
          handleEditInDetail={() => handleEditInDetail()}
          downloadBtn
          id={id}
        />
      ) : (
        <PageTitle
          title="User Detail"
          EditBtnInDetail={type === 'detail' ? 'Edit' : ''}
          handleEditInDetail={() => handleEditInDetail()}
          icon={<DeleteIcon />}
          EditIcon={<EditIcon />}
        />
      )}
      <div className="delete-btn-container">
        <div className="delete-btn">
          {isConfirmOpen && (
            <ConfirmDialog
              open={isConfirmOpen}
              message={'Are you sure that you want to delete this user?'}
              handleResponse={(e) => deleteUser(e)}
            />
          )}
        </div>
      </div>
      <Card style={{ zIndex: 1111 }}>
        <Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
          <Tab label="User" />
          <Tab label="Listed Rentals" />
          <Tab label="Loan Rental Transactions" />
          <Tab label="Borrow Rental Transactions" />
          <Tab label="Address" />
        </Tabs>
        <Divider />
        <CardContent>
          <TabPanel value={value} index={0}>
            <Suspense fallback={<div>Loading...</div>}>
              {user && user.userName && <UserForm data={user} type={type} isUserForRental={false} />}
            </Suspense>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Suspense fallback={<div>Loading...</div>}>
              <RentalListing id={id} api={GetUserRentals} storeName="users" selectorName="userRentals" extraFilter={false} />
            </Suspense>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Suspense fallback={<div>Loading...</div>}>
              <RentalTransactions id={id} api={GetUserLoanRentals} storeName="users" selectorName="userLoanRentals" isFromUser={true} />
            </Suspense>
          </TabPanel>
          <TabPanel value={value} index={3}>
            <Suspense fallback={<div>Loading...</div>}>
              <RentalTransactions
                id={id}
                api={GetUserBorrowerRentals}
                storeName="users"
                selectorName="userBorrowerRentals"
                isFromUser={true}
              />
            </Suspense>
          </TabPanel>
          <TabPanel value={value} index={4}>
            <Suspense fallback={<div>Loading...</div>}>
              <AddressListing id={id} api={GetAddressOfUser} storeName="address" selectorName="userAddress" isFromUser={true} />
            </Suspense>
          </TabPanel>
        </CardContent>
      </Card>
    </>
  )
}

export default UserDetail
