import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, CardContent, Grid, makeStyles, TextField } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import { Controller, useForm } from 'react-hook-form'
import PageTitle from 'components/PageTitle'
import { AddMaterial, DeleteMaterial, MaterialDetail, UpdateMaterial } from 'state/actions/material'

const OpenSnackbar = React.lazy(() => import('components/Snackbar'))
const ConfirmDialog = React.lazy(() => import('components/ConfirmDialog'))

const useStyles = makeStyles(() => ({
  btn: {
    marginTop: 15
  }
}))

function MaterialAddEdit() {
  const { handleSubmit, control, register } = useForm()
  const { id, type } = useParams()
  const history = useHistory()
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const dispatch = useDispatch()
  const resStatus = useSelector((state) => state.material.resStatus)
  const resMessage = useSelector((state) => state.material.resMessage)
  const materialDetail = useSelector((state) => state.material.materialDetail)
  const style = useStyles()

  useEffect(() => {
    if (id) {
      dispatch(MaterialDetail(id))
    } else {
      setIsPageLoading(true)
    }
  }, [])

  useEffect(() => {
    if (materialDetail && materialDetail.name) {
      setName(materialDetail.name)
      setIsPageLoading(true)
    }
  }, [materialDetail])

  useEffect(() => {
    if (resStatus && resMessage) {
      setIsLoading(false)
      setIsConfirmOpen(false)
      history.push('/materials')
    }
    if (!resStatus && resMessage) {
      setIsLoading(false)
    }
  }, [resStatus, resMessage])

  function onSubmit(e) {
    if (id) {
      dispatch(UpdateMaterial(id, e.name))
      setIsLoading(true)
    } else {
      dispatch(AddMaterial(e.name))
      setIsLoading(true)
    }
  }

  function deleteMaterial(res) {
    if (res) {
      dispatch(DeleteMaterial(id))
    } else {
      setIsConfirmOpen(false)
    }
  }
  function handleEditInDetail() {
    history.push('/materials/edit/' + id)
  }
  return (
    <>
      {resMessage && <OpenSnackbar isOpen={true} message={resMessage} />}
      {isConfirmOpen && (
        <ConfirmDialog open={isConfirmOpen} message={'You want to delete this Material!'} handleResponse={(e) => deleteMaterial(e)} />
      )}
      <PageTitle
        title={(materialDetail && materialDetail.name) || 'Add Material'}
        rightButton={materialDetail && materialDetail.rentalItemsCount === '0' && type === 'edit' ? 'Delete' : ''}
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
                    defaultValue={name || ''}
                    rules={{ required: 'Material name is required' }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="Name"
                        type="text"
                        name="name"
                        autoFocus
                        defaultValue={name || ''}
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
                      {id ? 'Update Material' : 'Add Material'}
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

export default MaterialAddEdit
