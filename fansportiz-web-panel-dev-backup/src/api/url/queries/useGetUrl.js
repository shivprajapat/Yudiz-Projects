import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import axios from '../../../axios/instanceAxios'

export const GetUrl = async () => {
  return await axios.get('/gaming/user/get-url/v1')
}

export default function useGetUrl () {
  const [sMediaUrl, setMediaUrl] = useState('')
  const [sKycUrl, setKycUrl] = useState('')
  const queryData = useQuery({
    queryKey: ['GetUrl'],
    queryFn: GetUrl,
    select: response => response?.data?.data,
    onSuccess: (data) => {
      setMediaUrl(data?.media)
      setKycUrl(data?.kyc)
    }
  })
  return { ...queryData, sMediaUrl, sKycUrl }
}
