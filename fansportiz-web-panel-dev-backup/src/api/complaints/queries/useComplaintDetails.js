import { useQuery } from '@tanstack/react-query'

import axios from '../../../axios/instanceAxios'

export const getComplaintDetails = async (id) => {
  return await axios.get(`/user/complaint/${id}/v1`)
}

export default function useComplaintDetails (id) {
  const queryData = useQuery({
    queryKey: ['ComplaintDetails', id],
    queryFn: () => getComplaintDetails(id),
    enabled: !!id,
    select: (data) => data.data.data
  })

  return { ...queryData }
}
