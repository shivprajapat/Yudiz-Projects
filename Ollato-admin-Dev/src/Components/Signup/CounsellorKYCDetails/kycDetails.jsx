import React, { useRef, useEffect, useState, useContext } from 'react'
import { Button, Form } from 'react-bootstrap'
/* import profilePlaceholder from '../../../assets/images/profile-placeholder.svg' */
import otherdocPlaceholder from '../../../assets/images/other-img-placeholder.svg'
// import profilePicture from '../../../assets/images/profile-picture.png'
import defaultPicture from '../../../assets/images/default.png'
// import pancardImg from '../../../assets/images/pancard-img.png'
import crossWhite from '../../../assets/images/crosswhite.svg'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerC } from '../../../Actions/auth'
import { useSnackbar } from 'react-notistack'
import { AppContext } from '../../../context'
import moment from 'moment'

const panCard = /([A-Z]){5}([0-9]){4}([A-Z]){1}$/
const aadharCard = /^\d{4}\s\d{4}\s\d{4}$/
// const gstNo = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png']
// Validation-Scheme for fields
const validationSchema = yup.object().shape({
  files: yup
    .mixed()
    .required('File is required')
    .test('required', 'File is required', val => { return val && val.length })
    .test('format',
      'Only Image allowed', (value) => value && SUPPORTED_FORMATS.includes(value[0]?.type)),
  panNo: yup
    .string()
    .required('PanCard number is required')
    .matches(panCard, 'Please enter valid pancard number. for ex. ABCTY1234D'),
  panCardFiles: yup
    .mixed()
    .required('File is required')
    .test('required', 'File is required', val => { return val && val.length })
    .test('format',
      'Only Image allowed', (value) => value && SUPPORTED_FORMATS.includes(value[0]?.type)),
  aadharNo: yup
    .string()
    .required('AadharCard number is required')
    .matches(aadharCard, 'Please enter valid aadhar number. for ex. 1111 1111 1111'),
  frontSideFiles: yup
    .mixed()
    .required('File is required')
    .test('required', 'File is required', val => { return val && val.length })
    .test('format',
      'Only Image allowed', (value) => value && SUPPORTED_FORMATS.includes(value[0]?.type)),
  backSideFiles: yup
    .mixed()
    .required('File is required')
    .test('required', 'File is required', val => { return val && val.length })
    .test('format',
      'Only Image allowed', (value) => value && SUPPORTED_FORMATS.includes(value[0]?.type)),
  gstNo: yup
    .string()
    .nullable(true)
    .matches(
      /^[a-zA-z0-9]*$/,
      'Special Characters are not allowed'
    ),
  signature: yup
    .mixed()
    .required('File is required')
    .test('required', 'File is required', val => { return val && val.length })
    .test('format',
      'Only Image allowed', (value) => value && SUPPORTED_FORMATS.includes(value[0]?.type)),
  terms: yup
    .boolean()
    .oneOf([true], 'You must accept the policy terms and conditions'),
  counsellortype: yup.array().test({
    name: 'categories_test',
    exclusive: true,
    message: 'At least select one counsellor type',
    test: (value) => value.length > 0
  })

})
function CounsellorKYCDetails () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [selectedImage, setSelectedFile] = useState()
  const [selectedPanCard, setPanCardImage] = useState()
  const [selectedAadharCard, setAadharCard] = useState()
  const [selectedBackSideImage, setBackSideImage] = useState()
  const [signature, setSignatureImage] = useState()
  const { userDetails } = useContext(AppContext)
  const [user] = userDetails
  const { enqueueSnackbar } = useSnackbar()
  const { educationdetails } = useContext(AppContext)
  const [educationdetail] = educationdetails
  const registeredFlag = useSelector((state) => state.auth.isRegistered)
  const registredResMessage = useSelector((state) => state.auth.resMessage)
  const previousProps = useRef({ registeredFlag, registredResMessage }).current

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
    // mode: 'onChange'
  })

  useEffect(() => {
    if (user.length === 0) {
      navigate('/counsellor/signup')
    }
  }, [])

  useEffect(() => {}, [selectedPanCard])
  const handleImageClose = (e, type) => {
    e.preventDefault()
    switch (type) {
      case 'panCardFile':
        return setPanCardImage()
      case 'frontSideFiles':
        return setAadharCard()
      case 'backSideFiles':
        return setBackSideImage()
      case 'signature':
        return setSignatureImage()
      // eslint-disable-next-line no-fallthrough
      default:
        return null
    }
  }
  useEffect(() => {
    if (previousProps?.registeredFlag !== registeredFlag) {
      if (registeredFlag) {
        enqueueSnackbar(`${registredResMessage}`, {
          variant: 'success',
          hide: 3000,
          autoHide: true
        })
        navigate('/')
      } else if (registeredFlag === false) {
        enqueueSnackbar(`${registredResMessage}`, {
          variant: 'error',
          hide: 3000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.registeredFlag = registeredFlag
    }
  }, [registeredFlag])
  const { onChange, name } = register('panNo')
  // Form onSubmit Method
  const onSubmit = (data) => {
    const formData = new FormData()
    formData.append('first_name', user?.firstName)
    formData.append('middle_name', user?.middleName)
    formData.append('last_name', user?.lastName)
    formData.append('email', user?.email)
    formData.append('mobile', user.mobileNumber)
    formData.append('dob', moment(user.dob).format('YYYY-MM-DD'))
    formData.append('gender', user.gender)
    formData.append('father_name', user.fName)
    formData.append('mother_name', user.mName)
    formData.append('password', user.password)
    formData.append('country_id', educationdetail?.country_id?.id)
    formData.append('state_id', educationdetail?.state_id?.id)
    formData.append('city_id', educationdetail?.city_id?.id)
    formData.append('pin_code', educationdetail.pin_code.toString())
    formData.append('professional_expertness', user?.professional_expertness)
    formData.append(
      'high_qualification_id',
      educationdetail?.high_qualification_id?.id
    )
    formData.append(
      'high_university_id',
      educationdetail?.high_university_id?.id
    )
    formData.append(
      'last_qualification_id',
      educationdetail?.last_qualification_id?.id
    )
    formData.append(
      'last_university_id',
      educationdetail?.last_university_id?.id
    )
    formData.append(
      'certificate_qualification_id',
      educationdetail?.certificate_qualification_id?.id
    )
    formData.append(
      'certificate_university_id',
      educationdetail?.certificate_university_id?.id
    )
    formData.append('total_experience', educationdetail?.total_experience)
    formData.append('resume', user?.file[0])
    formData.append('adharcard_front', data.frontSideFiles[0])
    formData.append('adharcard_back', data.backSideFiles[0])
    formData.append('pancard', data.panCardFiles[0])
    formData.append('profile_picture', data.files[0])
    formData.append('signature', data.signature[0])
    formData.append('gst_no', data.gstNo !== null ? data.gstNo : '')
    formData.append('adhar_card_number', data.aadharNo)
    formData.append('pan_number', data.panNo)
    formData.append(
      'career_counsellor',
      data?.counsellortype?.includes('career_counsellor') ? 1 : 0
    )
    formData.append(
      'psychologist',
      data?.counsellortype?.includes('pycho') ? 1 : 0
    )
    formData.append(
      'overseas_counsellor',
      data.counsellortype.includes('overseas') ? 1 : 0
    )
    formData.append(
      'subject_expert',
      data.counsellortype.includes('studentExpert') ? 1 : 0
    )
    dispatch(registerC(formData))
  }
  return (
    <>
      <Form>
        <Form.Group
          controlId='formFile'
          className='form-group profile-picture common-input-file uploaded-profile'
        >
          <Form.Control
            type='file'
            title='Upload Resume'
            className='hidden-file'
            name='files'
            accept="image/*"
            {...register('files', { required: true })}
            onChange={(e) => {
              onChange(e)
              setSelectedFile(e.target.files[0])
            }}
          />
          <div className='form-control d-flex align-items-center flex-column justify-content-center text-center '>
            <div className='img-box'>
              {selectedImage
                ? (
                <img src={URL.createObjectURL(selectedImage)} alt='' />
                  )
                : (
                <img src={defaultPicture} alt='' />
                  )}
            </div>
            <p className='m-0 blue-placeholder'>Upload Profile Photo</p>
          </div>
        </Form.Group>
        <p className='error-msg'>
          {errors.files?.message || errors.files?.label.message}
        </p>
        <Form.Group
          className={`form-group ${
            errors.panNo?.message ? 'error-occured' : ''
          }`}
          controlId='formpancardnumber'
        >
          <Form.Label>Pan Card Number</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Pan Card Number'
            name={name}
            onChange={(e) => {
              onChange(e)
            }}
            {...register('panNo', { required: true })}
          />
          <p className='error-msg'>
            {errors.panNo?.message || errors.panNo?.label.message}
          </p>
        </Form.Group>
        <Form.Group
          controlId='formgstnumber'
          className='form-group document-file-input common-input-file  uploaded-doc'
        >
          <Form.Label>Upload Pan Card</Form.Label>
          <Form.Control
            type='file'
            className='hidden-file'
            name='panCardFiles'
            accept="image/*"
            {...register('panCardFiles', { required: true })}
            onChange={(e) => {
              onChange(e)
              setPanCardImage(e.target.files[0])
            }}
          />
          <div className='form-control d-flex align-items-center flex-column justify-content-center text-center'>
            <div className='img-box'>
              {selectedPanCard
                ? (
                <>
                  <img src={URL.createObjectURL(selectedPanCard)} alt='' />
                  <button
                    className='close-cross-btn'
                    onClick={(e) => handleImageClose(e, 'panCardFile')}
                  >
                    <img src={crossWhite} alt='' />
                  </button>
                </>
                  )
                : (
                <img src={otherdocPlaceholder} alt='' />
                  )}
              <p className='m-0 blue-placeholder'>Upload JPG, PNG or PDF</p>
            </div>
          </div>
        </Form.Group>
        <p className='error-msg'>
          {errors.panCardFiles?.message || errors.panCardFiles?.label.message}
        </p>
        <Form.Group
          className={`form-group ${
            errors.aadharNo?.message ? 'error-occured' : ''
          }`}
          controlId='formaadharcardnumber'
        >
          <Form.Label>Aadhar Card Number</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Aadhar Card Number'
            name={name}
            onChange={(e) => {
              onChange(e)
            }}
            {...register('aadharNo', { required: true })}
          />
          <p className='error-msg'>
            {errors.aadharNo?.message || errors.aadharNo?.label.message}
          </p>
        </Form.Group>
        <Form.Group
          controlId='formFile'
          className='form-group mb-3 document-file-input common-input-file uploaded-doc'
        >
          <Form.Label>Upload Aadhar Card Front  Image</Form.Label>
          <Form.Control
            type='file'
            className='hidden-file'
            name='frontSideFiles'
            accept="image/*"
            {...register('frontSideFiles', { required: true })}
            onChange={(e) => {
              onChange(e)
              setAadharCard(e.target.files[0])
            }}
          />
          <div className='form-control d-flex align-items-center flex-column justify-content-center text-center'>
            <div className='img-box'>
              {selectedAadharCard
                ? (
                <>
                  {' '}
                  <img src={URL.createObjectURL(selectedAadharCard)} alt='' />
                  <button
                    className='close-cross-btn'
                    onClick={(e) => handleImageClose(e, 'frontSideFiles')}
                  >
                    <img src={crossWhite} alt='' />
                  </button>
                </>
                  )
                : (
                <img src={otherdocPlaceholder} alt='' />
                  )}
              <p className='m-2 blue-placeholder'>Upload JPG, PNG or PDF</p>
              <p className='m-0 color-black'>Front Side</p>
              {/* <img src={otherdocPlaceholder} alt="" /> */}
            </div>
          </div>
        </Form.Group>
        <p className='error-msg'>
          {errors.frontSideFiles?.message ||
            errors.frontSideFiles?.label.message}
        </p>
        <Form.Group
          controlId='formFile'
          className='form-group document-file-input common-input-file uploaded-doc'
        >
             <Form.Label>Upload Aadhar Card  Back Image</Form.Label>
          <Form.Control
            type='file'
            className='hidden-file'
            name='backSideFiles'
            accept="image/*"
            {...register('backSideFiles', { required: true })}
            onChange={(e) => {
              onChange(e)
              setBackSideImage(e.target.files[0])
            }}
          />
          <div className='form-control d-flex align-items-center flex-column justify-content-center text-center'>
            <div className='img-box'>
              {selectedBackSideImage
                ? (
                <>
                  <img
                    src={URL.createObjectURL(selectedBackSideImage)}
                    alt=''
                  />
                  <button
                    className='close-cross-btn'
                    onClick={(e) => handleImageClose(e, 'backSideFiles')}
                  >
                    <img src={crossWhite} alt='' />
                  </button>
                </>
                  )
                : (
                <>
                  <img src={otherdocPlaceholder} alt='' />
                  <p className='m-2 blue-placeholder'>Upload JPG, PNG or PDF</p>
                  <p className='m-0 color-black'>Back Side</p>
                </>
                  )}
              {/* <img src={otherdocPlaceholder} alt="" /> */}
              {/* <img src={otherdocPlaceholder} alt="" /> */}
              {/* <button className="close-cross-btn"><img src={crossWhite} alt="" /></button> */}
            </div>
          </div>
        </Form.Group>
        <p className='error-msg'>
          {errors.backSideFiles?.message || errors.backSideFiles?.label.message}
        </p>
        <Form.Group
          className={`form-group ${
            errors.gstNo?.message ? 'error-occured' : ''
          }`}
          controlId='formgstnumber'
        >
          <Form.Label>GST No</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter GST No'
            name={name}
            onChange={(e) => {
              onChange(e)
            }}
            {...register('gstNo', { required: true })}
          />
          <p className='error-msg'>
            {errors.gstNo?.message || errors.gstNo?.label.message}
          </p>
        </Form.Group>
        <Form.Group
          controlId='formgstnumber'
          className='form-group document-file-input common-input-file uploaded-doc'
        >
          <Form.Label>Upload Signature</Form.Label>
          <Form.Control
            type='file'
            className='hidden-file'
            name='signature'
            accept="image/*"
            {...register('signature', { required: true })}
            onChange={(e) => {
              onChange(e)
              setSignatureImage(e.target.files[0])
            }}
          />
          <div className='form-control d-flex align-items-center flex-column justify-content-center text-center'>
            <div className='img-box'>
              {signature
                ? (
                <>
                  <img src={URL.createObjectURL(signature)} alt='' />
                  <button
                    className='close-cross-btn'
                    onClick={(e) => handleImageClose(e, 'signature')}
                  >
                    <img src={crossWhite} alt='' />
                  </button>
                </>
                  )
                : (
                <>
                  <img src={otherdocPlaceholder} alt='' />
                  <p className='m-0 blue-placeholder'>Upload JPG, PNG or PDF</p>
                </>
                  )}
              {/* <img src={otherdocPlaceholder} alt="" /> */}
              {/* <button className="close-cross-btn"><img src={crossWhite} alt="" /></button> */}
            </div>
          </div>
        </Form.Group>

        <p className='error-msg'>
          {errors.signature?.message || errors.signature?.label.message}
        </p>
        <div className='col-xl-12 rowspacer'>
          <div className='profile-item '>
            <div className='row'>
              <div className='col-xl-12'>
                <div className='d-xl-block d-flex flex-wrap justify-content-between mb-sm-20'>
                  <Form.Group
                    controlId='formgstnumber'
                    className='form-group document-file-input common-input-file  uploaded-doc'
                  >
                    <Form.Label>Types</Form.Label>
                    <Form.Check type='checkbox'>
                    <Form.Check.Input
                              name='counsellortype'
                              value='career_counsellor'
                              {...register('counsellortype', {
                                required: {
                                  value: true,
                                  message: 'Required'
                                }
                              })}

                              // checked={profileData?.career_counsellor === '1'}
                            />

                      <Form.Check.Label>Career</Form.Check.Label>
                    </Form.Check>
                    <Form.Check type='checkbox'>
                    <Form.Check.Input
                              name='counsellortype'
                              type='checkbox'
                              value='pycho'
                              {...register('counsellortype', {
                                required: {
                                  value: true,
                                  message: 'Required'
                                }
                              })}
                              // checked={profileData?.psychologist === '1'}
                            />

                      <Form.Check.Label>Psychologist</Form.Check.Label>
                    </Form.Check>

                    <Form.Check type='checkbox'>
                    <Form.Check.Input
                              type='checkbox'
                              name='counsellortype'
                              value='overseas'
                              {...register('counsellortype', {
                                required: {
                                  value: true,
                                  message: 'Required'
                                }
                              })}
                              // checked={profileData?.overseas_counsellor === '1'}
                            />

                      <Form.Check.Label>Overseas</Form.Check.Label>
                    </Form.Check>
                    <Form.Check type='checkbox'>
                    <Form.Check.Input
                              type='checkbox'
                              name='counsellortype'
                              value='studentExpert'
                              {...register('counsellortype', {
                                required: {
                                  value: true,
                                  message: 'Required'
                                }
                              })}
                              // checked={profileData?.overseas_counsellor === '1'}
                            />

                      <Form.Check.Label>Subject Expert</Form.Check.Label>
                    </Form.Check>

                  </Form.Group>
                  {errors?.counsellortype?.message && (
                        <p className='error-msg text-left'>
                          Select atleast one type
                        </p>
                  )}
                  {/* <p className='error-msg'>
                        {(errors?.typeGroups?.overseas || errors?.typeGroups?.psyco || errors?.typeGroups?.career) && 'Please select atleast one type' }
                      </p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Form.Group
          className='form-group checkbox-box'
          controlId='formBasicCheckbox'
        >
          <Form.Check type='checkbox' id='checkbox-1'>
            <Form.Check.Input
              type='checkbox'
              onChange={(e) => {
                onChange(e)
              }}
              {...register('terms', { required: true })}
            />
            <Form.Check.Label>
              I agree with all <a href='#'>Terms & Conditions</a>
            </Form.Check.Label>
          </Form.Check>
          {errors.terms?.message && (
            <Form.Text className='error-msg'>
              {errors.terms?.message}{' '}
            </Form.Text>
          )}
        </Form.Group>
        <Button
          variant='primary'
          type='submit'
          className='theme-btn large-btn'
          onClick={handleSubmit(onSubmit)}
        >
          {' '}
          Sign Up{' '}
        </Button>
      </Form>
    </>
  )
}

export default CounsellorKYCDetails
