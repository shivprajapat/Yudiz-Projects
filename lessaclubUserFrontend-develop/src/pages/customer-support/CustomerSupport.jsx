/* eslint-disable react/prop-types */
import { createCustomerSupport } from 'modules/customer-support/redux/service'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import React, { useEffect } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { GlobalEventsContext } from 'shared/components/global-events'
import { EMAIL, TOAST_TYPE } from 'shared/constants'
import { validationErrors } from 'shared/constants/validationErrors'
import './style.scss'

const CustomerSupport = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({ mode: 'all' })

  const {
    state: { profileData }
  } = React.useContext(GlobalEventsContext)

  useEffect(() => {
    setValue('email', profileData?.email || '')
  }, [profileData])

  const dispatch = useDispatch()

  const onSubmit = async (data) => {
    const payload = {
      name: `${profileData?.firstName} ${profileData?.lastName}`,
      email: data.email,
      question: data.question
    }
    const response = await createCustomerSupport(payload)
    if (response) {
      reset({ question: '', email: profileData?.email || '' })
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: response?.data?.message,
          type: TOAST_TYPE.Success
        }
      })
    }
  }

  return (
    <section className="customer-support">
      <Container>
        <div className="heading">
          <h3>Customer Support</h3>
        </div>
        <div className="customer-support-form py-4 mb-4">
          <Form autoComplete="off" className='w-100' onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="form-group w-25">
              <Form.Label>Email*</Form.Label>
              <Form.Control
                name="email"
                className={errors.email && 'error'}
                {...register('email', {
                  required: validationErrors.required,
                  pattern: {
                    value: EMAIL,
                    message: validationErrors.email
                  }
                })}
              />
              {errors.email && (
                <Form.Control.Feedback type="invalid" className="invalidFeedback">
                  {errors.email.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group className="form-group">
              <Form.Label>Let us know what you have to say, we will reach out to you in email*</Form.Label>
              <Form.Control
                type="text"
                as="textarea"
                rows={3}
                name="question"
                className={errors.question && 'error'}
                {...register('question', {
                  required: validationErrors.required,
                  maxLength: { value: 500, message: validationErrors.maxLength(500) }
                })}
              />
              {errors.question && (
                <Form.Control.Feedback type="invalid" className="invalidFeedback">
                  {errors.question.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group className="d-flex justify-content-end">
              <Button className="white-btn" type="submit">
                <FormattedMessage id="submit" />
              </Button>
            </Form.Group>
          </Form>
        </div>
      </Container>
    </section>
  )
}

export default CustomerSupport
