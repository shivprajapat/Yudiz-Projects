import axios from '../../../axios/instanceAxios'
import { useMutation } from '@tanstack/react-query'
import { encryption } from '../../../utils/encryption'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../../../redux/userContext'

export const Login = async (loginData) => {
  const { FirebaseToken, Platform, userName, Password, loginID } = loginData
  const encryptedPass = encryption(Password)
  return await axios.post('/gaming/user/auth/login/v2', {
    sPushToken: FirebaseToken, sLogin: userName, sPassword: encryptedPass, sDeviceToken: loginID
  }, { headers: { Platform } })
}

export default function useLogin ({ setMessage, setModalMessage, userName, Password }) {
  const navigate = useNavigate()
  const { dispatch } = useContext(UserContext)
  const mutationData = useMutation({
    mutationFn: Login,
    select: response => response?.data,
    onSuccess: (response) => {
      if (response?.data?.Authorization) {
        localStorage.setItem('Token', response?.data?.Authorization)
        localStorage.setItem('userData', JSON.stringify(response?.data?.data))
        dispatch({ type: 'USER_TOKEN', payload: response?.data?.Authorization })
      }
      if (response?.data?.data?.nOtpSend) {
        navigate('/verification', { state: { userName, Password } })
      }
    },
    onError: (error) => {
      setMessage(error?.response?.data?.message)
      setModalMessage(true)
    }
  })
  return { ...mutationData }
}
