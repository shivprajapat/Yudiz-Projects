import { useQuery } from '@tanstack/react-query'

import axios from '../../../axios/instanceAxios'

export const getSeriesCategories = async (id) => { // more list
  return await axios.get(`/gaming/user/series-leaderboard-category-list/${id}/v1`)
}

export default function useSeriesCategoryList (id) {
  const queryData = useQuery({
    queryKey: ['Leaderboard-Series-Categories', id],
    queryFn: () => getSeriesCategories(id),
    select: (data) => data.data.data,
    enabled: !!id
  })

  return { ...queryData }
}
