import { useQuery } from '@tanstack/react-query'

import axios from '../../../axios/instanceAxios'

export const getMatchTips = async (slug) => { // match tips get
  return await axios.get(`/gaming/user/predictions/${slug}/v1`)
}

export default function useMatchTips (slug) {
  const queryData = useQuery({
    queryKey: ['MatchTips', slug],
    queryFn: () => getMatchTips(slug),
    select: (data) => data.data.data
  })

  return { ...queryData }
}
