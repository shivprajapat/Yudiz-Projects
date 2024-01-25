import { useMutation } from '@tanstack/react-query'
import axios from '../../../axios/instanceAxios'

export const VerifyToken = async ({ sPushToken, sDeviceId }) => {
  return await axios.post('/gaming/user/auth/validate-token/v2', { sPushToken, sDeviceId })
}

export default function useVerifyToken () {
  const mutationData = useMutation({
    mutationKey: ['VerifyToken'],
    mutationFn: VerifyToken,
    select: response => response?.data
  })
  return { ...mutationData }
}
