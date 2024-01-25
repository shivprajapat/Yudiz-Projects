import Axios from '../../axios'

export async function addBatchSchedule(data) {
  return Axios.put('/v1/batchSchedule/add', data)
}

export async function updateBatchSchedule(data) {
  return Axios.patch(`/v1/batchSchedule/edit/${data?.id}`, data.addData)
}

export function deleteBatchSchedule(id) {
  return Axios.delete(`/v1/batchSchedule/delete/${id}`)
}