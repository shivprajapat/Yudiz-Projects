const matchController = require('./match-management/controllers')
const seoController = require('./seo/controllers')
const globalWidgetController = require('./global-widget/controllers')
const authControllers = require('./authentication/controllers')

const controllers = { ...matchController, ...seoController, ...globalWidgetController, ...authControllers }

module.exports = controllers
