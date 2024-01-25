import { Box, Button, Card, CardContent, CircularProgress, FormControlLabel, Grid, Switch, TextField } from '@material-ui/core'
import PageTitle from 'components/PageTitle'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router'
import { GetReportDetail, UpdateReport } from 'state/actions/report'
import EditIcon from '@material-ui/icons/Edit'
function ReportDetail() {
  const { id, type } = useParams()
  const dispatch = useDispatch()
  const history = useHistory()
  const [report, setReport] = useState({})
  const [isActive, setIsActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const reportDetails = useSelector((state) => state.report.reportDetail)

  useEffect(() => {
    if (id) {
      setIsLoading(true)
      dispatch(GetReportDetail(id))
    }
  }, [])

  useEffect(() => {
    reportDetails && setReport(reportDetails)
    reportDetails && setIsActive(reportDetails.isActive)
    setIsLoading(false)
  }, [reportDetails])

  function handleChange(e) {
    setIsActive(e.target.checked)
  }

  function handleSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    const data = { isActive: isActive }
    dispatch(UpdateReport(id, data))
    history.push('/reports')
  }

  function handleEditInDetail() {
    history.push('/reports/edit/' + id)
  }

  return (
    <>
      <PageTitle
        EditIcon={<EditIcon />}
        EditBtnInDetail={type === 'detail' ? 'Edit' : ''}
        handleEditInDetail={() => handleEditInDetail()}
      />
      {isLoading && (
        <Box className="loader" component="div">
          <CircularProgress color="primary" size={30} />
        </Box>
      )}
      <Grid container style={{ justifyContent: 'center' }} spacing={3}>
        <Grid item md={5}>
          <Card>
            <CardContent>
              <form>
                <Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Reporting User"
                        type="text"
                        name="reportingUser"
                        autoFocus
                        disabled
                        value={report.userId || ''}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Reported User"
                        name="reportedUser"
                        disabled
                        value={report.reportedUserId || ''}
                        variant="outlined"
                      ></TextField>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      disabled
                      label="Reported Rental"
                      name="reportedRental"
                      value={report.reportedRentalId || ''}
                      variant="outlined"
                    ></TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="isBlocked"
                      name="isBlocked"
                      disabled
                      value={report.isBlocked || ''}
                      variant="outlined"
                    ></TextField>
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      style={{ marginTop: '15px' }}
                      className="rental-switch"
                      control={<Switch color="primary" checked={isActive} name="isActive" onChange={(e) => handleChange(e)} />}
                      disabled={type === 'detail'}
                      label="isActive"
                      labelPlacement="start"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label="text"
                      name="text"
                      disabled
                      value={report.text || ''}
                      variant="outlined"
                    ></TextField>
                  </Grid>
                  {type === 'edit' && (
                    <Grid item xs={12} sm={12}>
                      <Button onClick={(e) => handleSubmit(e)} variant="contained" fullWidth size="large" type="submit" color="primary">
                        {'Submit'}
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
export default ReportDetail
