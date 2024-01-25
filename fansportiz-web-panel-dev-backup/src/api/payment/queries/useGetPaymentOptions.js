import { useQuery } from '@tanstack/react-query'
import axios from '../../../axios/instanceAxios'

export const GetPaymentOptions = async () => {
  return await axios.get('/payment/user/payment-option/list/v2')
}

export default function useGetPaymentOptions () {
  const queryData = useQuery({
    queryKey: ['GetPaymentOptions'],
    queryFn: GetPaymentOptions,
    select: (response) => response?.data?.data
  })
  return queryData
}
