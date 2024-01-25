import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axios from '../../../axios/instanceAxios'
import { setErrorFunc } from '../../../utils/helper'

export const VerifyOTP = async ({ mobileNumber, sType, sAuth, sCode, ID, FirebaseToken }) => {
  return await axios.post('/gaming/user/auth/verify-otp/v2', {
    sLogin: mobileNumber, sType, sAuth, sCode, sDeviceId: ID, sPushToken: FirebaseToken
  })
}

export default function useVerifyOTP ({ setMessage, setModalMessage, authType, Mutation, userData }) {
  const navigate = useNavigate()
  const mutationData = useMutation({
    mutationKey: ['VerifyOTP'],
    mutationFn: VerifyOTP,
    select: response => response?.data,
    onSuccess: () => {
      if (authType === 'R') Mutation(userData)
      else if (authType === 'V') navigate('/profile')
      else if (authType === 'L') Mutation(userData)
      else if (authType === 'F') navigate('/login')
    },
    onError: (error) => {
      setErrorFunc(error, setMessage, setModalMessage)
    }
  })
  return { ...mutationData }
}
