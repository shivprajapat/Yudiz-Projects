import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useIntl } from 'react-intl'
import useAsync from './useAsync'
import { request } from '@/services/api.service'
import { setToastDataAction, showToastAction } from '@/actions/toastAction'
import { AccountConfirmationLink } from '@/queries/authQueries'

const useConfirmEmailAddress = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm()

  const dispatch = useDispatch()

  const intl = useIntl()
  const confirmEmailAddressResult = useAsync(null, null)

  const onSubmit = async (data) => {
    mutationConfirmEmailAddressData(data)
  }
  const mutationConfirmEmailAddressData = (data) => {
    try {
      confirmEmailAddressResult.run(request, {
        ...AccountConfirmationLink,
        variables: { email: data.email },
      })
    } catch (error) {}
  }

  useEffect(() => {
    const confirmEmailAddressData = confirmEmailAddressResult.state.data

    if (Object.keys(confirmEmailAddressData).length) {
      const message = confirmEmailAddressData?.accountConfirmationLink?.message
      dispatch(showToastAction(true))
      dispatch(
        setToastDataAction({
          show: true,
          message,
          error:
            confirmEmailAddressData.accountConfirmationLink.success === false
              ? true
              : false,
        })
      )
    }
  }, [confirmEmailAddressResult.state?.data])

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    intl,
    setValue,
    confirmEmailAddressResult,
  }
}

export default useConfirmEmailAddress
