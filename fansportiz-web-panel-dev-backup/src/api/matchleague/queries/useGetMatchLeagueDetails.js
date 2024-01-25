import { useQuery } from '@tanstack/react-query'
import axios from '../../../axios/instanceAxios'
import { setErrorFunc } from '../../../utils/helper'

export const getMatchLeagueDetails = async ({ matchLeagueId }) => {
  return await axios.get(`/gaming/user/match-league/${matchLeagueId}/v1`)
}

export default function useGetMatchLeagueDetails ({ dependencyData, setMessage, setModalMessage }) {
  const { matchLeagueId } = dependencyData
  const queryData = useQuery({
    queryKey: ['GetMatchLeagueDetails', matchLeagueId],
    queryFn: () => getMatchLeagueDetails({ matchLeagueId }),
    select: response => response?.data?.data,
    enabled: !!matchLeagueId,
    onError: error => {
      setErrorFunc(error, setMessage, setModalMessage)
    }
  })
  return { ...queryData }
}
