import { addQueryParams } from 'helpers'
import Axios from '../../axios'

export function getBatchScheduleList(query) {
  return Axios.get(`/v1/batchSchedule/list/all?${addQueryParams(query)}`)
}
export function getSpecificBatchSchedule(id) {
  return Axios.get(`/v1/batchSchedule/${id}`)
}