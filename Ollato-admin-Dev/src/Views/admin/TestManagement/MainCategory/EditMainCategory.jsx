import React, { useEffect, useRef } from 'react'
import { Form } from 'react-bootstrap'
/* React-Packages */
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSnackbar } from 'react-notistack'

/* Components */
import Header from '../../../../Components/Header'
import TitleHeader from '../../../../Components/TitleHeader'

/* Action File */
import {
  viewTestCategoryAction,
  editTestCategoryAction
} from '../../../../Actions/Admin/test'
import { validationSchemaMainCat } from '../../../../Shared/Utills/validationschema'

function EditMainCategory () {
  // Constant
  const params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const id = params?.id
  const token = localStorage.getItem('token')

  // useSelector
  const testDataArray = useSelector((state) => state.test.testCategoryDataById)
  const editedResMessage = useSelector((state) => state.test.resMessage)
  const isEditedData = useSelector((state) => state.test.isTestCategoryUpdated)

  // previousProps
  const previousProps = useRef({ editedResMessage, isEditedData }).current

  // useForm
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchemaMainCat)
  })
  const { onChange, name } = register()

  // onSubmit
  const onSubmit = (data) => {
    const testData = {
      id: Number(id),
      title: data.title,
      sort_order: data.sortOrder
    }
    if (testData) {
      dispatch(editTestCategoryAction(testData, token))
    }
  }

  // useEffect to get data
  useEffect(() => {
    dispatch(viewTestCategoryAction({ id: +id }, token))
  }, [])

  // Toastify Notification for Edit
  useEffect(() => {
    if (previousProps?.isEditedData !== isEditedData) {
      if (isEditedData) {
        enqueueSnackbar(`${editedResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/test-management/main-category')
      } else if (isEditedData === false) {
        enqueueSnackbar(`${editedResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isEditedData = isEditedData
    }
  }, [isEditedData])

  return (
    <>
          <Header />
          <TitleHeader name='Edit Main Category' title='Test Management' />
          <div className='main-layout'>
            <Form className='light-bg' onSubmit={handleSubmit(onSubmit)}>
              <div className='heading-box'>
                <h5>Edit Main Category</h5>
                <div className='btn-box'>
                  <button
                    type='button'
                    onClick={() => navigate(-1)}
                    className='theme-btn dark-btn text-none'
                  >
                    Cancel
                  </button>
                  <button type='submit' className='theme-btn text-none'>
                    Save
                  </button>
                </div>
              </div>
              <div className='form-middle-layout'>
                <div className='row'>
                  <div className='col-md-6'>
                    <Form.Group
                      className='form-group'
                      controlId='formmaincategory'
                    >
                      <Form.Label>Main Category</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder='Enter Main Category'
                        Value={testDataArray?.title}
                        name={name}
                        {...register('title', { required: true })}
                        onChange={(e) => {
                          onChange(e)
                        }}
                      />
                      {errors.title?.message && (
                        <Form.Text className='error-msg'>
                          {errors.title?.message}{' '}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </div>
                  <div className='col-md-6'>
                    <Form.Group className='form-group' controlId='formpincode1'>
                      <Form.Label>Sort Order</Form.Label>
                      <Form.Control
                        type='number'
                        placeholder='Enter Sort Order'
                        name={name}
                        {...register('sortOrder', { required: true })}
                        onChange={(e) => {
                          onChange(e)
                        }}
                        Value={testDataArray?.sort_order}
                      />
                      {errors.sortOrder?.message && (
                        <Form.Text className='error-msg'>
                          {errors.sortOrder?.message}{' '}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </div>
                </div>
              </div>
            </Form>
          </div>
    </>
  )
}

export default EditMainCategory
