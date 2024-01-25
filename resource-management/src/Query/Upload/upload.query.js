import axios from 'axios'
import Axios from '../../axios'

export async function preSignedUrl(image) {
  const response = await Axios.post('/api/user/pre-signed-url/v1', {
    sFileName: image.name,
    sContentType: image.type,
  })
  return response
}

export function postUrl(url, file) {
  console.log(file)
  axios
    .put(
      url,
      { file },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    .then((res) => console.log(res))
}
