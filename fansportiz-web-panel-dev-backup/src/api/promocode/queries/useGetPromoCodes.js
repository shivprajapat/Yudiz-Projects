import { useQuery } from '@tanstack/react-query'
import axios from '../../../axios/instanceAxios'

export const GetPromoCodes = async () => {
  return await axios.get('/gaming/user/promocode/list/v1')
}

export default function useGetPromoCodes () {
  const queryData = useQuery({
    queryKey: ['GetPromoCodes'],
    queryFn: GetPromoCodes,
    select: (response) => response?.data?.data
  })
  return queryData
}
