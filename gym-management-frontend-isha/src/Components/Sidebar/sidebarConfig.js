
import { route } from 'Routes/route'

import EmployeeManagement from 'Assets/Icons/EmployeeManagement'
import Organizations from 'Assets/Icons/Organization'
import Subscriptions from 'Assets/Icons/Subscription'
import Transactions from 'Assets/Icons/Transactions'
import Designation from 'Assets/Icons/Designation'
import Dashboard from 'Assets/Icons/Dashboard'
import interview from 'Assets/Icons/Interview'
import Trainers from 'Assets/Icons/Trainers'
import Schedule from 'Assets/Icons/Schedule'
// import MealPlan from 'Assets/Icons/MealPlan'
import Question from 'Assets/Icons/Question'

export const sidebarConfig = [
  { Component: Dashboard, title: 'Dashboard', link: route.dashboard, color: '#884B9D', allowed: 'noRole' },
  { Component: Organizations, title: 'Organizations', link: route.organizations, color: '#0B1C3C', allowed: 'noRole' },
  { Component: Schedule, title: 'Batch Schedule', link: route.batchSchedules, color: '#0EA085', allowed: 'noRole' },
  { Component: Trainers, title: 'Employees', link: route.employees, color: '#F29B20', allowed: 'noRole' },
  // { Component: Trainers, title: 'Trainers', link: route.trainers, color: '#288BA8', allowed: 'noRole' },
  { Component: EmployeeManagement, title: 'Customers', link: route.customers, color: '#884B9D', allowed: 'noRole' },
  // { Component: MealPlan, title: 'Meal Plan', link: route.mealPlans, color: '#0B1C3C', allowed: 'noRole' },
  { Component: Subscriptions, title: 'Subscriptions', link: route.subscriptions, color: '#0EA085', allowed: 'noRole' },
  { Component: Transactions, title: 'Transactions', link: route.transactions, color: '#F29B20', allowed: 'noRole' },
  { Component: interview, title: 'Inquiry', link: route.inquiry, color: '#288BA8', allowed: 'noRole' },
  { Component: Question, title: 'Question', link: route.questions, color: '#288BA8', allowed: 'noRole' },
  { Component: Designation, title: 'Designation', link: route.designation, color: '#884B9D', allowed: 'noRole' },
]

