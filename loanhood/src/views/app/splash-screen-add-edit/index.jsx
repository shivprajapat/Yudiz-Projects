import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, Card, CardContent, Grid, makeStyles, TextField } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import PageTitle from 'components/PageTitle'
import { AddSplashScreen, DeleteSplashScreen, SplashScreenDetail, UpdateSplashScreen } from 'state/actions/splashScreen'

const OpenSnackbar = React.lazy(() => import('components/Snackbar'))
const ConfirmDialog = React.lazy(() => import('components/ConfirmDialog'))

const useStyles = makeStyles(() => ({
  btn: {
    marginTop: 15
  }
}))

function SplashScreenAddEdit() {
  const { id, type } = useParams()
  const history = useHistory()
  const [formData, setFormData] = useState({ name: '', image: '', file: '', textColor: '' })
  const [errors, setErrors] = useState({ name: '', image: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const dispatch = useDispatch()
  const resStatus = useSelector((state) => state.splashScreen.resStatus)
  const resMessage = useSelector((state) => state.splashScreen.resMessage)
  const splashScreenDetail = useSelector((state) => state.splashScreen.splashScreenDetail)
  const style = useStyles()

  useEffect(() => {
    if (id) {
      dispatch(SplashScreenDetail(id))
    } else {
      setIsPageLoading(true)
    }
  }, [])

  useEffect(() => {
    if (splashScreenDetail && splashScreenDetail.name) {
      setFormData({
        name: splashScreenDetail.name,
        image: splashScreenDetail.assetUrl,
        textColor: splashScreenDetail.textColor
      })
      setIsPageLoading(true)
    }
  }, [splashScreenDetail])

  useEffect(() => {
    if (resStatus && resMessage) {
      setIsLoading(false)
      setIsConfirmOpen(false)
      history.push('/splash-screen')
    }
    if (!resStatus && resMessage) {
      setIsLoading(false)
    }
  }, [resStatus, resMessage])

  function handleChange(e) {
    switch (e.target.name) {
      case 'name':
        if (e.target.value.length > 0) {
          setErrors({ ...errors, name: '' })
        } else {
          setErrors({ ...errors, name: 'Name field is required' })
        }
        setFormData({ ...formData, name: e.target.value })
        break
      case 'image':
        if (e.target.files[0]) {
          setFormData({ ...formData, image: URL.createObjectURL(e.target.files[0]), file: e.target.files[0] })
          setErrors({ ...errors, image: '' })
        } else if (!formData.image) {
          setErrors({ ...errors, image: 'Image is required' })
        }
        break
      case 'textColor':
        setFormData({ ...formData, textColor: e.target.value })
        break
      default:
        break
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!formData.name || !formData.image) {
      if (!formData.name) {
        setErrors({ ...errors, name: 'Name field is required' })
      }
      if (!formData.image) {
        setErrors({ ...errors, image: 'Image is required' })
      }
    } else {
      if (id) {
        dispatch(UpdateSplashScreen(id, formData))
        setIsLoading(true)
      } else {
        dispatch(AddSplashScreen(formData))
        setIsLoading(true)
      }
    }
  }

  function deleteSplashScreen(res) {
    if (res) {
      dispatch(DeleteSplashScreen(id))
    } else {
      setIsConfirmOpen(false)
    }
  }
  function handleEditInDetail() {
    history.push('/splash-screen/edit/' + id)
  }
  return (
    <>
      {resMessage && <OpenSnackbar isOpen={true} message={resMessage} />}
      {isConfirmOpen && (
        <ConfirmDialog
          open={isConfirmOpen}
          message={'You want to delete this Splash Screen!'}
          handleResponse={(e) => deleteSplashScreen(e)}
        />
      )}
      <PageTitle
        title={(splashScreenDetail && splashScreenDetail.name) || 'Add Splash Screen'}
        rightButton={type === 'edit' ? 'Delete' : ''}
        icon={<DeleteIcon />}
        handleBtnEvent={() => setIsConfirmOpen(true)}
        EditIcon={<EditIcon />}
        EditBtnInDetail={type === 'detail' ? 'Edit' : ''}
        handleEditInDetail={() => handleEditInDetail()}
      />
      {isPageLoading && (
        <Grid container style={{ justifyContent: 'center' }} spacing={3}>
          <Grid item md={5}>
            <Card>
              <CardContent>
                <form>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Name"
                    type="text"
                    name="name"
                    autoFocus
                    defaultValue={formData.name || ''}
                    disabled={type === 'detail'}
                    onChange={(e) => handleChange(e)}
                    helperText={errors.name}
                    error={!!errors.name}
                  />
                  {type !== 'detail' && (
                    <input required className="file-input" name="image" type="file" accept="image/*" onChange={(e) => handleChange(e)} />
                  )}
                  {errors.image && <p className="err">{errors.image}</p>}
                  <TextField
                    label="Text color"
                    type="color"
                    variant="outlined"
                    name="textColor"
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                    disabled={type === 'detail'}
                    defaultValue={formData.textColor || ''}
                  />
                  <Box pt={1} component="img" src={formData.image} />
                  {type !== 'detail' && (
                    <Button
                      className={style.btn}
                      onClick={handleSubmit}
                      variant="contained"
                      size="large"
                      type="submit"
                      color="primary"
                      autoFocus
                      disabled={!(formData.name && formData.image && !errors.name && !errors.image) || isLoading}
                      endIcon={isLoading && <CircularProgress color="inherit" size={20} />}
                    >
                      {id ? 'Update Splash Screen' : 'Add Splash Screen'}
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

export default SplashScreenAddEdit
