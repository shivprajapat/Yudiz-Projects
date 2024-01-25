const router = require('express').Router()
const studentImportServices = require('./services')
const { isCenterAuthenticated } = require('../../../middlewares/middleware')
const { multerUpload } = require('../../../helper/file.upload')

router.post('/v1/center/import/student', multerUpload.fields([{
  name: 'student_import_file',
  maxCount: 1
}
]), isCenterAuthenticated, studentImportServices.addStudentsData)

module.exports = router
