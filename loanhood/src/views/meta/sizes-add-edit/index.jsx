import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, CardContent, Grid, makeStyles, MenuItem, TextField } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import PageTitle from 'components/PageTitle'
import { AddSize, DeleteSize, SizeDetail, UpdateSize } from 'state/actions/size'
import { GetAllSizeGroups } from 'state/actions/sizeGroup'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import { Controller, useForm } from 'react-hook-form'

const OpenSnackbar = React.lazy(() => import('components/Snackbar'))
const ConfirmDialog = React.lazy(() => import('components/ConfirmDialog'))

const useStyles = makeStyles(() => ({
  btn: {
    marginTop: 15
  }
}))

function SizesAddEdit() {
  const { handleSubmit, control } = useForm()

  const { id, type, sizegroupId } = useParams()
  const history = useHistory()
  const [formData, setFormData] = useState({ name: '', sizegroupId: '' })
  const [allSizeGroup, setSizeGroup] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const dispatch = useDispatch()
  const resStatus = useSelector((state) => state.size.resStatus)
  const resMessage = useSelector((state) => state.size.resMessage)
  const sizeDetail = useSelector((state) => state.size.sizeDetail)
  const allSizeGroups = useSelector((state) => state.sizeGroup.allSizeGroups)
  const style = useStyles()

  useEffect(() => {
    !allSizeGroups && dispatch(GetAllSizeGroups())
  }, [])

  useEffect(() => {
    allSizeGroups && setSizeGroup(allSizeGroups)
  }, [allSizeGroups])

  useEffect(() => {
    if (id) {
      dispatch(SizeDetail(id))
    } else {
      setIsPageLoading(true)
    }
  }, [])

  useEffect(() => {
    if (sizeDetail && sizeDetail.name) {
      setFormData({ name: sizeDetail.name, sizegroupId: sizeDetail.sizegroupId })
      setIsPageLoading(true)
    }
  }, [sizeDetail])

  useEffect(() => {
    if (resStatus && resMessage) {
      setIsLoading(false)
      setIsConfirmOpen(false)
      history.push(`/size-groups/${sizegroupId}/sizes`)
    }
    if (!resStatus && resMessage) {
      setIsLoading(false)
    }
  }, [resStatus, resMessage])

  function onSubmit(e) {
    if (id) {
      dispatch(UpdateSize(id, e))
      setIsLoading(true)
    } else {
      dispatch(AddSize(e))
      setIsLoading(true)
    }
  }

  function deleteSize(res) {
    if (res) {
      dispatch(DeleteSize(id))
    } else {
      setIsConfirmOpen(false)
    }
  }
  function handleEditInDetail() {
    history.push(`/size-groups/${sizegroupId}/sizes/edit/${id}`)
  }

  return (
    <>
      {resMessage && <OpenSnackbar isOpen={true} message={resMessage} />}
      {isConfirmOpen && (
        <ConfirmDialog open={isConfirmOpen} message={'You want to delete this size!'} handleResponse={(e) => deleteSize(e)} />
      )}
      <PageTitle
        title={(sizeDetail && sizeDetail.name) || 'Add Size'}
        rightButton={sizeDetail && sizeDetail.rentalItemsCount === '0' && type === 'edit' ? 'Delete' : ''}
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
                    rules={{ required: 'Name is required' }}
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
                    name="sizegroupId"
                    control={control}
                    defaultValue={formData.sizegroupId || ''}
                    rules={{ required: 'Size group is required' }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        variant="outlined"
                        margin="normal"
                        select
                        fullWidth
                        label="Size Group"
                        name="sizegroupId"
                        value={value}
                        disabled={type === 'detail'}
                        onChange={onChange}
                        helperText={error ? error.message : ''}
                        error={!!error}
                      >
                        {allSizeGroup.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />

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
                      {id ? 'Update Size' : 'Add Size'}
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

export default SizesAddEdit
