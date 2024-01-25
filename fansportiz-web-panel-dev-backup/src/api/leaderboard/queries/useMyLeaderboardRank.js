import { useQuery } from '@tanstack/react-query'

import axios from '../../../axios/instanceAxios'

export const getMyLeaderboardRank = async (id) => { // more list
  return await axios.get(`/gaming/user/series-leaderboard-get-myrank/${id}/v1`)
}

export default function useMyLeaderboardRank (id, detailsId) {
  const queryData = useQuery({
    queryKey: ['Leaderboard-Series-Category-Details', id, detailsId],
    queryFn: () => getMyLeaderboardRank(id),
    select: (data) => data.data.data,
    enabled: !!id && !detailsId
  })

  return { ...queryData }
}
