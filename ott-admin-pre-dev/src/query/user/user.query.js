import axios from '../../axios'

export async function getUser(payload) {
  return await axios.get(
    `/user/list?size=${payload.size}&search=${payload.search}&sort=${payload.sort}&orderBy=${payload.orderBy}&pageNumber=${payload.pageNumber}&eStatus=${payload.eStatus}&startDate=${payload.startDate}&endDate=${payload.endDate}&date=${payload.date}`
  )
}

export async function updateUserById(data) {
  return await axios.put(`/user/edit/${data?.id}`, { eStatus: data?.eStatus })
}

export async function viewUser(id) {
  return await axios.get(`/user/view/${id}`)
}

export async function updateUser(id, payload) {
  return await axios.put(`/user/edit/${id}`, payload)
}

export async function viewUserOprations(id, requestParams) {
  return await axios.get(
    `/operation/list?iUserId=${id}&size=${requestParams.size}&pageNumber=${requestParams.pageNumber}&search=${requestParams.search}&startDate=${requestParams.startDate}&endDate=${requestParams.endDate}&date=${requestParams.date}`
  )
}
