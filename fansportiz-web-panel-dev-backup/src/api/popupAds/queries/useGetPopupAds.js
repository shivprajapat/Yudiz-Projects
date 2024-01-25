import { useQuery } from '@tanstack/react-query'
import axios from '../../../axios/instanceAxios'

export const GetPopupAdsList = async () => await axios.get('/statics/user/popupAds/list/v1')

export default function useGetPopupAds ({ token }) {
  const queryData = useQuery({
    queryKey: ['GetPopupAds', token],
    queryFn: GetPopupAdsList,
    select: response => response?.data?.data,
    enabled: !!token
  })
  return { ...queryData }
}
