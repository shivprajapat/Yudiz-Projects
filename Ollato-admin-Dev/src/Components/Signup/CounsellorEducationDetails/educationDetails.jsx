import React, { useEffect, useContext } from 'react'
import { Button, Form } from 'react-bootstrap'
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  GetQualificationAction,
  GetAllUniversityData
} from '../../../Actions/auth'

import { useAddress } from '../../../Shared/Hooks/UseAddress'
import { AppContext } from '../../../context'

const validationSchema = yup.object().shape({
  country: yup
    .object()
    .nullable() // for handling null value when clearing options via clicking "x"
    .required('Country is required'),
  pincode: yup
    .string()
    .required('Pincode is required')
    .matches(/^[\w]*$/, 'Negative numbers not allowed')
    .min(5, 'Pincode must be greater than & equals to 5 digits')
    .max(10, 'Pincode must be less than & equals to 10 digits'),
  state: yup.object().required('State is required'),
  district: yup.object().required('District is required'),
  qualification: yup.object().required('Highest Qualification is required'),
  lQualification: yup.object().required('Last Qualification is required'),
  certificate: yup.object().required('Certificate is required'),
  university: yup.object().required('University is required'),
  suniversity: yup.object().required('University is required'),
  iuniversity: yup.object().required('University is required'),
  total_experience: yup
    .string()
    .nullable(true)
    .matches(
      /^(([a-zA-Z0-9]+\s)*[a-zA-Z0-9]+)?$/,
      'Invalid format'
    )
})
function EducationDetails (props) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // const location = useLocation()
  useEffect(() => {
    dispatch(GetQualificationAction())
    dispatch(GetAllUniversityData())
  }, [])
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(validationSchema)
  })
  const { onChange, name } = register()

  // custom hook
  const {
    countryid,
    setCountryid,
    stateid,
    setStateid,
    countriesArray,
    statesArray,
    districtArray
  } = useAddress()
  const { userDetails } = useContext(AppContext)
  const [user] = userDetails
  const { educationdetails } = useContext(AppContext)
  const [educationdetail, setEducationDetail] = educationdetails

  const qualificationData = useSelector((state) => state.auth.qData)
  const universityData = useSelector((state) => state.auth.universityData)
  // const previousProps = useRef({ statesData, countriesArray, districtData, qualificationData }).current
  // Form onSubmit Method

  useEffect(() => {
    if (Object.keys(user).length === 0) {
      navigate('/counsellor/signup')
    }
  }, [])
  const onSubmit = (data) => {
    // eslint-disable-next-line react/prop-types
    props.setNow(66.6)

    const studentData = {
      country_id: data.country,
      city_id: data.district,
      pin_code: Number(data.pincode),
      high_qualification_id: data.qualification,
      high_university_id: data.university,
      last_qualification_id: data.lQualification,
      last_university_id: data.suniversity,
      certificate_qualification_id: data.certificate,
      certificate_university_id: data.iuniversity,
      state_id: data.state,
      total_experience: data?.total_experience

      // resume: location.state.data.file
    }
    // eslint-disable-next-line no-empty
    if (studentData) {
      setEducationDetail(studentData)
      navigate('/kycdetails', { state: { data: studentData } })
    }
    reset()
  }
  /* for highestQualification */

  useEffect(() => {
    if (Object.keys(educationdetail).length !== 0) {
      setCountryid(educationdetail?.country_id?.id)
      setStateid(educationdetail?.state_id?.id)
      reset({
        country: {
          id: educationdetail?.country_id?.id,
          title: educationdetail?.country_id?.title
        },
        state: {
          id: educationdetail?.state_id?.id,
          title: educationdetail?.state_id?.title
        },
        district: {
          id: educationdetail?.city_id?.id,
          title: educationdetail?.city_id?.title
        },
        qualification: {
          id: educationdetail?.high_qualification_id?.id,
          title: educationdetail?.high_qualification_id?.title
        },
        lQualification: {
          id: educationdetail?.last_qualification_id?.id,
          title: educationdetail?.last_qualification_id?.title
        },
        certificate: {
          id: educationdetail?.certificate_qualification_id?.id,
          title: educationdetail?.certificate_qualification_id?.title
        },
        university: {
          id: educationdetail?.high_university_id?.id,
          title: educationdetail?.high_university_id?.title
        },
        suniversity: {
          id: educationdetail?.last_university_id?.id,
          title: educationdetail?.last_university_id?.title
        },
        iuniversity: {
          id: educationdetail?.certificate_university_id
            ?.id,
          title: educationdetail?.certificate_university_id
            ?.title
        },
        total_experience: educationdetail?.total_experience,
        pincode: educationdetail.pin_code
      })
    }
  }, [])

  return (
    <>
      <Form>
        <div className='light-bg-box bottom-space-none'>
          <h4>Counsellor Address</h4>
          <div className='row'>
            <div className='col-xl-6'>
              <Form.Group
                className='form-group common-select-style'
                controlId='formfullname'
              >
                <Form.Label>Country</Form.Label>
                <Form.Group
                  className='form-group common-select-style'
                  controlId='formfullname'
                >
                  <Controller
                    name='country'
                    control={control}
                    render={({ field, onChange }) => {
                      return (
                        <Select
                          {...field}
                          placeholder={'Select Country'}
                          className='react-dropdown'
                          classNamePrefix='dropdown'
                          options={countriesArray}
                          getOptionLabel={(option) => option?.title}
                          getOptionValue={(option) => option?.id}
                          onChange={(e) => {
                            field.onChange(e)
                            setCountryid(e.id)
                          }}
                        />
                      )
                    }}
                  />
                  <p className='error-msg'>
                    {errors.country?.message || errors.country?.title.message}
                  </p>
                </Form.Group>
              </Form.Group>
            </div>
            <div className='col-xl-6'>
              <Form.Group
                className='form-group common-select-style'
                controlId='formfullname'
              >
                <Form.Label>State</Form.Label>
                <Controller
                  name='state'
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        {...field}
                        placeholder={'Select State'}
                        className='react-dropdown'
                        classNamePrefix='dropdown'
                        options={statesArray}
                        onChange={(e) => {
                          field.onChange(e)
                          setStateid(e.id)
                          setValue('district', '')
                        }}
                        getOptionLabel={(option) => option?.title}
                        getOptionValue={(option) => option?.id}
                        isDisabled={!countryid && true}
                      />
                    )
                  }}
                />
                <p className='error-msg'>
                  {errors.state?.message || errors.state?.label?.message}
                </p>
              </Form.Group>
            </div>
          </div>
          <div className='row  '>
            <div className='col-xl-6'>
              <Form.Group
                className='form-group common-select-style'
                controlId='formfullname'
              >
                <Form.Label>District</Form.Label>
                {/* <Select isSearchable={false} Value={selectedDistrict} onChange={setSelectedDistrict} options={district} placeholder={'Select District'}/> */}
                <Controller
                  name='district'
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        {...field}
                        placeholder={'Select District'}
                        className='react-dropdown'
                        classNamePrefix='dropdown'
                        options={districtArray}
                        isSearchable={true}
                        getOptionLabel={(option) => option?.title}
                        getOptionValue={(option) => option?.id}
                        isDisabled={!stateid && true}
                      />
                    )
                  }}
                />
                <p className='error-msg'>
                  {errors.district?.message || errors.district?.label?.message}
                </p>
              </Form.Group>
            </div>
            <div className='col-xl-6'>
              <Form.Group
                className={`form-group ${
                  errors.pincode?.message ? 'error-occured' : ''
                }`}
                controlId='formpincode1'
              >
                <Form.Label>PIN Code</Form.Label>
                <Form.Control
                  type='number'
                  placeholder='Enter PIN Code'
                  name={name}
                  onChange={(e) => {
                    onChange(e)
                  }}
                  {...register('pincode', { required: true })}
                />
                <p className='error-msg'>
                  {errors.pincode?.message || errors.pincode?.label?.message}
                </p>
              </Form.Group>
            </div>
          </div>
        </div>
        <div className='light-bg-box bottom-margin-none'>
          <h4>Counsellor Details</h4>
          <Form.Group
            className='form-group common-select-style'
            controlId='formfullname'
          >
            <Form.Label>High Qualification</Form.Label>
            <Controller
              name='qualification'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder={'Select Qualification'}
                  className='react-dropdown'
                  classNamePrefix='dropdown'
                  options={qualificationData}
                  isSearchable={true}
                  getOptionLabel={(option) => option?.title}
                  getOptionValue={(option) => option?.id}
                />
              )}
            />
            <p className='error-msg'>
              {errors?.qualification?.message ||
                errors?.qualification?.id?.message}
            </p>
          </Form.Group>
          <Form.Group
            className='form-group common-select-style'
            controlId='formfullname'
          >
            <Form.Label>University/Institution</Form.Label>
            <Controller
              name='university'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder={'Select University'}
                  className='react-dropdown'
                  classNamePrefix='dropdown'
                  options={universityData}
                  isSearchable={true}
                  getOptionLabel={(option) => option?.title}
                  getOptionValue={(option) => option?.id}
                />
              )}
            />
            <p className='error-msg'>
              {errors.university?.message || errors.university?.label?.message}
            </p>
          </Form.Group>
          <Form.Group
            className='form-group common-select-style'
            controlId='formfullname'
          >
            <Form.Label>Last Qualification</Form.Label>
            <Form.Group
              className='form-group common-select-style'
              controlId='formfullname'
            >
              <Controller
                name='lQualification'
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder={'Select Last Qualification'}
                    className='react-dropdown'
                    classNamePrefix='dropdown'
                    options={qualificationData}
                    isSearchable={true}
                    getOptionLabel={(option) => option?.title}
                    getOptionValue={(option) => option?.id}
                  />
                )}
              />
              <p className='error-msg'>
                {errors.lQualification?.message ||
                  errors.lQualification?.label?.message}
              </p>
            </Form.Group>
          </Form.Group>
          <Form.Group
            className='form-group common-select-style'
            controlId='formfullname'
          >
            <Form.Label>University/Institution</Form.Label>
            <Controller
              name='suniversity'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder={'Select University'}
                  className='react-dropdown'
                  classNamePrefix='dropdown'
                  options={universityData}
                  isSearchable={true}
                  getOptionLabel={(option) => option?.title}
                  getOptionValue={(option) => option?.id}
                />
              )}
            />
            <p className='error-msg'>
              {errors.suniversity?.message ||
                errors.suniversity?.label?.message}
            </p>
          </Form.Group>
          <Form.Group
            className='form-group common-select-style'
            controlId='formfullname'
          >
            <Form.Label>Certification</Form.Label>
            <Form.Group
              className='form-group common-select-style'
              controlId='formfullname'
            >
              <Controller
                name='certificate'
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder={'Select Certificate'}
                    className='react-dropdown'
                    classNamePrefix='dropdown'
                    options={qualificationData}
                    isSearchable={true}
                    getOptionLabel={(option) => option?.title}
                    getOptionValue={(option) => option?.id}
                  />
                )}
              />
              <p className='error-msg'>
                {errors.certificate?.message ||
                  errors.certificate?.label?.message}
              </p>
            </Form.Group>
          </Form.Group>
          <Form.Group
            className='form-group common-select-style'
            controlId='formfullname'
          >
            <Form.Label>University/Institution</Form.Label>
            <Controller
              name='iuniversity'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder={'Select University'}
                  className='react-dropdown'
                  classNamePrefix='dropdown'
                  options={universityData}
                  isSearchable={true}
                  getOptionLabel={(option) => option?.title}
                  getOptionValue={(option) => option?.id}
                />
              )}
            />
            <p className='error-msg'>
              {errors.iuniversity?.message ||
                errors.iuniversity?.label?.message}
            </p>
          </Form.Group>
        </div>
        <div className='light-bg-box bottom-space-none'>
          <h4>Experiences</h4>
          <div className='row '>
          <Form.Group
          className={`form-group ${
            errors.firstName?.message ? 'error-occured' : ''
          }`}
          controlId='formfirstname'
        >
          <Form.Label>Experience Detail</Form.Label>
          <Form.Control
            type='text'
            placeholder='E.g. 11 years 3 months'
            name={name}
            onChange={(e) => {
              onChange(e)
            }}
            {...register('total_experience', { required: true })}
          />
          {errors.total_experience?.message && (
            <Form.Text className='error-msg'>
              {errors.total_experience?.message}{' '}
            </Form.Text>
          )}
        </Form.Group>
          </div>
        </div>
      </Form>
      <Form>
        <Button
          variant='primary'
          type='submit'
          className='theme-btn large-btn'
          onClick={handleSubmit(onSubmit)}
        >
          {' '}
          Next{' '}
        </Button>
      </Form>
    </>
  )
}

export default EducationDetails
