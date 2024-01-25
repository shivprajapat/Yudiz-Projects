import React, { useEffect, useState, useRef } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'react-notistack'

import Header from '../../../../Components/Header'
import TitleHeader from '../../../../Components/TitleHeader'

import {
  getAllMainCategoriesDataAction,
  viewTestSubCategoryAction,
  updateSubCategoryTestAction
} from '../../../../Actions/Admin/test'
import TextEditor from '../../../../Components/Editor'

const validationSchema = yup.object().shape({
  subCategory: yup.string().required('SubCategory is required'),
  subCategoryAbb: yup.string().required('SubCategory Abbreviation is required'),
  questions: yup.string().required('Questions is required'),
  sortOrder: yup.string().required('Sort Order is required'),
  mainCategory: yup.object().shape({
    id: yup.string().required('Test is required'),
    title: yup.string().required('Test is required')
  })
})

function EditSubCategory () {
  // Constant
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const params = useParams()
  const token = localStorage.getItem('token')
  const id = params?.id

  // useSelector
  const mainData = useSelector((state) => state.test.testSubCategoryDataById)
  const mainCategoryArray = useSelector((state) => state.test.mainCategoryData)
  const isCategoryEdited = useSelector(
    (state) => state.test.isSubCategoryEdited
  )
  const isCategoryEditedMessage = useSelector((state) => state.test.resMessage)

  // useState
  const [htmlData, setHtmlData] = useState(mainData?.description)

  // useEffect to getData
  useEffect(() => {
    dispatch(getAllMainCategoriesDataAction(token))
    dispatch(viewTestSubCategoryAction({ id: [id] }, token))
  }, [])

  useEffect(() => {
    setHtmlData(mainData?.description)
  }, [mainData])

  useEffect(() => {
    if (mainData && mainCategoryArray?.length) {
      const cData = mainCategoryArray.filter((c) => c?.id === mainData?.test_id)
      reset({
        mainCategory: cData[0]
      })
    }
  }, [mainData, mainCategoryArray])

  // previousProps
  const previousProps = useRef({
    mainCategoryArray,
    isCategoryEdited,
    isCategoryEditedMessage
  }).current

  // useForm
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    reset
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  // onSubmit
  const onSubmit = (data) => {
    const testData = {
      id,
      test_id: Number(data?.mainCategory?.id),
      title: data.subCategory,
      sub_test_abb: data.subCategoryAbb,
      no_of_questions: data.questions,
      description: htmlData,
      sort_order: data.sortOrder
    }
    if (testData) {
      dispatch(updateSubCategoryTestAction(testData, token))
    }
  }

  // Toastify Notification
  useEffect(() => {
    if (previousProps?.isCategoryEdited !== isCategoryEdited) {
      if (isCategoryEdited) {
        enqueueSnackbar(`${isCategoryEditedMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/test-management/sub-category')
        reset()
      } else if (isCategoryEdited === false) {
        enqueueSnackbar(`${isCategoryEditedMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isCategoryEdited = isCategoryEdited
    }
  }, [isCategoryEdited])
  return (
    <>
          <Header />
          <TitleHeader name='Edit Sub Category' title='Test Management' />
          {mainData?.id
            ? (
            <div className='main-layout'>
              <Form className='light-bg' onSubmit={handleSubmit(onSubmit)}>
                <div className='heading-box'>
                  <h5>Edit New Sub Category</h5>
                  <div className='btn-box'>
                    <button
                      type='button'
                      onClick={() =>
                        navigate('/admin/test-management/sub-category')
                      }
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
                        className='form-group common-select-style'
                        controlId='formfullname'
                      >
                        <Form.Label>Main Category</Form.Label>
                        <Controller
                          name='mainCategory'
                          control={control}
                          render={({
                            field: {
                              onChange,
                              value = getValues()?.categoriesArray
                            }
                          }) => {
                            return (
                              <>
                                <Select
                                  placeholder={'Select Main Category'}
                                  className='react-dropdown'
                                  classNamePrefix='dropdown'
                                  options={mainCategoryArray}
                                  getOptionLabel={(option) => option?.title}
                                  getOptionValue={(option) => option?.id}
                                  {...register('mainCategory')}
                                  value={value || getValues()?.categoriesArray}
                                  onChange={(e) => {
                                    onChange(e)
                                  }}
                                />
                              </>
                            )
                          }}
                        />
                        <p className='error-msg'>
                          {errors.mainCategory?.title?.message ||
                            errors.mainCategory?.id?.message}
                        </p>
                      </Form.Group>
                    </div>
                    <div className='col-md-6'>
                      <Form.Group
                        className='form-group'
                        controlId='formmainmaincategory'
                      >
                        <Form.Label>Sub Category</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder='Enter Sub Category'
                          name={name}
                          {...register('subCategory', { required: true })}
                          Value={mainData?.title}
                        />
                        <p className='error-msg'>
                          {errors?.subCategory?.message ||
                            errors?.subCategory?.message}
                        </p>
                      </Form.Group>
                    </div>
                    <div className='col-md-6'>
                      <Form.Group
                        className='form-group'
                        controlId='formmainmaincategory'
                      >
                        <Form.Label>Sub Category Abbreviation</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder='Enter Sub Category Abbreviation'
                          name={name}
                          {...register('subCategoryAbb', { required: true })}
                          Value={mainData?.sub_test_abb}
                        />
                        <p className='error-msg'>
                          {errors?.subCategoryAbb?.message ||
                            errors?.subCategoryAbb?.message}
                        </p>
                      </Form.Group>
                    </div>
                    <div className='col-md-6'>
                      <Form.Group
                        className='form-group'
                        controlId='formmainmaincategory'
                      >
                        <Form.Label>No Of Questions</Form.Label>
                        <Form.Control
                          type='number'
                          placeholder='Enter No Of Questions'
                          name={name}
                          {...register('questions', { required: true })}
                          Value={mainData?.no_of_questions}
                        />
                        <p className='error-msg'>
                          {errors?.questions?.message ||
                            errors?.questions?.message}
                        </p>
                      </Form.Group>
                    </div>
                    <div className='col-md-6'>
                      <Form.Group
                        className='form-group'
                        controlId='formmainmaincategory'
                      >
                        <Form.Label>Sort Order</Form.Label>
                        <Form.Control
                          type='number'
                          placeholder='Enter Sort Order'
                          name={name}
                          {...register('sortOrder', { required: true })}
                          Value={mainData?.sort_order}
                        />
                        <p className='error-msg'>
                          {errors?.sortOrder?.message ||
                            errors?.sortOrder?.message}
                        </p>
                      </Form.Group>
                    </div>
                    <div className='col-md-12'>
                      <Form.Group
                        className='form-group'
                        controlId='formmainmaincategory'
                      >
                        <Form.Label>Sub Category Description</Form.Label>
                        <TextEditor
                          initialHtmlData={htmlData}
                          setHtmlData={setHtmlData}
                        />
                      </Form.Group>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
              )
            : (
            <Spinner animation='border' />
              )}
    </>
  )
}

export default EditSubCategory
