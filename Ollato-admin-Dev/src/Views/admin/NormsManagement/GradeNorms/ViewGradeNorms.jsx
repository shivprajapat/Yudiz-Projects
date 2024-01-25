import React, { useEffect } from 'react'
import { Form } from 'react-bootstrap'
import Header from '../../../../Components/Header'
import TitleHeader from '../../../../Components/TitleHeader'
import { useDispatch, useSelector } from 'react-redux'
import {
  getAllGreades,
  getSpecificGradeNorms
} from '../../../../Actions/Admin/Norms/GradeNorms/GradeNorms'
import { useNavigate, useParams } from 'react-router-dom'
import { getAllNormsFrontend } from '../../../../Actions/Admin/Norms/norms'
function ViewGradeNorms () {
  // Constant
  const dispatch = useDispatch()
  const { id } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  // useEffect to get Data
  useEffect(() => {
    dispatch(getSpecificGradeNorms(Number(id), token))
    dispatch(getAllGreades(token))
    dispatch(getAllNormsFrontend(token))
  }, [])

  // useSelector
  const mainData = useSelector((state) => state.gradeNorms.resData)
  const gradeArray = useSelector((state) => state.gradeNorms.gradeList)
  const normsArray = useSelector((state) => state.norms.normsFrontList)

  return (
    <>
          <Header />
          <TitleHeader name='View GradeNorms' title='Norms Management' />
          <div className='main-layout'>
            <div className='heading-box'>
              <h5>View GradeNorms</h5>
              <div className='btn-box'>
                <button
                  className='theme-btn dark-btn text-none'
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
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
                      <Form.Label>Grade</Form.Label>
                      <Form.Control
                        type='text'
                        disabled
                        value={ gradeArray?.filter((data) => data?.id === mainData?.grade_id)[0]?.title || ''}
                      />
                    </Form.Group>
                  </div>
                  <div className='col-md-6'>
                    <Form.Group
                      className='form-group common-select-style'
                      controlId='formfullname'
                    >
                      <Form.Label>Norms</Form.Label>
                      <Form.Control
                        type='text'
                        disabled
                        value={normsArray?.filter((data) => data?.id === mainData?.norm_id)[0]?.title || ''}
                      />
                    </Form.Group>
                  </div>
                  <div className='col-md-6'>
                    <Form.Group
                      className='form-group common-select-style'
                      controlId='formfullname'
                    >
                      <Form.Label>Test</Form.Label>
                      <Form.Control
                        type='text'
                        disabled
                        value={mainData?.tests?.title}
                      />
                    </Form.Group>
                  </div>
                  <div className='col-md-6'>
                    <Form.Group
                      className='form-group common-select-style'
                      controlId='formfullname'
                    >
                      <Form.Label>SubTest</Form.Label>
                      <Form.Control
                        type='text'
                        disabled
                        value={mainData?.test_details?.title}
                      />
                    </Form.Group>
                  </div>
                  <div className='col-md-6'>
                    <Form.Group className='form-group' controlId='formminmarks'>
                      <Form.Label>Min Marks</Form.Label>
                      <Form.Control
                        type='text'
                        disabled
                        value={mainData?.min_marks}
                      />
                    </Form.Group>
                  </div>
                  <div className='col-md-6'>
                    <Form.Group className='form-group' controlId='formmaxmarks'>
                      <Form.Label>Max Marks</Form.Label>
                      <Form.Control
                        type='text'
                        disabled
                        value={mainData?.max_marks}
                      />
                    </Form.Group>
                  </div>
                </div>
              </Form>
            </div>
          </div>
    </>
  )
}

export default ViewGradeNorms
