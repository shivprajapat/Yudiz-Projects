import { useQuery } from '@tanstack/react-query'

import axios from '../../../axios/instanceAxios'

export const getAllLeaderBoardRank = async (id) => { // more list
  return await axios.get(`/gaming/user/series-leaderboard-get-allrank/${id}/v1`)
}

export default function useAllLeaderboardRank (id, detailsId) {
  const queryData = useQuery({
    queryKey: ['Leaderboard-Series-Category-Details', id, detailsId],
    queryFn: () => getAllLeaderBoardRank(id),
    select: (data) => data.data.data,
    enabled: !!id && !detailsId
  })

  return { ...queryData }
}
