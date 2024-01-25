export const route = {
  login: '/login',
  dashboard: '/dashboard',
  organizations: '/organizations',
  organizationsAddViewEdit: dynamicRoutes('organizations'),
  customers: '/customers',
  customersAddViewEdit: dynamicRoutes('customers'),
  employees: '/employees',
  employeesAddViewEdit: dynamicRoutes('employees'),
  trainers: '/trainers',
  trainersAddViewEdit: dynamicRoutes('trainers'),
  subscriptions: '/subscriptions',
  subscriptionsAddViewEdit: dynamicRoutes('subscriptions'),
  transactions: '/transactions',
  transactionsAddViewEdit: dynamicRoutes('transactions'),
  inquiry: '/inquiry',
  inquiryAddViewEdit: dynamicRoutes('inquiry'),
  batchSchedules: '/batchSchedules',
  batchSchedulesAddViewEdit: dynamicRoutes('batchSchedules'),
  mealPlans: '/mealPlans',
  mealPlansAddViewEdit: dynamicRoutes('mealPlans'),
  lifeCycles: '/customers/lifeCycles',
  lifeCyclesAddViewEdit: (id) => `/customers/lifecycle/${id}`,
  questions: '/questions',
  designation: '/designation'
}
function dynamicRoutes(module = '') {
  function commonRoutes({ id, type, postfixurl = '' }) {
    let isValidType = ['add', 'edit', 'view', ':type'].includes(type)

    if (!isValidType) throw new Error('Invalid type')
    return `${route?.[module] || module}/${type}${id ? `/${id}` : ''}${postfixurl ? `/${postfixurl}` : ''}`
  }
  return (type, id, postfixurl) => commonRoutes({ id, type, module, postfixurl })
}
