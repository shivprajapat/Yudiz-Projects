import { useMutation } from '@tanstack/react-query'
import axios from '../../../axios/instanceAxios'
import { setErrorFunc } from '../../../utils/helper'

export const UpdateKycDetails = async ({ kycType, sPanNumber, sPanName, nAadhaarNo }) => {
  let payload = {}
  if (kycType === 'PAN') payload = { sNo: sPanNumber, eType: kycType, sName: sPanName }
  else payload = { nNo: nAadhaarNo, eType: kycType }
  return await axios.put('/user-info/user/kyc/v1', { ...payload })
}

export default function useUpdateKycDetails ({ setMessage, setAlert, refetchKycDetails }) {
  const mutationData = useMutation({
    mutationKey: ['UpdateKycDetails'],
    mutationFn: UpdateKycDetails,
    select: response => response?.data?.data,
    onSuccess: () => {
      refetchKycDetails()
    },
    onError: (error) => {
      setErrorFunc(error, setMessage, setAlert)
    }
  })
  return mutationData
}
