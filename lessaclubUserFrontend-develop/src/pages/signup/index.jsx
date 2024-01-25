import React, { useEffect, useState } from 'react'
import { Col, Form, Row, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'

import { allRoutes } from 'shared/constants/allRoutes'
import { validationErrors } from 'shared/constants/validationErrors'
import { registerUser } from 'modules/auth/redux/service'
import { EMAIL } from 'shared/constants'
import CommonModal from 'shared/components/common-modal'
import { checkBallIcon, modalMailIcon } from 'assets/images'
import { getQueryVariable } from 'shared/utils'
import ResendRegisterModal from 'pages/login/resend-register/ResendRegisterModal'

const Signup = () => {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showResendEmailSuccess, setShowResendEmailSuccess] = useState(false)

  const referralCodeFromURL = getQueryVariable('referralCode')
  const resMessage = useSelector((state) => state.auth.resMessage)
  const resStatus = useSelector((state) => state.auth.resStatus)

  useEffect(() => {
    if (!resStatus && resMessage) {
      setLoading(false)
    }
  }, [resMessage, resStatus])

  const dispatch = useDispatch()
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
    watch
  } = useForm({ mode: 'onTouched' })

  useEffect(() => {
    if (referralCodeFromURL) {
      setValue('referralCode', referralCodeFromURL)
    }
  }, [])

  const termsAndConditions = watch('isTermsAccepted')

  const onSubmit = (payload) => {
    setLoading(true)
    dispatch(
      registerUser(payload, () => {
        setShow(true)
      })
    )
  }
  const labels = {
    firstName: useIntl().formatMessage({ id: 'firstName' }),
    enterFirstName: useIntl().formatMessage({ id: 'enterYourFirstName' }),
    lastName: useIntl().formatMessage({ id: 'lastName' }),
    enterLastName: useIntl().formatMessage({ id: 'enterYourLastName' }),
    emailId: useIntl().formatMessage({ id: 'emailId' }),
    enterEmailId: useIntl().formatMessage({ id: 'enterYourEmailId' }),
    referralCode: useIntl().formatMessage({ id: 'referralCode' }),
    enterReferralCode: useIntl().formatMessage({ id: 'enterReferralCode' })
  }

  const resendRegCreateModal = () => {
    setShowModal((prev) => !prev)
  }

  return (
    <>
      {showResendEmailSuccess && (
        <CommonModal
          show={showResendEmailSuccess}
          icon={checkBallIcon}
          titleId="resendMailSuccessfully"
          btnTxtId="backToHome"
          btnLink={allRoutes.home}
          background
        />
      )}
      {show && (
        <CommonModal
          show={show}
          icon={modalMailIcon}
          topTitleId="checkYourMail"
          topDescId="WeHaveSentLinkToThe"
          btnTxtId="backToHome"
          btnLink={allRoutes.home}
          isForSignup
          data={{ mail: getValues()?.email, link: '/' }}
        />
      )}
      <div>
        <h5>
          <FormattedMessage id="signupToNuuway" />
        </h5>
        <p>
          <FormattedMessage id="EnterTheFormBelowToCreateANuuwayAccountForYourself" />.
        </p>
        <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
          <Form.Group as={Row} className="form-group">
            <Col xl={6} className="mb-4 mb-xl-0">
              <Form.Group className="form-group">
                <Form.Label>{labels.firstName}*</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={labels.enterFirstName}
                  className={errors.firstName && 'error'}
                  {...register('firstName', {
                    required: validationErrors.required
                  })}
                />
                {errors.firstName && (
                  <Form.Control.Feedback type="invalid" className="invalidFeedback">
                    {errors.firstName.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
            <Col xl={6}>
              <Form.Group className="form-group">
                <Form.Label>{labels.lastName}*</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={labels.enterLastName}
                  className={errors.lastName && 'error'}
                  {...register('lastName', {
                    required: validationErrors.required
                  })}
                />
                {errors.lastName && (
                  <Form.Control.Feedback type="invalid" className="invalidFeedback">
                    {errors.lastName.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label>{labels.emailId}</Form.Label>
            <Form.Control
              type="email"
              placeholder={labels.enterEmailId}
              className={errors.email && 'error'}
              {...register('email', {
                required: validationErrors.required,
                maxLength: {
                  value: 50,
                  message: validationErrors.maxLength(50)
                },
                pattern: {
                  value: EMAIL,
                  message: validationErrors.email
                },
                validate: (value) => setValue('email', value.toLowerCase())
              })}
            />
            {errors.email && (
              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                {errors.email.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label>{labels.referralCode}</Form.Label>
            <Form.Control type="text" placeholder={labels.enterReferralCode} {...register('referralCode')} />
          </Form.Group>
          <Form.Group className="form-group d-flex mb-0">
            <Form.Check.Input className="flex-shrink-0" type="checkbox" {...register('isTermsAccepted')} />
            <Form.Check.Label>
              <FormattedMessage id="iAgreeToPlatforms" />
              <Link to={allRoutes.termsAndConditions}>
                <FormattedMessage id="termsOfService" />
              </Link>{' '}
              <FormattedMessage id="and" />
              <Link to={allRoutes.privacyPolicy}>
                <FormattedMessage id="privacyPolicy" />
              </Link>
            </Form.Check.Label>
          </Form.Group>
          <Form.Group className="form-group d-flex">
            <Form.Check.Input className="flex-shrink-0" type="checkbox" {...register('isMarketing')} />
            <Form.Check.Label>
              <FormattedMessage id="iConsentToMarketing" />
            </Form.Check.Label>
          </Form.Group>

          <Button className="white-btn" type="submit" disabled={!termsAndConditions || loading}>
            <FormattedMessage id="submit" />
          </Button>
        </Form>
        <p className="end-text text-center">
          <FormattedMessage id="alreadyHaveAnAccount" />?{' '}
          <Link to={allRoutes.login}>
            <FormattedMessage id="login" />
          </Link>
        </p>

        <p className="text-center end-text resend-reg-mail">
          Didn&apos;t recieve mail? <Link onClick={() => setShowModal(true)}>Send again</Link>
        </p>

        <ResendRegisterModal
          title={'Resend Registration Mail'}
          show={showModal}
          handleClose={resendRegCreateModal}
          setShowResendEmailSuccess={setShowResendEmailSuccess}
        />
      </div>
    </>
  )
}

export default Signup
