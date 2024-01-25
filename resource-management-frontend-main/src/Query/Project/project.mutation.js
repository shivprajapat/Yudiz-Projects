import axios from 'axios'
import { addQueryParams } from 'helpers'
import Axios from '../../axios'

export async function addProject(data) {
  if (data.imageData) {
    const presigned_data = await Axios.post('/api/project/pre-signed-url-image/v1', {
      sFileName: data.imageData.name,
      sContentType: data.imageData.type,
    })
    const response = await axios.put(presigned_data.data.data.url, data.imageData)
    if (response.status === 200) {
      data.sLogo = presigned_data.data.data.s3PathUrl
      return Axios.put(`/api/project/v2`, data)
    } else {
      return new Promise((_, rej) => rej('image not uploaded'))
    }
  } else {
    return Axios.put(`/api/project/v2`, data)
  }
}

export async function updateProject(data) {
  if (data.flag === 3) {
    const aContract = []
    for await (const d of data.aContract) {
      const presigned_data = await Axios.post('/api/project/pre-signed-url/v1', {
        sFileName: d?.sContract?.name,
        sContentType: d?.sContract?.type,
        iProjectId: data.iProjectId,
      })
      const response = await axios.put(presigned_data.data.data.url, d)
      if (response?.status === 200) {
        aContract.push({ sContract: presigned_data.data.data.s3PathUrl, sDocumentName: d?.sDocumentName })
      }
    }
    return Axios.put(`/api/project/v2`, { ...data, aContract })
  }
  if (data.flag === 2) {
    return Axios.put(`/api/project/v2`, data)
  }
  if (typeof data.imageData === 'string' || !data.imageData) {
    return Axios.put(`/api/project/v2`, { ...data, sLogo: data?.imageData || '' })
  }
  const presigned_data = await Axios.post('/api/project/pre-signed-url-image/v1', {
    sFileName: data.imageData.name,
    sContentType: data.imageData.type,
  })
  const response = await axios.put(presigned_data.data.data.url, data.imageData)
  if (response.status === 200) {
    data.sLogo = presigned_data.data.data.s3PathUrl
    return Axios.put(`/api/project/v2`, data)
  } else {
    return new Promise((_, rej) => rej('image not uploaded'))
  }
}

export function deleteProject(id) {
  return Axios.delete(`/api/project/${id}/v1`)
}
export function addProjectEmployeeReview(payload) {
  return Axios.put(`/api/review/${payload.id}/employees/add/v1`, payload.data)
}
export function editProjectEmployeeReview(payload) {
  return Axios.put(`/api/review/${payload.id}/employees/update/v1`, payload.data)
}
export function deleteProjectEmployeeReview(payload) {
  return Axios.put(`/api/review/${payload.id}/employees/delete/v1`, payload.data)
}

export function EmployeeFromDepartment({ query, aDepartmentIds }) {
  return Axios.post(`api/departmentWiseEmployee/v1?${addQueryParams(query)}`, { aDepartmentIds })
}

export function addDepartmentInProject(data) {
  return Axios.post(`/api/addProjectDepartment/v1`, data)
}

export function removeDepartmentInProject(query) {
  return Axios.delete(`/api/deleteProjectDepartment/v1?${addQueryParams(query)}`)
}

export function addDepartmentHoursAndCost(data) {
  return Axios.put(`/api/project/department/meta/${data.id}`, data)
}

export function addEmployeeInProject(data) {
  return Axios.post(`/api/addProjectEmployee/v2`, data)
}

export function updateEmployeeInProject(data) {
  return Axios.put(`/api/updateProjectEmployee/v2`, data)
}

export function updateEmployeePermission(data) {
  return Axios.put(`/api/updateUserPermission/v1`, data)
}

export function removeEmployeeInProject(query) {
  return Axios.delete(`/api/deleteProjectEmployee/v1?${addQueryParams(query)}`)
}

export function addEmployeeHours(data) {
  const id = data.id
  delete data.id
  return Axios.put(`/api/project/employee/meta/${id}`, { data })
}
export function updateDepartments(payload) {
  return Axios.put(`/api/updateProjectDepartments/${payload.id}/v1`, payload.data)
}
export function updateDepartmentsMeta(payload) {
  return Axios.put(`/api/updateProjectDepartment/v1`, payload)
}

export function AddEmployeeToDedicated(payload) {
  return Axios.put(`/api/addEmployeeDedicated/v1`, payload)
}

export function updateProjectStatus({ id, data }) {
  return Axios.put(`/api/dashboard/projectStatus/${id}/v1`, data)
}