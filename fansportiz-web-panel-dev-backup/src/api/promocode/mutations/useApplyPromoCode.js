import { useMutation } from '@tanstack/react-query'
import axios from '../../../axios/instanceAxios'
import { setErrorFunc } from '../../../utils/helper'

export const ApplyPromoCode = async ({ nAmount, sPromo }) => {
  return await axios.post('/gaming/user/promocode/check/v1', { nAmount, sPromo })
}

export default function useApplyPromoCode ({ setMessage, setAlert, clearPromo }) {
  const mutationData = useMutation({
    mutationKey: ['ApplyPromoCode'],
    mutationFn: ApplyPromoCode,
    select: response => response?.data,
    onError: (error) => {
      clearPromo()
      setErrorFunc(error, setMessage, setAlert)
    }
  })
  return { ...mutationData }
}
