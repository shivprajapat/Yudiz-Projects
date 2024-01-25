import Axios from '../../axios'
import axios from 'axios'

export async function addTechnology(data) {
    if (typeof data?.sLogo === 'object') {
        const presigned_data = await Axios.post('/api/technologies/pre-signed-url/v1', {
            sFileName: data.sLogo.name,
            sContentType: data.sLogo.type,
        })
        const response = await axios.put(presigned_data.data.data.url, data.sLogo)
        if (response.status === 200) {
            data.sLogo = presigned_data.data.data.s3PathUrl
            return Axios.post('/api/technologies/v1', data)
        } else {
            return Axios.post('/api/technologies/v1', data)
        }
    }
    else {
        return Axios.post('/api/technologies/v1', data)
    }
}

export async function updateTechnology({ id, data }) {
    if (typeof data.sLogo === 'string') {
        return Axios.put(`api/technologies/${id}/v1`, { ...data })
    }
    const presigned_data = await Axios.post('/api/technologies/pre-signed-url/v1', {
        sFileName: data.sLogo.name,
        sContentType: data.sLogo.type,
    })
    const response = await axios.put(presigned_data.data.data.url, data.sLogo)
    if (response.status === 200) {
        data.sLogo = presigned_data.data.data.s3PathUrl
        return Axios.put(`api/technologies/${id}/v1`, data)
    } else {
        return Axios.put(`api/technologies/${id}/v1`, data)
    }
}

export function deleteTechnology(id) {
    return Axios.delete(`/api/technologies/${id}/v1`)
}