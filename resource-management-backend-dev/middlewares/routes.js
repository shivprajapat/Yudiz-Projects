module.exports = (app) => {
  app.use('/api', [
    require('../models_routes_service/Employee/routes'),
    require('../models_routes_service/Department/routes'),
    require('../models_routes_service/Technology/routes'),
    require('../models_routes_service/Skill/routes'),
    require('../models_routes_service/JobProfile/routes'),
    require('../models_routes_service/Client/routes'),
    require('../models_routes_service/ProjectTag/routes'),
    require('../models_routes_service/Project/routes'),
    require('../models_routes_service/Interview/routes'),
    require('../models_routes_service/DashBoard/routes'),
    require('../models_routes_service/Logs/routes'),
    require('../models_routes_service/Notification/routes'),
    require('../models_routes_service/WorkLogs/routes'),
    require('../models_routes_service/ChangeRequest/routes'),
    require('../models_routes_service/organizationDetail/routes'),
    require('../models_routes_service/Currency/routes'),
    require('../models_routes_service/Role/routes'),
    require('../models_routes_service/Permission/routes'),
    require('../models_routes_service/OrganizationBranch/routes')
  ])

  app.get('/health-check', (req, res) => {
    const sDate = new Date().toJSON()
    return res.status(200).jsonp({ status: 200, sDate, deployment: process.env.NODE_ENV })
  })

  app.get('/', (req, res) => {
    return res.status(200).jsonp({ status: 200, message: 'Welcome to the RMS Yudiz' })
  })

  app.get('*', (req, res) => {
    return res.status(404).send('404  - Page not found')
  })
}
