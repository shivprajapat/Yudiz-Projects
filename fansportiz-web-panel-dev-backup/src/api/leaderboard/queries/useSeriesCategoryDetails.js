import { useQuery } from '@tanstack/react-query'

import axios from '../../../axios/instanceAxios'

export const getSeriesCategoryDetails = async (id) => { // more list
  return await axios.get(`/gaming/user/series-leaderboard-category/${id}/v1`)
}

export default function useSeriesCategoryDetails (id) {
  const queryData = useQuery({
    queryKey: ['Leaderboard-Series-Category-Details', id],
    queryFn: () => getSeriesCategoryDetails(id),
    select: (data) => data.data.data,
    enabled: !!id
  })

  return { ...queryData }
}
