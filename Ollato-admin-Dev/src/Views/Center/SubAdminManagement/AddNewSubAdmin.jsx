import React, { useEffect, useRef } from 'react'
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
import { yupResolver } from '@hookform/resolvers/yup'
import { Form } from 'react-bootstrap'
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  addSubAdminAction,
  getAllRoleSelect
} from '../../../Actions/Admin/subAdmin'
import { useSnackbar } from 'react-notistack'
import { validationSchemaSubAdmin } from '../../../Shared/Utills/validationschema'

function AddNewSubAdmin () {
  // Constant
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const { enqueueSnackbar } = useSnackbar()
  const dispatch = useDispatch()

  // useState

  // useEffect
  useEffect(() => {
    dispatch(getAllRoleSelect(token))
  }, [])

  // useSelector
  const roleListArray = useSelector((state) => state.subAdmin.roleData)
  const isSubAdminDataAdded = useSelector(
    (state) => state.subAdmin.isSubAdminAdded
  )
  const isSubAdminAddedMessage = useSelector(
    (state) => state.subAdmin.resMessage
  )

  // previousProps
  const previousProps = useRef({ isSubAdminDataAdded }).current

  // useForm
  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchemaSubAdmin)
  })

  // onSubmit
  const onSubmit = (data) => {
    const subAdminData = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      mobile: data.mobileNumber,
      admin_type: 'sub',
      role_id: data?.role?.id
    }
    if (subAdminData) {
      dispatch(addSubAdminAction(subAdminData, token))
    }
  }

  // Toastify Notification for Add
  useEffect(() => {
    if (previousProps?.isSubAdminDataAdded !== isSubAdminDataAdded) {
      if (isSubAdminDataAdded) {
        enqueueSnackbar(`${isSubAdminAddedMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/sub-admin-management')
      } else if (isSubAdminDataAdded === false) {
        enqueueSnackbar(`${isSubAdminAddedMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isSubAdminDataAdded = isSubAdminDataAdded
    }
  }, [isSubAdminDataAdded])

  return (
    <>
          <Header />
          <TitleHeader name='Sub-Admin' title='Add New Sub Admin' />
          <div className='main-layout'>
            <Form className='light-bg' onSubmit={handleSubmit(onSubmit)}>
              <div className='heading-box'>
                <h5>Add Sub-Admin</h5>
                <div className='btn-box'>
                  <button
                    className='theme-btn dark-btn text-none'
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                  <button className='theme-btn text-none'>Save</button>
                </div>
              </div>
              <div className='form-middle-layout'>
                <div className='row'>
                  <div className='col-xxl-12 '>
                    <div className='row'>
                      <div className='col-lg-6'>
                        <Form.Group
                          className={`form-group ${
                            errors.firstName?.message ? 'error-occured' : ''
                          }`}
                          controlId='firstName'
                        >
                          <Form.Label>First Name</Form.Label>
                          <Form.Control
                            placeholder='Enter First Name'
                            type='text'
                            {...register('firstName', { required: true })}
                          />
                          {errors.firstName?.message && (
                            <Form.Text className='error-msg'>
                              {errors.firstName?.message}
                            </Form.Text>
                          )}
                        </Form.Group>
                      </div>

                      <div className='col-lg-6'>
                        <Form.Group
                          className={`form-group ${
                            errors.lastName?.message ? 'error-occured' : ''
                          }`}
                          controlId='lastName'
                        >
                          <Form.Label>Last Name</Form.Label>
                          <Form.Control
                            placeholder='Enter Last Name'
                            type='text'
                            {...register('lastName', { required: true })}
                          />
                          {errors.lastName?.message && (
                            <Form.Text className='error-msg'>
                              {errors.lastName?.message}
                            </Form.Text>
                          )}
                        </Form.Group>
                      </div>

                      <div className='col-lg-6'>
                        <Form.Group
                          className={`form-group ${
                            errors.mobileNumber?.message ? 'error-occured' : ''
                          }`}
                          controlId='formBasicmobile'
                        >
                          <Form.Label>Mobile Number</Form.Label>
                          <div className='position-relative'>
                            <Form.Control
                              placeholder='Enter Mobile Number'
                              type='tel'
                              {...register('mobileNumber', { required: true })}
                            />
                          </div>
                          {errors.mobileNumber?.message && (
                            <Form.Text className='error-msg'>
                              {errors.mobileNumber?.message}
                            </Form.Text>
                          )}
                        </Form.Group>
                      </div>

                      <div className='col-lg-6'>
                        <Form.Group
                          className={`form-group verified ${
                            errors.email?.message ? 'error-occured' : ''
                          }`}
                          controlId='formBasicEmail'
                        >
                          <Form.Label>Email ID</Form.Label>
                          <div className='position-relative'>
                            <Form.Control
                              placeholder='Enter Email ID'
                              type='email'
                              {...register('email', { required: true })}
                            />
                          </div>
                          {errors.email?.message && (
                            <Form.Text className='error-msg'>
                              {errors.email?.message}
                            </Form.Text>
                          )}
                        </Form.Group>
                      </div>

                      <div className='col-lg-12'>
                        <Form.Group
                          className={`form-group common-select-style ${
                            errors.role?.message ? 'error-occured' : ''
                          }`}
                          controlId='role '
                        >
                          <Form.Label> Role</Form.Label>
                          <Controller
                            name='role'
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                className='react-dropdown'
                                classNamePrefix='dropdown'
                                placeholder={'Select Grade'}
                                getOptionLabel={(option) => option?.title}
                                getOptionValue={(option) => option?.id}
                                options={roleListArray}
                              />
                            )}
                          />
                          <p className='error-msg'>
                            {errors.role?.id.message ||
                              errors.role?.title.message}
                          </p>
                        </Form.Group>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </div>
    </>
  )
}

export default AddNewSubAdmin
