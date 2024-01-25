import { useQuery } from '@tanstack/react-query'

import axios from '../../../axios/instanceAxios'

export const getScorePoints = async (format) => { // get score points
  return await axios.get(`/gaming/user/score-point/v1?eFormat=${format}`)
}

export default function useScorePoints (format) {
  const queryData = useQuery({
    queryKey: ['PointSystemData', format],
    queryFn: () => getScorePoints(format),
    select: (data) => data.data.data,
    enabled: !!format
  })

  return { ...queryData }
}
