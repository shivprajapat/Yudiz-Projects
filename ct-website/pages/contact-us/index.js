import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap'
import Trans from 'next-translate/Trans'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import styles from './style.module.scss'
import formStyles from '@assets/scss/components/form.module.scss'
import Layout from '@shared-components/layout'
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TelegramIcon,
  TwitterIcon,
  YoutubeIcon,
  MailIcon
} from '@shared-components/ctIcons'
import {
  FACEBOOK_URL,
  TELEGRAM_URL,
  LINKEDIN_URL,
  INSTAGRAM_URL,
  TWITTER_URL,
  YOUTUBE_URL,
  TOAST_TYPE,
  EMAIL,
  ONLY_NUMBER
} from '@shared/constants'
import { validationErrors } from '@shared/constants/ValidationErrors'
import { GET_CONTACT_QUERY_TYPE, INSERT_CONTACT } from '@graphql/cms/cms.query'
import { ToastrContext } from '@shared/components/toastr'
import queryGraphql from '@shared/components/queryGraphql'
import { GET_ARTICLE_ID } from '@graphql/article/article.query'
import Error from '@shared/components/error'
import CustomSelect from '@shared/components/customSelect'
import { checkRedirectionStatus, handleApiError } from '@shared/utils'

const ContactUs = ({ seoData }) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors }
  } = useForm({ mode: 'onTouched' })
  const { dispatch } = useContext(ToastrContext)
  const router = useRouter()
  const [typeOfQueryOptions, setTypeOfQueryOptions] = useState()

  useQuery(GET_CONTACT_QUERY_TYPE, {
    onCompleted: (data) => {
      if (data && data.getContactQueryType) {
        setTypeOfQueryOptions(data.getContactQueryType)
      }
    }
  })

  const [insertContact, { loading }] = useMutation(INSERT_CONTACT, {
    onCompleted: (data) => {
      if (data && data.insertContact) {
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.insertContact.sMessage, type: TOAST_TYPE.Success }
        })
        router.push('/')
      }
    }
  })

  function onSubmit(formData) {
    const data = { ...formData, eQueryType: formData.eQueryType.sValue }
    insertContact({ variables: { input: { contactInput: data } } })
  }

  return (
    <Layout data={{ oSeo: seoData }}>
      <section className={`${styles.bannerSection}`}>
        <Container>
          <div className={`${styles.content} text-light`}>
            <h1 className="mb-2 font-semi">
              <Trans i18nKey="common:ContactUs" />
            </h1>
            <p>
              <Trans i18nKey="common:ContactInfo" />
            </p>
          </div>
        </Container>
      </section>
      <section className={`${styles.formBlock}`}>
        <Container>
          <Row>
            <Col lg={8} xxl={9}>
              <div className="common-box">
                <Form autoComplete="off" className="m-2 m-md-3" onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className={`${formStyles.formGroup}`} controlId="sName">
                        <Form.Label className={`${formStyles.label}`}>
                          <Trans i18nKey="common:FullName" />*
                        </Form.Label>
                        <Form.Control
                          className={`${formStyles.formControl} ${errors.sName && formStyles.hasError}`}
                          type="text"
                          name="sName"
                          {...register('sName', { required: validationErrors.required })}
                        />
                        {errors.sName && (
                          <Form.Control.Feedback type="invalid" className={`${formStyles.invalidFeedback}`}>
                            {errors.sName.message}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className={`${formStyles.formGroup}`} controlId="sEmail">
                        <Form.Label className={`${formStyles.label}`}>
                          <Trans i18nKey="common:Email" />*
                        </Form.Label>
                        <Form.Control
                          className={`${formStyles.formControl} ${errors.sEmail && formStyles.hasError}`}
                          type="text"
                          name="sEmail"
                          {...register('sEmail', {
                            required: validationErrors.required,
                            pattern: { value: EMAIL, message: validationErrors.email },
                            validate: (value) => setValue('sEmail', value.toLowerCase())
                          })}
                        />
                        {errors.sEmail && (
                          <Form.Control.Feedback type="invalid" className={`${formStyles.invalidFeedback}`}>
                            {errors.sEmail.message}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className={`${formStyles.formGroup}`} controlId="sPhone">
                        <Form.Label className={`${formStyles.label}`}>
                          <Trans i18nKey="common:PhoneNo" />*
                        </Form.Label>
                        <Form.Control
                          className={`${formStyles.formControl} ${errors.sPhone && formStyles.hasError}`}
                          type="number"
                          name="sPhone"
                          onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
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
                    <Col md={6}>
                      <Form.Group className={`${formStyles.formGroup}`} controlId="company">
                        <Form.Label className={`${formStyles.label}`}>
                          <Trans i18nKey="common:Company" />
                        </Form.Label>
                        <Form.Control className={`${formStyles.formControl}`} type="text" name="company" {...register('sCompany')} />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className={`${formStyles.formGroup}`} controlId="city">
                        <Form.Label className={`${formStyles.label}`}>
                          <Trans i18nKey="common:City" />
                        </Form.Label>
                        <Form.Control className={`${formStyles.formControl}`} type="text" name="city" {...register('sCity')} />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className={`${formStyles.formGroup}`} controlId="query">
                        <Form.Label className={`${formStyles.label}`}>
                          <Trans i18nKey="common:TypeOfQuery" />*
                        </Form.Label>
                        <Controller
                          name="eQueryType"
                          control={control}
                          rules={{ required: validationErrors.required }}
                          render={({ field: { onChange, value = [] } }) => (
                            <CustomSelect
                              options={typeOfQueryOptions}
                              labelKey="sLabel"
                              valueKey="sValue"
                              placeholder="Select Query"
                              onChange={onChange}
                              className={errors?.eQueryType && 'hasError'}
                              align={'end'}
                            />
                          )}
                        />
                        {errors.eQueryType && (
                          <Form.Control.Feedback type="invalid" className={`${formStyles.invalidFeedback}`}>
                            {errors.eQueryType.message}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group className={`${formStyles.formGroup}`} controlId="sSubject">
                        <Form.Label className={`${formStyles.label}`}>
                          <Trans i18nKey="common:Subject" />*
                        </Form.Label>
                        <Form.Control
                          className={`${formStyles.formControl} ${errors.sSubject && formStyles.hasError}`}
                          type="text"
                          name="sSubject"
                          {...register('sSubject', { required: validationErrors.required })}
                        />
                        {errors.sSubject && (
                          <Form.Control.Feedback type="invalid" className={`${formStyles.invalidFeedback}`}>
                            {errors.sSubject.message}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group className={`${formStyles.formGroup}`} controlId="sMessage">
                        <Form.Label className={`${formStyles.label}`}>
                          <Trans i18nKey="common:Message" />*
                        </Form.Label>
                        <Form.Control
                          className={`${formStyles.formControl} ${formStyles.formTextarea} ${errors.sMessage && formStyles.hasError}`}
                          as="textarea"
                          name="sMessage"
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
                  <Button className="theme-btn" variant="primary" type="submit" disabled={loading}>
                    <Trans i18nKey="common:Submit" />
                    {loading && <Spinner className="ms-2 align-middle" animation="border" size="sm" />}
                  </Button>
                </Form>
              </div>
            </Col>
            <Col lg={4} xxl={3}>
              <div className="common-box">
                <h4 className="text-uppercase">
                  <Trans i18nKey="common:ContactInformation" />
                </h4>
                <div className={`${styles.contactInfo} mb-3`}>
                  {/* <p className="d-flex">
                    <span className="d-block me-2">
                      <PasswordPhoneIcon />
                    </span>
                    <Link href="tel:08040990778">
                      <a>080-40990778</a>
                    </Link>
                  </p> */}
                  <p className="d-flex">
                    <span className="d-block me-2">
                      <MailIcon />
                    </span>
                    <Link href="mailto:contact@crictracker.com">
                      <a>contact@crictracker.com</a>
                    </Link>
                  </p>
                </div>
                <ul className={`${styles.socialMenu} d-flex text-uppercase align-items-center`}>
                  <li>
                    <a href={FACEBOOK_URL} target="_blank" rel="noreferrer">
                      <FacebookIcon />
                    </a>
                  </li>
                  <li>
                    <a href={TWITTER_URL} target="_blank" rel="noreferrer">
                      <TwitterIcon />
                    </a>
                  </li>
                  <li>
                    <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
                      <InstagramIcon />
                    </a>
                  </li>
                  <li>
                    <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
                      <LinkedinIcon />
                    </a>
                  </li>
                  <li>
                    <a href={YOUTUBE_URL} target="_blank" rel="noreferrer">
                      <YoutubeIcon />
                    </a>
                  </li>
                  <li>
                    <a href={TELEGRAM_URL} target="_blank" rel="noreferrer">
                      <TelegramIcon />
                    </a>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Layout>
  )
}
ContactUs.propTypes = {
  seoData: PropTypes.object
}
export default Error(ContactUs)

export async function getServerSideProps({ res, resolvedUrl }) {
  try {
    res.setHeader('Cache-Control', 'public, max-age=420')
    const { data: seoData } = await queryGraphql(GET_ARTICLE_ID, { input: { sSlug: resolvedUrl.replaceAll('/', '') || '' } })
    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = checkRedirectionStatus(seoData?.getSeoData)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj
    return {
      props: {
        seoData: seoData?.getSeoData
      }
    }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    const status = handleApiError(e)
    return status
  }
}
