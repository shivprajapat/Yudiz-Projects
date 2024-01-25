import { useMutation } from '@tanstack/react-query'
import axios from '../../../axios/instanceAxios'
import { setErrorFunc, setSuccessMsgFunc } from '../../../utils/helper'

export const SendOTP = async ({ mobileNumber, sType, sAuth }) => {
  return await axios.post('/gaming/user/auth/send-otp/v1', { sLogin: mobileNumber, sType, sAuth })
}

export default function useSendOTP ({ setMessage, setModalMessage }) {
  const mutationData = useMutation({
    mutationKey: ['SendOTP'],
    mutationFn: SendOTP,
    select: response => response?.data,
    onSuccess: (response) => {
      setSuccessMsgFunc(response, setMessage, setModalMessage)
    },
    onError: (error) => {
      setErrorFunc(error, setMessage, setModalMessage)
    }
  })
  return { ...mutationData }
}
