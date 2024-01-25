import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axios from '../../../axios/instanceAxios'
import { setErrorFunc } from '../../../utils/helper'

export const ForgotPassword = async ({ sLogin, sType, sAuth, sCode, sNewPassword }) => {
  // const encryptedPass = encryption(password)
  return await axios.post('/gaming/user/auth/reset-password/v3', {
    sLogin, sType, sAuth, sCode, sNewPassword
  })
}

export default function useForgotPassword ({ setMessage, setModalMessage }) {
  const navigate = useNavigate()
  const mutationData = useMutation({
    mutationKey: ['ForgotPassword'],
    mutationFn: ForgotPassword,
    select: response => response?.data,
    onSuccess: () => {
      navigate('/login')
    },
    onError: (error) => {
      setErrorFunc(error, setMessage, setModalMessage)
    }
  })
  return { ...mutationData }
}
