import { useQuery } from '@tanstack/react-query'
import axios from '../../../axios/instanceAxios'

export const GetDepositValidation = async ({ type }) => {
  return await axios.get(`/gaming/user/setting/${type}/v1`)
}

export default function useGetDepositValidation ({ type }) {
  const queryData = useQuery({
    queryKey: ['GetDepositValidation'],
    queryFn: () => GetDepositValidation({ type }),
    select: response => response?.data?.data
  })
  return { ...queryData }
}
