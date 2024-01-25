import { addQueryParams } from 'helpers'
import Axios from '../../axios'

export function getBranchDetails(query) {
return Axios.get(`/api/orgbranch/v1?${addQueryParams(query)}`)
}

export function getBranchDetailsById(id) {
return Axios.get(`/api/orgbranch/${id}/v1`)
}