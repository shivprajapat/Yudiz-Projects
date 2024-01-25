import React, { useEffect, useRef, useState } from 'react'

/* React Packages */
import { Form, Spinner } from 'react-bootstrap'
// import Select from 'react-select'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'

/* Components */
import Header from '../../../../Components/Header'
import TitleHeader from '../../../../Components/TitleHeader'

/* Action File */
import {
  viewTestSubCategoryAction,
  getAllMainCategoriesDataAction
} from '../../../../Actions/Admin/test'

function ViewSubCategory () {
  // Constant
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const params = useParams()
  const id = params?.id
  const token = localStorage.getItem('token')

  // useState
  const [array, setArray] = useState([])

  // useSelector
  const testDataArray = useSelector(
    (state) => state.test.testSubCategoryDataById
  )
  const categoriesData = useSelector((state) => state.test.mainCategoryData)

  // previousProps
  const previousProps = useRef({ testDataArray, categoriesData }).current

  // useForm
  const { reset } = useForm()

  // useEffect to get data
  useEffect(() => {
    if (token) {
      dispatch(getAllMainCategoriesDataAction(token))
    }
  }, [token])

  useEffect(() => {
    if (id) {
      const testData = {
        id: Number(id)
      }
      dispatch(viewTestSubCategoryAction(testData, token))
    }
  }, [id])

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
        setArray(array)
      }
    }
    return () => {
      previousProps.categoriesData = categoriesData
    }
  }, [categoriesData])
  useEffect(() => {
    if (array?.length) {
      const arrayV = array.filter((c) => c.value === testDataArray?.test_id)
      reset({
        array: arrayV
      })
    }
  }, [array])

  return (
    <>
          <Header />
          <TitleHeader name='View Sub Category' title='Test Management' />
          <div className='main-layout'>
            <div className='heading-box'>
              <h5>View Sub Category</h5>
              <div className='btn-box'>
                <button
                  className='theme-btn dark-btn text-none'
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
              </div>
            </div>
            {testDataArray?.id
              ? (
              <div className='form-middle-layout'>
                <Form className='light-bg'>
                  <div className='row'>
                    <div className='col-md-6'>
                      <Form.Group
                        className='form-group'
                        controlId='formmaincategory'
                      >
                        <Form.Label>Main Category</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder='Enter Sub Category'
                          Value={array[0]?.label}
                          disabled
                        />
                      </Form.Group>
                    </div>
                    <div className='col-md-6'>
                      <Form.Group
                        className='form-group'
                        controlId='formmaincategory'
                      >
                        <Form.Label>Sub Category</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder='Enter Sub Category'
                          Value={testDataArray?.title}
                          disabled
                        />
                      </Form.Group>
                    </div>
                    <div className='col-md-6'>
                      <Form.Group
                        className='form-group'
                        controlId='formmaincategory'
                      >
                        <Form.Label>Sort Order</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder='Enter Sub Category'
                          Value={testDataArray?.sort_order}
                          disabled
                        />
                      </Form.Group>
                    </div>
                    <div className='col-md-6'>
                      <Form.Group
                        className='form-group'
                        controlId='formmaincategory'
                      >
                        <Form.Label>No of questions</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder='Enter Sub Category'
                          Value={testDataArray?.no_of_questions}
                          disabled
                        />
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
                          value={testDataArray?.sort_order}
                          disabled
                        />
                      </Form.Group>
                    </div>
                    <div className='col-md-12'>
                      <Form.Group
                        className='form-group'
                        controlId='formmaincategory'
                      >
                        <Form.Label>Sub Category Description</Form.Label>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: testDataArray?.description
                          }}
                        ></div>
                      </Form.Group>
                    </div>
                  </div>
                </Form>
              </div>
                )
              : (
              <Spinner animation='border' />
                )}
          </div>
    </>
  )
}

export default ViewSubCategory
