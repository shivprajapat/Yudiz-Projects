import { useQuery } from '@tanstack/react-query'
import axios from '../../../axios/instanceAxios'

export const GetUserProfile = async () => {
  return await axios.get('/gaming/user/profile/v2')
}

export default function useGetUserProfile () {
  const queryData = useQuery({
    queryKey: ['GetUserProfile'],
    queryFn: GetUserProfile,
    select: response => response?.data?.data
  })
  return { ...queryData }
}
