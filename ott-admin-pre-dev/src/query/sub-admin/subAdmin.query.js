import axios from '../../axios'

export async function getSubAdminList(requestParams) {
  return await axios.get(
    `/subAdmin/list?size=${requestParams.size}&search=${requestParams.search}&sort=${requestParams.sort}&orderBy=${requestParams.orderBy}&pageNumber=${requestParams.pageNumber}&eStatus=${requestParams.eStatus}&startDate=${requestParams.startDate}&endDate=${requestParams.endDate}&date=${requestParams.date}`
  )
}

export async function getAllPermission() {
  return await axios.get(`/permission/all`)
}

export async function getSubAdminById(id) {
  return await axios.get(`/subAdmin/profile/` + id)
}

export async function updateSubAdminById(data) {
  const { id } = data
  const updateData = {
    sEmail: data?.sEmail,
    sUserName: data?.sUserName,
    aPermissions: data?.permissions,
    sMobile: data?.sMobile,
    eStatus: data?.eStatus
  }
  return await axios.put(`/subAdmin/update/` + id, updateData)
}

export async function deleteSubAdmin(id) {
  return await axios.delete(`/subAdmin/delete/` + id)
}

export async function addSubAdmin(data) {
  const addData = {
    sEmail: data?.payload?.sEmail,
    sUserName: data?.payload?.sUserName,
    aPermissions: data?.permissions,
    sMobile: data?.payload?.sMobile
  }
  return await axios.post(`/subAdmin/add`, addData)
}
