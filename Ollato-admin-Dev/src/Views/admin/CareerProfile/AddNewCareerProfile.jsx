import React, { useEffect, useRef, useState } from 'react'
import { Form } from 'react-bootstrap'
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import { addCareerProfileAction } from '../../../Actions/Admin/careerProfile'
import { useSnackbar } from 'react-notistack'
import { validationSchemaCarProf } from '../../../Shared/Utills/validationschema'

function AddNewCareerProfile () {
  // Constant
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const token = localStorage.getItem('token')
  const { enqueueSnackbar } = useSnackbar()

  // useState
  const [selectedImage, setSelectedImage] = useState()
  const [subProfile, setSubProfile] = useState([''])

  // useSelector
  const isCareerProfileAdded = useSelector(state => state.careerProfile.isCareerProfileAdded)
  const isCareerProfileAddedMessage = useSelector(state => state.careerProfile.resMessage)

  const previousProps = useRef({ isCareerProfileAdded, isCareerProfileAddedMessage }).current

  // Increase
  const addSubProfile = (e, i) => {
    e.preventDefault()
    setSubProfile([...subProfile, ''])
  }

  // Decrease
  const removeOption = (e, count) => {
    e.preventDefault()
    if (count === 0) return
    setSubProfile(subProfile.filter((value, index) => count !== index))
    dispatch()
  }

  // File Change
  const handleSubProfileValueChange = (e, count) => {
    const selectedSubProfile = subProfile?.map((value, index) => {
      return count === index ? e?.target?.value : value
    })
    setSubProfile(selectedSubProfile)
  }

  // useForm
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchemaCarProf)
  })
  const { onChange } = register()

  // onSubmit
  const onSubmit = (data) => {
    const formData = new FormData()
    formData.append('profile_type', data?.profileType)
    formData.append('career_profile_file', data?.files[0])
    formData.append('profile_type_det', JSON.stringify(subProfile))
    formData.append('is_file', true)
    dispatch(addCareerProfileAction(formData, token))
  }

  // Notification for Add
  useEffect(() => {
    if (previousProps?.isCareerProfileAdded !== isCareerProfileAdded) {
      if (isCareerProfileAdded) {
        enqueueSnackbar(`${isCareerProfileAddedMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/career-profile')
      } else if (isCareerProfileAdded === false) {
        enqueueSnackbar(`${isCareerProfileAddedMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isCareerProfileAdded = isCareerProfileAdded
    }
  }, [isCareerProfileAdded])

  return (
    <>
          <Header />
          <TitleHeader name='Add New Career Profile' title='Career Profile' />
          <div className='main-layout'>
            <div className='heading-box'>
              <h5>Add New Career Profile</h5>
              <div className='btn-box'>
                <button
                  className='theme-btn dark-btn text-none'
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
                <button
                  className='theme-btn text-none'
                  onClick={handleSubmit(onSubmit)}
                >
                  Save
                </button>
              </div>
            </div>
            <div className='form-middle-layout'>
              <Form className='light-bg'>
                <div className='row'>
                  <div className='col-md-6'>
                    <Form.Group
                      className='form-group'
                      controlId='formprofiletype'
                    >
                      <Form.Label>Profile Type</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder='Enter Profile Type'
                        {...register('profileType', {
                          required: 'true'
                        })}
                      />
                      {errors.profileType?.message && (
                        <Form.Text className='error-msg'>
                          {errors.profileType?.message}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </div>
                  <div className='col-md-6'>
                    <Form.Group
                      controlId='formFile'
                      className='form-group resume-file-input'
                    >
                      <Form.Label>File</Form.Label>
                      <Form.Control
                        type='file'
                        title='Upload Resume'
                        className='hidden-file'
                        name='files'
                        accept='application/pdf,application/msword'
                        {...register('files', { required: true })}
                        onChange={(e) => {
                          onChange(e)
                          setSelectedImage(e.target.files[0])
                        }}
                      />
                      <div className='form-control d-flex justify-content-between align-items-center'>
                        {selectedImage === undefined
                          ? (
                          <>
                            <p className='m-0'>Upload File</p>
                            <button className='browse-btn'>Browse</button>
                          </>
                            )
                          : (
                              selectedImage?.name
                            )}
                      </div>
                      <p className='error-msg'>{errors.files?.message}</p>
                    </Form.Group>
                  </div>
                  <div className='col-md-12'>
                    <h4 className='black-font mb-4'>Profile Details</h4>
                    {subProfile?.map((i, count) => {
                      return (
                        <>
                          <div className='addmoreaddbox d-flex align-items-start'>
                            <div className='option-item'>
                              <div className='optionitembox'>
                                <Form.Group
                                  className='form-group'
                                  controlId='formsubprofile'
                                >
                                  <Form.Label>Sub Profile</Form.Label>
                                  <Form.Control
                                    type='text'
                                    placeholder='Enter Sub Profile'
                                    value={subProfile[count]}
                                    onChange={(e) =>
                                      handleSubProfileValueChange(e, count)
                                    }
                                  />
                                </Form.Group>
                              </div>
                            </div>
                            <div className='add-remove-btn'>
                              <div>
                                <button
                                  className='theme-btn small-btn'
                                  onClick={(e) =>
                                    addSubProfile(e, subProfile?.length + 1)
                                  }
                                >
                                  +
                                </button>
                              </div>
                              <div>
                                <button
                                  className='theme-btn dark-btn'
                                  onClick={(e) => removeOption(e, count)}
                                >
                                  -
                                </button>
                              </div>
                            </div>
                          </div>
                        </>
                      )
                    })}
                  </div>
                </div>
              </Form>
            </div>
          </div>
    </>
  )
}

export default AddNewCareerProfile
