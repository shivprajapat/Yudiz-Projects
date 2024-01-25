import Axios from "../../axios"

export function updateOrganizationDetails({ id, data }) {
    return Axios.put(`/api/organizationDetails/${id}/v1`, data)
}