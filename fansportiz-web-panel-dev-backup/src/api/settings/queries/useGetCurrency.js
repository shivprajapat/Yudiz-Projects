import { useQuery } from '@tanstack/react-query'
import axios from '../../../axios/instanceAxios'

export const getCurrency = async () => {
  return await axios.get('/gaming/user/currency/v1')
}

export default function useGetCurrency () {
  const queryData = useQuery({
    queryKey: ['getCurrency'],
    queryFn: getCurrency,
    select: response => response?.data?.data?.sLogo
  })
  return { ...queryData }
}
