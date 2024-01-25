import { addQueryParams } from 'helpers'
import Axios from '../../axios'

export function getClosedStatusProject(query) {
    return Axios.get(`/api/projects/closed/v1?${addQueryParams(query)}`)
}