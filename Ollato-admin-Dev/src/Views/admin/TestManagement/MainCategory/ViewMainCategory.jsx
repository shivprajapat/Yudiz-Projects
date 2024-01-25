import React, { useEffect } from 'react'

/* React Packages */
import { Form, Spinner } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

/* Components */
import Header from '../../../../Components/Header'
import TitleHeader from '../../../../Components/TitleHeader'

/* Action File */
import { viewTestCategoryAction } from '../../../../Actions/Admin/test'

function ViewMainCategory () {
  // Constant
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const params = useParams()
  const id = params?.id
  const token = localStorage.getItem('token')

  // useSelector
  const testDataArray = useSelector((state) => state.test.testCategoryDataById)

  // useEffect to get data
  useEffect(() => {
    dispatch(viewTestCategoryAction({ id: +id }, token))
  }, [id])

  return (
    <>
          <Header />
          <TitleHeader name='View Main Category' title='Test Management' />
          <div className='main-layout'>
            <div className='heading-box'>
              <h5>View Main Category</h5>
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
                          placeholder='Enter Main Category'
                          Value={testDataArray?.title}
                          disabled
                        />
                      </Form.Group>
                    </div>
                    <div className='col-md-6'>
                      <Form.Group
                        className='form-group'
                        controlId='formpincode1'
                      >
                        <Form.Label>Sort Order</Form.Label>
                        <Form.Control
                          type='number'
                          placeholder='Enter Sort Order'
                          Value={testDataArray?.sort_order}
                          disabled
                        />
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

export default ViewMainCategory
