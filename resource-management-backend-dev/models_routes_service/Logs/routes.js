const router = require('express').Router()
const logService = require('./services')
const { setLanguage, isAuthenticated, isAuthorized } = require('../../middlewares/middleware')
const { checkDownLoadExcelLimitByIp } = require('../../helper/redis')

router.get('/logs/v1', setLanguage, isAuthenticated, isAuthorized('VIEW_LOGS'), logService.LogsDetails)
    .put('/logs/v1', setLanguage, isAuthenticated, isAuthorized('UPDATE_LOGS'), logService.updateLogs)
    // .post('/DownloadExcel', setLanguage, checkDownLoadExcelLimitByIp, isAuthenticated, logService.DownloadExcel)
    .post('/DownloadExcel', setLanguage, isAuthenticated, checkDownLoadExcelLimitByIp, isAuthorized('DOWNLOAD_EXCEL'), logService.DownloadExcel)
    .get('/bucketInfo', isAuthorized('VIEW_S3BUCKETINFO'), logService.getBucket)

    // .post('/sendMailPostmark', setLanguage, isAuthenticated, logService.sendMailPostmark)

    .post('/addLogs', logService.addLogs)

    .get('/getLogs', logService.getLogs)

    .get('/getNetLogs', logService.getNetLogs)

    .put('/updateLogs', logService.updateYearLogs)

    .put('/logs/projectContract', setLanguage, isAuthenticated, logService.updateProjectContract)
    .get('/ProjectFetch/:id', setLanguage, isAuthenticated, logService.ProjectFetch)
    .get('/removeNetLogsCron', setLanguage, logService.removeNetLogsCron)
    .get('/removeOpLogsCron', setLanguage, logService.removeOpLogsCron)

module.exports = router
