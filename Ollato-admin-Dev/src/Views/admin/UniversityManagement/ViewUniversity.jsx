import React, { useEffect } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getUniversityById } from '../../../Actions/Admin/university'

function EditUniversity () {
  // Constant
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()
  const token = localStorage.getItem('token')

  // useSelector
  const mainData = useSelector((state) => state.university.resData)
  useEffect(() => {
    dispatch(getUniversityById(parseInt(id), token))
  }, [])
  return (
    <>
          <Header />
          <TitleHeader name='University' />
          <div className='main-layout'>
            <div className='heading-box'>
              <h5>View University</h5>
              <div className='btn-box'>
                <button className='theme-btn dark-btn text-none' onClick={() => navigate(-1)}>Cancel</button>
              </div>
            </div>
            {mainData?.title
              ? <>
                <div className='form-middle-layout'>
                  <Form className='light-bg'>
                    <div className='row'>
                      <div className='col-md-6'>
                        <Form.Group
                          className='form-group'
                          controlId='formuniversityfullname'
                        >
                          <Form.Label>University Full Name</Form.Label>
                          <Form.Control
                            type='text'
                            value={mainData.title ? mainData?.title : ''}
                            disabled
                          />
                        </Form.Group>
                      </div>
                    </div>
                  </Form>
                </div>
              </>
              : <Spinner animation="border" />}
          </div>
    </>
  )
}

export default EditUniversity
