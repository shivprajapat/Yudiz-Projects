import { useQuery } from '@tanstack/react-query'

import axios from '../../../axios/instanceAxios'

export const getOfferList = async () => { // offer list get
  return await axios.get('/statics/user/offer/list/v1')
}

export default function useOfferList () {
  const queryData = useQuery({
    queryKey: ['OfferList'],
    queryFn: getOfferList,
    select: (data) => data.data.data
  })

  return { ...queryData }
}
