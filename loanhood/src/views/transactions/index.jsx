import PageTitle from 'components/PageTitle'
import React, { Fragment, useEffect, useState } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  TablePagination,
  TextField,
  Typography
} from '@material-ui/core'
import FilterListIcon from '@material-ui/icons/FilterList'
import { GetUsers } from 'state/actions/users'
import { useDispatch, useSelector } from 'react-redux'
import { GetAllRentals } from 'state/actions/rental'
import { GetTransactions } from 'state/actions/transaction'
import { useHistory } from 'react-router'
import { appendParams, getQueryVariable, parseParams, removeParam } from 'utils/helper'
const LazyLoadingSelect = React.lazy(() => import('components/LazyLoadingSelect'))
const LazyLoadingSelectRental = React.lazy(() => import('components/LazyLoadingSelectRental'))
const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    button: {
      marginTop: '-20px',
      marginLeft: '40px'
    },
    notification: {
      display: 'flex',
      justifyContent: 'between',
      backgroundColor: '#f5f5f5',
      borderRadius: '5px'
    },
    notificationRead: {
      display: 'flex',
      justifyContent: 'between'
    },
    rentalImage: {
      width: '100px'
    },

    dropdown: {
      marginLeft: '50px'
    },
    secondary: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'start',
      justifyContent: 'space-between',
      width: '100%'
    },
    loader: {
      position: 'absolute',
      height: '100%',
      width: '100%',
      backgroundColor: 'rgba(255,255,255,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      top: 0,
      left: 0
    },
    large: {
      width: '70px',
      height: '70px'
    },
    rentalTitle: {
      display: 'box',
      lineClamp: '2',
      boxOrient: 'vertical',
      overflow: 'hidden'
    },
    imgContain: {
      align: 'flex-start',
      width: '40%'
    },
    firstBox: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    backgroundColor: {
      backgroundColor: '#f2f2f2'
    },
    rootCard: {
      display: 'flex',
      width: 'auto',
      backgroundColor: '#f2f2f2',
      boxShadow: 'none',
      padding: '0',
      border: '1px solid #f5f5f5'
    },
    details: {
      padding: '0',
      display: 'flex',
      alignSelf: 'center',
      height: '100%',
      flexDirection: 'column'
    },
    content: {
      paddingBottom: '0',
      flex: '1 0 auto'
    },
    cover: {
      width: '100px',
      height: '100px',
      paddingBottom: '0'
    },
    alignSelfEnd: {
      textAlign: 'right'
    },
    gridContainer: {
      paddingTop: '20px'
    },
    listItem: {
      cursor: 'default'
    }
  })
)

function Transactions() {
  const rentalIdParam = getQueryVariable('rentalId')
  const userIdParam = getQueryVariable('userId')

  const classes = useStyles()
  const dispatch = useDispatch()
  const history = useHistory()
  const params = parseParams(location.search)
  const searchValue = getQueryVariable('search') || ''
  const [requestParams, setRequestParams] = useState(getRequestParams())
  const [timer, setTimer] = useState(null)
  const [transactionList, setTransactionList] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [currentFilter, setCurrentFilter] = useState({})
  const [clear, setClear] = useState(false)
  const transactions = useSelector((state) => state.transaction.transactions)
  useEffect(() => {
    requestParams && getTransactions(requestParams)
  }, [requestParams])

  useEffect(() => {
    if (transactions) {
      setTransactionList(transactions.rows)
      setTotalCount(transactions.count)
      setIsLoading(false)
    }
  }, [transactions])

  // useEffect(() => {
  //   return history.listen((e) => {
  //     setRequestParams(getRequestParams(e.search))
  //     // changeTab(getActiveTabName(e.search))
  //   })
  // }, [history])

  function getRequestParams(e) {
    const data = e ? parseParams(e) : params
    return {
      offset: Number(data.page) - 1 || 0,
      limit: Number(data.limit) || 10,
      searchValue: data.search || '',
      sortField: Number(data.sortField) || 'createdAt',
      sortOrder: data.sortOrder || -1,
      filter: [{ userId: data.userId && data.userId, rentalId: data.userId && data.rentalId }] || []
    }
  }

  function getTransactions(data) {
    data && setRequestParams(data)
    dispatch(GetTransactions(data || requestParams))
    setIsLoading(true)
  }
  function handleFilter() {
    setIsFilterOpen(!isFilterOpen)
  }
  function clearFilter() {
    const allParams = ['page', 'firstName', 'lastName', 'userName', 'userId', 'rentalId', 'rentalTitle', 'limit', 'rentalId']
    setClear(true)
    setCurrentFilter({})
    allParams.forEach((m) => removeParam(m))

    const data = {
      offset: 0,
      limit: 10,
      searchValue: '',
      sortField: 'createdAt',
      sortOrder: -1,
      filter: []
    }
    setRequestParams(data)
    setIsFilterOpen(!isFilterOpen)
  }

  function applyFilter() {
    const data = []
    for (const key in currentFilter) {
      if (currentFilter[key]) {
        data.push({ [key]: currentFilter[key] })
      }
    }
    // setAppendParamsState(true)
    currentFilter && currentFilter.title && appendParams({ rentalTitle: currentFilter.title, rentalId: currentFilter.rentalId })
    currentFilter &&
      currentFilter.user &&
      currentFilter.user.id &&
      appendParams({
        userId: currentFilter?.user?.id,
        firstName: currentFilter?.user?.firstName,
        lastName: currentFilter?.user?.lastName,
        userName: currentFilter?.user?.userName
      })
    // appendParams({ userId: currentFilter.user.id, rentalId: currentFilter.rentalId })
    removeParam('page')
    const updated = {
      ...requestParams,
      filter: [{ userId: userIdParam || currentFilter?.user?.id, rentalId: rentalIdParam || currentFilter?.rentalId }],
      offset: 0,
      limit: 10
    }
    // appendParams({})
    setRequestParams(updated)
    setIsFilterOpen(!isFilterOpen)
  }

  function handleFilterChange(e, data, type) {
    if (type === 'user') {
      setCurrentFilter({ ...currentFilter, user: data })
    } else if (type === 'rental') {
      setCurrentFilter({ ...currentFilter, rentalId: e, selectedUserFromRental: data.user, title: data.title })
    }
  }

  function handleChange(e) {
    if (timer) {
      clearTimeout(timer)
      setTimer(null)
    }
    setTimer(
      setTimeout(() => {
        handleSearch(e.target.value)
        appendParams({ search: e.target.value })
      }, 500)
    )
  }

  function handleSearch(text) {
    const data = {
      ...requestParams,
      searchValue: text,
      offset: 0
    }
    setRequestParams(data)
    setIsLoading(true)
    dispatch(GetTransactions(data))
  }

  function handlePageChange(e, page) {
    setRequestParams({ ...requestParams, offset: page })
    appendParams({ page: page + 1 })
  }

  function handleRowChange(e, p) {
    appendParams({ limit: +e.target.value })
    getTransactions({ offset: 0, limit: +e.target.value })
  }
  function gotoTransactionDetails(id) {
    history.push(`/rentals/transaction/detail/${id}`)
  }

  return (
    <>
      <PageTitle title="Transactions" />
      <Drawer
        className="filterDrawer"
        variant="temporary"
        anchor={'right'}
        open={isFilterOpen}
        onClose={handleFilter}
        ModalProps={{
          keepMounted: true
        }}
      >
        <div className="drawer-inner">
          <Typography variant="h4">Apply Filter</Typography>
          <div style={{ textAlign: 'right' }}>
            <Button onClick={clearFilter} color="primary">
              Clear Filter
            </Button>
          </div>
          <LazyLoadingSelect
            apiCall={isFilterOpen}
            api={GetUsers}
            selectedId={parseInt(userIdParam) || parseInt(currentFilter?.user?.id)}
            placeholder="Users"
            storeName="users"
            selectorName="users"
            getSelectedBrand={(e, id) => handleFilterChange(e, id, 'user')}
            selectedUser={currentFilter.user || currentFilter.selectedUserFromRental}
            clearData={clear}
          />
          <LazyLoadingSelectRental
            apiCall={isFilterOpen}
            api={GetAllRentals}
            selectedId={parseInt(rentalIdParam) || parseInt(currentFilter.rentalId)}
            placeholder="Rentals"
            storeName="rental"
            selectorName="allRentals"
            getSelectedBrand={(e, id) => handleFilterChange(e, id, 'rental')}
            selectedUserId={currentFilter?.user?.id}
            clearUserData={clear}
          />
          <Button onClick={applyFilter} variant="contained" fullWidth size="large" type="submit" color="primary">
            Apply Filter
          </Button>
        </div>
      </Drawer>
      <Card className="transaction-list">
        <CardContent className="">
          <Box className={classes.root} p={2}>
            <TextField
              type="search"
              size="small"
              label="Search..."
              variant="outlined"
              onChange={(e) => handleChange(e)}
              defaultValue={searchValue}
            ></TextField>
            <IconButton onClick={handleFilter}>
              <FilterListIcon fontSize="inherit" />
            </IconButton>
          </Box>
          <List>
            {totalCount === 0 && (
              <Typography variant="subtitle2" noWrap align="center">
                No Record found.
              </Typography>
            )}
            {transactionList.map((item) => {
              return (
                <Fragment key={item.id}>
                  <ListItem alignItems="flex-start" className={classes.listItem}>
                    <Grid container spacing={5} className={classes.gridContainer}>
                      <Grid item xs={4}>
                        <Card className={classes.rootCard}>
                          <CardMedia
                            className={classes.cover}
                            component="img"
                            image={item?.rental?.rentalImages[0]?.imageUrl.replace('cdn.loanhood.com/', 'ik.imagekit.io/w6paupmag1w/')}
                            title={item?.rental?.title}
                          />
                          <div className={classes.details}>
                            <CardContent className={classes.content} style={{ paddingBottom: '0' }}>
                              <Typography component="h6" variant="h6">
                                Item <Typography component="span" color="textSecondary">{`#${item.id}`}</Typography>
                              </Typography>
                              <Typography className={classes.rentalTitle} variant="h6">
                                {item?.rental?.title}
                              </Typography>
                            </CardContent>
                          </div>
                        </Card>
                        <Box pt={1}>
                          <Typography component="h6" variant="h6">
                            Status
                          </Typography>
                        </Box>
                        <Box pt={1}>
                          <Typography component="h6" variant="h6">
                            {item?.currentStatus}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={2}>
                        {/* <Box p={2} component="span">
                    <Typography component="span" className={classes.rentalTitle}>
                      Dates
                    </Typography>
                  </Box> */}
                        <Typography component="span">
                          <Typography component="span" variant="h6">
                            Dates
                          </Typography>
                          <Box py={2} component="p">
                            <Typography component="span" display="block">
                              {`${item?.startAt} -`}
                            </Typography>
                            <Typography component="span" display="block">
                              {item?.endAt}
                            </Typography>
                          </Box>

                          {item?.currentStatus ===
                            ('confirmed' ||
                              'deliveryWaitingForLoaner' ||
                              'delieveryShippedByLoaner' ||
                              'receivedByBorrower' ||
                              'returnShippedByBorrower' ||
                              'paymentSuccess' ||
                              'returnWaitingForBorrower' ||
                              'returnShippedByBorrower') && (
                            <Box component="p" pt={1.5}>
                              <Typography component="span" variant="h6">
                                Delivery Method
                              </Typography>
                              <Typography component="span" display="block">
                                By Mail
                              </Typography>
                            </Box>
                          )}
                          {item?.currentStatus === ('isPersonCollectionPending' || 'inPersonReturnPending') && (
                            <Box component="p" pt={1.5}>
                              <Typography component="span" variant="h6">
                                Delivery Method
                              </Typography>
                              <Typography component="span" display="block">
                                By Courier
                              </Typography>
                            </Box>
                          )}
                        </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography component="span">
                          <Typography component="span" variant="h6">
                            Loaner
                          </Typography>
                          <Box py={1}>
                            <Typography component="span" variant="h6">
                              {`${item?.loaner?.firstName} ${item?.loaner?.lastName}`}
                            </Typography>
                          </Box>

                          <Box component="p">
                            <Typography component="span" display="block">
                              {item?.loanerAddress?.address1}
                            </Typography>
                            <Typography component="span" display="block">
                              {item?.loanerAddress?.address2}
                            </Typography>
                            <Typography component="span" display="block">
                              {item?.loanerAddress?.city}
                            </Typography>
                            <Typography component="span" display="block">
                              {item?.loanerAddress?.postCode}
                            </Typography>
                          </Box>
                        </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography component="span">
                          <Typography component="span" variant="h6">
                            Borrower
                          </Typography>
                          <Box py={1}>
                            <Typography component="span" variant="h6">
                              {`${item?.borrower?.firstName} ${item?.borrower?.lastName}`}
                            </Typography>
                          </Box>

                          <Box component="p">
                            <Typography component="span" display="block">
                              {item?.borrowerAddress?.address1}
                            </Typography>
                            <Typography component="span" display="block">
                              {item?.borrowerAddress?.address2}
                            </Typography>
                            <Typography component="span" display="block">
                              {item?.borrowerAddress?.city}
                            </Typography>
                            <Typography component="span" display="block">
                              {item?.borrowerAddress?.postalCode}
                            </Typography>
                          </Box>
                        </Typography>
                      </Grid>
                      <Grid item xs={2} className={classes.alignSelfEnd}>
                        <Button variant="contained" color="primary" onClick={() => gotoTransactionDetails(item.id)}>
                          Details
                        </Button>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <Divider variant="fullWidth" component="li" />
                </Fragment>
              )
            })}
          </List>

          {totalCount !== 0 && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalCount}
              rowsPerPage={requestParams.limit}
              page={requestParams.offset}
              onChangePage={(e, p) => handlePageChange(e, p)}
              onChangeRowsPerPage={(e, p) => handleRowChange(e, p)}
            />
          )}
          {isLoading && (
            <Box className="loader" component="div">
              <CircularProgress color="primary" size={30} />
            </Box>
          )}
        </CardContent>
      </Card>
    </>
  )
}

export default Transactions
