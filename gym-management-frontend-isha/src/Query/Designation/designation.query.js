import { addQueryParams } from 'helpers'
import Axios from '../../axios'

export function getDesignation(query) {
    return Axios.get(`/v1/designation/list/all?${addQueryParams(query)}`)
}

export function getDesignationById(id) {
    return Axios.get(`/v1/designation/${id}`)
}