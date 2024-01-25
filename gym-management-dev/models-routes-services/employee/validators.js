const { body, param, query } = require('express-validator')
const { trainerType, gender, userType } = require('../../data')

const addEmployee = [
  body('sName').trim().not().isEmpty(),
  body('eUserType').trim().not().isEmpty().isIn(userType),
  body('sEmail').not().isEmpty().isEmail().optional(),
  body('sMobile').not().isEmpty().isMobilePhone(),
  body('nAge').not().isEmpty().isInt({ min: 17, max: 100 }),
  body('eGender').not().isEmpty().isIn(gender),
  body('sAddress').trim().not().isEmpty(),
  body('nExpertLevel').optional().isInt({ min: 1, max: 10 }),
  body('eType').optional().isIn(trainerType),
  body('sExperience').trim().not().isEmpty().optional(),
  body('nCharges').not().isEmpty().isInt().optional(),
  body('nCommission').optional().isInt(),
  body('dBirthDate').optional().isDate(),
  body('dAnniversaryDate').optional().isDate(),
  body('aBranchId.*').isMongoId().optional()
]

const getEmployee = [
  param('id').isMongoId()
]

const updateEmployee = [
  param('id').isMongoId(),
  body('sName').trim().not().isEmpty(),
  body('sEmail').not().isEmpty().isEmail().optional(),
  body('sMobile').not().isEmpty().isMobilePhone(),
  body('nAge').not().isEmpty().isInt({ min: 17, max: 100 }),
  body('eGender').not().isEmpty().isIn(gender),
  body('sAddress').trim().not().isEmpty(),
  body('nExpertLevel').not().isEmpty().isInt({ min: 1, max: 10 }).optional(),
  body('eType').not().isEmpty().isIn(trainerType).optional(),
  body('sExperience').trim().not().isEmpty().optional(),
  body('nCharges').not().isEmpty().isInt().optional(),
  body('nCommission').optional().isInt(),
  body('dBirthDate').optional().trim(),
  body('dAnniversaryDate').optional().trim(),
  body('aBranchId.*.').isMongoId().optional()
]

const deleteEmployee = [
  param('id').isMongoId()
]

const getEmployeeList = [
  query('eUserType').optional().trim().notEmpty().isIn(userType),
  query('aBranchId.*').isMongoId().optional()
]

module.exports = {
  addEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeList
}
