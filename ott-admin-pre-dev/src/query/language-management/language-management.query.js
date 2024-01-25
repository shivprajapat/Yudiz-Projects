import axios from '../../axios'

export async function getLanguageList(requestParams) {
  return await axios.get(`/language/list?size=${requestParams.size}&search=${requestParams.search}&sort=${requestParams.sort}&orderBy=${requestParams.orderBy}&pageNumber=${requestParams.pageNumber}&eStatus=${requestParams.eStatus}&startDate=${requestParams.startDate}&endDate=${requestParams.endDate}&date=${requestParams.date}
  `)
}

export async function updateLanguageById(data) {
  return await axios.put(`/language/edit/` + data?.id, { eStatus: data?.eStatus })
}

export async function getLanguageSelect() {
  return await axios.get(`/language/all`)
}

export async function addLanguage(data) {
  return await axios.post(`/language/add`, {
    sName: data?.data?.language?.name,
    sCode: data?.data?.language?.code,
    eStatus: data.status ? 'y' : 'n',
    eFrontendAccess: data.forFrontend ? 'y' : 'n'
  })
}

export async function deleteLanguage(id) {
  return await axios.delete(`/language/delete/` + id)
}
