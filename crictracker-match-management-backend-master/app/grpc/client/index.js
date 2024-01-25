const seoControllers = require('./seo/controllers')
const articleControllers = require('./article/controllers')
const globalWidgetControllers = require('./global-widget/controllers')

const controllers = { ...seoControllers, ...articleControllers, ...globalWidgetControllers }

module.exports = controllers
