import Axios from "../../axios"
import { addQueryParams } from 'helpers'

export function getCity(countryID, stateID, query = { page: 0, limit: 50 }) {
    return Axios.get(`/api/cities/v1?iCountryId=${countryID}&iStateId=${stateID}&${addQueryParams(query)}`)
}
