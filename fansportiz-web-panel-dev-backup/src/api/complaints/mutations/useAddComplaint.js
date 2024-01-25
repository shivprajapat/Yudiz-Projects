import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import axios from '../../../axios/instanceAxios'

export const addComplaint = async ({ sImage, sTitle, sDescription, eType }) => {
  if (sImage && sImage.file) {
    const signedUrlRes = await axios.post('/user/complaint/pre-signed-url/v1', { sFileName: sImage.file.name, sContentType: sImage.file.type })
    const bImgUrl = signedUrlRes.data.data.sUrl
    const bImg = signedUrlRes.data.data.sPath
    await axios.put(bImgUrl, sImage.file, { headers: { 'Content-Type': sImage.file.type, noAuth: true } })
    return await axios.post('/user/complaint/v1', { sImage: bImg, sTitle, sDescription, eType })
  } else {
    return await axios.post('/user/complaint/v1', { sImage: sImage || '', sTitle, sDescription, eType })
  }
}

export default function useAddComplaint () {
  const navigate = useNavigate()

  const mutationData = useMutation({
    mutationFn: addComplaint,
    onSuccess: (data) => {
      navigate('/complaints', { state: { resMessage: data.data.message } })
    }
  })

  return { ...mutationData }
}
