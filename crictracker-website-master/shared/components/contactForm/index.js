import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap'
import dynamic from 'next/dynamic'
import { EMAIL, ONLY_NUMBER, TOAST_TYPE } from '@shared/constants'
import { Controller, useForm } from 'react-hook-form'

import ToastrContext from '@shared/components/toastr/ToastrContext'
import formStyles from '@assets/scss/components/form.module.scss'
import { useMutation } from '@apollo/client'
import { INSERT_CONTACT } from '@graphql/cms/cms.query'
import { validationErrors } from '@shared/constants/ValidationErrors'
import { useRouter } from 'next/router'

const CustomSelect = dynamic(() => import('@shared/components/customSelect'))
const CustomFormGroup = dynamic(() => import('@shared/components/customForm/customFormGroup'))
const CustomInput = dynamic(() => import('@shared/components/customForm/customInput'))
const CustomFeedback = dynamic(() => import('@shared/components/customForm/customFeedback'))

function ContactForm({ typeOfQuery }) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors }
  } = useForm({ mode: 'onTouched' })
  const router = useRouter()
  const { dispatch } = useContext(ToastrContext)

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
    <Form autoComplete="off" className="m-2 m-md-3" onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col md={6}>
          <CustomFormGroup className={`${formStyles.formGroup}`} controlId="sName">
            <Form.Label className={`${formStyles.label}`}>
              <Trans i18nKey="common:FullName" />*
            </Form.Label>
            <CustomInput
              className={`${formStyles.formControl} ${errors.sName && formStyles.hasError}`}
              type="text"
              name="sName"
              register={register('sName', {
                required: validationErrors.required
              })}
            />
            {errors.sName && (
              <CustomFeedback message={errors.sName.message} type="invalid" className={`${formStyles.invalidFeedback}`} />
            )}
          </CustomFormGroup>
        </Col>
        <Col md={6}>
          <CustomFormGroup className={`${formStyles.formGroup}`} controlId="sEmail">
            <Form.Label className={`${formStyles.label}`}>
              <Trans i18nKey="common:Email" />*
            </Form.Label>
            <CustomInput
              className={`${formStyles.formControl} ${errors.sEmail && formStyles.hasError}`}
              type="text"
              name="sEmail"
              register={register('sEmail', {
                required: validationErrors.required,
                pattern: { value: EMAIL, message: validationErrors.email },
                validate: (value) => setValue('sEmail', value.toLowerCase())
              })}
            />
            {errors.sEmail && (
              <CustomFeedback message={errors.sEmail.message} type="invalid" className={`${formStyles.invalidFeedback}`} />
            )}
          </CustomFormGroup>
        </Col>
        <Col md={6}>
          <CustomFormGroup className={`${formStyles.formGroup}`} controlId="sPhone">
            <Form.Label className={`${formStyles.label}`}>
              <Trans i18nKey="common:PhoneNo" />*
            </Form.Label>
            <CustomInput
              className={`${formStyles.formControl} ${errors.sPhone && formStyles.hasError}`}
              type="number"
              name="sPhone"
              onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
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
        <Col md={6}>
          <CustomFormGroup className={`${formStyles.formGroup}`} controlId="company">
            <Form.Label className={`${formStyles.label}`}>
              <Trans i18nKey="common:Company" />
            </Form.Label>
            <CustomInput className={`${formStyles.formControl}`} type="text" name="company" register={register('sCompany')} />
          </CustomFormGroup>
        </Col>
        <Col md={6}>
          <CustomFormGroup className={`${formStyles.formGroup}`} controlId="city">
            <Form.Label className={`${formStyles.label}`}>
              <Trans i18nKey="common:City" />
            </Form.Label>
            <CustomInput className={`${formStyles.formControl}`} type="text" name="city" register={register('sCity')} />
          </CustomFormGroup>
        </Col>
        <Col md={6}>
          <CustomFormGroup className={`${formStyles.formGroup}`} controlId="query">
            <Form.Label className={`${formStyles.label}`}>
              <Trans i18nKey="common:TypeOfQuery" />*
            </Form.Label>
            <Controller
              name="eQueryType"
              control={control}
              rules={{ required: validationErrors.required }}
              render={({ field: { onChange, value = [] } }) => (
                <CustomSelect
                  options={typeOfQuery}
                  labelKey="sLabel"
                  valueKey="sValue"
                  placeholder="Select Query"
                  onChange={onChange}
                  name="eQueryType"
                  className={errors?.eQueryType && 'hasError'}
                  align={'end'}
                  isNative
                />
              )}
            />
            {errors.eQueryType && (
              <CustomFeedback message={errors.eQueryType.message} type="invalid" className={`${formStyles.invalidFeedback}`} />
            )}
          </CustomFormGroup>
        </Col>
        <Col md={12}>
          <CustomFormGroup className={`${formStyles.formGroup}`} controlId="sSubject">
            <Form.Label className={`${formStyles.label}`}>
              <Trans i18nKey="common:Subject" />*
            </Form.Label>
            <CustomInput
              className={`${formStyles.formControl} ${errors.sSubject && formStyles.hasError}`}
              type="text"
              name="sSubject"
              register={register('sSubject', {
                required: validationErrors.required
              })}
            />
            {errors.sSubject && (
              <CustomFeedback message={errors.sSubject.message} type="invalid" className={`${formStyles.invalidFeedback}`} />
            )}
          </CustomFormGroup>
        </Col>
        <Col md={12}>
          <CustomFormGroup className={`${formStyles.formGroup}`} controlId="sMessage">
            <Form.Label className={`${formStyles.label}`}>
              <Trans i18nKey="common:Message" />*
            </Form.Label>
            <CustomInput
              className={`${formStyles.formControl} ${formStyles.formTextarea} ${errors.sMessage && formStyles.hasError}`}
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
      <Button className="theme-btn" variant="primary" type="submit" disabled={loading}>
        <Trans i18nKey="common:Submit" />
        {loading && <Spinner className="ms-2 align-middle" animation="border" />}
      </Button>
    </Form>
  )
}

ContactForm.propTypes = {
  typeOfQuery: PropTypes.array
}
export default ContactForm
