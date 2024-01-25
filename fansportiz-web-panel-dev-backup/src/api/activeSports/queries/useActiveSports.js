import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import axios from '../../../axios/instanceAxios'

export const GetActiveSports = async () => {
  return await axios.get('/gaming/user/match/active-sports/v2')
}

export default function useActiveSports () {
  const [activeSport, setActiveSport] = useState('')

  const queryData = useQuery({
    queryKey: ['ActiveSports'],
    queryFn: GetActiveSports,
    select: (response) => response.data.data,
    onSuccess: (data) => {
      if (data && data.length > 0) {
        const sport = data.sort((a, b) => a.sName > b.sName ? -1 : 1).sort((a, b) => (a.nPosition > b.nPosition) ? 1 : -1).map(data => data.sName)
        setActiveSport(sport?.length && sport[0] && (sport[0].toLowerCase()))
      }
    }
  })

  return { ...queryData, activeSport }
}
