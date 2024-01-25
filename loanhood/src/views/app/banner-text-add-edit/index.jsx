import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, CardContent, Grid, makeStyles, TextField } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import PageTitle from 'components/PageTitle'
import { AddBannerText, BannerTextDetail, DeleteBannerText, UpdateBannerText } from 'state/actions/bannerText'
import { Controller, useForm } from 'react-hook-form'

const OpenSnackbar = React.lazy(() => import('components/Snackbar'))
const ConfirmDialog = React.lazy(() => import('components/ConfirmDialog'))

const useStyles = makeStyles(() => ({
  btn: {
    marginTop: 15
  }
}))

function BannerTextAddEdit() {
  const { handleSubmit, control } = useForm()
  const { id, type } = useParams()
  const history = useHistory()
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const dispatch = useDispatch()
  const resStatus = useSelector((state) => state.bannerText.resStatus)
  const resMessage = useSelector((state) => state.bannerText.resMessage)
  const bannerTextDetail = useSelector((state) => state.bannerText.bannerTextDetail)
  const style = useStyles()

  useEffect(() => {
    if (id) {
      dispatch(BannerTextDetail(id))
    } else {
      setIsPageLoading(true)
    }
  }, [])

  useEffect(() => {
    if (bannerTextDetail && bannerTextDetail.text) {
      setText(bannerTextDetail.text)
      setIsPageLoading(true)
    }
  }, [bannerTextDetail])

  useEffect(() => {
    if (resStatus && resMessage) {
      setIsLoading(false)
      setIsConfirmOpen(false)
      history.push('/banner-texts')
    }
    if (!resStatus && resMessage) {
      setIsLoading(false)
    }
  }, [resStatus, resMessage])

  function onSubmit(e) {
    if (id) {
      dispatch(UpdateBannerText(id, e.text))
      setIsLoading(true)
    } else {
      dispatch(AddBannerText(e.text))
      setIsLoading(true)
    }
  }

  function deleteBannerText(res) {
    if (res) {
      dispatch(DeleteBannerText(id))
    } else {
      setIsConfirmOpen(false)
    }
  }
  function handleEditInDetail() {
    history.push('/banner-texts/edit/' + id)
  }
  return (
    <>
      {resMessage && <OpenSnackbar isOpen={true} message={resMessage} />}
      {isConfirmOpen && (
        <ConfirmDialog open={isConfirmOpen} message={'You want to delete this Banner Text!'} handleResponse={(e) => deleteBannerText(e)} />
      )}
      <PageTitle
        title={(bannerTextDetail && bannerTextDetail.text) || 'Add Banner Text'}
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
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Controller
                    name="text"
                    control={control}
                    defaultValue={text || ''}
                    rules={{ required: 'banner text is required' }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Text"
                        type="text"
                        name="text"
                        autoFocus
                        value={value}
                        disabled={type === 'detail'}
                        onChange={onChange}
                        helperText={error ? error.message : ''}
                        error={!!error}
                      />
                    )}
                  />
                  {type !== 'detail' && (
                    <Button
                      className={style.btn}
                      onClick={handleSubmit}
                      variant="contained"
                      size="large"
                      type="submit"
                      color="primary"
                      autoFocus
                      disabled={isLoading}
                      endIcon={isLoading && <CircularProgress color="inherit" size={20} />}
                    >
                      {id ? 'Update Banner Text' : 'Add Banner Text'}
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

export default BannerTextAddEdit
