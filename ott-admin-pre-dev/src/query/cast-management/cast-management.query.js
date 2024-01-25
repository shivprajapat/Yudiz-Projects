import axios from '../../axios'

export async function getCastList(requestParams) {
    return await axios.get(`/cast/list?size=${requestParams.size}&search=${requestParams.search}&sort=${requestParams.sort}@orderBy=${requestParams.orderBy}&pageNumber=${requestParams.pageNumber}&eStatus=${requestParams.eStatus}&startDate=${requestParams.startDate}&endDate=${requestParams.endDate}&date=${requestParams.date}`)
}

export async function updateCastById(data) {
    return await axios.put(`/cast/${data?.id}`, data.payload)
}

export async function deleteCast(id) {
   return await axios.delete(`/cast/${id}`)
}

export async function addCast(data) {
    return await axios.post('/cast/add', data.payload)
}

export async function getCastDetail(data) {
    return await axios.get(`/cast/view/${data?.id}`)
}
