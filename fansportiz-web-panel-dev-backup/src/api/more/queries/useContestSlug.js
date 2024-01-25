import { useQuery } from '@tanstack/react-query'

import axios from '../../../axios/instanceAxios'

export const getContestSlug = async (slug) => { // get details from slug
  return await axios.get(`/statics/user/cms/${slug}/v1`)
}

export default function useContestSlug (slug) {
  const queryData = useQuery({
    queryKey: ['ContestSlugDetails', slug],
    queryFn: () => getContestSlug(slug),
    select: (data) => data.data.data
  })

  return { ...queryData }
}
