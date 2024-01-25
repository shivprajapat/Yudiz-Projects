import React, { useEffect, useRef } from 'react'
import { Form } from 'react-bootstrap'
/* React Packages */
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
// import { useDispatch, useSelector } from 'react-redux'
// import { useSnackbar } from 'react-notistack'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'react-notistack'

/* Components */
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
/* Action File */
import {
  getSpecificGradeData,
  editSpecificGrade
} from '../../../Actions/Admin/grade'

const validationSchema = yup.object().shape({
  gradeNo: yup
    .string()
    .required('Grade is required')
    .matches(/^[aA-zZ\s]+$/, 'Special Charaters & Numbers are not Allowed')
})

function EditGrade () {
  // Constant
  const navigate = useNavigate()
  const params = useParams()
  const id = params.id
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
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
  const specificGradeData = useSelector(
    (state) => state.grade.specificGradeData
  )
  const editedResMessage = useSelector((state) => state.grade.resMessage)
  const isEditedData = useSelector((state) => state.grade.isGradeEdited)
  const previousProps = useRef({ editedResMessage, isEditedData }).current

  // useForm
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  // onSubmit
  const onSubmit = (data) => {
    const gradedata = {
      id,
      title: data.gradeNo
    }
    if (gradedata) {
      dispatch(editSpecificGrade(gradedata, token))
    }
  }

  // Toastify Notification
  useEffect(() => {
    if (previousProps?.isEditedData !== isEditedData) {
      if (isEditedData) {
        enqueueSnackbar(`${editedResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/grade-management')
      } else if (isEditedData === false) {
        enqueueSnackbar(`${editedResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isEditedData = isEditedData
    }
  }, [isEditedData])

  return (
    <>
          <Header name='Edit Grade' />
          <TitleHeader name='Edit Grade' title='Grade Management' />
          <div className='main-layout'>
            <Form className='light-bg' onSubmit={handleSubmit(onSubmit)}>
              <div className='heading-box'>
                <h5>Edit Grade</h5>
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
                      className={`form-group ${errors.gradeNo?.message ? 'error-occured' : ''
                        }`}
                      controlId='formgradenumber'
                    >
                      <Form.Label>Grade</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder='Enter Grade'
                        name={name}
                        Value={
                          (specificGradeData && specificGradeData?.title) || ''
                        }
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

export default EditGrade
