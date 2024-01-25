import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, CardContent, Grid, makeStyles, MenuItem, TextField } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import PageTitle from 'components/PageTitle'
import { AddSubCategory, DeleteSubCategory, SubCategoryDetail, UpdateSubCategory } from 'state/actions/subCategory'
import { GetAllCategories } from 'state/actions/filter'
import { Controller, useForm } from 'react-hook-form'

const OpenSnackbar = React.lazy(() => import('components/Snackbar'))
const ConfirmDialog = React.lazy(() => import('components/ConfirmDialog'))

const useStyles = makeStyles(() => ({
  btn: {
    marginTop: 15
  }
}))

function SubCategoryAddEdit() {
  const { handleSubmit, control } = useForm()
  const { id, type, categoryId } = useParams()
  const history = useHistory()
  const [formData, setFormData] = useState({ name: '', categoryId: '' })
  const [allCategory, setAllCategory] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const dispatch = useDispatch()
  const resStatus = useSelector((state) => state.subCategory.resStatus)
  const resMessage = useSelector((state) => state.subCategory.resMessage)
  const subCategoryDetail = useSelector((state) => state.subCategory.subCategoryDetail)
  const allCategories = useSelector((state) => state.filter.allCategories)

  const style = useStyles()

  useEffect(() => {
    !allCategories && dispatch(GetAllCategories())
  }, [])

  useEffect(() => {
    allCategories && setAllCategory(allCategories)
  }, [allCategories])

  useEffect(() => {
    if (id) {
      dispatch(SubCategoryDetail(id))
    } else {
      setIsPageLoading(true)
    }
  }, [])

  useEffect(() => {
    if (subCategoryDetail && subCategoryDetail.name) {
      setFormData({ name: subCategoryDetail.name, categoryId: subCategoryDetail.categoryId })
      setIsPageLoading(true)
    }
  }, [subCategoryDetail])

  useEffect(() => {
    if (resStatus && resMessage) {
      setIsLoading(false)
      setIsConfirmOpen(false)
      history.push(`/categories/${categoryId}/sub-categories`)
    }
    if (!resStatus && resMessage) {
      setIsLoading(false)
    }
  }, [resStatus, resMessage])

  function onSubmit(e) {
    if (id) {
      dispatch(UpdateSubCategory(id, e))
      setIsLoading(true)
    } else {
      dispatch(AddSubCategory(e))
      setIsLoading(true)
    }
  }

  function deleteSubCategory(res) {
    if (res) {
      dispatch(DeleteSubCategory(id))
    } else {
      setIsConfirmOpen(false)
    }
  }
  function handleEditInDetail() {
    history.push(`/categories/${categoryId}/sub-categories/edit/${id}`)
  }
  return (
    <>
      {resMessage && <OpenSnackbar isOpen={true} message={resMessage} />}
      {isConfirmOpen && (
        <ConfirmDialog
          open={isConfirmOpen}
          message={'You want to delete this Sub Category!'}
          handleResponse={(e) => deleteSubCategory(e)}
        />
      )}
      <PageTitle
        title={(subCategoryDetail && subCategoryDetail.name) || 'Add Sub Category'}
        rightButton={subCategoryDetail && subCategoryDetail.rentalItemsCount === '0' && type === 'edit' ? 'Delete' : ''}
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
                    name="categoryId"
                    control={control}
                    defaultValue={formData.categoryId || ''}
                    rules={{ required: 'category is required' }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        variant="outlined"
                        margin="normal"
                        select
                        fullWidth
                        label="Category"
                        name="categoryId"
                        value={value}
                        onChange={onChange}
                        disabled={type === 'detail'}
                        helperText={error ? error.message : ''}
                        error={!!error}
                      >
                        {allCategory.map((option) => (
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
                      {id ? 'Update Sub Category' : 'Add Sub Category'}
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

export default SubCategoryAddEdit
