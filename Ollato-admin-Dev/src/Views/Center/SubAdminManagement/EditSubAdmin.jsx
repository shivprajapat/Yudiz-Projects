import React, { useEffect, useRef } from 'react'
import TitleHeader from '../../../Components/TitleHeader'
import { useNavigate, useParams } from 'react-router-dom'
import { Form, Spinner } from 'react-bootstrap'
import Select from 'react-select'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import { editSpecificSubAdmin, getAllRoleSelect, getSpecificSubAdmin } from '../../../Actions/Admin/subAdmin'
import { useForm, Controller } from 'react-hook-form'
import { useSnackbar } from 'react-notistack'
import { validationSchemaSubAdmin } from '../../../Shared/Utills/validationschema'

function EditSubAdmin () {
  // Constant
  const { id } = useParams()
  const token = localStorage.getItem('token')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  // useEffect to ger data by id
  useEffect(() => {
    dispatch(getSpecificSubAdmin(id, token))
    dispatch(getAllRoleSelect(token))
  }, [])

  // useSelector
  const mainData = useSelector(state => state.subAdmin.resData)
  const roleListArray = useSelector(state => state.subAdmin.roleData)
  const isEditedData = useSelector(state => state.subAdmin.isSubAdminEdited)
  const editedResMessage = useSelector(state => state.subAdmin.resMessage)

  // previousProps
  const previousProps = useRef({
    roleListArray,
    isEditedData,
    editedResMessage
  }).current

  // useForm
  const {
    control,
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(validationSchemaSubAdmin)
  })

  // useEffect to reSet Data
  useEffect(() => {
    if (mainData && roleListArray?.length) {
      const roleV = roleListArray?.filter(r => r.id === mainData?.role_id)[0]
      reset({
        firstName: mainData?.first_name,
        lastName: mainData?.last_name,
        mobileNumber: mainData?.mobile,
        email: mainData?.email,
        role: roleV
      })
    }
  }, [mainData, roleListArray])

  const onSubmit = data => {
    const subAdminData = {
      id,
      first_name: data?.firstName,
      last_name: data?.lastName,
      email: data?.email,
      mobile: data?.mobileNumber,
      admin_type: 'sub',
      role_id: data?.role?.id
    }
    if (subAdminData) {
      dispatch(editSpecificSubAdmin(subAdminData, token))
    }
  }

  // Notification for Add
  useEffect(() => {
    if (previousProps?.isEditedData !== isEditedData) {
      if (isEditedData) {
        enqueueSnackbar(`${editedResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/sub-admin-management')
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
          <TitleHeader name="Edit" title="Edit Sub Admin" />
          {mainData?.id
            ? (
            <div className="main-layout whitebox-layout my-editprofile-page">
              <Form className="light-bg" onSubmit={handleSubmit(onSubmit)}>
                <div className="heading-box">
                  <h5>Add Sub-Admin</h5>
                  <div className="btn-box">
                    <button className="theme-btn dark-btn text-none" onClick={() => navigate('/admin/sub-admin-management')}>
                      Cancel
                    </button>
                    <button type="submit" className="theme-btn text-none">
                      Save
                    </button>
                  </div>
                </div>
                <div className="light-bg-box">
                  <div className="row">
                    <div className="col-xxl-12 ">
                      <div className="row">
                        <div className="col-lg-12">
                          <h4>Admin Details</h4>
                        </div>
                        <div className="col-lg-6">
                          <Form.Group className={`form-group ${errors.firstName?.message ? 'error-occured' : ''}`} controlId="firstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control placeholder="Enter First Name" type="text" {...register('firstName', { required: true })} />
                            {errors.firstName?.message && <Form.Text className="error-msg">{errors.firstName?.message}</Form.Text>}
                          </Form.Group>
                        </div>
                        <div className="col-lg-6">
                          <Form.Group className={`form-group ${errors.lastName?.message ? 'error-occured' : ''}`} controlId="lastName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control placeholder="Enter Last Name" type="text" {...register('lastName', { required: true })} />
                            {errors.lastName?.message && <Form.Text className="error-msg">{errors.lastName?.message}</Form.Text>}
                          </Form.Group>
                        </div>
                        <div className="col-lg-6">
                          <Form.Group className={`form-group ${errors.mobileNumber?.message ? 'error-occured' : ''}`} controlId="formBasicmobile">
                            <Form.Label>Mobile Number</Form.Label>
                            <div className="position-relative">
                              <Form.Control
                                placeholder="Enter Mobile Number"
                                type="tel"
                                {...register('mobileNumber', {
                                  required: true
                                })}
                              />
                            </div>
                            {errors.mobileNumber?.message && <Form.Text className="error-msg">{errors.mobileNumber?.message}</Form.Text>}
                          </Form.Group>
                        </div>
                        <div className="col-lg-6">
                          <Form.Group className={`form-group verified ${errors.email?.message ? 'error-occured' : ''}`} controlId="formBasicEmail">
                            <Form.Label>Email ID</Form.Label>
                            <div className="position-relative">
                              <Form.Control placeholder="Enter Email ID" type="email" {...register('email', { required: true })} />
                            </div>
                            {errors.email?.message && <Form.Text className="error-msg">{errors.email?.message}</Form.Text>}
                          </Form.Group>
                        </div>
                        <div className="col-lg-12">
                          <Form.Group className="form-group common-select-style" controlId="role">
                            <Form.Label> Role</Form.Label>
                            <Controller
                              name="role"
                              control={control}
                              render={({ field: { onChange, value = {} } }) => (
                                <Select
                                  className="react-dropdown"
                                  classNamePrefix="dropdown"
                                  placeholder={'Select Role'}
                                  getOptionLabel={option => option?.title}
                                  getOptionValue={option => option?.id}
                                  options={roleListArray}
                                  value={value || getValues()?.roleListArray}
                                  onChange={e => {
                                    onChange(e)
                                  }}
                                />
                              )}
                            />
                            <p className="error-msg">{errors.role?.id.message || errors.role?.title.message}</p>
                          </Form.Group>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
              )
            : (
            <Spinner animation="border" />
              )}
    </>
  )
}

export default EditSubAdmin
