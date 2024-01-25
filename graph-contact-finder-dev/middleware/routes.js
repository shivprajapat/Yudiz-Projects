// @ts-check
const { responseMessage } = require('../helpers/utilityServices')
module.exports = (app) => {
  app.use('/api', [
    require('../models-routes-controllers/user/routes'),
    require('../models-routes-controllers/admin/auth/routes'),
    require('../models-routes-controllers/admin/permissions/routes'),
    require('../models-routes-controllers/admin/roles/routes'),
    require('../models-routes-controllers/report/routes'),
    require('../models-routes-controllers/admin/subAdmin/routes'),
    require('../models-routes-controllers/notification/routes'),
    require('../models-routes-controllers/admin/profession/routes'),
    require('../models-routes-controllers/admin/city/routes'),
    require('../models-routes-controllers/request/routes'),
    require('../models-routes-controllers/otp/routes'),
    require('../models-routes-controllers/review/routes'),
    require('../models-routes-controllers/user/professionDetails/routes')
  ])
  app.all('*', (req, res) => {
    return responseMessage(req, res, 'NotFound', 'RouteNotFound')
  })
}
