import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, CardContent, Grid, makeStyles, TextField } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import PageTitle from 'components/PageTitle'
import { AddSizeGroup, DeleteSizeGroup, SizeGroupDetail, UpdateSizeGroup } from 'state/actions/sizeGroup'
import DeleteIcon from '@material-ui/icons/Delete'
import { Controller, useForm } from 'react-hook-form'
const OpenSnackbar = React.lazy(() => import('components/Snackbar'))
const ConfirmDialog = React.lazy(() => import('components/ConfirmDialog'))

const useStyles = makeStyles(() => ({
  btn: {
    marginTop: 15
  }
}))

function SizeGroupAddEdit() {
  const { handleSubmit, control } = useForm()
  const { id, type } = useParams()
  const history = useHistory()
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const dispatch = useDispatch()
  const resStatus = useSelector((state) => state.sizeGroup.resStatus)
  const resMessage = useSelector((state) => state.sizeGroup.resMessage)
  const sizeGroupsDetail = useSelector((state) => state.sizeGroup.sizeGroupsDetail)
  const style = useStyles()

  useEffect(() => {
    if (id) {
      dispatch(SizeGroupDetail(id))
    } else {
      setIsPageLoading(true)
    }
  }, [])

  useEffect(() => {
    if (sizeGroupsDetail && sizeGroupsDetail.name) {
      setName(sizeGroupsDetail.name)
      setIsPageLoading(true)
    }
  }, [sizeGroupsDetail])

  useEffect(() => {
    if (resStatus && resMessage) {
      setIsLoading(false)
      setIsConfirmOpen(false)
      history.push('/size-groups')
    }
    if (!resStatus && resMessage) {
      setIsLoading(false)
    }
  }, [resStatus, resMessage])

  function onSubmit(e) {
    if (id) {
      dispatch(UpdateSizeGroup(id, e.name))
      setIsLoading(true)
    } else {
      dispatch(AddSizeGroup(e.name))
      setIsLoading(true)
    }
  }

  function deleteSizeGroup(res) {
    if (res) {
      dispatch(DeleteSizeGroup(id))
    } else {
      setIsConfirmOpen(false)
    }
  }

  return (
    <>
      {resMessage && <OpenSnackbar isOpen={true} message={resMessage} />}
      {isConfirmOpen && (
        <ConfirmDialog open={isConfirmOpen} message={'You want to delete this size group!'} handleResponse={(e) => deleteSizeGroup(e)} />
      )}
      <PageTitle
        title={(sizeGroupsDetail && sizeGroupsDetail.name) || 'Add Size Group'}
        rightButton={sizeGroupsDetail && sizeGroupsDetail.sizesCount === '0' && id ? 'Delete' : ''}
        icon={<DeleteIcon />}
        handleBtnEvent={() => setIsConfirmOpen(true)}
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
                    rules={{ required: 'name is required' }}
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
                      {id ? 'Update Size Group' : 'Add Size Group'}
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

export default SizeGroupAddEdit
