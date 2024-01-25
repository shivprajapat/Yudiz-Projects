import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { useDispatch } from 'react-redux'
import useAsync from './useAsync'
import { request } from '@/services/api.service'
import { ForgetPassword } from '@/queries/authQueries'
import { setToastDataAction } from '@/actions/toastAction'
import { trimString } from '@/helper'

const useForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const intl = useIntl()
  const forgotPasswordResult = useAsync(null, null)
  const dispatch = useDispatch()

  const onSubmit = (data) => {
    forgotPasswordResult.run(request, {
      ...ForgetPassword,
      variables: { email: trimString(data.email) },
    })
  }

  useEffect(() => {
    if (forgotPasswordResult.state.isSuccess) {
      const message =
        forgotPasswordResult?.state?.data?.requestPasswordResetEmail?.message
      dispatch(setToastDataAction({ show: true, message }))
    }
  }, [forgotPasswordResult.state.isSuccess])

  return {
    register,
    handleSubmit,
    errors,
    intl,
    onSubmit,
    forgotPasswordResult,
  }
}

export default useForgotPassword
