import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, Card, CardContent, Grid, makeStyles, TextField } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import PageTitle from 'components/PageTitle'
import { AddColors, ColorDetail, DeleteColors, UpdateColor } from 'state/actions/color'
import { Controller, useForm } from 'react-hook-form'

const OpenSnackbar = React.lazy(() => import('components/Snackbar'))
const ConfirmDialog = React.lazy(() => import('components/ConfirmDialog'))

const useStyles = makeStyles(() => ({
  btn: {
    marginTop: 15
  }
}))

function ColorAddEdit() {
  const {
    handleSubmit,
    control,
    register,
    watch,
    formState: { errors }
  } = useForm()
  const { id, type } = useParams()
  const history = useHistory()
  const [formData, setFormData] = useState({ name: '', colorCode: '', image: '', file: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const dispatch = useDispatch()
  const resStatus = useSelector((state) => state.color.resStatus)
  const resMessage = useSelector((state) => state.color.resMessage)
  const colorDetail = useSelector((state) => state.color.colorDetail)
  const style = useStyles()
  const imageInput = watch('image')
  const imageInputUrl = imageInput && imageInput[0] && URL.createObjectURL(imageInput[0])
  useEffect(() => {
    if (id) {
      dispatch(ColorDetail(id))
    } else {
      setIsPageLoading(true)
    }
  }, [])

  useEffect(() => {
    if (colorDetail && colorDetail.name) {
      setFormData({ name: colorDetail.name, colorCode: colorDetail.colorCode, image: colorDetail.uri })
      setIsPageLoading(true)
    }
  }, [colorDetail])

  useEffect(() => {
    if (resStatus && resMessage) {
      setIsLoading(false)
      setIsConfirmOpen(false)
      history.push('/colors')
    }
    if (!resStatus && resMessage) {
      setIsLoading(false)
    }
  }, [resStatus, resMessage])

  function onSubmit(e) {
    if (imageInput) {
      e.file = imageInput[0]
      delete e.image
    } else {
      e.image = formData.image
    }
    if (id) {
      dispatch(UpdateColor(id, e))
      setIsLoading(true)
    } else {
      dispatch(AddColors(e))
      setIsLoading(true)
    }
  }

  function deleteColor(res) {
    if (res) {
      dispatch(DeleteColors(id))
    } else {
      setIsConfirmOpen(false)
    }
  }
  function handleEditInDetail() {
    history.push('/colors/edit/' + id)
  }
  return (
    <>
      {resMessage && <OpenSnackbar isOpen={true} message={resMessage} />}
      {isConfirmOpen && (
        <ConfirmDialog open={isConfirmOpen} message={'You want to delete this Color!'} handleResponse={(e) => deleteColor(e)} />
      )}
      <PageTitle
        title={(colorDetail && colorDetail.name) || 'Add Color'}
        rightButton={colorDetail && colorDetail.rentalItemsCount === '0' && type === 'edit' ? 'Delete' : ''}
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
                    control={control}
                    defaultValue={formData.name || ''}
                    rules={{ required: 'Color name is required' }}
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
                      />
                    )}
                  />

                  <Controller
                    name="colorCode"
                    control={control}
                    defaultValue={formData.colorCode || ''}
                    rules={{ required: 'Color code is required' }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Color Code"
                        type="text"
                        name="colorCode"
                        defaultValue={formData.colorCode || ''}
                        disabled={type === 'detail'}
                        onChange={onChange}
                        helperText={error ? error.message : ''}
                        error={!!error}
                        {...register('colorCode', {
                          minLength: {
                            value: 4,
                            message: 'color code must be at least 4 characters'
                          }
                        })}
                      />
                    )}
                  />
                  {type !== 'detail' && (
                    <input
                      className="file-input"
                      name="image"
                      type="file"
                      accept="image/*"
                      {...register('image', !type && { required: 'Image is required' })}
                    />
                  )}
                  {errors.image && !type && <p className="err">{errors.image.message}</p>}
                  <Box pt={1} component="img" src={imageInputUrl || formData.image} />
                  {type !== 'detail' && (
                    <Button
                      className={style.btn}
                      variant="contained"
                      size="large"
                      type="submit"
                      color="primary"
                      disabled={isLoading}
                      endIcon={isLoading && <CircularProgress color="inherit" size={20} />}
                    >
                      {id ? 'Update Color' : 'Add Color'}
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

export default ColorAddEdit
