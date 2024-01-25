import { useQuery } from '@tanstack/react-query'
import axios from '../../../axios/instanceAxios'

export const BannerStatistics = async (ID) => {
  return await axios.post(`/statics/user/banner/log/${ID}/v1`)
}

export default function useBannerStatistics ({ bannerClicked }) {
  const queryData = useQuery({
    queryKey: ['BannerStatistics', bannerClicked],
    queryFn: () => BannerStatistics(bannerClicked),
    enabled: !!bannerClicked
  })
  return queryData
}
