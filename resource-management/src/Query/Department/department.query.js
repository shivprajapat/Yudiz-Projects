import { addQueryParams } from 'helpers/helper'
import Axios from '../../axios'

export async function getDepartmentList(query) {
  const response = await Axios.get(`/api/departments/v1?${addQueryParams(query)}`)
  return response
}
