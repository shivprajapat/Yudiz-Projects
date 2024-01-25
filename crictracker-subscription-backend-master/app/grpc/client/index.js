const subscriptionController = require('./seo/controllers')
const authControllers = require('./authentication/controllers')
const globalWidgetGrpcUrl = require('./global-widget/controllers')

const controllers = { ...subscriptionController, ...authControllers, ...globalWidgetGrpcUrl }

module.exports = controllers
