import axios from 'axios'
import Axios from '../../axios'

export async function addEmployee(data) {
  if (typeof data?.imageData === 'object') {
    const presigned_data = await Axios.post('/api/pre-signed-url/v1', {
      sFileName: data.imageData.name,
      sContentType: data.imageData.type,
    })
    const response = await axios.put(presigned_data.data.data.url, data.imageData)
    if (response.status === 200) {
      data.sProfilePic = presigned_data.data.data.s3PathUrl
      delete data.imageData
      return Axios.post('/api/employee/CreateEmployee', data)
    } else {
      return Axios.post('/api/employee/CreateEmployee', data)
    }
  } else {
    return Axios.post('/api/employee/CreateEmployee', data)
  }
}

export async function updateEmployee(data) {
  if (typeof data.empData.imageData === 'string') {
    return Axios.put('/api/employee/EmployeeUpdate/' + data.id, { ...data.empData, sProfilePic: data?.imageData })
  }

  const presigned_data = await Axios.post('/api/pre-signed-url/v1', {
    sFileName: data.empData.imageData.name,
    sContentType: data.empData.imageData.type,
  })
  const response = await axios.put(presigned_data.data.data.url, data.empData.imageData)
  if (response.status === 200) {
    data.empData.sProfilePic = presigned_data.data.data.s3PathUrl
    return Axios.put('/api/employee/EmployeeUpdate/' + data.id, data.empData)
  } else {
    return Axios.put('/api/employee/EmployeeUpdate/' + data.id, data.empData)
  }
}

export function deleteEmployee(id) {
  return Axios.delete('/api/employee/EmployeeDelete/' + id)
}

export function updateCurrencyEmployee(data) {
  return Axios.put('/api/currencies/v1', data)
}
export function downloadCsv(payload) {
  return Axios.post('/api/DownloadExcel', payload)
}
