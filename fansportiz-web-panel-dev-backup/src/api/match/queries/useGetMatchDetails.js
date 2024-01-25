import { useQuery } from '@tanstack/react-query'
import axios from '../../../axios/instanceAxios'
import { setErrorFunc } from '../../../utils/helper'

export const getMatchDetails = async ({ matchId, sportsType }) => {
  return await axios.get(`/gaming/user/match/${matchId}/v1?sportsType=${sportsType}`)
}

export default function useGetMatchDetails ({ dependencyData, setMessage, setModalMessage }) {
  const { matchId, sportsType } = dependencyData
  const queryData = useQuery({
    queryKey: ['GetMatchDetails', matchId && sportsType],
    queryFn: () => getMatchDetails({ matchId, sportsType }),
    select: response => response?.data?.data,
    enabled: !!(matchId && sportsType),
    onError: error => {
      setErrorFunc(error, setMessage, setModalMessage)
    }
  })
  return { ...queryData }
}
