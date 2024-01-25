import React, { useRef, useEffect } from 'react'
import { Form } from 'react-bootstrap'

/* React Packages */
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'react-notistack'
import { useNavigate } from 'react-router-dom'

/* Components */
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'

/* Action File */
import { addQualificationAction } from '../../../Actions/Admin/qualification'
import { validationSchemaQualification } from '../../../Shared/Utills/validationschema'

function AddNewGrade () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const token = localStorage.getItem('token')
  const isQualificationDataAdded = useSelector(state => state.qualification.isQualificationAdded)
  const isQualificationAddedMessage = useSelector(state => state.qualification.resMessage)
  const previousProps = useRef({ isQualificationDataAdded, isQualificationAddedMessage }).current

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchemaQualification)
  })
  const { onChange, name } = register('title')

  const onSubmit = data => {
    const qualificationData = {
      title: data.title
    }
    if (qualificationData) {
      dispatch(addQualificationAction(qualificationData, token))
    }
    reset()
  }

  // Toastify Notification
  useEffect(() => {
    if (previousProps?.isQualificationDataAdded !== isQualificationDataAdded) {
      if (isQualificationDataAdded) {
        enqueueSnackbar(`${isQualificationAddedMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/qualification-management')
      } else if (isQualificationDataAdded === false) {
        enqueueSnackbar(`${isQualificationAddedMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        }
        )
      }
    }
    return () => {
      previousProps.isQualificationDataAdded = isQualificationDataAdded
    }
  }, [isQualificationDataAdded])

  /* Cancel button */
  const handleclick = () => {
    navigate(-1)
  }
  return (
    <>
          <Header />
          <TitleHeader name='Add Qualification' title="Qualification" />
          <div className='main-layout'>
            <Form className='light-bg' onSubmit={handleSubmit(onSubmit)}>
              <div className="heading-box">
                <h5>Add Qualification</h5>
                <div className="btn-box">
                  <button type="button" className='theme-btn dark-btn text-none' onClick={handleclick} >Cancel</button>
                  <button type="submit" className='theme-btn text-none'>Save</button>
                </div>
              </div>
              <div className="form-middle-layout">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className={`form-group ${errors.title?.message ? 'error-occured' : ''}`} controlId="formgradenumber">
                      <Form.Label>Qualification</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Qualification"
                        name={name}
                        {...register('title', { required: true })}
                        onChange={(e) => {
                          onChange(e)
                        }}
                      />
                      {errors.title?.message && <Form.Text className="error-msg">{errors.title?.message} </Form.Text>}
                    </Form.Group>
                  </div>
                </div>
              </div>
            </Form>
          </div>
    </>
  )
}

export default AddNewGrade
