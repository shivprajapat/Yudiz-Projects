const router = require('express').Router()
const studentImportServices = require('./services')
const { isAdminAuthenticated } = require('../../../middlewares/middleware')
const { multerUpload } = require('../../../helper/file.upload')

router.post('/v1/admin/import/student', multerUpload.fields([{
  name: 'student_import_file',
  maxCount: 1
}
]), isAdminAuthenticated, studentImportServices.addStudentsData)
router.get('/v1/create/import/student', studentImportServices.createStudent)

module.exports = router
