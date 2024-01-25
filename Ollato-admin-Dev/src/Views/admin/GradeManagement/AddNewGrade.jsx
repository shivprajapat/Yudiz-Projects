import React, { useRef, useEffect } from 'react'
import { Form } from 'react-bootstrap'

/* React Packages */
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'react-notistack'
import { useNavigate } from 'react-router-dom'

/* Components */
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'

/* Action File */
import { addGradeAction } from '../../../Actions/Admin/grade'

const validationSchema = yup.object().shape({
  gradeNo: yup
    .string()
    .required('Grade is required')
    .matches(/^[aA-zZ\s]+$/, 'Special Charaters & Numbers are not Allowed')
})

function AddNewGrade () {
  // Constant
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const token = localStorage.getItem('token')
  const handleclick = () => {
    navigate(-1)
  }

  // useSelector
  const isGradeDataAdded = useSelector((state) => state.grade.isGradeAdded)
  const isGradeAddedMessage = useSelector((state) => state.grade.resMessage)

  // previousProps
  const previousProps = useRef({
    isGradeDataAdded,
    isGradeAddedMessage
  }).current

  // useForm
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  // onSubmit
  const onSubmit = (data) => {
    const gradeData = {
      title: data.gradeNo
    }
    if (gradeData) {
      dispatch(addGradeAction(gradeData, token))
    }
    reset()
  }

  // Toastify Notification
  useEffect(() => {
    if (previousProps?.isGradeDataAdded !== isGradeDataAdded) {
      if (isGradeDataAdded) {
        enqueueSnackbar(`${isGradeAddedMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/grade-management')
      } else if (isGradeDataAdded === false) {
        enqueueSnackbar(`${isGradeAddedMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isGradeDataAdded = isGradeDataAdded
    }
  }, [isGradeDataAdded])

  return (
    <>
          <Header name='Add Grade' />
          <TitleHeader name='Add Grade' title='Grade Management' />
          <div className='main-layout'>
            <Form className='light-bg' onSubmit={handleSubmit(onSubmit)}>
              <div className='heading-box'>
                <h5>Add Grade</h5>
                <div className='btn-box'>
                  <button
                    type='button'
                    className='theme-btn dark-btn text-none'
                    onClick={handleclick}
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
                      className={`form-group ${
                        errors.gradeNo?.message ? 'error-occured' : ''
                      }`}
                      controlId='formgradenumber'
                    >
                      <Form.Label>Grade</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder='Enter Grade'
                        name='gradeNo'
                        {...register('gradeNo', { required: true })}
                      />
                      {errors.gradeNo?.message && (
                        <Form.Text className='error-msg'>
                          {errors.gradeNo?.message}
                        </Form.Text>
                      )}
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
