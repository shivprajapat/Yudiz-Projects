import { useMutation } from '@tanstack/react-query'
import axios from '../../../axios/instanceAxios'
import { setErrorFunc } from '../../../utils/helper'

export const UpdateUserProfile = async ({ type, userData }) => {
  if (type === 'data') return await axios.put('/gaming/user/profile/v1', userData)
  else if (type === 'img') {
    const response = await axios.post('/gaming/user/profile/pre-signed-url/v1', { sFileName: userData?.name, sContentType: userData?.type })
    const url = response.data.data.sUrl
    const sImage = response.data.data.sPath
    await axios.put(url, userData, { headers: { 'Content-Type': 'multipart/form-data', noAuth: true } })
    return await axios.put('/gaming/user/profile/v1', { sProPic: sImage })
  }
}

export default function useUpdateUserProfile ({ setMessage, setAlert, refetchUserProfile }) {
  const mutationData = useMutation({
    mutationKey: ['UpdateUserProfile'],
    mutationFn: UpdateUserProfile,
    onSuccess: () => {
      refetchUserProfile()
    },
    onError: (error) => {
      setErrorFunc(error, setMessage, setAlert)
    }
  })
  return mutationData
}
