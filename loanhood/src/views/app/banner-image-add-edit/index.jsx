import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, Card, CardContent, Grid, makeStyles, TextField } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import PageTitle from 'components/PageTitle'
import { AddBannerImage, BannerImageDetail, DeleteBannerImage, UpdateBannerImage } from 'state/actions/bannerImage'
import { Controller, useForm } from 'react-hook-form'
import { URL_REGEX } from 'utils/constants'

const OpenSnackbar = React.lazy(() => import('components/Snackbar'))
const ConfirmDialog = React.lazy(() => import('components/ConfirmDialog'))

const useStyles = makeStyles(() => ({
  btn: {
    marginTop: 15
  }
}))

function BannerImageAddEdit() {
  const {
    handleSubmit,
    control,
    register,
    watch,
    formState: { errors }
  } = useForm()
  const { id, type } = useParams()
  const history = useHistory()
  const [formData, setFormData] = useState({ name: '', image: '', file: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const dispatch = useDispatch()
  const resStatus = useSelector((state) => state.bannerImage.resStatus)
  const resMessage = useSelector((state) => state.bannerImage.resMessage)
  const bannerImageDetail = useSelector((state) => state.bannerImage.bannerImageDetail)
  const style = useStyles()
  const imageInput = watch('image')
  const imageInputUrl = imageInput && imageInput[0] && URL.createObjectURL(imageInput[0])
  useEffect(() => {
    if (id) {
      dispatch(BannerImageDetail(id))
    } else {
      setIsPageLoading(true)
    }
  }, [])

  useEffect(() => {
    if (bannerImageDetail && bannerImageDetail.name) {
      setFormData({
        name: bannerImageDetail.name,
        image: bannerImageDetail.assetUrl,
        url: bannerImageDetail.url
      })
      setIsPageLoading(true)
    }
  }, [bannerImageDetail])

  useEffect(() => {
    if (resStatus && resMessage) {
      setIsLoading(false)
      setIsConfirmOpen(false)
      history.push('/banner-images')
    }
    if (!resStatus && resMessage) {
      setIsLoading(false)
    }
  }, [resStatus, resMessage])

  function onSubmit(e) {
    e.url = e.url || null
    if (imageInputUrl) {
      e.file = e.image[0]
      delete e.image
    } else {
      e.image = formData.image
    }
    if (id) {
      dispatch(UpdateBannerImage(id, e))
      setIsLoading(true)
    } else {
      dispatch(AddBannerImage(e))
      setIsLoading(true)
    }
  }

  function deleteBannerImage(res) {
    if (res) {
      dispatch(DeleteBannerImage(id))
    } else {
      setIsConfirmOpen(false)
    }
  }
  function handleEditInDetail() {
    history.push('/banner-images/edit/' + id)
  }
  return (
    <>
      {resMessage && <OpenSnackbar isOpen={true} message={resMessage} />}
      {isConfirmOpen && (
        <ConfirmDialog
          open={isConfirmOpen}
          message={'You want to delete this Banner image!'}
          handleResponse={(e) => deleteBannerImage(e)}
        />
      )}
      <PageTitle
        title={(bannerImageDetail && bannerImageDetail.name) || 'Add Banner image'}
        rightButton={type === 'edit' ? 'Delete' : ''}
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
                    rules={{ required: 'Name field is required' }}
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
                    name="url"
                    control={control}
                    defaultValue={formData.url || ''}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="URL"
                        type="text"
                        name="name"
                        value={value}
                        disabled={type === 'detail'}
                        onChange={onChange}
                        helperText={error ? error.message : ''}
                        {...register('url', {
                          pattern: { value: URL_REGEX, message: 'Please Enter Valid URL' }
                        })}
                        error={!!error}
                      />
                    )}
                  />
                  {type !== 'detail' && !formData?.image && (
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
                      onClick={handleSubmit}
                      variant="contained"
                      size="large"
                      type="submit"
                      color="primary"
                      disabled={isLoading}
                      endIcon={isLoading && <CircularProgress color="inherit" size={20} />}
                    >
                      {id ? 'Update Banner Image' : 'Add Banner Image'}
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

export default BannerImageAddEdit
