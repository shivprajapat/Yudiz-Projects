import axios from 'axios'
import { useSnackbar } from 'react-notistack'

export const useS3Upload = () => {
  const { enqueueSnackbar } = useSnackbar()

  async function uploadFile (payload) {
    try {
      const presignedData = await axios.post(
        `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/pre-signed-for-private`,
        { data: payload }
      )
      if (presignedData?.data?.data) {
        const data = presignedData?.data?.data // Assuming you have your object here
        const keys = Object.keys(data)
        const lastKey = keys[keys.length - 1]
        for (const key in data) {
          try {
            const file = payload.find((i) => i.flag === key)?.file
            const result = await axios.put(
              presignedData?.data?.data[key]?.sUrl,
              file
            )
            if (key === lastKey && result) {
              return presignedData?.data?.data
            }
            // return { result, path: presignedData?.data?.data?.sPath }
          } catch (err) {
            console.log('err', err)
          }
        }
      }
    } catch (err) {
      enqueueSnackbar(`${err?.response?.data?.message}`, {
        variant: 'error',
        autoHide: true,
        hide: 2000
      })
      return { err }
    }
  }

  const getImage = async (filepath, token) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/getUrl-for-private`,
        { data: filepath },
        { headers: { Authorization: token } }
      )
      return response?.data // Return the URL here
    } catch (error) {
      console.log('error', error)
      throw error // Rethrow the error to handle it elsewhere if needed
    }
  }

  return {
    uploadFile,
    getImage
  }
}
