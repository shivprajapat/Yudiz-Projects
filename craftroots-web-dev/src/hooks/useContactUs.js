import { useDispatch } from 'react-redux'
import { useIntl } from 'react-intl'
import { setToastDataAction } from '@/actions/toastAction'
import { trimString } from '@/helper'

export default function useContactUs(reset) {
  const dispatch = useDispatch()
  const intl = useIntl()

  async function submitHandler(data) {
    const formData = new FormData()
    formData.append('name', trimString(data?.name))
    formData.append('email', trimString(data?.email))
    // formData.append('message', data?.message)
    try {
      const response = await fetch(
        `https://api.nextel.io/WEBHOOK_V1/Audience/set/${process.env.NEXT_PUBLIC_NEXTEL_KEY_ID}`,
        {
          method: 'POST',
          body: formData,
        }
      )
      const result = await response.json()
      if (result) {
        dispatch(
          setToastDataAction({
            show: true,
            message: result?.message,
          })
        )
        reset()
      }
    } catch (error) {
      dispatch(
        setToastDataAction({
          show: true,
          message: intl.formatMessage({
            id: 'somethingWentWrong',
          }),
          error: true,
        })
      )
      console.log('error', error)
    }
  }
  return {
    submitHandler,
  }
}
