import Axios from "../../axios"

export function addBranchData(data) {
  return Axios.post(`/api/orgbranch/v1`, data)
}

export function updateBranchData({ ibranchId, data }) {
  return Axios.put(`/api/orgbranch/${ibranchId}/v1`, data)
}

export function deleteBranchData(ibranchId) {
  return Axios.delete(`/api/orgbranch/${ibranchId}/v1`)
}