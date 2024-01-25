import { useQuery } from '@tanstack/react-query'
import axios from '../../../axios/instanceAxios'

export const GetNotificationCount = async () => {
  return await axios.get('/notification/user/notification/unread-count/v1')
}

export default function useGetNotificationCount ({ token }) {
  const queryData = useQuery({
    queryKey: ['GetNotificationCount'],
    queryFn: GetNotificationCount,
    select: response => response?.data?.data,
    enabled: !!token,
    refetchInterval: 20000
  })
  return { ...queryData }
}
