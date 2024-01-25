import { useMutation } from '@tanstack/react-query'
import axios from '../../../axios/instanceAxios'
import { useNavigate } from 'react-router-dom'
import { setErrorFunc } from '../../../utils/helper'

export const Registration = async ({ FirebaseToken, Platform, sUsername, sEmail, sMobNum, sPassword, sCode, sReferCode, sDeviceId, sSocialToken, aPolicyId }) => {
  // const encryptedPass = encryption(Password)
  return await axios.post('/gaming/user/auth/register/v4', {
    sPushToken: FirebaseToken, sUsername, sEmail, sMobNum, sDeviceId, sPassword, sCode, sReferCode, sSocialToken, aPolicyId
  }, { headers: { Platform } })
}

export default function useRegister ({ setMessage, setModalMessage }) {
  const navigate = useNavigate()
  const mutationData = useMutation({
    mutationFn: Registration,
    select: response => response?.data,
    onSuccess: (response) => {
      localStorage.setItem('Token', response.data.Authorization)
      navigate('/', { state: { message: response?.data?.message } })
    },
    onError: (error) => {
      setErrorFunc(error, setMessage, setModalMessage)
    }
  })
  return mutationData
}
