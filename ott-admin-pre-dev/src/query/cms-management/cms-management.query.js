import axios from '../../axios'

export async function getCmsList(requestParams) {
    return await axios.get(`/cms/list?size=${requestParams.size}&search=${requestParams.search}&sort=${requestParams.sort}@orderBy=${requestParams.orderBy}&pageNumber=${requestParams.pageNumber}&eStatus=${requestParams.eStatus}&startDate=${requestParams.startDate}&endDate=${requestParams.endDate}&date=${requestParams.date}`)
}

export async function updateCmsById(data) {
    return await axios.put(`/cms/edit/${data?.id}`, data.payload)
}

export async function deleteCms(id) {
    return await axios.delete(`/cms/${id}`)
}

export async function addCms(data) {
    return await axios.post('/cms/add', data.payload)
}

export async function getCmsDetail(data) {
    return await axios.get(`/cms/view/${data?.id}`)
}
