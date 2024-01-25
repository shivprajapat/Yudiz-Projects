/* eslint-disable indent */

const { body, param } = require('express-validator')

const updateProjectStatus = [
    param('id').not().isEmpty().isMongoId(),
    body('eProjectStatus').trim().not().isEmpty()
]

module.exports = {
    updateProjectStatus
}
