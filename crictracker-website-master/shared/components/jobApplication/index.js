import React, { useContext, useRef, useState } from 'react'
import { Row, Col, Button, Form } from 'react-bootstrap'
import { useMutation, useQuery } from '@apollo/client'
import { Controller, useForm } from 'react-hook-form'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'

import styles from './style.module.scss'
import formStyles from '../../../assets/scss/components/form.module.scss'
import ToastrContext from '@shared-components/toastr/ToastrContext'
import { NewsIcon } from '../ctIcons'
import { validationErrors } from '../../constants/ValidationErrors'
import { APPLY_JOB, GENERATE_CV_PRE_SIGNED_URL } from '../../../graphql/careers/career.mutation'
import { EMAIL, ONLY_NUMBER, TOAST_TYPE } from '../../constants/index'
import { GET_LOCATIONS } from '../../../graphql/careers/career.query'
import CustomSelect from '../customSelect'
import CustomFormGroup from '@shared/components/customForm/customFormGroup'
import CustomInput from '@shared/components/customForm/customInput'
import CustomFeedback from '@shared/components/customForm/customFeedback'
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
      sReference: value.sReference,
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
      <Form onSubmit={handleSubmit(onSubmit)} className="mb-3 mb-md-0">
        <section className="pt-3">
          <h3 className="small-head text-primary text-uppercase">
            <Trans i18nKey="common:SendUsMessage" />
          </h3>
          <Row>
            <Col lg={4} sm={6}>
              <CustomFormGroup className={formStyles.formGroup} controlId="fullName">
                <Form.Label className={`${formStyles.label} font-semi`}>
                  <Trans i18nKey="common:FullName" /> *
                </Form.Label>
                <CustomInput
                  className={`${formStyles.formControl} ${errors.sFullName && formStyles.hasError}`}
                  type="text"
                  name="sFullName"
                  register={register('sFullName', {
                    required: validationErrors.required,
                    minLength: { value: 3, message: validationErrors.minLength(3) },
                    maxLength: { value: 30, message: validationErrors.maxLength(30) }
                  })}
                />
                {errors.sFullName && (
                  <CustomFeedback message={errors.sFullName.message} type="invalid" className={`${formStyles.invalidFeedback}`} />
                )}
              </CustomFormGroup>
            </Col>
            <Col lg={4} sm={6}>
              <CustomFormGroup className={formStyles.formGroup} controlId="email">
                <Form.Label className={`${formStyles.label} font-semi`}>
                  <Trans i18nKey="common:Email" /> *
                </Form.Label>
                <CustomInput
                  className={`${formStyles.formControl} ${errors.sEmail && formStyles.hasError}`}
                  type="text"
                  name="sEmail"
                  register={register('sEmail', {
                    required: validationErrors.required,
                    pattern: { value: EMAIL, message: validationErrors.email }
                  })}
                />
                {errors.sEmail && (
                  <CustomFeedback message={errors.sEmail.message} type="invalid" className={`${formStyles.invalidFeedback}`} />
                )}
              </CustomFormGroup>
            </Col>
            <Col lg={4} sm={6}>
              <CustomFormGroup className={formStyles.formGroup} controlId="phoneNumber">
                <Form.Label className={`${formStyles.label} font-semi`}>
                  <Trans i18nKey="common:PhoneNo" /> (<Trans i18nKey="common:NumberOnly" />)*
                </Form.Label>
                <CustomInput
                  className={`${formStyles.formControl} ${errors.sPhone && formStyles.hasError}`}
                  type="tel"
                  name="sPhone"
                  register={register('sPhone', {
                    required: validationErrors.required,
                    pattern: { value: ONLY_NUMBER, message: validationErrors.number },
                    maxLength: { value: 10, message: validationErrors.number },
                    minLength: { value: 10, message: validationErrors.number }
                  })}
                />
                {errors.sPhone && (
                  <CustomFeedback message={errors.sPhone.message} type="invalid" className={`${formStyles.invalidFeedback}`} />
                )}
              </CustomFormGroup>
            </Col>
            <Col lg={4} sm={6}>
              <CustomFormGroup className={formStyles.formGroup} controlId="currentEmployer">
                <Form.Label className={`${formStyles.label} font-semi`}>
                  <Trans i18nKey="common:CurrentEmployer" />
                </Form.Label>
                <CustomInput className={`${formStyles.formControl}`} name="sCurrentEmployer" type="text" register={register('sCurrentEmployer')} />
              </CustomFormGroup>
            </Col>
            <Col lg={4} sm={6}>
              <CustomFormGroup className={formStyles.formGroup} controlId="currentCTC">
                <Form.Label className={`${formStyles.label} font-semi`}>
                  <Trans i18nKey="common:CurrentCTC" /> (<Trans i18nKey="common:NumberOnly" />)*
                </Form.Label>
                <CustomInput
                  className={`${formStyles.formControl} ${errors.sCurrentCTC && formStyles.hasError}`}
                  type="number"
                  step="0.01"
                  min="0"
                  name="sCurrentCTC"
                  register={register('sCurrentCTC', {
                    required: validationErrors.required
                  })}
                />
                {errors.sCurrentCTC && (
                  <CustomFeedback message={errors.sCurrentCTC.message} type="invalid" className={`${formStyles.invalidFeedback}`} />
                )}
              </CustomFormGroup>
            </Col>
            <Col lg={4} sm={6}>
              <CustomFormGroup className={formStyles.formGroup} controlId="expectedCTC">
                <Form.Label className={`${formStyles.label} font-semi`}>
                  <Trans i18nKey="common:ExpectedCTC" /> (<Trans i18nKey="common:NumberOnly" />)*
                </Form.Label>
                <CustomInput
                  type="number"
                  step="0.01"
                  min="0"
                  name="sExpectedCTC"
                  className={`${formStyles.formControl} ${errors.sExpectedCTC && formStyles.hasError}`}
                  register={register('sExpectedCTC', {
                    required: validationErrors.required
                  })}
                />
                {errors.sExpectedCTC && (
                  <CustomFeedback message={errors.sExpectedCTC.message} type="invalid" className={`${formStyles.invalidFeedback}`} />
                )}
              </CustomFormGroup>
            </Col>
            <Col lg={4} sm={6}>
              <CustomFormGroup className={formStyles.formGroup} controlId="currentLocation">
                <Form.Label className={`${formStyles.label} font-semi`}>
                  <Trans i18nKey="common:CurrentLocation" />
                </Form.Label>
                <CustomInput className={`${formStyles.formControl}`} name="sCurrentLocation" type="text" register={register('sCurrentLocation')} />
              </CustomFormGroup>
            </Col>
            <Col lg={4} sm={6}>
              <CustomFormGroup className={formStyles.formGroup} controlId="preferredLocation">
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
                      isNative
                      className={errors?.oLocation && 'hasError'}
                    />
                  )}
                />
                {errors.oLocation && (
                  <CustomFeedback message={errors.oLocation.message} type="invalid" className={`${formStyles.invalidFeedback}`} />
                )}
              </CustomFormGroup>
            </Col>
            <Col lg={4} sm={6}>
              <CustomFormGroup className={formStyles.formGroup} controlId="totalExperience">
                <Form.Label className={`${formStyles.label} font-semi`}>
                  <Trans i18nKey="common:TotalExperience" /> (<Trans i18nKey="common:NumberOnly" />)*
                </Form.Label>
                <CustomInput
                  className={`${formStyles.formControl} ${errors.sTotalExperience && formStyles.hasError}`}
                  type="number"
                  step="0.1"
                  name="sTotalExperience"
                  register={register('sTotalExperience', {
                    required: validationErrors.required
                  })}
                />
                {errors.sTotalExperience && (
                  <CustomFeedback message={errors.sTotalExperience.message} type="invalid" className={`${formStyles.invalidFeedback}`} />
                )}
              </CustomFormGroup>
            </Col>
            <Col lg={4} sm={6}>
              <CustomFormGroup className={formStyles.formGroup} controlId="totalExperience">
                <Form.Label className={`${formStyles.label} font-semi`}>
                  <Trans i18nKey="common:reference" />
                </Form.Label>
                <CustomInput
                  className={`${formStyles.formControl} ${errors.sReference && formStyles.hasError}`}
                  type="text"
                  step="0.1"
                  name="sReference"
                  register={register('sReference')}
                />
                {errors.sReference && (
                  <CustomFeedback message={errors.sReference.message} type="invalid" className={`${formStyles.invalidFeedback}`} />
                )}
              </CustomFormGroup>
            </Col>
            <Col sm={12}>
              <CustomFormGroup
                className={`${formStyles.formGroup} ${styles.filedrop} p-2 p-md-3 d-flex flex-column flex-sm-row justify-content-between align-items-center position-relative ${errors.userCV ? 'border border-danger' : ''
                  } br-sm`}
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
                <input type="file" name="userCV" accept=".pdf,.ppt" {...userCV} className="position-absolute h-100 w-100 start-0 top-0 opacity-0" />
              </CustomFormGroup>
              {errors.userCV && (
                <CustomFeedback message={errors.userCV.message} type="invalid" className={`${formStyles.invalidFeedback} mb-2`} />
              )}
            </Col>
            {/* sample */}
            <Col sm={12}>
              <CustomFormGroup
                className={`${formStyles.formGroup} ${styles.filedrop} p-2 p-md-3 d-flex flex-column flex-sm-row justify-content-between align-items-center position-relative br-sm`}
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
                <input type="file" name="sUploadSample" accept=".pdf,.ppt" {...userSample} className="position-absolute h-100 w-100 start-0 top-0 opacity-0" />
              </CustomFormGroup>
            </Col>
            <Col md={12}>
              <CustomFormGroup className={formStyles.formGroup} controlId="message">
                <Form.Label className={`${formStyles.label} font-semi`}>
                  <Trans i18nKey="common:Message" /> *
                </Form.Label>
                <CustomInput
                  className={`${formStyles.formControl} ${formStyles.formTextarea} ${styles.formTextarea} ${errors.sMessage && formStyles.hasError
                    }`}
                  as="textarea"
                  name="sMessage"
                  register={register('sMessage', {
                    required: validationErrors.required
                  })}
                />
                {errors.sMessage && (
                  <CustomFeedback message={errors.sMessage.message} type="invalid" className={`${formStyles.invalidFeedback}`} />
                )}
              </CustomFormGroup>
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
