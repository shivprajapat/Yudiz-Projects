import { lazy } from 'react'
import { route } from './route'

const PublicRoute = lazy(() => import('./PublicRoute'))
const PrivateRoute = lazy(() => import('./PrivateRoute'))

// public Routes Files
const Login = lazy(() => import('Pages/Auth/Login'))

// Private Routes Files
const Dashboard = lazy(() => import('Pages/Dashboard'))
const OrganizationList = lazy(() => import('Pages/Organization'))
const AddOrganization = lazy(() => import('Pages/Organization/Add-Organization'))
const CustomersList = lazy(() => import('Pages/Customer'))
const AddCustomer = lazy(() => import('Pages/Customer/Add-Customer'))
// const TrainersList = lazy(() => import('Pages/Trainer'))
const SubscriptionList = lazy(() => import('Pages/Subscription'))
// const AddTrainer = lazy(() => import('Pages/Trainer/Add-Trainer'))
const AddSubscription = lazy(() => import('Pages/Subscription/Add-Subscription'))
const AddTransaction = lazy(() => import('Pages/Transaction/Add-Transaction'))
const TransactionsList = lazy(() => import('Pages/Transaction'))
const InquiryList = lazy(() => import('Pages/Inquiry'))
const AddInquiry = lazy(() => import('Pages/Inquiry/Add-Inquiry'))
const EmployeeList = lazy(() => import('Pages/Employee'))
const AddEmployee = lazy(() => import('Pages/Employee/Add-Employee'))
const BatchScheduleList = lazy(() => import('Pages/BatchSchedule'))
const AddBatchSchedule = lazy(() => import('Pages/BatchSchedule/Add-BatchSchedule'))
// const MealPlanList = lazy(() => import('Pages/MealPlan'))
// const AddMealPlan = lazy(() => import('Pages/MealPlan/Add-MealPlan'))
// const LifeCyclesList = lazy(() => import('Pages/LifeCycle'))
const AddLifeCycle = lazy(() => import('Pages/LifeCycle/Add-LifeCycle'))
const Questions = lazy(() => import('Pages/Questions'))
const Designation = lazy(() => import('Pages/Designation'))

const RoutesDetails = [
  {
    defaultRoute: '',
    Component: PublicRoute,
    props: {},
    isPrivateRoute: false,
    children: [{ path: '/login', Component: Login, exact: true }],
  },
  {
    defaultRoute: '',
    Component: PrivateRoute,
    props: {},
    isPrivateRoute: true,
    children: [
      { path: route.dashboard, Component: Dashboard, allowed: 'noRole', exact: true },

      { path: route.organizations, Component: OrganizationList, allowed: 'noRole', exact: true },
      { path: route.organizationsAddViewEdit(':type'), Component: AddOrganization, allowed: 'noRole', exact: true },
      { path: route.organizationsAddViewEdit(':type', ':id'), Component: AddOrganization, allowed: 'noRole', exact: true },

      { path: route.customers, Component: CustomersList, allowed: 'noRole', exact: true },
      { path: route.customersAddViewEdit(':type'), Component: AddCustomer, allowed: 'noRole', exact: true },
      { path: route.customersAddViewEdit('edit', ':id'), Component: AddCustomer, allowed: 'noRole', exact: true },

      // { path: route.lifeCycles, Component: CustomersList, allowed: 'noRole', exact: true },
      // { path: route.lifeCyclesAddViewEdit(':type'), Component: AddLifeCycle, allowed: 'noRole', exact: true },
      { path: route.lifeCyclesAddViewEdit(':id'), Component: AddLifeCycle, allowed: 'noRole', exact: true },

      // { path: route.mealPlans, Component: MealPlanList, allowed: 'noRole', exact: true },
      // { path: route.mealPlansAddViewEdit(':type'), Component: AddMealPlan, allowed: 'noRole', exact: true },
      // { path: route.mealPlansAddViewEdit(':type', ':id'), Component: AddMealPlan, allowed: 'noRole', exact: true },

      { path: route.batchSchedules, Component: BatchScheduleList, allowed: 'noRole', exact: true },
      { path: route.batchSchedulesAddViewEdit(':type'), Component: AddBatchSchedule, allowed: 'noRole', exact: true },
      { path: route.batchSchedulesAddViewEdit(':type', ':id'), Component: AddBatchSchedule, allowed: 'noRole', exact: true },

      { path: route.employees, Component: EmployeeList, allowed: 'noRole', exact: true },
      { path: route.employeesAddViewEdit(':type'), Component: AddEmployee, allowed: 'noRole', exact: true },
      { path: route.employeesAddViewEdit(':type', ':id'), Component: AddEmployee, allowed: 'noRole', exact: true },

      // { path: route.trainers, Component: TrainersList, allowed: 'noRole', exact: true },
      // { path: route.trainersAddViewEdit(':type'), Component: AddEmployee, allowed: 'noRole', exact: true },
      // { path: route.trainersAddViewEdit(':type', ':id'), Component: AddEmployee, allowed: 'noRole', exact: true },

      { path: route.subscriptions, Component: SubscriptionList, allowed: 'noRole', exact: true },
      { path: route.subscriptionsAddViewEdit(':type'), Component: AddSubscription, allowed: 'noRole', exact: true },
      { path: route.subscriptionsAddViewEdit(':type', ':id'), Component: AddSubscription, allowed: 'noRole', exact: true },
      { path: route.transactions, Component: TransactionsList, allowed: 'noRole', exact: true },
      { path: route.transactionsAddViewEdit(':type'), Component: AddTransaction, allowed: 'noRole', exact: true },
      { path: route.transactionsAddViewEdit(':type', ':id'), Component: AddTransaction, allowed: 'noRole', exact: true },

      { path: route.inquiry, Component: InquiryList, allowed: 'noRole', exact: true },
      { path: route.inquiryAddViewEdit(':type'), Component: AddInquiry, allowed: 'noRole', exact: true },
      { path: route.inquiryAddViewEdit(':type', ':id'), Component: AddInquiry, allowed: 'noRole', exact: true },

      { path: route.questions, Component: Questions, allowed: 'noRole', exact: true },

      { path: route.designation, Component: Designation, allowed: 'noRole', exact: true },


    ],
  },
]

export default RoutesDetails
