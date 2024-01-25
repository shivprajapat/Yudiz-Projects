import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TablePagination,
  TextField,
  MenuItem,
  Typography
} from '@material-ui/core'
import PageTitle from 'components/PageTitle'
import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { GetNotifications } from 'state/actions/notification'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { RentalTransactionsUpdateState } from 'state/actions/rental'
import { formateDateTime } from 'utils/helper'
const useStyles = makeStyles((theme) =>
  createStyles({
    button: {
      marginTop: '-20px',
      marginLeft: '40px'
    },
    notification: {
      display: 'flex',
      justifyContent: 'between',
      backgroundColor: '#f5f5f5',
      borderRadius: '5px',
      padding: '25px'
    },
    notificationRead: {
      display: 'flex',
      justifyContent: 'between',
      padding: '25px'
    },
    rentalImage: {
      width: '100px'
    },

    dropdown: {
      marginLeft: '50px'
    },
    secondary: {
      display: 'flex',
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
    materialListItem: {
      padding: 0
    },
    cardContent: {
      padding: 0
    },
    materialList: {
      paddingTop: 0
    }
  })
)
function Notifications() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const history = useHistory()
  const [requestParams, setRequestParams] = useState({ offset: 0, limit: 10, isUpdated: false })
  const [totalCount, setTotalCount] = useState('')
  const [notificationList, setNotificationList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const notifications = useSelector((state) => state.notification.notifications)
  const [inboxState, setInboxState] = useState('')
  const [showAllNotificationState, setShowAllNotificationState] = useState('')
  useEffect(() => {
    getNotification()
  }, [])

  useEffect(() => {
    if (notifications) {
      setNotificationList(notifications.rows)
      setTotalCount(notifications.count)
      setIsLoading(false)
    }
  }, [notifications])

  useEffect(() => {
    setInboxState('inbox')
  }, [])
  function handlePageChange(e, p) {
    getNotification({ offset: p, limit: requestParams.limit })
  }
  function handleRowChange(e, p) {
    getNotification({ offset: 0, limit: +e.target.value })
  }
  function goToRentalTransaction(item) {
    history.push('rentals/transaction/edit/' + item.rentalTransactionId)
  }
  function getNotification(data) {
    data && setRequestParams(data)
    dispatch(GetNotifications(data || requestParams))
    setIsLoading(true)
  }
  function goToChatPage(item) {
    history.push(`chat/${item.rentalTransactionId}/sender/${item.senderId}/receiver/${item.receiverId}`)
  }
  function handleOnChange(e, id, lonerId) {
    dispatch(RentalTransactionsUpdateState({ rentalTransactionId: id, loanerId: lonerId, state: e.target.value, isUpdated: true }))
  }
  function showInbox() {
    if (inboxState !== 'inbox') {
      setInboxState('inbox')
      setShowAllNotificationState('')
      getNotification({ offset: 0, limit: 10, isUpdated: false })
    }
  }
  function showAllNotification() {
    if (showAllNotificationState !== 'all') {
      setShowAllNotificationState('all')
      setInboxState('')
      getNotification({ offset: 0, limit: 10 })
    }
  }
  return (
    <>
      <PageTitle
        title="Notifications"
        inbox
        inboxState={inboxState}
        showAllNotificationState={showAllNotificationState}
        showInbox={() => showInbox()}
        showAllNotification={() => showAllNotification()}
      />
      <Card className="notification-list">
        <CardContent className={classes.cardContent}>
          <List className={classes.materialList}>
            {notificationList.map((item) => {
              return (
                <Fragment key={item.id}>
                  <div className={(!item.isRead && classes.notification) || classes.notificationRead}>
                    <ListItem
                      onClick={() =>
                        ![
                          'paymentPending',
                          'requestCanceled',
                          'confirmed',
                          'deliveryWaitingForLoaner',
                          'deliveryShippedByLoaner',
                          'receivedByBorrower',
                          'completed',
                          'inPersonCollectionPending'
                        ].includes(item.rentalTransaction.currentStatus) && goToRentalTransaction(item)
                      }
                      alignItems="flex-start"
                      className={classes.materialListItem}
                    >
                      <ListItemAvatar>
                        <Avatar
                          alt={item.sender.userName}
                          src={item.sender.avatarUrl.replace('cdn.loanhood.com/', 'ik.imagekit.io/w6paupmag1w/')}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.sender.firstName + ' ' + item.sender.lastName}
                        secondary={
                          <>
                            <Typography component="span">{item.message}</Typography>
                            <Typography component="span" display="block">
                              Time : {formateDateTime(item.createdAt)}
                            </Typography>

                            <Typography component="span" className={classes.secondary}>
                              {item.rentalTransaction.borrowerId === item.sender.id ? (
                                <Typography component="span" className={classes.borrowerSecondary}>
                                  <Typography component="span" variant="h6">
                                    Borrower
                                  </Typography>
                                  <Typography component="span" display="block">
                                    Name : {item.sender.firstName} {item.sender.lastName}
                                  </Typography>
                                  <Typography component="span" display="block">
                                    Username : {item.sender.userName}
                                  </Typography>
                                  <Typography component="span" display="block">
                                    Email :{item.sender.emailId}
                                  </Typography>
                                </Typography>
                              ) : (
                                <Typography component="span" className={classes.borrowerSecondary}>
                                  <Typography component="span" variant="h6">
                                    Borrower
                                  </Typography>
                                  <Typography component="span" display="block">
                                    Name : {item.receiver.firstName} {item.receiver.lastName}
                                  </Typography>
                                  <Typography component="span" display="block">
                                    Username : {item.receiver.userName}
                                  </Typography>
                                  <Typography component="span" display="block">
                                    Email :{item.receiver.emailId}
                                  </Typography>
                                </Typography>
                              )}
                              {item.rentalTransaction.loanerId === item.receiver.id ? (
                                <Typography component="span" className={classes.loanerSecondary}>
                                  <Typography component="span" variant="h6">
                                    Loaner
                                  </Typography>
                                  <Typography component="span" display="block">
                                    Name : {item.receiver.firstName} {item.receiver.lastName}
                                  </Typography>
                                  <Typography component="span" display="block">
                                    Username : {item.receiver.userName}
                                  </Typography>
                                  <Typography component="span" display="block">
                                    Email :{item.receiver.emailId}
                                  </Typography>
                                </Typography>
                              ) : (
                                <Typography component="span" className={classes.loanerSecondary}>
                                  <Typography component="span" variant="h6">
                                    Loaner
                                  </Typography>
                                  <Typography component="span" display="block">
                                    Name : {item.sender.firstName} {item.sender.lastName}
                                  </Typography>
                                  <Typography component="span" display="block">
                                    Username : {item.sender.userName}
                                  </Typography>
                                  <Typography component="span" display="block">
                                    Email :{item.sender.emailId}
                                  </Typography>
                                </Typography>
                              )}
                              <Typography component="span" className={classes.rentalSecondary}>
                                {item?.rental?.title && <Typography component="span">Rental</Typography>}
                                {item?.rental?.title && <span>Title : {item?.rental?.title}</span>}
                                {item?.rental?.rentalImages && (
                                  <img
                                    src={item?.rental?.rentalImages[0]?.imageUrl.replace(
                                      'cdn.loanhood.com/',
                                      'ik.imagekit.io/w6paupmag1w/'
                                    )}
                                    className={classes.rentalImage}
                                  />
                                )}
                              </Typography>
                            </Typography>
                            <Typography>
                              {[
                                'paymentPending',
                                'requestCanceled',
                                'confirmed',
                                'deliveryWaitingForLoaner',
                                'deliveryShippedByLoaner',
                                'receivedByBorrower',
                                'completed',
                                'inPersonCollectionPending'
                              ].includes(item.rentalTransaction.currentStatus) && 'Not Editable because transaction state is not editable'}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <div>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        select
                        size="small"
                        label="Current State"
                        disabled={[
                          'paymentPending',
                          'requestCanceled',
                          'confirmed',
                          'deliveryWaitingForLoaner',
                          'deliveryShippedByLoaner',
                          'receivedByBorrower',
                          'completed',
                          'inPersonCollectionPending'
                        ].includes(item.rentalTransaction.currentStatus)}
                        defaultValue={item.rentalTransaction.currentStatus}
                        name="currentStatus"
                        onChange={(e) => handleOnChange(e, item.rentalTransactionId, item.rental.userId)}
                      >
                        <MenuItem value={item.rentalTransaction.currentStatus}>{item.rentalTransaction.currentStatus}</MenuItem>
                        {(item.rentalTransaction.currentStatus === ('confirmed' || 'receivedByBorrower' || 'inPersonReturnPending') &&
                          ['deliveryShippedByLoaner', 'completed'].map((e) => {
                            return (
                              <MenuItem key={e} value={e}>
                                {e}
                              </MenuItem>
                            )
                          })) ||
                          (item.rentalTransaction.currentStatus === 'requestPending' &&
                            ['requestAccepted', 'requestDeclined'].map((e) => {
                              return (
                                <MenuItem key={e} value={e}>
                                  {e}
                                </MenuItem>
                              )
                            })) ||
                          (item.rentalTransaction.currentStatus === 'returnShippedByBorrower' && (
                            <MenuItem value={'completed'}>{'completed'}</MenuItem>
                          ))}
                      </TextField>
                      {item.key === 'chat' && (
                        <div>
                          <Button color="primary" onClick={() => goToChatPage(item)}>
                            Reply
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <Divider variant="fullWidth" component="li" />
                </Fragment>
              )
            })}
          </List>
          {totalCount && (
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

export default Notifications
