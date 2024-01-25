import React, { useRef, useEffect } from 'react'

/* React Packages */
import { Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSnackbar } from 'react-notistack'
import { useNavigate } from 'react-router-dom'

/* Components */
import Header from '../../../../Components/Header'
import TitleHeader from '../../../../Components/TitleHeader'
import { useDispatch, useSelector } from 'react-redux'

/* Action File */
import { addTestAction } from '../../../../Actions/Admin/test'
import { validationSchemaMainCat } from '../../../../Shared/Utills/validationschema'

function AddNewMainCategory () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const token = localStorage.getItem('token')
  const isTestDataAdded = useSelector(state => state.test.isTestCategoryAdded)
  const isTestAddedMessage = useSelector(state => state.test.resMessage)
  // const isTestAddedfgMessage = useSelector(state =>
  const previousProps = useRef({ isTestDataAdded, isTestAddedMessage }).current
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchemaMainCat)
  })

  const { onChange, name } = register('gradeNo')

  const onSubmit = data => {
    const testData = {
      title: data.title,
      sort_order: data.sortOrder
    }
    if (testData) {
      dispatch(addTestAction(testData, token))
    }
  }

  // Toastify Notification
  useEffect(() => {
    if (previousProps?.isTestDataAdded !== isTestDataAdded) {
      if (isTestDataAdded) {
        enqueueSnackbar(`${isTestAddedMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/test-management/main-category')
        reset()
      } else if (isTestDataAdded === false) {
        enqueueSnackbar(`${isTestAddedMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        }
        )
      }
    }
    return () => {
      previousProps.isTestDataAdded = isTestDataAdded
    }
  }, [isTestDataAdded])
  /* Cancel button */
  const handleclick = () => {
    navigate(-1)
  }
  return (
    <>
              <Header />
              <TitleHeader name='Add New Main Category' title='Test Management'/>
              <div className='main-layout'>
              <Form className='light-bg' onSubmit={handleSubmit(onSubmit)} >
                  <div className="heading-box">
                      <h5>Add New Main Category</h5>
                      <div className="btn-box">
                        <button type="button" onClick={handleclick} className='theme-btn dark-btn text-none'>Cancel</button>
                        <button type="submit" className='theme-btn text-none'>Save</button>
                      </div>
                  </div>
                    <div className="form-middle-layout">
                          <div className="row">
                            <div className="col-md-6">
                              <Form.Group className={`form-group ${errors.title?.message ? 'error-occured' : ''}`} controlId="formmaincategory">
                                <Form.Label>Main Category</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter Main Category"
                                  name={name}
                                  {...register('title', { required: true })}
                                  onChange={(e) => {
                                    onChange(e)
                                  }}
                                />
                                {errors.title?.message && <Form.Text className="error-msg">{errors.title?.message} </Form.Text>}
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                              <Form.Group className={`form-group ${errors.sortOrder?.message ? 'error-occured' : ''}`} controlId="formpincode1">
                                <Form.Label>Sort Order</Form.Label>
                                <Form.Control
                                  type="number"
                                  placeholder="Enter Sort Order"
                                  name={name}
                                  {...register('sortOrder', { required: true })}
                                  onChange={(e) => {
                                    onChange(e)
                                  }}
                                />
                                {errors.sortOrder?.message && <Form.Text className="error-msg">{errors.sortOrder?.message} </Form.Text>}
                              </Form.Group>
                            </div>
                          </div>
                    </div>
              </Form>
              </div>
    </>
  )
}

export default AddNewMainCategory
