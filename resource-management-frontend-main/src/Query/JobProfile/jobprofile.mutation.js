import Axios from '../../axios'

export function addJobProfile(data) {
    return Axios.post('/api/job-profile/v1', data)
}

export function updateJobProfile({ id, data }) {
    return Axios.put(`/api/job-profile/${id}/v1`, data)
}

export function deleteJobProfile(id) {
    return Axios.delete(`api/job-profile/${id}/v1`)
}