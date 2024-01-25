import React, { useEffect, useRef } from 'react'
import { Form } from 'react-bootstrap'
/* React Packages */
import { useForm } from 'react-hook-form'

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
import { editSpecificQualification, getSpecificQualificationData } from '../../../Actions/Admin/qualification'
import { validationSchemaQualification } from '../../../Shared/Utills/validationschema'

function EditQualification () {
  // Constant
  const navigate = useNavigate()
  const params = useParams()
  const id = params.id
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const token = localStorage.getItem('token')

  // useSelector
  const mainData = useSelector(state => state.qualification.specificQualificationData)
  const editedResMessage = useSelector((state) => state.qualification.resMessage)
  const isEditedData = useSelector((state) => state.qualification.isQulificationEdited)

  // previousProps
  const previousProps = useRef({ editedResMessage, isEditedData }).current

  // useEffect to get data by id
  useEffect(() => {
    if (id) {
      dispatch(getSpecificQualificationData(Number(id), token))
    }
  }, [id])

  // useForm
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(validationSchemaQualification)
  })

  // reSet Data
  useEffect(() => {
    if (mainData) {
      reset({
        title: mainData?.title
      })
    }
  }, [mainData])

  // onSubmit
  const onSubmit = (data) => {
    const gradedata = {
      id,
      title: data.title
    }
    if (gradedata) {
      dispatch(editSpecificQualification(gradedata, token))
    }
  }

  // Notification for Edit
  useEffect(() => {
    if (previousProps?.isEditedData !== isEditedData) {
      if (isEditedData) {
        enqueueSnackbar(`${editedResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/qualification-management')
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

  return (
    <>
          <Header name='Edit Qualification' />
          <TitleHeader name='Edit Qualification' title='Qualification Management' />
          <div className='main-layout'>
            <Form className='light-bg' onSubmit={handleSubmit(onSubmit)}>
              <div className='heading-box'>
                <h5>Edit Qualification</h5>
                <div className='btn-box'>
                  <button
                    type='button'
                    className='theme-btn dark-btn text-none'
                    onClick={() => navigate(-1)}
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
                      className={`form-group ${errors.title?.message ? 'error-occured' : ''
                        }`}
                      controlId='formgradenumber'
                    >
                      <Form.Label>Qualification</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder='Enter Qualification'
                        {...register('title', { required: true })}
                      />
                      {errors.title?.message && (
                        <Form.Text className='error-msg'>
                          {errors.title?.message}
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

export default EditQualification
