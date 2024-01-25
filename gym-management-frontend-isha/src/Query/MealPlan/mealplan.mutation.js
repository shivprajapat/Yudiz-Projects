/* eslint-disable no-unused-vars */
import { addQueryParams } from 'helpers'
import Axios from '../../axios'

export function addMealPlan(data) {
  return Axios.put(`/v1/mealPlan/add`, data)
}

export async function updateMealPlan({ newData, id }) {
  return Axios.patch(`/v1/mealPlan/edit/${id}`, newData)
}

export function deleteMealPlan(id) {
  return Axios.delete(`/v1/mealPlan/delete/${id}`)
}

// meal plan schedule
export function addMealSchedule(data) {
  return Axios.put(`/v1/mealPlanDetails/add`, data)
}

export async function updateMealSchedule({ newData, id }) {
  return Axios.patch(`/v1/mealPlanDetails/edit?iMealPlanId=${id}`, newData)
}
