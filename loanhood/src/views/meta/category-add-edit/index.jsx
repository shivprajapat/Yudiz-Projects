import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, CardContent, Grid, makeStyles, TextField } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import DeleteIcon from '@material-ui/icons/Delete'
import PageTitle from 'components/PageTitle'
import { AddCategory, CategoryDetail, DeleteCategory, UpdateCategory } from 'state/actions/category'
import { Controller, useForm } from 'react-hook-form'

const OpenSnackbar = React.lazy(() => import('components/Snackbar'))
const ConfirmDialog = React.lazy(() => import('components/ConfirmDialog'))

const useStyles = makeStyles(() => ({
  btn: {
    marginTop: 15
  }
}))

function CategoryAddEdit() {
  const { handleSubmit, control } = useForm()
  const { id, type } = useParams()
  const history = useHistory()
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const dispatch = useDispatch()
  const resStatus = useSelector((state) => state.category.resStatus)
  const resMessage = useSelector((state) => state.category.resMessage)
  const categoryDetail = useSelector((state) => state.category.categoryDetail)
  const style = useStyles()

  useEffect(() => {
    if (id) {
      dispatch(CategoryDetail(id))
    } else {
      setIsPageLoading(true)
    }
  }, [])

  useEffect(() => {
    if (categoryDetail && categoryDetail.name) {
      setName(categoryDetail.name)
      setIsPageLoading(true)
    }
  }, [categoryDetail])

  useEffect(() => {
    if (resStatus && resMessage) {
      setIsLoading(false)
      setIsConfirmOpen(false)
      history.push('/categories')
    }
    if (!resStatus && resMessage) {
      setIsLoading(false)
    }
  }, [resStatus, resMessage])

  function onSubmit(e) {
    if (id) {
      dispatch(UpdateCategory(id, e.name))
      setIsLoading(true)
    } else {
      dispatch(AddCategory(e.name))
      setIsLoading(true)
    }
  }

  function deleteCategory(res) {
    if (res) {
      dispatch(DeleteCategory(id))
    } else {
      setIsConfirmOpen(false)
    }
  }

  return (
    <>
      {resMessage && <OpenSnackbar isOpen={true} message={resMessage} />}
      {isConfirmOpen && (
        <ConfirmDialog open={isConfirmOpen} message={'You want to delete this Category!'} handleResponse={(e) => deleteCategory(e)} />
      )}
      <PageTitle
        title={(categoryDetail && categoryDetail.name) || 'Add Category'}
        rightButton={id && categoryDetail && categoryDetail.subCategoriesCount === '0' ? 'Delete' : ''}
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
                    rules={{ required: 'category is required' }}
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
                      variant="contained"
                      size="large"
                      type="submit"
                      color="primary"
                      autoFocus
                      disabled={isLoading}
                      endIcon={isLoading && <CircularProgress color="inherit" size={20} />}
                    >
                      {id ? 'Update Category' : 'Add Category'}
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

export default CategoryAddEdit
