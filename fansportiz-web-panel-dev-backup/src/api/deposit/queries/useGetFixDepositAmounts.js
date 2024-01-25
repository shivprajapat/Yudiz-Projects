import { useQuery } from '@tanstack/react-query'
import axios from '../../../axios/instanceAxios'

export const GetFixDepositAmounts = async () => {
  return await axios.get('/gaming/user/setting/fix-deposit/v1')
}

export default function useGetFixDepositAmounts () {
  const queryData = useQuery({
    queryKey: ['GetFixDepositAmounts'],
    queryFn: GetFixDepositAmounts,
    select: response => response?.data?.data
  })
  return { ...queryData }
}
