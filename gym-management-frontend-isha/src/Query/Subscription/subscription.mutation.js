import Axios from '../../axios'

export async function addSubscription(data) {
  return Axios.put('/v1/subscription/add', data)
}

export async function updateSubscription({ id, newData }) {
  return Axios.patch(`/v1/subscription/edit/${id}`, newData)
}

export function deleteSubscription(id) {
  return Axios.delete(`/v1/subscription/delete/${id}`)
}

export function freezeSubscription(data) {
  return Axios.post(`/v1/subscriptionFreeze/freeze`, data)
}

export function unfreezeSubscription(data) {
  return Axios.post(`/v1/subscriptionFreeze/unfreeze`, data)
}
