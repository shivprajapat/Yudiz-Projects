import React, { useEffect, useRef } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
import { useNavigate, useParams } from 'react-router-dom'
import { getUniversityById, updateUniversity } from '../../../Actions/Admin/university'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSnackbar } from 'react-notistack'

const validationSchema = yup.object().shape({
  universityFullName: yup.string()
    .required('University Name is required')
    .min(2, 'University Name must be at least 2 characters')
    .matches(/^[a-zA-z]+([\s][a-zA-Z]+)*$/, 'Special Characters & Numeric value are not allowed')
})

function EditUniversity () {
  // Constant
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const token = localStorage.getItem('token')

  // useSelector
  const mainData = useSelector((state) => state.university.resData)
  const editedResMessage = useSelector((state) => state.university.resMessage)
  const isEditedData = useSelector((state) => state.university.isUniversityEdited)

  // previousProps
  const previousProps = useRef({ editedResMessage, isEditedData }).current

  useEffect(() => {
    if (previousProps?.isEditedData !== isEditedData) {
      if (isEditedData) {
        enqueueSnackbar(`${editedResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/university-management')
      } else if (isEditedData === false) {
        enqueueSnackbar(`${editedResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        }
        )
      }
    }
    return () => {
      previousProps.isEditedData = isEditedData
    }
  }, [isEditedData])

  useEffect(() => {
    dispatch(getUniversityById(parseInt(params?.id), token))
  }, [])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const onSubmit = (data) => {
    const universityData = {
      id: mainData.id,
      title: data.universityFullName
    }
    if (universityData) {
      dispatch(updateUniversity(universityData, token, reset))
    }
    reset({
      universityFullName: data.universityFullName
    })
  }
  useEffect(() => {
    if (mainData) {
      reset({
        universityFullName: mainData?.title
      })
    }
  }, [mainData])
  return (
    <>
          <Header />
          <TitleHeader name='University' />
          <div className='main-layout'>
            <div className='heading-box'>
              <h5>Edit University</h5>
              <div className='btn-box'>
                <button className='theme-btn dark-btn text-none' onClick={() => navigate(-1)}>Cancel</button>
                <button className='theme-btn text-none' onClick={handleSubmit(onSubmit)} >Save</button>
              </div>
            </div>
            {mainData?.title
              ? <div className='form-middle-layout'>
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
                          placeholder='Enter University Full Name'
                          {...register('universityFullName', {
                            required: 'true'
                          })}
                        />
                        {errors.universityFullName?.message && (
                          <Form.Text className='error-msg'>
                            {errors.universityFullName?.message}
                          </Form.Text>
                        )}
                      </Form.Group>
                    </div>
                  </div>
                </Form>
              </div>
              : <Spinner animation="border" />}
          </div>
    </>
  )
}

export default EditUniversity
