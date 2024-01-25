import React, { useContext, useEffect, useRef, useState } from 'react'
import { Row, Col, Form, Button, Spinner } from 'react-bootstrap'
import { useQuery, useMutation } from '@apollo/client'
import { Controller, useForm } from 'react-hook-form'
import useTranslation from 'next-translate/useTranslation'
import formStyles from '@assets/scss/components/form.module.scss'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'

import profileStyles from '../profile-style.module.scss'
import styles from './style.module.scss'
import { NO_SPECIAL_CHARACTER, TOAST_TYPE } from '@shared/constants'
import { LIST_COUNTRY } from '@graphql/profile/profile.query'
import { EDIT_PROFILE, GENERATE_PRE_SIGNED } from '@graphql/profile/profile.mutation'
import { ToastrContext } from '@shared/components/toastr'
import { allRoutes } from '@shared/constants/allRoutes'
import { dateCheck, debounce, getDateForOlderThanEighteen } from '@utils'
import { GlobalEventsContext } from '@shared/components/global-events'
import { validationErrors } from '@shared/constants/ValidationErrors'
import { getCurrentUser, setCurrentUser } from '@shared/libs/menu'
import CustomSelect from '@shared/components/customSelect'

function ProfileEditContentHelper(data) {
  const { t } = useTranslation()
  const router = useRouter()
  const { stateGlobalEvents } = useContext(GlobalEventsContext)
  const { dispatch } = useContext(ToastrContext)
  const [requestParams, setRequestParams] = useState({ nSkip: 1, nLimit: 10, sSearch: '' })
  const isBottomReached = useRef(false)
  const totalCountry = useRef(0)
  const [countryList, setCountryList] = useState()
  const { dispatchGlobalEvents: editProfileEvent } = useContext(GlobalEventsContext)
  const currentUser = getCurrentUser()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues
  } = useForm({ mode: 'onTouched' })
  const values = getValues()
  const [generatePreSignedUrl] = useMutation(GENERATE_PRE_SIGNED)

  const { loading: loadingCountry } = useQuery(LIST_COUNTRY, {
    variables: { input: requestParams },
    onCompleted: (data) => {
      if (data && data.listFrontCountry) {
        if (isBottomReached.current) {
          setCountryList([...countryList, ...data.listFrontCountry.aResults])
        } else {
          setCountryList(data.listFrontCountry.aResults)
        }
        totalCountry.current = data.listFrontCountry.nTotal
        isBottomReached.current = false
      }
    }
  })

  useEffect(() => {
    stateGlobalEvents && stateGlobalEvents.profileData && setCurrentUser({ ...stateGlobalEvents.profileData })
  }, [stateGlobalEvents])
  useEffect(() => {
    if (currentUser) {
      setUserValue(currentUser)
    }
  }, [currentUser])

  function handleScrollCountry() {
    if (totalCountry.current > requestParams.nSkip * 10) {
      setRequestParams({ ...requestParams, nSkip: requestParams.nSkip + 1 })
      isBottomReached.current = true
    }
  }
  const optimizedSearch = debounce((value) => {
    setRequestParams({ ...requestParams, sSearch: value, nSkip: 1 })
  })
  function setUserValue(data) {
    const date = data?.dDOB && dateCheck(data?.dDOB).toISOString().split('T')[0]
    reset({
      sFullName: data?.sFullName,
      sUsername: data?.sUsername,
      sEmail: data?.sEmail,
      eGender: data?.eGender,
      dDOB: date,
      sCity: data?.sCity,
      sBio: data?.sBio,
      userProfile: data?.sProPic,
      sCountry: { sSortName: data?.oCountry?.sSortName, sName: data?.oCountry?.sName }
    })
  }

  const uploadImage = (data) => {
    return Promise.all(data.map((item) => fetch(item.sUploadUrl, { method: 'put', body: item.file })))
  }

  async function onSubmit(data) {
    const input = {
      sFullName: data?.sFullName,
      eGender: data?.eGender,
      dDOB: data?.dDOB,
      sCity: data?.sCity,
      sCountryId: data?.sCountry?.sId,
      sBio: data?.sBio
    }
    if (data && data.userProfileImg && data.userProfileImg.files && data.userProfileImg.files[0]) {
      const profileInput = {
        sFileName: data.userProfileImg.files[0].name.split('.')[0],
        sContentType: data.userProfileImg.files[0].type,
        sType: 'profile'
      }
      const { data: preSignedData } = await generatePreSignedUrl({ variables: { generatePreSignedUrlInput: profileInput } })
      const uploadData = []
      uploadData.push({ sUploadUrl: preSignedData.generatePreSignedUrl[0].sUploadUrl, file: data.userProfileImg.files[0] })
      uploadImage(uploadData)
        .then((res) => {
          editProfile({
            variables: {
              input: {
                ...input,
                sProPic: preSignedData.generatePreSignedUrl[0].sS3Url
              }
            }
          })
        })
        .catch((err) => {
          console.error('err', err)
        })
    } else {
      editProfile({
        variables: {
          input: input
        }
      })
    }
  }

  const [editProfile, { loading }] = useMutation(EDIT_PROFILE, {
    onCompleted: (data) => {
      if (data && data.updateProfile) {
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.updateProfile.sMessage, type: TOAST_TYPE.Success }
        })
        editProfileEvent({
          type: 'CHANGE_PROFILE',
          payload: {
            profileData: {
              ...data.updateProfile.oData,
              oCountry: { sName: data?.updateProfile?.oData?.oCountry?.sName, sSortName: data?.updateProfile?.oData?.oCountry?.sSortName }
            }
          }
        })
        router.push(allRoutes.profile)
      }
    }
  })
  return (
    <div className={`${profileStyles.profileInner} flex-grow-1`}>
      <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Row>
          <Col lg={4} sm={6}>
            <Form.Group className={formStyles.formGroup} controlId="fullName">
              <Form.Label className={`${formStyles.label} font-semi`}>{t('common:FullName')}</Form.Label>
              <Form.Control
                className={formStyles.formControl}
                type="text"
                {...register('sFullName', {
                  required: validationErrors.required,
                  minLength: { value: 3, message: validationErrors.minLength(3) },
                  maxLength: { value: 30, message: validationErrors.maxLength(30) }
                })}
              />
              {errors.sFullName && (
                <Form.Control.Feedback type="invalid" className={formStyles.invalidFeedback}>
                  {errors.sFullName.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>
          <Col lg={4} sm={6}>
            <Form.Group className={formStyles.formGroup} controlId="userName">
              <Form.Label className={`${formStyles.label} font-semi`}>{t('common:UserName')} *</Form.Label>
              <Form.Control className={formStyles.formControl} type="text" disabled {...register('sUsername')} />
            </Form.Group>
          </Col>
          <Col lg={4} sm={6}>
            <Form.Group className={formStyles.formGroup} controlId="email">
              <Form.Label className={`${formStyles.label} font-semi`}>{t('common:Email')} *</Form.Label>
              <Form.Control
                className={`${formStyles.formControl} ${data?.getUser?.bIsEmailVerified === true && styles.verify}`}
                type="email"
                disabled
                {...register('sEmail')}
              />
            </Form.Group>
          </Col>
          <Col lg={4} sm={6}>
            <Form.Group className={formStyles.formGroup} controlId="dob">
              <Form.Label className={`${formStyles.label} font-semi`}>{t('common:DateOfBirth')}</Form.Label>
              <Form.Control
                className={formStyles.formControl}
                type="date"
                max={getDateForOlderThanEighteen()}
                {...register('dDOB')}
              />
              {errors.dDOB && (
                <Form.Control.Feedback type="invalid" className={formStyles.invalidFeedback}>
                  {errors.dDOB.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>
          <Col lg={8} sm={12}>
            <Form.Group className={formStyles.formGroup} controlId="gender">
              <Form.Label className={`${formStyles.label} font-semi`}>{t('common:Gender')}</Form.Label>
              <div className="my-1 my-md-2">
                <Form.Check
                  inline
                  className={`${formStyles.formRadio} d-inline-flex align-items-center`}
                  type="radio"
                  name="gender"
                  id="male"
                  label={t('common:Male')}
                  value="m"
                  {...register('eGender')}
                />
                <Form.Check
                  inline
                  className={`${formStyles.formRadio} d-inline-flex align-items-center`}
                  type="radio"
                  name="gender"
                  id="female"
                  label={t('common:Female')}
                  value="f"
                  {...register('eGender')}
                />
                <Form.Check
                  inline
                  className={`${formStyles.formRadio} d-inline-flex align-items-center`}
                  type="radio"
                  name="gender"
                  id="other"
                  label={t('common:Other')}
                  value="o"
                  {...register('eGender')}
                />
              </div>
            </Form.Group>
          </Col>

          <Col lg={4} sm={6}>
            <Form.Group className={formStyles.formGroup} controlId="city">
              <Form.Label className={`${formStyles.label} font-semi`}>{t('common:City')}</Form.Label>
              <Form.Control className={formStyles.formControl} type="text" {...register('sCity', {
                pattern: { value: NO_SPECIAL_CHARACTER, message: validationErrors.noSpecialCharacters }
              })} />
              {errors.sCity && (
                <Form.Control.Feedback type="invalid" className={formStyles.invalidFeedback}>
                  {errors.sCity.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>
          <Col lg={4} sm={6}>
            <Form.Group className={formStyles.formGroup} controlId="country">
              <Form.Label className={`${formStyles.label} font-semi`}>{t('common:Country')}</Form.Label>
              <Controller
                name="sCountry"
                control={control}
                rules={{ required: validationErrors.required }}
                render={({ field: { onChange, value = [] } }) => (
                  <CustomSelect
                    value={value || values?.sCountry}
                    options={countryList}
                    labelKey="sName"
                    placeholder="Select Country"
                    valueKey="_id"
                    isLoading={loadingCountry}
                    isSearchable
                    isBottomReached={handleScrollCountry}
                    onChange={(e) => {
                      onChange(e)
                    }}
                    onInputChange={(value) => optimizedSearch(value)}
                    className={errors?.eQueryType && 'hasError'}
                    align={'end'}
                  />
                )}
              />
            </Form.Group>
          </Col>
        </Row>
        <hr className="mt-1" />
        <Row>
          <Col md={12}>
            <Form.Group className={formStyles.formGroup} controlId="bio">
              <Form.Label className={`${formStyles.label} font-semi`}>{t('common:Bio')}</Form.Label>
              <Form.Control
                className={`${formStyles.formControl} ${formStyles.formTextarea}`}
                as="textarea"
                {...register('sBio', { maxLength: { value: 250, message: validationErrors.maxLength(250) } })}
              />
              {errors.sBio && (
                <Form.Control.Feedback type="invalid" className={formStyles.invalidFeedback}>
                  {errors.sBio.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>
        </Row>
        {/* FOR PHASE 2 (social network list)
                    <hr className="mt-1" />
                    <Row>
                      <Col lg={4} sm={6}>
                        <Form.Group className={formStyles.formGroup} controlId="socialNetwork">
                          <Form.Label className={`${formStyles.label} font-semi`}>Social Network</Form.Label>
                          <Select className="react-scontrol" options={optionsFormat} classNamePrefix="custom-select" />
                        </Form.Group>
                      </Col>
                      <Col lg={4} sm={6}>
                        <Form.Group className={formStyles.formGroup} controlId="displayName">
                          <Form.Label className={`${formStyles.label} font-semi`}>Display Name</Form.Label>
                          <Form.Control className={formStyles.formControl} type="text" />
                        </Form.Group>
                      </Col>
                      <Col lg={4} sm={6}>
                        <Form.Group className={formStyles.formGroup} controlId="country">
                          <Form.Label className={`${formStyles.label} font-semi`}>Country</Form.Label>
                          <Form.Control className={formStyles.formControl} type="text" />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Button variant="link" className="text-primary xsmall-text mb-3">
                      <b className="font-semi">+ Add Social Network</b>
                    </Button> */}
        <div className={`${styles.formsBtn} mb-2`}>
          <Button className="theme-btn small-btn" type="submit" disabled={loading}>
            {t('common:Save')}
            {loading && <Spinner className="ms-2 align-middle" animation="border" size="sm" />}
          </Button>
        </div>
      </Form>
    </div>
  )
}

ProfileEditContentHelper.propTypes = {
  data: PropTypes.object
}
export default ProfileEditContentHelper
