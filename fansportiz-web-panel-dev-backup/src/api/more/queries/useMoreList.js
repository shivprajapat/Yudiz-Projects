import { useQuery } from '@tanstack/react-query'

import axios from '../../../axios/instanceAxios'

export const getMoreList = async () => { // more list
  return await axios.get('/statics/user/cms/list/v1')
}

export default function useMoreList () {
  const queryData = useQuery({
    queryKey: ['MoreList'],
    queryFn: getMoreList,
    select: (data) => data.data.data
  })

  return { ...queryData }
}
