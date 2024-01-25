import React, { useEffect, useRef, useState } from 'react'
import TitleHeader from '../../../Components/TitleHeader'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { Form } from 'react-bootstrap'
import { useSnackbar } from 'react-notistack'
import { useDispatch, useSelector } from 'react-redux'
import { editProfileAdmin, viewProfileAdmin } from '../../../Actions/auth'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import crossWhite from '../../../assets/images/crosswhite.svg'
import defaultimage from '../../../assets/images/default.jpeg'
// import axios from 'axios'
import { useS3Upload } from '../../../Shared/Hooks/UseS3UPload'
function EditmyprofileAdmin () {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const [selectedImage, setSelectedFile] = useState()
  const profileData = useSelector((state) => state.auth.profileDataAdmin)
  const isProfileEditedAdmin = useSelector(
    (state) => state.auth.isProfileEditedAdmin
  )
  const resMessageFlag = useSelector((state) => state.auth.resMessage)
  const previousProps = useRef({ isProfileEditedAdmin }).current
  const { uploadFile, getImage } = useS3Upload()

  useEffect(() => {
    dispatch(viewProfileAdmin(token))
  }, [])

  const validationSchema = yup.object().shape({
    firstname: yup
      .string()
      .required('First Name is required')
      .min(2, 'First Name must be at least 2 characters')
      .max(20, 'First Name must be at most 20 characters')
      .matches(
        /^[a-zA-z]+([\s][a-zA-Z]+)*$/,
        'Special Characters & Numeric value are not allowed'
      ),
    lastname: yup
      .string()
      .required('Last Name is required')
      .min(2, 'Last Name must be at least 2 characters')
      .max(20, 'Last Name must be at most 20 characters')
      .matches(
        /^[a-zA-z]+([\s][a-zA-Z]+)*$/,
        'Special Characters & Numeric value are not allowed'
      ),
    mobileNumber: yup
      .string()
      .required('Mobile Number is required')
      .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, 'Enter valid Mobile Number'),
    email: yup
      .string()
      .required('Email is required')
      .matches(/.+@.+\.[A-Za-z]+$/, 'Enter valid E-Mail')
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(validationSchema)
  })
  const { onChange } = register()

  useEffect(() => {
    if (previousProps?.isProfileEditedAdmin !== isProfileEditedAdmin) {
      if (isProfileEditedAdmin === true) {
        dispatch(viewProfileAdmin(token))
        // localStorage.setItem('profile', profileData)
        enqueueSnackbar(`${resMessageFlag}`, {
          variant: 'success',
          autoHide: true,
          hide: 2000
        })
        navigate('/admin/settings/myprofile')
      } else if (isProfileEditedAdmin === false) {
        enqueueSnackbar(`${resMessageFlag}`, {
          variant: 'error',
          autoHide: true,
          hide: 2000
        })
      }
    }
    return () => {
      previousProps.isProfileEditedAdmin = isProfileEditedAdmin
    }
  }, [isProfileEditedAdmin])

  useEffect(() => {
    if (profileData) {
      async function getImageUrl () {
        if (profileData?.profile_pic) {
          const data = [{
            path: profileData?.profile_pic,
            flag: 'profile'
          }]
          const result = await getImage(data, token)
          setSelectedFile(result?.url?.profile)
        }
      }
      getImageUrl()
      // setSelectedFile(profileData?.profile_pic)
      reset({
        firstname: profileData?.first_name,
        lastname: profileData?.last_name,
        email: profileData?.email,
        mobileNumber: profileData?.mobile,
        username: profileData?.user_name
      })
    }
  }, [profileData])

  const removeImage = (e) => {
    e.preventDefault()
    setSelectedFile(null)
  }

  const onSubmit = async (data) => {
    const payload = {
      first_name: data?.firstname,
      last_name: data?.lastname,
      email: data?.email,
      mobile: data?.mobileNumber,
      profile: profileData?.profile_pic
    }
    if (typeof selectedImage === 'object') {
      const data = [{
        fileName: selectedImage.name.replace(/\.(\w+)$/, ''),
        sContentType: selectedImage.type,
        flag: 'profile',
        file: selectedImage
      }]
      const result = await uploadFile(data, 'profile')
      if (result?.profile?.sPath) {
        payload.profile = result?.profile?.sPath
      }
    }
    if (payload) {
      dispatch(editProfileAdmin(payload, token))
    }
  }

  return (
    <>
      <TitleHeader name="Edit" title="My Profile" />
      <div className="main-layout whitebox-layout my-editprofile-page">
        <Form className="light-bg" onSubmit={handleSubmit(onSubmit)}>
          <div className="heading-box">
            <div className="text-end">
              <button
                className="theme-btn dark-btn text-none"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button type="submit" className="theme-btn text-none ms-2">
                Save
              </button>
            </div>
          </div>
          <div className="light-bg-box">
            <div className="row">
              <div className="col-xxl-3 profile-update">
                <Form.Group
                  controlId="formFile"
                  className="form-group profile-picture common-input-file d-flex justify-content-center"
                >
                  <div className="close-dp">
                    <Form.Control
                      type="file"
                      className="hidden-file"
                      name="files"
                      accept="image/*"
                      {...register('files', { required: true })}
                      onChange={(e) => {
                        onChange(e)
                        setSelectedFile(e.target.files[0])
                      }}
                    />
                    <div className="form-control d-flex align-items-center flex-column justify-content-center text-center ">
                      <div className="img-box">
                        {/* {selectedImage
                            ? ( */}
                        <img
                          src={
                            selectedImage === null
                              ? defaultimage
                              : typeof selectedImage === 'string'
                                ? selectedImage
                                : typeof selectedImage === 'object'
                                  ? URL.createObjectURL(selectedImage)
                                  : null
                          }
                          alt=""
                        />
                      </div>
                    </div>
                    <button
                      onClick={(e) => removeImage(e)}
                      className="dp-remove"
                    >
                      <img src={crossWhite} alt="" />
                    </button>
                  </div>
                </Form.Group>
              </div>

              <div className="col-xxl-9 ">
                <div className="row">
                  <div className="col-lg-12">
                    <h4>Admin Details</h4>
                  </div>
                  <div className="col-lg-6">
                    <Form.Group
                      className={`form-group ${
                        errors.firstname?.message ? 'error-occured' : ''
                      }`}
                      controlId="firstname"
                    >
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        placeholder="Enter firstname"
                        type="text"
                        {...register('firstname', { required: true })}
                      />
                      {errors.firstname?.message && (
                        <Form.Text className="error-msg">
                          {errors.firstname?.message}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </div>
                  <div className="col-lg-6">
                    <Form.Group
                      className={`form-group ${
                        errors.lastname?.message ? 'error-occured' : ''
                      }`}
                      controlId="lastname"
                    >
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        placeholder="Enter lastname"
                        type="text"
                        {...register('lastname', { required: true })}
                      />
                      {errors.lastname?.message && (
                        <Form.Text className="error-msg">
                          {errors.lastname?.message}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </div>
                  <div className="col-lg-6">
                    <Form.Group
                      className={`form-group ${
                        errors.username?.message ? 'error-occured' : ''
                      }`}
                      controlId="username"
                    >
                      <Form.Label>User Name</Form.Label>
                      <Form.Control
                        placeholder="Enter username"
                        type="text"
                        {...register('username', { required: true })}
                      />
                      {errors.username?.message && (
                        <Form.Text className="error-msg">
                          {errors.username?.message}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </div>
                  <div className="col-lg-6">
                    <Form.Group
                      controlId="formBasicEmail"
                      className={`form-group ${
                        errors.mobileNumber?.message ? 'error-occured' : ''
                      }`}
                    >
                      <Form.Label>Mobile Number</Form.Label>
                      <Form.Control
                        placeholder="Enter Mobile Number"
                        type="text"
                        {...register('mobileNumber', { required: true })}
                      />
                      {errors.mobileNumber?.message && (
                        <Form.Text className="error-msg">
                          {errors.mobileNumber?.message}{' '}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </div>
                  <div className="col-lg-6">
                    <Form.Group
                      className={`form-group verified ${
                        errors.email?.message ? 'error-occured' : ''
                      }`}
                      controlId="formBasicEmail"
                    >
                      <Form.Label>Email ID</Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          placeholder="Enter Email ID"
                          type="email"
                          {...register('email', { required: true })}
                        />
                      </div>
                      {errors.email?.message && (
                        <Form.Text className="error-msg">
                          {errors.email?.message}
                        </Form.Text>
                      )}
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

export default EditmyprofileAdmin
