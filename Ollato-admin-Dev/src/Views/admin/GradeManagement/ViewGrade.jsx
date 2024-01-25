import React, { useEffect } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
import { getSpecificGradeData } from '../../../Actions/Admin/grade'

function EditGrade () {
  // Constant
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch()
  const id = params.id
  const token = localStorage.getItem('token')
  const handleclick = () => {
    navigate(-1)
  }

  // useEffect to get data by id
  useEffect(() => {
    if (id) {
      dispatch(getSpecificGradeData(Number(id), token))
    }
  }, [id])

  // useSelector
  const specificGradeData = useSelector(state => state.grade.specificGradeData)

  return (
    <>
          <Header name='View Grade' />
          <TitleHeader name='View Grade' title='Grade Management' />
          <div className='main-layout'>
            <div className='heading-box'>
              <h5>View Grade</h5>
              <div className='btn-box'>
                <button
                  type='button'
                  className='theme-btn dark-btn text-none'
                  onClick={handleclick}
                >
                  Cancel
                </button>
              </div>
            </div>

                {specificGradeData?.id
                  ? (
                  <div className='col-md-6'>
                    <Form className='light-bg'>
                      <Form.Group
                        className='form-group'
                        controlId='formgradenumber'
                      >
                        <Form.Label>Grade</Form.Label>
                        <Form.Control
                          type='text'
                          Value={
                            (specificGradeData && specificGradeData?.title) ||
                            ''
                          }
                          disabled
                        />
                      </Form.Group>
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

export default EditGrade
