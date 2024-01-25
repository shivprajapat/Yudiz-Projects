import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link, useHistory } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  TextField,
  Typography
} from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import PageTitle from 'components/PageTitle'
import OpenSnackbar from 'components/Snackbar'
import { GetTransactionDetail, RentalTransactionsUpdateState } from 'state/actions/rental'
import { formateDate } from 'utils/helper'

function RentalTransactionDetail() {
  const { id, type } = useParams()
  const history = useHistory()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState()
  const [isLoading, setIsLoading] = useState()
  const transactionDetail = useSelector((state) => state.rental.transactionDetail)
  const resStatus = useSelector((state) => state.rental.resStatus)
  const resMessage = useSelector((state) => state.rental.resMessage)
  const [currentStatus, setCurrentStatus] = useState()
  useEffect(() => {
    if (id) {
      dispatch(GetTransactionDetail(id))
    }
  }, [])

  useEffect(() => {
    if (transactionDetail) {
      setFormData(transactionDetail)
      setCurrentStatus(transactionDetail.currentStatus)
    }
  }, [transactionDetail])

  useEffect(() => {
    if (resStatus && resMessage) {
      setIsLoading(false)
      history.goBack()
    }
    if (!resStatus && resMessage) {
      setIsLoading(false)
    }
  }, [resStatus, resMessage])

  function handleOnChange(e) {
    if (e.target.name === 'currentStatus') {
      setCurrentStatus(e.target.value)
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }
  }

  function updateTransition() {
    dispatch(RentalTransactionsUpdateState({ rentalTransactionId: id, loanerId: formData.loaner.id, state: currentStatus }))
    setIsLoading(true)
    setFormData({ ...transactionDetail, currentStatus: currentStatus })
  }
  function handleEditInDetail() {
    history.push('/rentals/transaction/edit/' + id)
  }
  return (
    <>
      {resMessage && <OpenSnackbar isOpen={true} message={resMessage} />}
      <PageTitle
        title={`Transaction ${type === 'edit' ? 'Edit' : 'Detail'}`}
        EditIcon={<EditIcon />}
        EditBtnDisabled={['completed'].includes(formData?.currentStatus)}
        EditBtnInDetail={type === 'detail' ? 'Edit' : ''}
        handleEditInDetail={() => handleEditInDetail()}
      />
      {formData && (
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item sm={4}>
                <div className="transaction-img">
                  <img
                    src={formData?.rental?.rentalImages[0]?.imageUrl.replace('cdn.loanhood.com/', 'ik.imagekit.io/w6paupmag1w/')}
                    alt={formData?.rental?.title}
                  />
                </div>
              </Grid>
              <Grid item sm={8}>
                <Box pb={2} className="transaction-detail">
                  <Typography variant="h6">Rental Title</Typography>
                  <Typography variant="body1">
                    <Link to={'/rentals/detail/' + formData?.rental?.id}>{formData?.rental?.title}</Link>
                  </Typography>
                </Box>
                {formData?.loaner && (
                  <Box pb={2} className="transaction-detail">
                    <Typography variant="h6">Loaner User Name</Typography>
                    <Typography variant="body1">
                      <Link to={'/users/detail/' + formData?.loaner?.dryCleanPrice}>{formData?.loaner?.userName}</Link>
                    </Typography>
                  </Box>
                )}
                {formData?.loanerAddress && (
                  <Box pb={2} className="transaction-detail">
                    <Typography variant="h6">Loaner address</Typography>
                    <Typography variant="body1">
                      {formData?.loanerAddress?.address1}, {formData?.loanerAddress?.address2}, {formData?.loanerAddress?.city},{' '}
                      {formData?.loanerAddress?.postCode}
                    </Typography>
                  </Box>
                )}
                {formData?.borrower && (
                  <Box pb={2} className="transaction-detail">
                    <Typography variant="h6">Borrower User Name</Typography>
                    <Typography variant="body1">
                      <Link to={'/users/detail/' + formData?.borrower?.id}>{formData?.borrower?.userName}</Link>
                    </Typography>
                  </Box>
                )}
                {formData?.borrowerAddress && (
                  <Box pb={2} className="transaction-detail">
                    <Typography variant="h6">Borrower address</Typography>
                    <Typography variant="body1">
                      {formData?.borrowerAddress?.address1}, {formData?.borrowerAddress?.address2}, {formData?.borrowerAddress?.city},{' '}
                      {formData?.borrowerAddress?.postCode}
                    </Typography>
                  </Box>
                )}
              </Grid>
              <Grid item sm={4}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  type="text"
                  size="small"
                  disabled
                  label="Start At"
                  defaultValue={formData?.startAt}
                />
              </Grid>
              <Grid item sm={4}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  type="text"
                  size="small"
                  disabled
                  label="End At"
                  defaultValue={formData?.endAt}
                />
              </Grid>
              <Grid item sm={4}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  select
                  size="small"
                  disabled={type === 'detail' || ['completed'].includes(formData?.currentStatus)}
                  label="Current State"
                  value={currentStatus}
                  name="currentStatus"
                  onChange={handleOnChange}
                >
                  <MenuItem value={formData?.currentStatus}>{formData?.currentStatus}</MenuItem>
                  {(formData?.currentStatus === ('confirmed' || 'receivedByBorrower' || 'inPersonReturnPending') &&
                    ['deliveryShippedByLoaner', 'completed'].map((e) => {
                      return (
                        <MenuItem key={e} value={e}>
                          {e}
                        </MenuItem>
                      )
                    })) ||
                    (formData.currentStatus === 'requestPending' &&
                      ['requestAccepted', 'requestDeclined'].map((e) => {
                        return (
                          <MenuItem key={e} value={e}>
                            {e}
                          </MenuItem>
                        )
                      })) ||
                    (formData.currentStatus === 'requestDeclined' &&
                      ['requestAccepted', 'requestPending'].map((e) => {
                        return (
                          <MenuItem key={e} value={e}>
                            {e}
                          </MenuItem>
                        )
                      })) ||
                    (formData.currentStatus === 'returnShippedByBorrower' && <MenuItem value={'completed'}>{'completed'}</MenuItem>) ||
                    (formData.currentStatus === 'deliveryWaitingForLoaner' &&
                      ['receivedByLoaner', 'completed'].map((e) => {
                        return (
                          <MenuItem key={e} value={e}>
                            {e}
                          </MenuItem>
                        )
                      }))}
                </TextField>
              </Grid>
              <Grid item sm={4}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  type="text"
                  size="small"
                  disabled
                  label="Original Price"
                  defaultValue={formData?.rental?.originalPrice}
                />
              </Grid>
              <Grid item sm={4}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  type="text"
                  size="small"
                  disabled
                  label="Rental Price Per Week"
                  defaultValue={formData?.rental?.rentalPricePerWeek}
                />
              </Grid>
              <Grid item sm={4}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  type="text"
                  size="small"
                  disabled
                  label="Delivery Price"
                  defaultValue={formData.deliveryPrice}
                />
              </Grid>
              <Grid item sm={4}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  type="text"
                  size="small"
                  disabled
                  label="Dry Clean Price"
                  defaultValue={formData.dryCleanPrice}
                />
              </Grid>
              <Grid item sm={4}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  type="text"
                  size="small"
                  disabled
                  label="Borrower Service Fee"
                  defaultValue={formData?.rental?.borrowerServiceFee}
                />
              </Grid>
              <Grid item sm={4}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  type="text"
                  size="small"
                  disabled
                  label="Loaner Service Fee"
                  defaultValue={formData?.rental?.loanerServiceFee}
                />
              </Grid>
              <Grid item sm={4}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  type="text"
                  size="small"
                  disabled
                  label="Stripe Payment Id"
                  defaultValue={formData?.stripePaymentId}
                />
              </Grid>
              <Grid item sm={4}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  type="text"
                  size="small"
                  disabled
                  label="Updated At"
                  defaultValue={formateDate(formData?.updatedAt)}
                />
              </Grid>
              <Grid item sm={4}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  type="text"
                  size="small"
                  disabled
                  label="Created At"
                  defaultValue={formateDate(formData?.createdAt)}
                />
              </Grid>
              {type === 'edit' && (
                <Grid item sm={4}>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                    size="large"
                    onClick={updateTransition}
                    endIcon={isLoading && <CircularProgress color="inherit" size={20} />}
                  >
                    Update
                  </Button>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      )}
      {formData && (
        <Card className="rental-item">
          <CardHeader title="Rental transaction states"></CardHeader>
          <CardContent>
            <List>
              {formData.rentaltransactionstates.map((item, i) => (
                <ListItem key={i}>
                  <ListItemText primary={item.state} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default RentalTransactionDetail
