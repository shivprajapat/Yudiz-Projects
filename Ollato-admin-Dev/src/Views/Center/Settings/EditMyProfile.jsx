import React, { useEffect, useRef, useState } from 'react'
/* Components */
// import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
import { useNavigate } from 'react-router-dom'
import { Form } from 'react-bootstrap'
import * as yup from 'yup'
// import profilePlaceholder from '../../../assets/images/profile-placeholder.svg'
import { useDispatch, useSelector } from 'react-redux'
import {
  editProfileCenter,
  viewCenterProfile
} from '../../../Actions/Center/dashboard'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSnackbar } from 'react-notistack'
import crossWhite from '../../../assets/images/crosswhite.svg'
import defaultimage from '../../../assets/images/default.jpeg'
import { useS3Upload } from '../../../Shared/Hooks/UseS3UPload'

function Editmyprofile () {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const [selectedImage, setSelectedFile] = useState()
  const profileData = useSelector((state) => state.center.profileData)
  const isProfileEditedCenter = useSelector(
    (state) => state.center.isProfileEdited
  )
  const resMessageFlag = useSelector((state) => state.center.resMessage)
  const previousProps = useRef({ isProfileEditedCenter }).current
  const { uploadFile, getImage } = useS3Upload()

  useEffect(() => {
    dispatch(viewCenterProfile(token))
  }, [])

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .required('Name is required')
      .matches(
        /^[a-zA-Z ]*$/,
        'Special Characters & Numeric value are not allowed'
      ),
    username: yup.string().required('Username is required'),
    email: yup
      .string()
      .required('Email is required')
      .matches(/.+@.+\.[A-Za-z]+$/, 'Enter valid E-Mail'),
    mobileNumber: yup
      .string()
      .required('Mobile Number is required')
      .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, 'Enter valid Mobile Number')
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
    if (profileData) {
      async function getImageUrl () {
        const data = [{
          path: profileData?.profile,
          flag: 'profile'
        }]
        const result = await getImage(data, token)
        setSelectedFile(result?.url?.profile)
      }
      getImageUrl()
      reset({
        name: profileData?.title,
        email: profileData?.email,
        mobileNumber: profileData?.mobile,
        username: profileData?.user_name
        // files: `${process.env.REACT_APP_AXIOS_BASE_URL}${profileData?.profile}`
      })
    }
  }, [profileData])
  useEffect(() => {
    if (previousProps?.isProfileEditedCenter !== isProfileEditedCenter) {
      if (isProfileEditedCenter === true) {
        enqueueSnackbar(`${resMessageFlag}`, {
          variant: 'success',
          autoHide: true,
          hide: 3000
        })
        navigate('/center/settings/myprofile')
      } else if (isProfileEditedCenter === false) {
        enqueueSnackbar(`${resMessageFlag}`, {
          variant: 'error',
          autoHide: true,
          hide: 3000
        })
      }
    }
    return () => {
      previousProps.isProfileEditedCenter = isProfileEditedCenter
    }
  }, [isProfileEditedCenter])

  const removeImage = (e) => {
    e.preventDefault()
    setSelectedFile(null)
  }

  const onSubmit = async (data) => {
    const payload = {
      title: data?.name,
      userName: data?.username,
      email: data?.email,
      mobile: data?.mobileNumber,
      profile: profileData?.profile
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
      } else {
        return null
      }
    }
    if (payload) {
      dispatch(editProfileCenter(payload, token))
    }
  }

  return (
    <>
      {/* <Header /> */}
      <TitleHeader name="Edit" title="My Profile" />
      <div className="main-layout whitebox-layout my-editprofile-page">
        <Form className="light-bg" onSubmit={handleSubmit(onSubmit)}>
          <div className="heading-box">
            <div className="text-end">
              <button
                className="theme-btn dark-btn text-none"
                onClick={(e) => {
                  e.preventDefault()
                  navigate(-1)
                }}
              >
                Cancel
              </button>
              <button type="submit" className="theme-btn text-none ms-2">
                Save
              </button>
            </div>
          </div>
          <div className="light-bg-box">
            <div className="row align-items-center">
              <div className="col-lg-4 col-xl-3 profile-update">
                <Form.Group
                  controlId="formFile"
                  className="form-group profile-picture common-input-file d-flex justify-content-center"
                >
                  <div className="close-dp">
                    <Form.Control
                      type="file"
                      className="hidden-file"
                      name="files"
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
                          alt="profile-pic"
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
              <div className="col-lg-8 col-xl-9">
                <div className="row">
                  <div className="col-md-12">
                    <h4>Center Details</h4>
                  </div>
                  <div className="col-lg-12 col-xl-12">
                    <div className="row">
                      <div className="col-md-12">
                        <Form.Group
                          className={`form-group ${
                            errors.name?.message ? 'error-occured' : ''
                          }`}
                          controlId="name"
                        >
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            placeholder="Enter name"
                            type="text"
                            {...register('name', { required: true })}
                          />
                          {errors.name?.message && (
                            <Form.Text className="error-msg">
                              {errors.name?.message}
                            </Form.Text>
                          )}
                        </Form.Group>
                      </div>
                      <div className="col-md-12">
                        <Form.Group
                          className={`form-group ${
                            errors.username?.message ? 'error-occured' : ''
                          }`}
                          controlId="title"
                        >
                          <Form.Label>User name</Form.Label>
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
                      <div className="col-md-12">
                        <Form.Group
                          className={`form-group ${
                            errors.email?.message ? 'error-occured' : ''
                          }`}
                          controlId="email"
                        >
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            placeholder="Enter email"
                            type="text"
                            {...register('email', { required: true })}
                          />
                          {errors.email?.message && (
                            <Form.Text className="error-msg">
                              {errors.email?.message}
                            </Form.Text>
                          )}
                        </Form.Group>
                      </div>
                      <div>
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
                    </div>
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

export default Editmyprofile
