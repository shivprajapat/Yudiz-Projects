import { useQuery } from '@tanstack/react-query'
import axios from '../../../axios/instanceAxios'

export const GetUserStatistics = async () => {
  return await axios.get('/gaming/user/profile-statistics/v1')
}

export default function useGetUserStatistics () {
  const queryData = useQuery({
    queryKey: ['GetUserStatistics'],
    queryFn: GetUserStatistics,
    select: response => response?.data?.data
  })
  return { ...queryData }
}
