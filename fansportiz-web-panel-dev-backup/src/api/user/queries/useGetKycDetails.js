import { useQuery } from '@tanstack/react-query'
import axios from '../../../axios/instanceAxios'

export const GetKycDetails = async () => {
  return await axios.get('/user-info/user/kyc/v2')
}

export default function useGetKycDetails () {
  const queryData = useQuery({
    queryKey: ['GetKycDetails'],
    queryFn: GetKycDetails,
    select: response => response?.data?.data
  })
  return { ...queryData }
}
