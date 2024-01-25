import React, { useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { Input, TextArea, Button } from '@/components/generic'
import {
  emailRegex,
  nameRegex,
  phoneRegex,
  textAreaRegex,
  trimString,
} from '@/helper'
import { AssistanceFormData } from '@/queries/footerQueries'
import { request } from '@/services/api.service'
import { setToastDataAction } from '@/actions/toastAction'
import useAsync from '@/hooks/useAsync'

function AssistanceForm() {
  const dispatch = useDispatch()
  const assistanceRes = useAsync(null, null)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const onSubmit = (data) => {
    assistanceRes.run(request, {
      ...AssistanceFormData,
      variables: {
        name: trimString(data.name),
        email: trimString(data.email),
        telephone: trimString(data.phone),
        message: data.message,
      },
    })
  }

  useEffect(() => {
    if (assistanceRes.state.data && !assistanceRes.state.isLoading) {
      reset()
      dispatch(
        setToastDataAction({
          show: true,
          message: assistanceRes.state.data?.assistanceForm?.message,
        })
      )
    }
  }, [assistanceRes.state.data])

  const intl = useIntl()
  return (
    <div>
      <h6 className="footer-heading">
        {intl.formatMessage({ id: 'footer.assistanceForm.title' })}
      </h6>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <Input
            placeholder={
              intl.formatMessage({
                id: 'form.fullName.placeHolder',
              }) + '*'
            }
            name="name"
            type="text"
            register={register}
            required
            validation={{
              pattern: {
                value: nameRegex,
                message: `${intl.formatMessage({
                  id: 'form.name.errorMessage',
                })}`,
              },
            }}
            errors={errors}
            disabled={assistanceRes.state.isLoading}
          />
        </div>
        <div className="form-group">
          <Input
            placeholder={
              intl.formatMessage({
                id: 'form.email.placeHolder',
              }) + '*'
            }
            name="email"
            type="email"
            register={register}
            required
            errors={errors}
            disabled={assistanceRes.state.isLoading}
            validation={{
              pattern: {
                value: emailRegex,
                message: `${intl.formatMessage({
                  id: 'form.email.errorMessage',
                })}`,
              },
            }}
          />
        </div>
        <div className="form-group">
          <Input
            placeholder={
              intl.formatMessage({
                id: 'form.phoneNumber.placeHolder',
              }) + '*'
            }
            name="phone"
            type="text"
            register={register}
            disabled={assistanceRes.state.isLoading}
            required
            validation={{
              pattern: {
                value: phoneRegex,
                message: `${intl.formatMessage({
                  id: 'form.phoneNumber.errorMessage',
                })}`,
              },
            }}
            errors={errors}
          />
        </div>
        <div className="form-group">
          <TextArea
            placeholder={
              intl.formatMessage({
                id: 'form.textArea.placeHolder',
              }) + '*'
            }
            name="message"
            type="text"
            register={register}
            required
            disabled={assistanceRes.state.isLoading}
            validation={{
              pattern: {
                value: textAreaRegex,
                message: `${intl.formatMessage({
                  id: 'form.maxTextAreaCharacters.errorMessage',
                })}`,
              },
            }}
            errors={errors}
          />
        </div>
        <Button
          title={intl.formatMessage({
            id: 'button.submit',
          })}
          type="submit"
          btnLoader={assistanceRes.state.isLoading}
          disabled={assistanceRes.state.isLoading}
        />
      </form>
    </div>
  )
}

export default AssistanceForm
