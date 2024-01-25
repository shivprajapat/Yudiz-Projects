import React, { useContext, useRef, useState } from 'react'
import { Row, Col, Button, Form } from 'react-bootstrap'
import { useMutation, useQuery } from '@apollo/client'
import { Controller, useForm } from 'react-hook-form'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'

import styles from './style.module.scss'
import formStyles from '../../../assets/scss/components/form.module.scss'
import { ToastrContext } from '../toastr/index'
import { NewsIcon } from '../ctIcons'
import { validationErrors } from '../../constants/ValidationErrors'
import { APPLY_JOB, GENERATE_CV_PRE_SIGNED_URL } from '../../../graphql/careers/career.mutation'
import { EMAIL, ONLY_NUMBER, TOAST_TYPE } from '../../constants/index'
import { GET_LOCATIONS } from '../../../graphql/careers/career.query'
import CustomSelect from '../customSelect'

function JobApplication({ id }) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    reset,
    watch
  } = useForm({})
  const { dispatch } = useContext(ToastrContext)
  const [location, setLocation] = useState()
  const sampleDataRef = useRef()
  const userCV = register('userCV', { required: validationErrors.required })
  const uploadedCV = watch('userCV')
  const userSample = register('userSample')
  const uploadedSample = watch('userSample')

  const [generateCVPreSignedUrl] = useMutation(GENERATE_CV_PRE_SIGNED_URL)
  const { loading: locationLoading } = useQuery(GET_LOCATIONS, {
    onCompleted: (data) => {
      if (data && data.getLocations) {
        setLocation(data.getLocations)
      }
    }
  })
  const [applyJob] = useMutation(APPLY_JOB, {
    onCompleted: (data) => {
      if (data && data.applyJob) {
        reset()
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.applyJob.sMessage, type: TOAST_TYPE.Success }
        })
      }
    }
  })
  const uploadImage = (data) => {
    return Promise.all(data.map((item) => fetch(item.sUploadUrl, { method: 'put', body: item.file })))
  }
  async function onSubmit(value) {
    if (value?.userSample?.length !== 0) {
      const sampleInput = {
        sFileName: value.userSample[0]?.name.split('.')[0],
        sContentType: value.userSample[0]?.type,
        sType: 'enqWorkSample'
      }
      const { data: preSignedSampleData } = await generateCVPreSignedUrl({ variables: { input: sampleInput } })
      sampleDataRef.current = preSignedSampleData.generateCVPreSignedUrl[0]
    }
    const cvInput = {
      sFileName: value.userCV[0].name.split('.')[0],
      sContentType: value.userCV[0].type,
      sType: 'jobApplyCV'
    }
    const { data: preSignedData } = await generateCVPreSignedUrl({ variables: { input: cvInput } })
    const input = {
      sFullName: value.sFullName,
      sEmail: value.sEmail,
      sPhone: value.sPhone,
      sCurrentEmployer: value?.sCurrentEmployer,
      sCurrentCTC: value.sCurrentCTC,
      sExpectedCTC: value.sExpectedCTC,
      sCurrentLocation: value?.sCurrentLocation,
      iPreferredLocationId: value.oLocation._id,
      sTotalExperience: value.sTotalExperience,
      sMessage: value.sMessage,
      iJobId: id,
      sUploadCV: preSignedData.generateCVPreSignedUrl[0].sS3Url,
      sUploadSample: sampleDataRef.current && sampleDataRef.current.sS3Url
    }
    const uploadData = []
    uploadData.push({ sUploadUrl: preSignedData.generateCVPreSignedUrl[0].sUploadUrl, file: value.userCV[0] })
    if (value?.userSample?.length !== 0) {
      uploadData.push({ sUploadUrl: sampleDataRef.current.sUploadUrl, file: value.userSample[0] })
    }
    uploadImage(uploadData)
      .then((res) => {
        applyJob({ variables: { input: { jobApplyInput: input } } })
      })
      .catch((err) => {
        console.error('err', err)
      })
  }
  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <section className="pt-3">
          <h3 className="small-head text-primary text-uppercase">
            <Trans i18nKey="common:SendUsMessage" />
          </h3>
          <Row>
            <Col lg={4} sm={6}>
              <Form.Group className={formStyles.formGroup} controlId="fullName">
                <Form.Label className={`${formStyles.label} font-semi`}>
                  <Trans i18nKey="common:FullName" /> *
                </Form.Label>
                <Form.Control
                  className={`${formStyles.formControl} ${errors.sFullName && formStyles.hasError}`}
                  type="text"
                  {...register('sFullName', { required: validationErrors.required })}
                />
                {errors.sFullName && (
                  <Form.Control.Feedback type="invalid" className={`${formStyles.invalidFeedback}`}>
                    {errors.sFullName.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
            <Col lg={4} sm={6}>
              <Form.Group className={formStyles.formGroup} controlId="email">
                <Form.Label className={`${formStyles.label} font-semi`}>
                  <Trans i18nKey="common:Email" /> *
                </Form.Label>
                <Form.Control
                  className={`${formStyles.formControl} ${errors.sEmail && formStyles.hasError}`}
                  type="text"
                  {...register('sEmail', {
                    required: validationErrors.required,
                    pattern: { value: EMAIL, message: validationErrors.email }
                  })}
                />
                {errors.sEmail && (
                  <Form.Control.Feedback type="invalid" className={`${formStyles.invalidFeedback}`}>
                    {errors.sEmail.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
            <Col lg={4} sm={6}>
              <Form.Group className={formStyles.formGroup} controlId="phoneNumber">
                <Form.Label className={`${formStyles.label} font-semi`}>
                  <Trans i18nKey="common:PhoneNo" /> *
                </Form.Label>
                <Form.Control
                  className={`${formStyles.formControl} ${errors.sPhone && formStyles.hasError}`}
                  type="tel"
                  {...register('sPhone', {
                    required: validationErrors.required,
                    pattern: { value: ONLY_NUMBER, message: validationErrors.number },
                    maxLength: { value: 10, message: validationErrors.number },
                    minLength: { value: 10, message: validationErrors.number }
                  })}
                />
                {errors.sPhone && (
                  <Form.Control.Feedback type="invalid" className={`${formStyles.invalidFeedback}`}>
                    {errors.sPhone.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
            <Col lg={4} sm={6}>
              <Form.Group className={formStyles.formGroup} controlId="currentEmployer">
                <Form.Label className={`${formStyles.label} font-semi`}>
                  <Trans i18nKey="common:CurrentEmployer" />
                </Form.Label>
                <Form.Control className={`${formStyles.formControl}`} type="text" {...register('sCurrentEmployer')} />
              </Form.Group>
            </Col>
            <Col lg={4} sm={6}>
              <Form.Group className={formStyles.formGroup} controlId="currentCTC">
                <Form.Label className={`${formStyles.label} font-semi`}>
                  <Trans i18nKey="common:CurrentCTC" /> *
                </Form.Label>
                <Form.Control
                  className={`${formStyles.formControl} ${errors.sCurrentCTC && formStyles.hasError}`}
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('sCurrentCTC', { required: validationErrors.required })}
                />
                {errors.sCurrentCTC && (
                  <Form.Control.Feedback type="invalid" className={`${formStyles.invalidFeedback}`}>
                    {errors.sCurrentCTC.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
            <Col lg={4} sm={6}>
              <Form.Group className={formStyles.formGroup} controlId="expectedCTC">
                <Form.Label className={`${formStyles.label} font-semi`}>
                  <Trans i18nKey="common:ExpectedCTC" /> *
                </Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  className={`${formStyles.formControl} ${errors.sExpectedCTC && formStyles.hasError}`}
                  {...register('sExpectedCTC', { required: validationErrors.required })}
                />
                {errors.sExpectedCTC && (
                  <Form.Control.Feedback type="invalid" className={`${formStyles.invalidFeedback}`}>
                    {errors.sExpectedCTC.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
            <Col lg={4} sm={6}>
              <Form.Group className={formStyles.formGroup} controlId="currentLocation">
                <Form.Label className={`${formStyles.label} font-semi`}>
                  <Trans i18nKey="common:CurrentLocation" />
                </Form.Label>
                <Form.Control className={`${formStyles.formControl}`} type="text" {...register('sCurrentLocation')} />
              </Form.Group>
            </Col>
            <Col lg={4} sm={6}>
              <Form.Group className={formStyles.formGroup} controlId="preferredLocation">
                <Form.Label className={`${formStyles.label} font-semi`}>
                  <Trans i18nKey="common:PreferredLocation" /> *
                </Form.Label>
                <Controller
                  name="oLocation"
                  control={control}
                  rules={{ required: validationErrors.required }}
                  render={({ field: { onChange, value = [] } }) => (
                    <CustomSelect
                      options={location}
                      labelKey="sTitle"
                      valueKey="_id"
                      placeholder="Select Location"
                      onChange={onChange}
                      isLoading={locationLoading}
                      className={errors?.oLocation && 'hasError'}
                    />
                  )}
                />
                {errors.oLocation && (
                  <Form.Control.Feedback type="invalid" className={`${formStyles.invalidFeedback}`}>
                    {errors.oLocation.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
            <Col lg={4} sm={6}>
              <Form.Group className={formStyles.formGroup} controlId="totalExperience">
                <Form.Label className={`${formStyles.label} font-semi`}>
                  <Trans i18nKey="common:TotalExperience" /> *
                </Form.Label>
                <Form.Control
                  className={`${formStyles.formControl} ${errors.sTotalExperience && formStyles.hasError}`}
                  type="number"
                  step="0.1"
                  {...register('sTotalExperience', { required: validationErrors.required })}
                />
                {errors.sTotalExperience && (
                  <Form.Control.Feedback type="invalid" className={`${formStyles.invalidFeedback}`}>
                    {errors.sTotalExperience.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
            <Col sm={12}>
              <Form.Group
                className={`${formStyles.formGroup} ${
                  styles.filedrop
                }  d-flex flex-column flex-sm-row justify-content-between align-items-center position-relative ${
                  errors.userCV ? 'border border-danger' : ''
                }  `}
              >
                {uploadedCV?.length ? (
                  uploadedCV[0].name
                ) : (
                  <>
                    <p className="mb-2 mb-sm-0 d-flex align-items-center justify-content-center flex-wrap">
                      <span className={`${styles.icon} d-block me-1 me-md-2`}>
                        <NewsIcon />
                      </span>
                      <span className="text-uppercase">
                        <Trans i18nKey="common:UploadYourCV" />
                      </span>
                      &nbsp;
                      <small>
                        {' '}
                        (<Trans i18nKey="common:CVValidation" />)
                      </small>
                    </p>
                  </>
                )}
                <div className="d-flex align-items-center">
                  <p className="mb-0 me-2">
                    <Trans i18nKey="common:DargNDrop" />
                  </p>
                  <Button className="theme-btn dark-btn">
                    {uploadedCV?.length ? <Trans i18nKey="common:Change" /> : <Trans i18nKey="common:Browse" />}
                  </Button>
                </div>
                <input type="file" name="userCV" accept=".pdf,.ppt" {...userCV} className="position-absolute h-100 w-100 opacity-0" />
              </Form.Group>
              {errors.userCV && (
                <Form.Control.Feedback type="invalid" className={`${formStyles.invalidFeedback} mb-2`}>
                  {errors.userCV.message}
                </Form.Control.Feedback>
              )}
            </Col>
            {/* sample */}
            <Col sm={12}>
              <Form.Group
                className={`${formStyles.formGroup} ${
                  styles.filedrop
                }  d-flex flex-column flex-sm-row justify-content-between align-items-center position-relative`}
              >
                {uploadedSample?.length ? (
                  uploadedSample[0].name
                ) : (
                  <>
                    <p className="mb-2 mb-sm-0 d-flex align-items-center justify-content-center flex-wrap">
                      <span className={`${styles.icon} d-block me-1 me-md-2`}>
                        <NewsIcon />
                      </span>
                      <span className="text-uppercase">
                        <Trans i18nKey="common:UploadYourSample" />
                      </span>
                      &nbsp;
                      <small>
                        {' '}
                        (<Trans i18nKey="common:CVValidation" />)
                      </small>
                    </p>
                  </>
                )}
                <div className="d-flex align-items-center">
                  <p className="mb-0 me-2">
                    <Trans i18nKey="common:DargNDrop" />
                  </p>
                  <Button className="theme-btn dark-btn">
                    {uploadedSample?.length ? <Trans i18nKey="common:Change" /> : <Trans i18nKey="common:Browse" />}
                  </Button>
                </div>
                <input type="file" name="sUploadSample" accept=".pdf,.ppt" {...userSample} className="position-absolute h-100 w-100 opacity-0" />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className={formStyles.formGroup} controlId="message">
                <Form.Label className={`${formStyles.label} font-semi`}>
                  <Trans i18nKey="common:Message" /> *
                </Form.Label>
                <Form.Control
                  className={`${formStyles.formControl} ${formStyles.formTextarea} ${styles.formTextarea} ${
                    errors.sMessage && formStyles.hasError
                  }`}
                  as="textarea"
                  {...register('sMessage', { required: validationErrors.required })}
                />
                {errors.sMessage && (
                  <Form.Control.Feedback type="invalid" className={`${formStyles.invalidFeedback}`}>
                    {errors.sMessage.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Button className="theme-btn small-btn" type="submit">
            <Trans i18nKey="common:ApplyNow" />
          </Button>
        </section>
      </Form>
    </>
  )
}
JobApplication.propTypes = {
  id: PropTypes.string
}

export default JobApplication
