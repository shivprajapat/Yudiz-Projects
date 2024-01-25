import axios from '../../axios'

export async function getGenreList(requestParams) {
  return await axios.get(
    `/genre/list?size=${requestParams.size}&search=${requestParams.search}&sort=${requestParams.sort}&orderBy=${requestParams.orderBy}&pageNumber=${requestParams.pageNumber}&eStatus=${requestParams.eStatus}&startDate=${requestParams.startDate}&endDate=${requestParams.endDate}`
  )
}

export async function languageDropDown() {
  return await axios.get(`/dropdown/language`)
}

export async function addGenre(data) {
  return await axios.post('/genre/add', data.payload)
}

export async function updateGenreById(data) {
  return await axios.put(`/genre/${data.id}`, { eStatus: data.eStatus })
}

export async function getGenreDetail(data) {
  return await axios.get(`/genre/view/${data.id}`)
}
export async function deleteGenre(id) {
  return await axios.delete(`/genre/` + id)
}
