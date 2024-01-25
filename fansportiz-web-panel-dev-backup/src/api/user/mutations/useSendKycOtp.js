import { useMutation } from '@tanstack/react-query'
import axios from '../../../axios/instanceAxios'

export const SendKycOtp = async ({ nAadhaarNo }) => {
  return await axios.post('/user-info/user/kyc/aadhaar-send-otp/v1', { nAadhaarNo })
}

export default function useSendKycOtp () {
  const mutationData = useMutation({
    mutationKey: ['SendKycOtp'],
    mutationFn: SendKycOtp,
    onMutate: data => data
  })
  return mutationData
}
