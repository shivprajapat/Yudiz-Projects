import Axios from '../../axios'

export async function addOrganization(data) {
  return Axios.put('/v1/organization/add', data?.addData)
}

export async function updateOrganization(data) {
  return Axios.patch(`/v1/organization/edit/${data?.id}`, data.addData)
}

export function deleteOrganization(id) {
  return Axios.delete(`/v1/organization/delete/${id}`)
}