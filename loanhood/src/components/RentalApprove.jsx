import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, CardContent, CardHeader, CircularProgress, Grid, TextField } from '@material-ui/core'
import { ChangeRentalState } from 'state/actions/rental'

function RentalApprove({ id, onSuccess }) {
  const dispatch = useDispatch()
  const [isApproveLoading, setIsApproveLoading] = useState(false)
  const [isRejectLoading, setIsRejectLoading] = useState(false)
  const [review, setReview] = useState('')
  const resStatus = useSelector((state) => state.rental.resStatus)
  const resMessage = useSelector((state) => state.rental.resMessage)

  useEffect(() => {
    if (resStatus && resMessage) {
      if (isApproveLoading) {
        setIsApproveLoading(false)
        onSuccess('approve')
      }
      if (isRejectLoading) {
        setIsRejectLoading(false)
        onSuccess('reject')
      }
    }
    if (!resStatus && resMessage) {
      setIsApproveLoading(false)
      setIsRejectLoading(false)
    }
  }, [resStatus, resMessage])

  function handleChange(e) {
    setReview(e.target.value)
  }

  function addReview(e, type) {
    e.preventDefault()
    const data = {
      status: type ? 'approved' : 'rejected',
      message: review
    }
    if (type) {
      dispatch(ChangeRentalState(id, data))
      setIsApproveLoading(true)
    } else {
      dispatch(ChangeRentalState(id, data))
      setIsRejectLoading(true)
    }
  }
  return (
    <Card className="rental-item">
      <CardHeader title="Add Review"></CardHeader>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={8}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Reason for rejection"
              name="review"
              size="small"
              multiline
              rows={4}
              defaultValue={review}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              style={{ margin: '15px 0' }}
              variant="contained"
              onClick={(e) => addReview(e, true)}
              fullWidth
              type="submit"
              color="primary"
              disabled={isApproveLoading}
              endIcon={isApproveLoading && <CircularProgress color="inherit" size={20} />}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              onClick={(e) => addReview(e, false)}
              fullWidth
              type="submit"
              color="primary"
              disabled={isRejectLoading || !review}
              endIcon={isRejectLoading && <CircularProgress color="inherit" size={20} />}
            >
              Reject With Message
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
RentalApprove.propTypes = {
  id: PropTypes.string,
  onSuccess: PropTypes.func
}
export default RentalApprove
