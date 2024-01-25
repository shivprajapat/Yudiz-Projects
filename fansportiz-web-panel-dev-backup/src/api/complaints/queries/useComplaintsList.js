import { useQuery } from '@tanstack/react-query'

import axios from '../../../axios/instanceAxios'

export const getComplaintList = async () => {
  return await axios.get('/user/complaint/list/v1')
}

export default function useComplaintsList () {
  const queryData = useQuery({
    queryKey: ['ComplaintList'],
    queryFn: getComplaintList,
    select: (data) => data.data.data
  })

  return { ...queryData }
}
