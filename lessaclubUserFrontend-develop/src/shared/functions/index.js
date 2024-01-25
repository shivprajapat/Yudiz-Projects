import axios from 'shared/libs/axios'

import { apiPaths } from 'shared/constants/apiPaths'

export const getPreSignedUrl = async (payload) => {
  try {
    document.body.classList.add('global-loader')
    const response = await axios.post(apiPaths.assetUpload, payload)
    document.body.classList.remove('global-loader')
    return response
  } catch (error) {
    document.body.classList.remove('global-loader')
  }
}
