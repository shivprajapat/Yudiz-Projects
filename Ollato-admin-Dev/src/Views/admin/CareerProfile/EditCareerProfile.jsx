import React, { useEffect, useRef, useState } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteCareerProfileDetail,
  editSpecificCareerProfile,
  getSpecificCareerProfileData
} from '../../../Actions/Admin/careerProfile'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useSnackbar } from 'react-notistack'
import { validationSchemaCarProf } from '../../../Shared/Utills/validationschema'
// import PdfIcon from '../../../assets/images/rotate-icon.svg'

function EditCareerProfile () {
  // Constant
  const navigate = useNavigate()
  const { id } = useParams()
  const dispatch = useDispatch()
  const token = localStorage.getItem('token')
  const { enqueueSnackbar } = useSnackbar()

  // useEffect
  useEffect(() => {
    dispatch(getSpecificCareerProfileData(Number(id), token))
  }, [])

  // useSelector
  const mainData = useSelector((state) => state.careerProfile.resData)
  const isEditedData = useSelector((state) => state.careerProfile.isCareerProfileEdited)
  const editedResMessage = useSelector((state) => state.careerProfile.resMessage)

  // previousProps
  const previousProps = useRef({ isEditedData, editedResMessage }).current

  // useState
  const [subProfile, setSubProfile] = useState(
    mainData[0]?.career_detail || [
      {
        id: '',
        profile_type_det: ''
      }
    ]
  )
  const [fieName, setFileName] = useState('')

  // Increase
  const addSubProfile = (e, i) => {
    e.preventDefault()
    setSubProfile([
      ...subProfile,
      {
        id: '',
        profile_type_det: ''
      }
    ])
  }

  // Decrease
  const removeOption = (e, count, idForDelete) => {
    e.preventDefault()
    setSubProfile(subProfile.filter((value, index) => count !== index))
    dispatch(deleteCareerProfileDetail({ id: [idForDelete] }, token))
  }
  // File Change
  const handleSubProfileValueChange = (e, count, id) => {
    // eslint-disable-next-line array-callback-return
    const selectedSubProfile = subProfile?.map((value, index) => {
      if (index === count) {
        return { ...value, profile_type_det: e.target.value }
      }
      return value
    })
    setSubProfile(selectedSubProfile)
  }

  // useForm
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(validationSchemaCarProf)
  })
  const { onChange } = register()

  // reSet Form
  useEffect(() => {
    reset({
      profileType: mainData[0]?.profile_type,
      files: mainData[0]?.path
    })
    if (mainData) {
      setSubProfile(mainData[0]?.career_detail)
    }
  }, [mainData])

  // onSubmit
  const onSubmit = (data) => {
    const formData = new FormData()
    formData.append('id', id)
    formData.append('profile_type', data?.profileType)
    formData.append('careerProfileArray', JSON.stringify(subProfile))
    if (fieName) {
      formData.append('career_profile_file', fieName)
    } else {
      formData.append('career_profile_file', mainData[0]?.path)
    }
    // formData.append('career_profile_file', fieName[0] || mainData[0]?.path)
    formData.append('is_file', true)
    if (formData) {
      dispatch(editSpecificCareerProfile(formData, token))
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
        navigate(-1)
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
          <Header />
          <TitleHeader name='Edit Career Profile' title='Career Profile' />
          <div className='main-layout'>
            <div className='heading-box'>
              <h5>Edit Career Profile</h5>
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
            {mainData[0]?.id
              ? <div className='form-middle-layout'>
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
                      className='form-group resume-file-input d-flex flex-wrap flex-column '
                    >
                      <Form.Label>File</Form.Label>

                      <a
                        href={`${process.env.REACT_APP_AXIOS_BASE_URL}${mainData[0]?.path}`}
                        style={fieName ? { pointerEvents: 'none' } : null}
                        target='_blank'
                        rel='noreferrer'
                        disa
                      >
                        {fieName
                          ? fieName?.name
                          : 'Resume'}
                      </a>
                    </Form.Group>
                    <div className='fixed-size '>
                      <Form.Control
                       type='file'
                       title='Upload Resume'
                       className='hidden-file'
                       name='files'
                       accept='application/pdf,application/msword'
                       {...register('files', { required: true })}
                       onChange={(e) => {
                         onChange(e)
                         setFileName(e.target.files[0])
                       }}
                      />
                      <button className='browse-btn theme-btn btn'>
                        Browse
                      </button>
                    </div>
                    </div>
                    <div className='col-md-12'>
                      <h4 className='black-font mb-4'>Profile Details</h4>
                      {subProfile?.map((data, count) => {
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
                                      value={data?.profile_type_det}
                                      onChange={(e) =>
                                        handleSubProfileValueChange(
                                          e,
                                          count,
                                          data?.id
                                        )
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
                                    onClick={(e) =>
                                      removeOption(e, count, data?.id)
                                    }
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
              : (
              <Spinner animation='border' />
                )}
          </div>
    </>
  )
}

export default EditCareerProfile
