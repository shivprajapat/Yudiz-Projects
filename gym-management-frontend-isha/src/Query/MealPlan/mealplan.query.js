import { addQueryParams } from 'helpers'
import Axios from '../../axios'

export function getMealPlanList(query) {
  return Axios.get(`/v1/mealPlan/list/all?${addQueryParams(query)}`)
}

export function getSpecificMealPlan(id) {
  return Axios.get(`/v1/mealPlan/${id}`)
}

// get meal plan schedule
export function getMealScheduleList(id) {
  return Axios.get(`/v1/mealPlanDetails/list/all?order=asc&iMealPlanId=${id}`)
} 