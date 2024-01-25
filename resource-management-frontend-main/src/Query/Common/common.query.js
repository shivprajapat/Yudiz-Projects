import { addQueryParams, removeSpaces } from 'helpers'
import Axios from '../../axios'

export function commonLists(query) {
  return Axios.get(`api/job-profile/employee/v1?${addQueryParams(query)}`)
}

export function addTechnology(sName) {
  return Axios.post('/api/technologies/v1', { sName: removeSpaces(sName) })
}
export function addProjectTags(sName) {
  return Axios.post('api/projectTags/v1', { sName: removeSpaces(sName) })
}
export function addJobProfile(sName) {
  return Axios.post('api/job-profile/v1', { sName: removeSpaces(sName) })
}
