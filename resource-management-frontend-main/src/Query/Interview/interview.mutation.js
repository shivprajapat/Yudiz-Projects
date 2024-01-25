import Axios from '../../axios'

export function deleteInterview(id) {
  return Axios.delete(`/api/interview/${id}/v1`)
}

export function addInterview(data) {
  return Axios.post('/api/addInterviews/v1', data)
}

export function updateInterview(data) {
  return Axios.put(`/api/updateInterviews/${data.id}/v1`, data.InteviewData)
}

export function filterInterview(id, filter) {
  const body = {}
  body[filter] = id
  return Axios.post(`/api/filterInterview/v1`, body)
}
