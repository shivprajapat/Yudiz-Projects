import { addQueryParams } from "helpers"
import Axios from "../../axios"

// export function getCountries() {
//     return Axios.get(`/api/countries/v1`)
// }

export function getCountries(query = { page: 0, limit: 50 }) {
    return Axios.get(`/api/countries/v1?${addQueryParams(query)}`)
}
