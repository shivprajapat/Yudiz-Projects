import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, CardContent, Grid, makeStyles, TextField } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import { Controller, useForm } from 'react-hook-form'
import { AddBrand, BrandDetail, DeleteBrand, UpdateBrand } from 'state/actions/brand'
import PageTitle from 'components/PageTitle'

const OpenSnackbar = React.lazy(() => import('components/Snackbar'))
const ConfirmDialog = React.lazy(() => import('components/ConfirmDialog'))

const useStyles = makeStyles(() => ({
  btn: {
    marginTop: 15
  }
}))

function BrandAddEdit() {
  const { handleSubmit, control, register } = useForm()
  const { id, type } = useParams()
  const history = useHistory()
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const dispatch = useDispatch()
  const resStatus = useSelector((state) => state.brand.resStatus)
  const resMessage = useSelector((state) => state.brand.resMessage)
  const brandDetail = useSelector((state) => state.brand.brandDetail)
  const style = useStyles()
  useEffect(() => {
    if (id) {
      dispatch(BrandDetail(id))
    } else {
      setIsPageLoading(true)
    }
  }, [])

  useEffect(() => {
    if (brandDetail && brandDetail.name) {
      setName(brandDetail.name)
      setIsPageLoading(true)
    }
  }, [brandDetail])

  useEffect(() => {
    if (resStatus && resMessage) {
      setIsLoading(false)
      setIsConfirmOpen(false)
      history.push('/brands')
    }
    if (!resStatus && resMessage) {
      setIsLoading(false)
    }
  }, [resStatus, resMessage])

  function onSubmit(e) {
    if (id) {
      dispatch(UpdateBrand(id, e.name))
      setIsLoading(true)
    } else {
      dispatch(AddBrand(e.name))
      setIsLoading(true)
    }
  }
  function deleteBrand(res) {
    if (res) {
      dispatch(DeleteBrand(id))
    } else {
      setIsConfirmOpen(false)
    }
  }
  function handleEditInDetail() {
    history.push('/brands/edit/' + id)
  }
  return (
    <>
      {resMessage && <OpenSnackbar isOpen={true} message={resMessage} />}
      {isConfirmOpen && (
        <ConfirmDialog open={isConfirmOpen} message={'You want to delete this brand!'} handleResponse={(e) => deleteBrand(e)} />
      )}
      <PageTitle
        title={(brandDetail && brandDetail.name) || 'Add Brand'}
        rightButton={brandDetail && brandDetail.rentalItemsCount === '0' && type === 'edit' ? 'Delete' : ''}
        icon={<DeleteIcon />}
        EditIcon={<EditIcon />}
        handleBtnEvent={() => setIsConfirmOpen(true)}
        EditBtnInDetail={type === 'detail' ? 'Edit' : ''}
        handleEditInDetail={() => handleEditInDetail()}
      />
      {isPageLoading && (
        <Grid container style={{ justifyContent: 'center' }} spacing={3}>
          <Grid item md={5}>
            <Card>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Controller
                    name="name"
                    defaultValue={name || ''}
                    control={control}
                    rules={{ required: 'Brand name is required' }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Name"
                        type="text"
                        name="name"
                        autoFocus
                        value={value}
                        disabled={type === 'detail'}
                        onChange={onChange}
                        helperText={error ? error.message : ''}
                        error={!!error}
                        {...register('name')}
                      />
                    )}
                  />

                  {type !== 'detail' && (
                    <Button
                      className={style.btn}
                      variant="contained"
                      size="large"
                      type="submit"
                      color="primary"
                      autoFocus
                      disabled={isLoading}
                      endIcon={isLoading && <CircularProgress color="inherit" size={20} />}
                    >
                      {id ? 'Update Brand' : 'Add Brand'}
                    </Button>
                  )}
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </>
  )
}

export default BrandAddEdit
