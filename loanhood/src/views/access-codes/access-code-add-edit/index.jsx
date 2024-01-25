import { Button, Card, CardContent, CircularProgress, FormControlLabel, Grid, Switch, TextField } from '@material-ui/core'
import PageTitle from 'components/PageTitle'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router'
import { GetAccessCodeDetail, UpdateAccessCode, AddAccessCode } from 'state/actions/accessCodes'
import EditIcon from '@material-ui/icons/Edit'
import { Controller, useForm } from 'react-hook-form'
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
const OpenSnackbar = React.lazy(() => import('components/Snackbar'))

function AccessCodeAddEdit() {
  const { id, type } = useParams()
  const dispatch = useDispatch()
  const history = useHistory()
  const [code, setCode] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, control, reset } = useForm({})
  const codeDetails = useSelector((state) => state.accessCodes.codeDetail)
  const resMessage = useSelector((state) => state.accessCodes.resMessage)
  const resStatus = useSelector((state) => state.accessCodes.resStatus)

  useEffect(() => {
    if (id) {
      setIsLoading(true)
      dispatch(GetAccessCodeDetail(id))
    }
  }, [])
  useEffect(() => {
    if (codeDetails) {
      setCode(codeDetails)
      setFormData(codeDetails)
      setIsLoading(false)
    }
  }, [codeDetails])

  useEffect(() => {
    if (resMessage && resStatus) {
      setIsLoading(false)

      history.push('/access-codes')
    }
    if (!resStatus && resMessage) {
      setIsLoading(false)
    }
  }, [resMessage, resStatus])

  function setFormData(value) {
    reset({
      aCode: value?.aCode,
      maxUses: value?.maxUses,
      expiryDate: value?.expiryDate,
      status: value?.status,
      numberUsed: value?.numberUsed || 0
    })
  }

  function onSubmit(e) {
    const date = typeof e?.expiryDate === 'object' ? e?.expiryDate?.toISOString() : e?.expiryDate
    const data = {
      aCode: e?.aCode,
      maxUses: e?.maxUses,
      expiryDate: date,
      numberUsed: e?.numberUsed,
      status: e?.status
    }
    if (id) {
      dispatch(UpdateAccessCode({ ...data, id }))
    } else {
      dispatch(AddAccessCode(data))
    }
    setIsLoading(true)
  }

  function handleEditInDetail() {
    history.push('/access-codes/edit/' + id)
  }
  return (
    <>
      {!resStatus && resMessage && <OpenSnackbar isOpen={true} message={resMessage} />}

      <PageTitle
        title={id ? 'Edit Access Code' : 'Add Access Code'}
        EditIcon={<EditIcon />}
        EditBtnInDetail={type === 'detail' ? 'Edit' : ''}
        handleEditInDetail={() => handleEditInDetail()}
      />
      <Grid container style={{ justifyContent: 'center' }} spacing={3}>
        <Grid item md={5}>
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="aCode"
                        control={control}
                        defaultValue={code.aCode || ''}
                        rules={{ required: 'This Field is required' }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Code"
                            type="text"
                            name="aCode"
                            autoFocus
                            disabled={type === 'detail'}
                            value={value}
                            onChange={onChange}
                            helperText={error ? error.message : null}
                            error={!!error}
                            {...register('aCode', {
                              minLength: {
                                value: 5,
                                message: 'Code Should be 5 characters long'
                              },
                              maxLength: {
                                value: 5,
                                message: 'Code Should be 5 characters long'
                              }
                            })}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="maxUses"
                        control={control}
                        defaultValue={code?.maxUses || ''}
                        rules={{ required: 'This Filed is required' }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            label="Max uses"
                            name="maxUses"
                            disabled={type === 'detail'}
                            variant="outlined"
                            type="number"
                            value={value}
                            onChange={onChange}
                            helperText={error ? error.message : null}
                            error={!!error}
                          ></TextField>
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  {type === 'detail' && (
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="numberUsed"
                        control={control}
                        defaultValue={code?.numberUsed || ''}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            type="number"
                            fullWidth
                            disabled={type === 'detail'}
                            label="Numbers of times used"
                            name="numberUsed"
                            variant="outlined"
                            value={value}
                            onChange={onChange}
                            helperText={error ? error.message : null}
                            error={!!error}
                          ></TextField>
                        )}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="expiryDate"
                      control={control}
                      defaultValue={code?.expiryDate || null}
                      rules={{ required: 'This Field is required' }}
                      render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <DateTimePicker
                            disablePast
                            InputLabelProps={{
                              shrink: true
                            }}
                            allowKeyboardControl={false}
                            clearable
                            format="yyyy/MM/dd hh:mm a"
                            margin="normal"
                            fullWidth
                            label="Expiry Date And Time"
                            name="expiryDate"
                            disabled={type === 'detail'}
                            inputVariant="outlined"
                            value={value}
                            onChange={onChange}
                            helperText={error ? error.message : null}
                            error={!!error}
                          />
                        </MuiPickersUtilsProvider>
                      )}
                    />
                  </Grid>
                  {type && (
                    <Grid item xs={12} sm={12}>
                      <Controller
                        name="status"
                        control={control}
                        defaultValue={!!code?.status}
                        render={({ field }) => (
                          <FormControlLabel
                            className="rental-switch"
                            control={
                              <Switch
                                color="primary"
                                name="status"
                                checked={field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                              />
                            }
                            disabled={type === 'detail'}
                            label="Status"
                            labelPlacement="start"
                          />
                        )}
                      />
                    </Grid>
                  )}
                  {type !== 'detail' && (
                    <Grid item xs={12} sm={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        color="primary"
                        disabled={isLoading}
                        endIcon={isLoading && <CircularProgress color="inherit" size={20} />}
                      >
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
export default AccessCodeAddEdit
