const router = require('express').Router()
const departmentService = require('./services')
const validators = require('./validators')
const { validate, setLanguage, isAuthenticated, isAuthorized } = require('../../middlewares/middleware')

router.use(setLanguage, isAuthenticated)
  .post('/departments/v1', isAuthorized('CREATE_DEPARTMENT'), validators.departmentCheckV1, validate, departmentService.addDepartment)
  .delete('/departments/:id/v1', isAuthorized('DELETE_DEPARTMENT'), validators.departmentCheckIdV1, validate, departmentService.deleteDepartments)
  .put('/departments/:id/v1', isAuthorized('UPDATE_DEPARTMENT'), validators.updateDepartmentsCheckV1, validate, departmentService.updateDepartments)
  .get('/departments/v1', isAuthorized('VIEW_DEPARTMENT'), departmentService.getDepartments)
  .post('/departmentWiseEmployee/v1', isAuthorized('VIEW_EMPLOYEE'), departmentService.getDepartmentWiseEmployee)
  .get('/department/summery/:id/v1', departmentService.getDepartmentSummery)
  .delete('/deleteSubDepartment/v1', departmentService.deleteSubDepartment)
  .get('/department/summery/employee/:id', departmentService.getDepartmentSummeryEmployee)

module.exports = router
