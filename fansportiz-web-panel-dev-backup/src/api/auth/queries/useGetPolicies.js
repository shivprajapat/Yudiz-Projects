import { useQuery } from '@tanstack/react-query'

import axios from '../../../axios/instanceAxios'

export const getPolicies = async () => {
  return await axios.get('/statics/user/cms/register-policy/v1')
}

export default function useGetPolicies () {
  const queryData = useQuery({
    queryKey: ['GetPolicies'],
    queryFn: getPolicies,
    select: (response) => response.data.data
  })

  return queryData
}
