import React, { useEffect } from 'react'
import { Form } from 'react-bootstrap'
/* React Packages */
// import { useDispatch, useSelector } from 'react-redux'
// import { useSnackbar } from 'react-notistack'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

/* Components */
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
/* Action File */
import { getSpecificQualificationData } from '../../../Actions/Admin/qualification'

function EditGrade () {
  // Constants
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch()
  const id = params.id
  const token = localStorage.getItem('token')

  // useSelector
  const specificQualificationData = useSelector((state) => state.qualification.specificQualificationData)

  useEffect(() => {
    if (id) {
      dispatch(getSpecificQualificationData(Number(id), token))
    }
  }, [id])

  /* Cancel button */
  const handleclick = () => {
    navigate(-1)
  }
  return (
    <>
          <Header name='View Qualification' />
          <TitleHeader name='View Qualification' />
          <div className='main-layout'>
            <Form className='light-bg'>
              <div className="heading-box">
                <h5>View Qualification</h5>
                <div className="btn-box">
                  <button type="button" className='theme-btn dark-btn text-none' onClick={handleclick} >Cancel</button>
                  {/* <button type="submit" className='theme-btn text-none'>Save</button> */}
                </div>
              </div>
              <div className="form-middle-layout">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className='form-group' controlId="formgradenumber">
                      <Form.Label>Qualification</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Qualification"
                        value={specificQualificationData ? specificQualificationData?.title : ''}
                        disabled
                      />
                    </Form.Group>
                  </div>
                </div>
              </div>
            </Form>
          </div>
    </>
  )
}

export default EditGrade
