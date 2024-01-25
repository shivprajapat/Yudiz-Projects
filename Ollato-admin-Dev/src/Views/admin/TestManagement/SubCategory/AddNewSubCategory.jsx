import React, { useState, useEffect, useRef } from 'react'
import { Form } from 'react-bootstrap'
import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSnackbar } from 'react-notistack'
import { useNavigate } from 'react-router-dom'

import Header from '../../../../Components/Header'
import TitleHeader from '../../../../Components/TitleHeader'

import { getAllMainCategoriesDataAction, addSubCategoryTestAction } from '../../../../Actions/Admin/test'
import TextEditor from '../../../../Components/Editor'

const validationSchema = yup.object().shape({
  mainCategory: yup
    .object()
    .shape({
      label: yup.string().required('Main Category is required'),
      value: yup.string().required('Main Category is required')
    })
    .nullable() // for handling null value when clearing options via clicking "x"
    .required('Main Category is required'),
  subCategory: yup.string().required('SubCategory is required'),
  subCategoryAbb: yup.string().required('SubCategory Abbreviation is required'),
  questions: yup.string().required('Questions is required'),
  // description: yup.string().required('Description is required'),
  sortOrder: yup
    .number()
    .positive('Only positive numbers')
    .typeError('Sort Order must be a number')
    .required('Sort Order is required')

})

function AddNewMainCategory () {
  // Constant
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const token = localStorage.getItem('token')

  // useState
  const [data, setData] = useState([])
  const [htmlData, setHtmlData] = useState('')

  // useEffect
  useEffect(() => {
    if (token) {
      dispatch(getAllMainCategoriesDataAction(token))
    }
  }, [token])

  // useSelector
  const categoriesData = useSelector((state) => state.test.mainCategoryData)
  const isCategoryAdded = useSelector(state => state.test.isSubCategoryAdded)
  const isCategoryAddedMessage = useSelector(state => state.test.resMessage)

  // previousProps
  const previousProps = useRef({ categoriesData, isCategoryAdded, isCategoryAddedMessage }).current

  // useForm
  const { control, handleSubmit, register, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchema)
  })
  const { onChange, name } = register()

  useEffect(() => {
    if (previousProps?.categoriesData !== categoriesData) {
      const array = []
      if (categoriesData) {
        // eslint-disable-next-line array-callback-return
        categoriesData.map((data) => {
          array.push({
            value: data.id,
            label: data.title
          })
        })
        setData(array)
      }
    }
    return () => {
      previousProps.categoriesData = categoriesData
    }
  }, [categoriesData])

  const onSubmit = data => {
    const testData = {
      test_id: Number(data.mainCategory.value),
      title: data.subCategory,
      sub_test_abb: data.subCategoryAbb,
      no_of_questions: Number(data.questions),
      description: htmlData,
      sort_order: Number(data.sortOrder)
    }
    if (testData) {
      dispatch(addSubCategoryTestAction(testData, token))
    }
  }
  // Toastify Notification
  useEffect(() => {
    if (previousProps?.isCategoryAdded !== isCategoryAdded) {
      if (isCategoryAdded) {
        enqueueSnackbar(`${isCategoryAddedMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/test-management/sub-category')
        reset()
      } else if (isCategoryAdded === false) {
        enqueueSnackbar(`${isCategoryAddedMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        }
        )
      }
    }
    return () => {
      previousProps.isCategoryAdded = isCategoryAdded
    }
  }, [isCategoryAdded])

  /* Cancel button */
  const handleclick = () => {
    navigate(-1)
  }

  return (
    <>
              <Header />
              <TitleHeader name='Add New Sub Category' title='Test Management'/>
              <div className='main-layout'>
              <Form className='light-bg' onSubmit={handleSubmit(onSubmit)} >
                  <div className="heading-box">
                      <h5>Add New Sub Category</h5>
                      <div className="btn-box">
                        <button type="button" onClick={handleclick} className='theme-btn dark-btn text-none'>Cancel</button>
                        <button type="submit" className='theme-btn text-none'>Save</button>
                      </div>
                  </div>
                    <div className="form-middle-layout">
                          <div className="row">
                          <div className="col-md-6">
                              <Form.Group className="form-group common-select-style" controlId="formfullname">
                                <Form.Label>Main Category</Form.Label>
                                <Controller
                                    name="mainCategory"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                        // defaultValue={options[0]}
                                        {...field}
                                        isClearable // enable isClearable to demonstrate extra error handling
                                        isSearchable={false}
                                        placeholder={'Select Main Catgeory'}
                                        className='react-dropdown'
                                        classNamePrefix='dropdown'
                                        options={data}
                                        />
                                    )}
                                />
                                <p className="error-msg">{errors?.mainCategory?.message || errors?.mainCategory?.label.message}</p>
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                              <Form.Group className="form-group" controlId="formmainmaincategory">
                                <Form.Label>Sub Category</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter Sub Category"
                                  name={name}
                                  {...register('subCategory', { required: true })}
                                  onChange={(e) => {
                                    onChange(e)
                                  }}
                                />
                                <p className="error-msg">{errors?.subCategory?.message || errors?.subCategory?.message}</p>
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                              <Form.Group className="form-group" controlId="formmainmaincategory">
                                <Form.Label>Sub Category Abbreviation</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter Sub Category Abbreviation"
                                  name={name}
                                  {...register('subCategoryAbb', { required: true })}
                                  onChange={(e) => {
                                    onChange(e)
                                  }}
                                />
                                <p className="error-msg">{errors?.subCategoryAbb?.message || errors?.subCategoryAbb?.message}</p>
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                              <Form.Group className="form-group" controlId="formmainmaincategory">
                                <Form.Label>No Of Questions</Form.Label>
                                <Form.Control
                                  type="number"
                                  placeholder="Enter No Of Questions"
                                  name={name}
                                  {...register('questions', { required: true })}
                                  onChange={(e) => {
                                    onChange(e)
                                  }}
                                />
                                <p className="error-msg">{errors?.questions?.message || errors?.questions?.message}</p>
                              </Form.Group>
                            </div>
                            <div className="col-md-6">
                              <Form.Group className="form-group" controlId="formmainmaincategory">
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
                                <p className="error-msg">{errors?.sortOrder?.message || errors?.sortOrder?.message}</p>
                              </Form.Group>
                            </div>
                            <div className="col-md-12">
                              <Form.Label>Sub Category Description</Form.Label>
                              <TextEditor setHtmlData={setHtmlData} />
                            </div>
                          </div>
                    </div>
                </Form>
              </div>
    </>
  )
}

export default AddNewMainCategory
