import Axios from '../../axios'

export function updateStatusClosedToProgress(id) {
    return Axios.put(`/api/project/retrive/${id}/v1`)
}