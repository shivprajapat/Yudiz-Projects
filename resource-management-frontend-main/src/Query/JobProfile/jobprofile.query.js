import { addQueryParams } from 'helpers'
import Axios from '../../axios'

export function getJobProfile(query) {
    return Axios.get(`/api/job-profile/v1?${addQueryParams(query)}`)
}
export function getJobProfileById(id) {
    return Axios.get(`/api/job-profile/${id}/v1`)
}