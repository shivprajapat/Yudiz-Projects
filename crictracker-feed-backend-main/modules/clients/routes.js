const router = require('express').Router()
const clientsServices = require('./services')
const { clientStore, clientLogin, clientChangePassword, clientForgotPassword, clientResetPassword, getGeneralApiStats } = require('./validators')
const { isAdminAuthenticated, setLanguage } = require('../admins/middleware')
const { isClientAuthenticated, checkArticleSubType, checkCatSubType, isFeedClientAuthenticated } = require('./middleware')

router.post('/', isAdminAuthenticated, clientStore, clientsServices.store)
router.put('/regenerate-token', isClientAuthenticated, clientsServices.regenerateToken)
router.post('/login', clientLogin, setLanguage, clientsServices.login)
router.post('/change-password', clientChangePassword, isClientAuthenticated, clientsServices.changePassword)
router.post('/forgot-password', clientForgotPassword, setLanguage, clientsServices.forgotPassword)
router.post('/reset-password', clientResetPassword, setLanguage, clientsServices.resetPassword)
router.delete('/invalid-tokens', setLanguage, clientsServices.removeInvalidTokens)

router.get('/', isClientAuthenticated, clientsServices.fetchClient)

router.get('/get-api-stats', getGeneralApiStats, isFeedClientAuthenticated, clientsServices.getGeneralApiStats)
router.get('/articles-fetched', isFeedClientAuthenticated, checkArticleSubType, clientsServices.getArticleApiStats)
router.get('/category-articles-fetched', isFeedClientAuthenticated, checkCatSubType, clientsServices.getCategoryApiStats)

module.exports = router
