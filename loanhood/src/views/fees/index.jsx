import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, CardContent, CircularProgress, FormControlLabel, Grid, Switch, TextField } from '@material-ui/core'
import { Controller, useForm } from 'react-hook-form'

import OpenSnackbar from 'components/Snackbar'
import { GetFees, UpdateFees } from 'state/actions/fees'
import PageTitle from 'components/PageTitle'

function Fees() {
  const dispatch = useDispatch()
  const [fee, setFee] = useState()
  const fees = useSelector((state) => state.fees.fees)
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, control, reset } = useForm({})
  const resMessage = useSelector((state) => state.fees.resMessage)
  const resStatus = useSelector((state) => state.fees.resStatus)

  useEffect(() => {
    setIsLoading(true)
    dispatch(GetFees())
  }, [])
  useEffect(() => {
    if (fees) {
      setFee(fees)
      setFormData(fees)
      setIsLoading(false)
    }
  }, [fees])

  useEffect(() => {
    if (!resStatus && resMessage) {
      setIsLoading(false)
    }
    if (resStatus && resMessage) {
      setIsLoading(false)
    }
  }, [resMessage, resStatus])

  function setFormData(value) {
    reset({
      borrowerItemGBP: value?.borrowerItemGBP,
      borrowerLookGBP: value?.borrowerLookGBP,
      loanerPercent: value?.loanerPercent,
      defaultSuggestPricePercent: value?.defaultSuggestPricePercent,
      noFees: value?.noFees
    })
  }
  function onSubmit(e) {
    const data = {
      borrowerItemGBP: e?.borrowerItemGBP,
      borrowerLookGBP: e?.borrowerLookGBP,
      loanerPercent: e?.loanerPercent,
      retunRentalInDays: e?.retunRentalInDays,
      defaultSuggestPricePercent: e?.defaultSuggestPricePercent,
      noFees: e?.noFees
    }
    dispatch(UpdateFees(data))
    setIsLoading(true)
  }
  return (
    <>
      {!resStatus && resMessage && <OpenSnackbar isOpen={true} message={resMessage} />}
      {resStatus && resMessage && <OpenSnackbar isOpen={true} message={resMessage} />}
      <PageTitle title={'Fees'} />
      <Grid container style={{ justifyContent: 'center' }} spacing={3}>
        <Grid item md={5}>
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="borrowerItemGBP"
                        control={control}
                        defaultValue={fee?.borrowerItemGBP || ''}
                        rules={{ required: 'This Field is required' }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Borrower item fee"
                            type="number"
                            name="borrowerItemGBP"
                            autoFocus
                            value={value}
                            onChange={onChange}
                            helperText={error ? error.message : null}
                            error={!!error}
                            {...register('borrowerItemGBP')}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="borrowerLookGBP"
                        control={control}
                        defaultValue={fee?.borrowerLookGBP || ''}
                        rules={{ required: 'This Filed is required' }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            label="Borrower Look fee"
                            name="borrowerLookGBP"
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
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="defaultSuggestPricePercent"
                        control={control}
                        defaultValue={fee?.defaultSuggestPricePercent || ''}
                        rules={{ required: 'This Field is required' }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Default suggest price %"
                            type="number"
                            name="defaultSuggestPricePercent"
                            autoFocus
                            value={value}
                            onChange={onChange}
                            helperText={error ? error.message : null}
                            error={!!error}
                            {...register('defaultSuggestPricePercent')}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="loanerPercent"
                        control={control}
                        defaultValue={fee?.loanerPercent || ''}
                        rules={{ required: 'This Filed is required' }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <TextField
                            margin="normal"
                            fullWidth
                            label="Loaner percent"
                            name="loanerPercent"
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
                  <Grid item xs={12} sm={12}>
                    <Controller
                      name="noFees"
                      control={control}
                      defaultValue={!!fee?.noFees}
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
                          label="No Fees"
                          labelPlacement="start"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
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
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default Fees
