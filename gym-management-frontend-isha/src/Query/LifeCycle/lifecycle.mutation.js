import Axios from '../../axios'

export async function addLifeCycle(data) {
  return Axios.put('/v1/lifecycle/add', data?.addData)
}

export async function updateLifeCycle(data) {
  return Axios.put(`/v1/lifecycle/add`, data.addData)
}

export function deleteLifeCycle(id) {
  return Axios.delete(`/v1/lifecycle/delete/${id}`)
}