import Axios from "../../axios"


export function getOrganizationDetails() {
    return Axios.get(`api/organizationDetails/v1`)    
}
