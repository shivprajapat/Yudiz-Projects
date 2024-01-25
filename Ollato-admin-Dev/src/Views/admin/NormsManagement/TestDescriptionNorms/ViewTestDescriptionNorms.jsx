import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import Header from '../../../../Components/Header'
import TitleHeader from '../../../../Components/TitleHeader'
import { useNavigate, useParams } from 'react-router-dom'
import { getSpecificTestNormsDescription } from '../../../../Actions/Admin/Norms/TestNormsDescription/TestNormsDescription'
import { useDispatch, useSelector } from 'react-redux'
import { getAllNormsList } from '../../../../Actions/Admin/Norms/norms'
function ViewTestDescriptionNorms () {
  // Constant
  const navigate = useNavigate()
  const { id } = useParams()
  const token = localStorage.getItem('token')
  const dispatch = useDispatch()
  const [norms, setNorms] = useState([])

  // useSelector
  const mainData = useSelector(state => state.testNormsDescription.resData)
  const normsArray = useSelector((state) => state.norms.normsList)

  // useEffect to get data by id
  useEffect(() => {
    dispatch(getSpecificTestNormsDescription(Number(id), token))
    dispatch(getAllNormsList(token))
  }, [])

  useEffect(() => {
    normsArray && setNorms(normsArray?.filter((data) => data?.id === mainData?.norm_id))
  }, [mainData, normsArray])

  return (
    <>
          <Header />
          <TitleHeader
            name='View Test Description Norms'
            title='Norms Management'
          />
          <div className='main-layout'>
            <div className='heading-box'>
              <h5>View Test Description Norms</h5>
              <div className='btn-box'>
                <button className='theme-btn dark-btn text-none' onClick={() => navigate('/admin/norms/test-description-norms')} >Cancel</button>
              </div>
            </div>
            <div className='form-middle-layout'>
              <Form className='light-bg'>
                <div className='row'>
                  <div className='col-md-6'>
                    <Form.Group
                      className='form-group common-select-style'
                      controlId='formfullname'
                    >
                      <Form.Label>Norms</Form.Label>
                      <Form.Control value={norms[0]?.title} disabled />
                    </Form.Group>
                  </div>
                  <div className='col-md-6'>
                    <Form.Group
                      className='form-group common-select-style'
                      controlId='formfullname'
                    >
                      <Form.Label>Test</Form.Label>
                      <Form.Control value={mainData?.tests?.title} disabled />
                    </Form.Group>
                  </div>
                  <div className='col-md-6'>
                    <Form.Group
                      className='form-group common-select-style'
                      controlId='formfullname'
                    >
                      <Form.Label>SubTest</Form.Label>
                      <Form.Control value={mainData?.test_details?.title} disabled />
                    </Form.Group>
                  </div>
                  <div className='col-md-12'>
                    <div className='row'>
                      <div className='col-md-6'>
                        <Form.Group
                          className='form-group'
                          controlId='formdescription'
                        >
                          <Form.Label>Test Description</Form.Label>
                          <Form.Control
                            as='textarea'
                            className='big-textarea'
                            disabled
                            value={mainData?.description}
                          />
                        </Form.Group>
                      </div>
                      <div className='col-md-6'>
                        <Form.Group
                          className='form-group'
                          controlId='formplanofaction'
                        >
                          <Form.Label>Plan of action</Form.Label>
                          <Form.Control
                            as='textarea'
                            className='big-textarea'
                            disabled
                            value={mainData?.plan_of_action}
                          />
                        </Form.Group>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          </div>
    </>
  )
}

export default ViewTestDescriptionNorms
