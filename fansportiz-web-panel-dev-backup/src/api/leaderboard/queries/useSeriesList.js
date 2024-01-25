import { useQuery } from '@tanstack/react-query'

import axios from '../../../axios/instanceAxios'

export const getSeries = async (sportsType) => { // more list
  return await axios.post('/gaming/user/series-leaderboard/v1', { eCategory: sportsType })
}

export default function useSeriesList (sportsType) {
  const queryData = useQuery({
    queryKey: ['Leaderboard-Series-List', sportsType],
    queryFn: () => getSeries(sportsType),
    select: (data) => data.data.data,
    enabled: !!sportsType
  })

  return { ...queryData }
}
