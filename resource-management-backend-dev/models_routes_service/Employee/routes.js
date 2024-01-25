const router = require('express').Router()
const validators = require('./validators')
const employeeService = require('./services')
const { validate, isAuthenticated, setLanguage, decrypt, decryptForChangePassword, decryptForForgotPassword, isAuthorized } = require('../../middlewares/middleware')
const { checkLoginLimitByIp } = require('../../helper/redis')
const { checkCurrency } = require('./validators')

router.post('/employee/signup/v1', setLanguage, validators.registerUserV1, validate, employeeService.signUp)
  .post('/employee/login/v1', setLanguage, checkLoginLimitByIp, validators.loginUserV1, validate, decrypt, employeeService.login)
  .put('/employee/logout/v1', setLanguage, isAuthenticated, employeeService.logout)
  .get('/loggedinUser/v1', setLanguage, isAuthenticated, isAuthorized('VIEW_EMPLOYEE'), employeeService.getLoginUser)
  .post('/employee/forgot-password', setLanguage, validators.forgotPasswordV1, validate, employeeService.forgot_password)
  .post('/employee/reset-password', setLanguage, decryptForForgotPassword, employeeService.reset_password)
  .post('/employee/CreateEmployee', setLanguage, isAuthenticated, isAuthorized('CREATE_EMPLOYEE'), validators.CreateEmployee, validate, employeeService.CreateEmployee)
  // .get('/employees/v1', setLanguage, isAuthenticated, validate, employeeService.EmployeeDetails)
  .get('/employee/employeeDetails/v1', setLanguage, isAuthenticated, isAuthorized('VIEW_EMPLOYEE'), validate, employeeService.EmployeeDetails)
  .get('/employee/EmployeeDetail/:id', setLanguage, isAuthenticated, isAuthorized('VIEW_EMPLOYEE'), validators.EmployeeDetail, validate, employeeService.EmployeeDetail)
  .put('/employee/EmployeeUpdate/:id', setLanguage, isAuthenticated, isAuthorized('UPDATE_EMPLOYEE'), validators.EmployeeUpdate, validate, employeeService.EmployeeUpdate)
  .delete('/employee/EmployeeDelete/:id', setLanguage, isAuthenticated, isAuthorized('DELETE_EMPLOYEE'), validators.deleteEmployee, validate, employeeService.EmployeeDelete)
  .get('/employee/search/v1', setLanguage, isAuthenticated, isAuthorized('VIEW_EMPLOYEE'), employeeService.employeeExists)
  .post('/employee/change-password/v1', setLanguage, isAuthenticated, isAuthorized('VIEW_EMPLOYEE'), validators.changePasswordValidateV1, validate, decryptForChangePassword, employeeService.changePassword)
  .post('/pre-signed-url/v1', setLanguage, isAuthenticated, validators.userPreSignedUrlCheck, validate, employeeService.getSignedUrl)
  .get('/generate', employeeService.generate)
  .get('/dgenerate', employeeService.dgenerate)
  .get('/employee/all/v1', setLanguage, isAuthenticated, isAuthorized('VIEW_EMPLOYEE'), employeeService.getAllEmployee)
// .get('/employees/v1', setLanguage, isAuthenticated, validate, employeeService.EmployeeDetails)

router.get('/user/profile/v1', setLanguage, isAuthenticated, isAuthorized('VIEW_USERPROFILE'), employeeService.getUser)
router.get('/user/profile/getUserProjects/v1', setLanguage, isAuthenticated, isAuthorized('VIEW_USERPROFILE'), employeeService.getUserProjects)
router.put('/user/profile/update/v1', setLanguage, isAuthenticated, isAuthorized('UPDATE_USERPROFILE'), employeeService.updateUserProfile)
router.put('/user/profile/update/skills/v1', setLanguage, isAuthenticated, isAuthorized('UPDATE_USERPROFILE'), employeeService.updateUserSkills)

router.post('/devicetoken/v1', setLanguage, isAuthenticated, validators.deviceTokenValidate, employeeService.addDeviceToken)

// currency api
router.post('/currencies/v1', setLanguage, isAuthenticated, isAuthorized('UPDATE_EMPLOYEE'), checkCurrency, validate, employeeService.addCurrency)
router.put('/currencies/v1', setLanguage, isAuthenticated, isAuthorized('UPDATE_EMPLOYEE'), checkCurrency, validate, employeeService.updateCurrency)

router.post('/cewp/v1', setLanguage, isAuthenticated, employeeService.cewp)
router.post('/setpassword/v1', setLanguage, employeeService.setpassword)

router.get('/employeeCurrency/v1', setLanguage, isAuthenticated, employeeService.employeeCurrencies)

router.get('/animation', employeeService.animation)

module.exports = router
