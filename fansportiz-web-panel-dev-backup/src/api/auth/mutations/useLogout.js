import axios from '../../../axios/instanceAxios'
import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import { UserContext } from '../../../redux/userContext'
import { setErrorFunc } from '../../../utils/helper'

export const Logout = async () => {
  return await axios.put('/gaming/user/auth/logout/v1', {})
}

export default function useLogout ({ setMessage, setAlert }) {
  const { dispatch } = useContext(UserContext)
  const mutationData = useMutation({
    mutationFn: Logout,
    select: response => response?.data,
    onSuccess: () => {
      localStorage.removeItem('Token')
      dispatch({ type: 'USER_TOKEN', payload: '' })
    },
    onError: (error) => {
      setErrorFunc(error, setMessage, setAlert)
    }
  })
  return { ...mutationData }
}
