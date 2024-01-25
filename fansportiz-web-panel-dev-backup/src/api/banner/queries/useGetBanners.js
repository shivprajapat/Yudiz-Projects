import { useQuery } from '@tanstack/react-query'
import axios from '../../../axios/instanceAxios'

export const GetBanner = async (place) => {
  return await axios.get(`/statics/user/banner/list/${place}/v1`)
}

export default function useGetBanners ({ screen }) {
  const queryData = useQuery({
    queryKey: ['GetBanner'],
    queryFn: () => GetBanner(screen),
    select: (response) => {
      const data = response?.data?.data
      const items = []
      if (data?.length > 0) {
        data.sort((a, b) => a.nPosition - b.nPosition).map((data) => {
          items.push({ src: data.sImage, eCategory: data.eCategory, eScreen: data.eScreen, iMatchId: data.iMatchId, iMatchLeagueId: data.iMatchLeagueId, key: data._id, sLink: data.sLink, eType: data.eType, sDescription: data.sDescription })
          return items
        })
      }
      return items
    }
  })
  return queryData
}
