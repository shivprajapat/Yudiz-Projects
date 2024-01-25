import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import Trans from 'next-translate/Trans'
import { Button, Form, Spinner } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { useContext } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'

import { EMAIL, ONLY_NUMBER, TOAST_TYPE, URL_REGEX } from '@shared/constants'
import { INSERT_FEEDBACK } from '@graphql/feedback/feedback.mutation'
import { validationErrors } from '@shared/constants/ValidationErrors'
import ToastrContext from '@shared/components/toastr/ToastrContext'
import formStyles from '@assets/scss/components/form.module.scss'

const CustomSelect = dynamic(() => import('@shared/components/customSelect'))
const CustomFormGroup = dynamic(() => import('@shared/components/customForm/customFormGroup'))
const CustomInput = dynamic(() => import('@shared/components/customForm/customInput'))
const CustomFeedback = dynamic(() => import('@shared/components/customForm/customFeedback'))

function FeedBackForm({ typeOfFeedback }) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors }
  } = useForm({ mode: 'onTouched' })
  const { dispatch } = useContext(ToastrContext)
  const router = useRouter()

  const [insertFeedback, { loading }] = useMutation(INSERT_FEEDBACK, {
    onCompleted: (data) => {
      if (data && data.insertFeedback) {
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.insertFeedback.sMessage, type: TOAST_TYPE.Success }
        })
        router.push('/')
      }
    }
  })

  function onSubmit(formData) {
    const data = { ...formData, eQueryType: formData.eQueryType.sValue }
    insertFeedback({ variables: { input: { feedbackInput: data } } })
  }
  return (
    <Form autoComplete="off" className="m-2 m-md-3" onSubmit={handleSubmit(onSubmit)}>
      <div className='row'>
        <div className='col-md-6'>
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
        </div>
        <div className='col-md-6'>
          <CustomFormGroup className={`${formStyles.formGroup}`} controlId="sEmail">
            <Form.Label className={`${formStyles.label}`}>
              <Trans i18nKey="common:EmailAddress" />*
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
        </div>
        <div className='col-md-6'>
          <CustomFormGroup className={`${formStyles.formGroup}`} controlId="sPhone">
            <Form.Label className={`${formStyles.label}`}>
              <Trans i18nKey="common:PhoneNo" />
            </Form.Label>
            <CustomInput
              className={`${formStyles.formControl} ${errors.sPhone && formStyles.hasError}`}
              type="number"
              name="sPhone"
              register={register('sPhone', {
                pattern: { value: ONLY_NUMBER, message: validationErrors.number },
                maxLength: { value: 10, message: validationErrors.number },
                minLength: { value: 10, message: validationErrors.number }
              })}
            />
            {errors.sPhone && (
              <CustomFeedback message={errors.sPhone.message} type="invalid" className={`${formStyles.invalidFeedback}`} />
            )}
          </CustomFormGroup>
        </div>
        <div className='col-md-6'>
          <CustomFormGroup className={`${formStyles.formGroup}`} controlId="query">
            <Form.Label className={`${formStyles.label}`}>
              <Trans i18nKey="common:Category" />*
            </Form.Label>
            <Controller
              name="eQueryType"
              control={control}
              rules={{ required: validationErrors.required }}
              render={({ field: { onChange, value = [] } }) => (
                <CustomSelect
                  options={typeOfFeedback}
                  labelKey="sLabel"
                  valueKey="sValue"
                  placeholder="Select Feedback"
                  onChange={onChange}
                  className={errors?.eQueryType && 'hasError'}
                  isNative
                  align={'end'}
                />
              )}
            />
            {errors.eQueryType && (
              <CustomFeedback message={errors.eQueryType.message} type="invalid" className={`${formStyles.invalidFeedback}`} />
            )}
          </CustomFormGroup>
        </div>
        <div className='col-md-12'>
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
        </div>
        <div className='col-md-12'>
          <CustomFormGroup className={`${formStyles.formGroup}`} controlId="sPageLink">
            <Form.Label className={`${formStyles.label}`}>
              <Trans i18nKey="common:PageLink" />
            </Form.Label>
            <CustomInput
              className={`${formStyles.formControl} ${errors.sPageLink && formStyles.hasError}`}
              type="text"
              name="sPageLink"
              register={register('sPageLink', {
                pattern: { value: URL_REGEX, message: validationErrors.url }
              })}
            />
            {errors.sPageLink && (
              <CustomFeedback message={errors.sPageLink.message} type="invalid" className={`${formStyles.invalidFeedback}`} />
            )}
          </CustomFormGroup>
        </div>
        <div className='col-md-12'>
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
        </div>
      </div>
      <Button className="theme-btn" variant="primary" type="submit" disabled={loading}>
        <Trans i18nKey="common:Submit" />
        {loading && <Spinner className="ms-2 align-middle" animation="border" />}
      </Button>
    </Form>
  )
}
FeedBackForm.propTypes = {
  typeOfFeedback: PropTypes.array
}
export default FeedBackForm
