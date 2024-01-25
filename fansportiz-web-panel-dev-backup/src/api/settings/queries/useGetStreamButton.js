import { useQuery } from '@tanstack/react-query'
import axios from '../../../axios/instanceAxios'

export const getStreamButton = async () => {
  return await axios.get('/gaming/user/match/stream-button/v1')
}

export default function useGetStreamButton () {
  const queryData = useQuery({
    queryKey: ['GetStreamButton'],
    queryFn: getStreamButton,
    select: response => response?.data?.data
  })
  return { ...queryData }
}
