const { paymentPayumoneyResponse, paymentPayumoneyFail, paymentCenterPayumoneyResponse, paymentCenterPayumoneyFail } = require('../helper/payumoney')
const config = require('../config/config-file')

module.exports = (app) => {
  app.use('/api', [

    // admin
    require('../models-routes-services/admin/auth/routes'),
    require('../models-routes-services/admin/package/routes'),
    require('../models-routes-services/admin/state/routes'),
    require('../models-routes-services/admin/city/routes'),
    require('../models-routes-services/admin/roles/routes'),
    require('../models-routes-services/admin/grade/routes.js'),
    require('../models-routes-services/admin/university/routes'),
    require('../models-routes-services/admin/board/routes'),
    require('../models-routes-services/admin/school/routes'),
    require('../models-routes-services/admin/software_matrix/routes'),
    require('../models-routes-services/admin/qualification/routes'),
    require('../models-routes-services/admin/test/test-category/routes'),
    require('../models-routes-services/admin/test/test-sub-category/routes'),
    require('../models-routes-services/admin/test_time_norms/routes'),
    require('../models-routes-services/admin/question/routes'),
    require('../models-routes-services/admin/norms/routes'),
    require('../models-routes-services/admin/norm-grades/routes'),
    require('../models-routes-services/admin/test-norm-description/routes'),
    require('../models-routes-services/admin/career-profile/routes'),
    require('../models-routes-services/admin/issue-category/routes'),
    require('../models-routes-services/admin/counsellor/routes'),
    require('../models-routes-services/admin/center/routes'),
    require('../models-routes-services/admin/student/routes'),
    require('../models-routes-services/admin/admin-profile/routes'),
    require('../models-routes-services/admin/sessions/routes'),
    require('../models-routes-services/admin/dashboard/routes'),
    require('../models-routes-services/admin/student-import/routes'),
    require('../models-routes-services/admin/center/redeem/routes'),
    require('../models-routes-services/admin/counsellor/redeem/routes'),
    require('../models-routes-services/admin/coupon-code/routes'),
    require('../models-routes-services/admin/csv/routes'),

    // student
    require('../models-routes-services/student/auth/routes'),
    require('../models-routes-services/student/counsellor/routes'),
    require('../models-routes-services/student/profile/routes'),
    require('../models-routes-services/student/grade/routes.js'),
    require('../models-routes-services/student/timeslot/routes'),
    require('../models-routes-services/student/board/routes.js'),
    require('../models-routes-services/student/school/routes.js'),
    require('../models-routes-services/student/dashboard/routes'),
    require('../models-routes-services/student/package/routes'),
    require('../models-routes-services/student/test/routes'),
    require('../models-routes-services/student/test/test_report/routes'),
    // counsellor
    require('../models-routes-services/counsellor/routes'),
    require('../models-routes-services/counsellor/availability/routes'),
    require('../models-routes-services/counsellor/sessions/routes'),
    require('../models-routes-services/counsellor/settings/routes'),
    require('../models-routes-services/counsellor/revenue/routes'),
    require('../models-routes-services/counsellor/redeem/routes'),
    // common
    require('../models-routes-services/common/city/routes.js'),
    require('../models-routes-services/common/state/routes.js'),
    require('../models-routes-services/common/country/routes.js'),
    require('../models-routes-services/common/university/routes.js'),
    require('../models-routes-services/common/center/routes.js'),
    require('../models-routes-services/common/routes.js'),
    // center
    require('../models-routes-services/center/Auth/routes'),
    require('../models-routes-services/center/dashboard/routes'),
    require('../models-routes-services/center/profile/routes'),
    require('../models-routes-services/center/Auth/routes'),
    require('../models-routes-services/center/student/routes'),
    require('../models-routes-services/center/sessions/routes'),
    require('../models-routes-services/center/counsellor/routes'),
    require('../models-routes-services/center/packages/routes'),
    require('../models-routes-services/center/revenue/routes'),
    require('../models-routes-services/center/redeem/routes'),
    require('../models-routes-services/center/student-import/routes')
  ])
  app.get('/ping', (req, res) => {
    return res.send('Pong..!')
  })
  app.get('/health-check', (req, res) => {
    const sDate = new Date().toJSON()
    return res.status(200).jsonp({ status: 200, sDate })
  })
  /** For student package payment response */
  app.post('/payumoney/success', async (req, res) => {
    let redirectUrl = `${config.FRONTEND_HOST_URL}/payment-fail`
    try {
      console.log('payment success body : ' + JSON.stringify(req.body))
      const packageSuccess = await paymentPayumoneyResponse(req.body)
      if (packageSuccess) {
        redirectUrl = `${config.FRONTEND_HOST_URL}/thank-you`
      }
      res.redirect(redirectUrl)
    } catch (e) {
      res.redirect(redirectUrl)
    }
  })
  app.post('/payumoney/fail', async (req, res) => {
    const redirectUrl = `${config.FRONTEND_HOST_URL}/payment-fail`
    try {
      console.log('payment erro body : ' + JSON.stringify(req.body))
      await paymentPayumoneyFail(req.body)
      res.redirect(redirectUrl)
    } catch (e) {
      await paymentPayumoneyFail(req.body)
      res.redirect(redirectUrl)
    }
  })
  app.get('/payumoney/fail', async (req, res) => {
    const redirectUrl = `${config.FRONTEND_HOST_URL}/payment-fail`
    try {
      console.log('payment erro body : ' + JSON.stringify(req.body))
      res.redirect(redirectUrl)
    } catch (e) {
      res.redirect(redirectUrl)
    }
  })

  /** For center package payment response */
  app.post('/center/payumoney/success', async (req, res) => {
    let redirectUrl = `${config.ADMIN_HOST_URL}/center/payment-fail`
    try {
      console.log('payment success body : ' + JSON.stringify(req.body))
      const packageSuccess = await paymentCenterPayumoneyResponse(req.body)
      if (packageSuccess) {
        redirectUrl = `${config.ADMIN_HOST_URL}/center/thank-you`
      }
      res.redirect(redirectUrl)
    } catch (e) {
      res.redirect(redirectUrl)
    }
  })
  app.post('/center/payumoney/fail', async (req, res) => {
    const redirectUrl = `${config.ADMIN_HOST_URL}/center/payment-fail`
    try {
      console.log('center payment erro body : ' + JSON.stringify(req.body))
      await paymentCenterPayumoneyFail(req.body)
      res.redirect(redirectUrl)
    } catch (e) {
      await paymentCenterPayumoneyFail(req.body)
      res.redirect(redirectUrl)
    }
  })
  app.get('/center/payumoney/fail', async (req, res) => {
    const redirectUrl = `${config.ADMIN_HOST_URL}/center/payment-fail`
    try {
      console.log('center payment erro body : ' + JSON.stringify(req.body))
      res.redirect(redirectUrl)
    } catch (e) {
      res.redirect(redirectUrl)
    }
  })
  app.get('*', (req, res) => {
    return res.status(404).send('404')
  })
}
