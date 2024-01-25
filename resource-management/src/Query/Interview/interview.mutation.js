import Axios from '../../axios'

export async function deleteInterview(id) {
  const response = await Axios.delete(`/api/interview/${id}/v1`)
  return response
}

export async function addInterview(data) {
  const response = await Axios.post('/api/addInterviews/v1', data)
  return response
}

export async function updateInterview(data) {
  const response = await Axios.patch(`/api/updateInterviews/${data.id}/v1`, data.clientData)
  return response
}

export async function filterInterview(id) {
  const response = await Axios.get(`/api/filterInterview/${id}/v1`)
  return response
}
