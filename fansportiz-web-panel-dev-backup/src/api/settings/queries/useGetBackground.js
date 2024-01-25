import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import axios from '../../../axios/instanceAxios'

export const getBackground = async () => {
  return await axios.get('/gaming/user/side-background/v1')
}

export default function useGetBackground () {
  const [sBackImage, setBackImage] = useState('')
  const [sImage, setImage] = useState('')

  const queryData = useQuery({
    queryKey: ['GetBackground'],
    queryFn: getBackground,
    select: (response) => response.data.data,
    onSuccess: (data) => {
      setBackImage(data?.sBackImage)
      setImage(data?.sImage)
    }
  })

  return { ...queryData, sBackImage, sImage }
}
