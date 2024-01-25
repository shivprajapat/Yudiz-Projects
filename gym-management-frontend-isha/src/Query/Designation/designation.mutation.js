import Axios from '../../axios'

export function addDesignation(data) {
    return Axios.post(`/v1/designation/add`, data)
}

export function updateDesignation({ id, data }) {
    return Axios.put(`/v1/designation/edit/${id}`, data)
}

export function deleteDesignation(id) {
    return Axios.delete(`/v1/designation/delete/${id}`)
}