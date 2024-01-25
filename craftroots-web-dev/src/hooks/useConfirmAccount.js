import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import useAsync from '@/hooks/useAsync'
import { AccountConfirmWithToken } from '@/queries/authQueries'
import { request } from '@/services/api.service'
import { setToastDataAction } from '@/actions/toastAction'
import { STORAGE_KEYS } from '@/helper/constant'
import { setCookie } from '@/helper'

const useConfirmAccount = () => {
  const router = useRouter()
  const { id, key } = router.query
  const dispatch = useDispatch()

  const accountConfirmWithTokenResult = useAsync(null, null)

  const mutationAccountConfirmWithToken = (id, key) => {
    const parsedId = parseInt(id)
    accountConfirmWithTokenResult.run(request, {
      ...AccountConfirmWithToken,
      variables: { id: parsedId, key: key },
    })
  }

  useEffect(() => {
    if (id && key) {
      mutationAccountConfirmWithToken(id, key)
    }
  }, [id, key])

  useEffect(() => {
    if (accountConfirmWithTokenResult?.state?.isSuccess) {
      const accountConfirmWithTokenData =
        accountConfirmWithTokenResult?.state?.data

      if (Object.keys(accountConfirmWithTokenData).length) {
        const message =
          accountConfirmWithTokenData?.accountConfirmation?.message
        dispatch(
          setToastDataAction({
            show: true,
            error: !accountConfirmWithTokenData.accountConfirmation.success,
            message,
          })
        )
        if (accountConfirmWithTokenData?.accountConfirmation.success) {
          const token = accountConfirmWithTokenData?.accountConfirmation?.token
          setCookie(STORAGE_KEYS.token, token)
          window.location.href = window.location.origin
        }
      }
    }
  }, [accountConfirmWithTokenResult?.state?.isSuccess])

  return {
    loading: accountConfirmWithTokenResult?.state?.isLoading,
  }
}

export default useConfirmAccount
