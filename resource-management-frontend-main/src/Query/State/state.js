import Axios from "../../axios"
import { addQueryParams } from 'helpers'


export function getState(id, query = { page: 0, limit: 50 }) {
    return Axios.get(`/api/states/v1?iCountryId=${id}&${addQueryParams(query)}`)
}
