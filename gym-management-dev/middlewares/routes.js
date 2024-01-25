// @ts-check
module.exports = (app) => {
  app.use('/api/v1/dashboard', require('../models-routes-services/dashboard/routes'))
  app.use('/api/v1/lifecycle', require('../models-routes-services/customer/lifecycleHistory/routes'))
  app.use('/api/v1/organization', require('../models-routes-services/organization/routes'))
  app.use('/api/v1/admin', require('../models-routes-services/admin/routes'))
  app.use('/api/v1/customer', require('../models-routes-services/customer/routes'))
  app.use('/api/v1/question', require('../models-routes-services/question/routes'))
  app.use('/api/v1/exercise', require('../models-routes-services/exercise/routes'))
  app.use('/api/v1/employee', require('../models-routes-services/employee/routes'))
  app.use('/api/v1/subscription', require('../models-routes-services/subscription/routes'))
  app.use('/api/v1/transaction', require('../models-routes-services/transaction/routes'))
  app.use('/api/v1/inquiry', require('../models-routes-services/inquiry/routes'))
  app.use('/api/v1/inquiryFollowup', require('../models-routes-services/inquiry/inquiryFollowup/routes'))
  app.use('/api/v1/inquiryVisit', require('../models-routes-services/inquiry/inquiryVisit/routes'))
  app.use('/api/v1/subscriptionFreeze', require('../models-routes-services/subscription/subscriptionFreezeLog/routes'))
  app.use('/api/v1/mealPlan', require('../models-routes-services/mealPlan/routes'))
  app.use('/api/v1/mealPlanDetails', require('../models-routes-services/mealPlan/mealPlanDetails/routes'))
  app.use('/api/v1/workoutPlan', require('../models-routes-services/workoutPlan/routes'))
  app.use('/api/v1/workoutPlanDetails', require('../models-routes-services/workoutPlan/workoutPlanDetails/routes'))
  app.use('/api/v1/report', require('../models-routes-services/report/routes'))
  app.use('/api/v1/batchSchedule', require('../models-routes-services/batchSchedule/routes'))
  app.use('/api/v1/setting', require('../models-routes-services/setting/routes'))

  app.get('*', (req, res) => {
    return res.status(404).send({ message: '404 Page Not Found' })
  })
}
