const { status, jsonStatus } = require('../../helper/api.responses')
const { body, param } = require('express-validator')

const { isValidId, isValidNumber } = require('../../helper/utilities.services')

function flag1(req) {
  const errors = []

  if (!req.body.sName || (req.body.sName.trim()).length === 0) {
    errors.push({ msg: 'Invalid Value', value: req.body?.sName || '', location: 'body', param: 'sName' })
  }
  // if (!req.body.iBAId || !isValidId(req.body.iBAId)) {
  //   errors.push({ msg: 'Invalid Value', value: req.body?.iBAId || '', location: 'body', param: 'iBAId' })
  // }
  // if (!req.body.iBDId || !isValidId(req.body.iBDId)) {
  //   errors.push({ msg: 'Invalid Value', value: req.body?.iBDId || '', location: 'body', param: 'iBDId' })
  // }
  // if (!req.body.iProjectManagerId || !isValidId(req.body.iProjectManagerId)) {
  //   errors.push({ msg: 'Invalid Value', value: req.body?.iProjectManagerId || '', location: 'body', param: 'iProjectManagerId' })
  // }
  // if (!req.body.aProjectTag || req.body.aProjectTag.length === 0) {
  //   errors.push({ msg: 'Invalid Value', value: req.body?.aProjectTag || '', location: 'body', param: 'aProjectTag' })
  // }
  // if (!req.body.aTechnology || req.body.aTechnology.length === 0) {
  //   errors.push({ msg: 'Invalid Value', value: req.body?.aTechnology || '', location: 'body', param: 'aTechnology' })
  // }
  // if (!req.body.aClient || req.body.aClient.length === 0) {
  //   errors.push({ msg: 'Invalid Value', value: req.body?.aClient || '', location: 'body', param: 'aClient' })
  // }
  // if (!req.body.sLogo || (req.body.sLogo.trim()).length === 0) {
  //   errors.push({ msg: 'Invalid Value', value: req.body?.sLogo || '', location: 'body', param: 'sLogo' })
  // }

  // if (req.body.aClient) {
  //   const arrayValidate = req.body.aClient.filter(employee => {
  //     if (!employee.iClientId || !isValidId(employee.iClientId)) {
  //       return true
  //     }
  //     return false
  //   })

  //   if (arrayValidate.length > 0) {
  //     errors.push({ msg: 'Invalid Value', value: arrayValidate || '', location: 'body', param: 'aClient' })
  //   }
  // }
  // if (req.body.aTechnology) {
  //   const arrayValidate = req.body.aTechnology.filter(technology => {
  //     if (!technology.iTechnologyId || !isValidId(technology.iTechnologyId)) {
  //       return true
  //     }
  //     return false
  //   })

  //   if (arrayValidate.length > 0) {
  //     errors.push({ msg: 'Invalid Value', value: arrayValidate || '', location: 'body', param: 'iTechnologyId' })
  //   }
  // }

  // if (req.body.aProjectTag) {
  //   const arrayValidate = req.body.aProjectTag.filter(projectTag => {
  //     if (!projectTag.iProjectTagId || !isValidId(projectTag.iProjectTagId)) {
  //       return true
  //     }
  //     return false
  //   })

  //   if (arrayValidate.length > 0) {
  //     errors.push({ msg: 'Invalid Value', value: arrayValidate || '', location: 'body', param: 'iProjectTagId' })
  //   }
  // }

  return errors
}
function flag2(req) {
  const errors = []

  if (!req.body.iProjectId || !isValidId(req.body.iProjectId)) {
    errors.push({ msg: 'Invalid Value', value: req.body?.iProjectId || '', location: 'body', param: 'iProjectId' })
  }

  if (req.body.eProjectType === 'Dedicated') {
    // if (!req.body.sCost) {
    //   errors.push({ msg: 'Invalid Value', value: req.body?.sCost || '', location: 'body', param: 'sCost' })
    // }
    // if (!req.body.eCostType) {
    //   errors.push({ msg: 'Invalid Value', value: req.body?.eCostType || '', location: 'body', param: 'eCostType' })
    // }
    // if (['Monthly', 'Hourly'].indexOf(req.body.eCostType) === -1) {
    //   errors.push({ msg: 'Invalid Value', value: req.body?.eCostType || '', location: 'body', param: 'eCostType' })
    // }

    // if (!req.body.dBillingCycleDate) {
    //   errors.push({ msg: 'Invalid Value', value: req.body?.dBillingCycleDate || '', location: 'body', param: 'dBillingCycleDate' })
    // }

    // if (!req.body.dNoticePeriodDate) {
    //   errors.push({ msg: 'Invalid Value', value: req.body?.dNoticePeriodDate || '', location: 'body', param: 'dNoticePeriodDate' })
    // }

    // if (!req.body.aProjectBaseEmployee || req.body.aProjectBaseEmployee.length === 0) {
    //   errors.push({ msg: 'Invalid Value', value: req.body?.aProjectBaseEmployee || '', location: 'body', param: 'aProjectBaseEmployee' })
    // }

    // if (req.body.aProjectBaseEmployee) {
    //   const arrayValidate = req.body.aProjectBaseEmployee.filter((employee) => {
    //     if (!employee.iEmployeeId || !isValidId(employee.iEmployeeId)) {
    //       return true
    //     }
    //     return false
    //   })

    //   if (arrayValidate.length > 0) {
    //     errors.push({ msg: 'Invalid Value', value: arrayValidate || '', location: 'body', param: 'aProjectBaseEmployee' })
    //   }
    // }
  }

  if (req.body.eProjectType === 'Fixed') {
    // if (!req.body.dStartDate) {
    //   errors.push({ msg: 'Invalid Value', value: req.body?.dStartDate || '', location: 'body', param: 'dStartDate' })
    // }

    if (!req.body.nTimeLineDays || !isValidNumber(req.body.nTimeLineDays)) {
      errors.push({ msg: 'Invalid Value', value: req.body?.nTimeLineDays || '', location: 'body', param: 'nTimeLineDays' })
      if (req.body.nTimeLineDays <= 0) {
        errors.push({ msg: 'Invalid Value', value: req.body?.nTimeLineDays || '', location: 'body', param: 'nTimeLineDays' })
      }
    }

    if (!req.body.sCost || !isValidNumber(Number(req.body.sCost))) {
      errors.push({ msg: 'Invalid Value', value: req.body?.sCost || '', location: 'body', param: 'sCost' })
      if (Number(req.body.sCost) <= 0) {
        errors.push({ msg: 'Invalid Value', value: req.body?.sCost || '', location: 'body', param: 'sCost' })
      }
    }

    // if (!req.body.dEndDate) {
    //   errors.push({ msg: 'Invalid Value', value: req.body?.dEndDate || '', location: 'body', param: 'dEndDate' })
    // }

    // if (!req.body.aProjectBaseEmployee || req.body.aProjectBaseEmployee.length === 0) {
    //   errors.push({ msg: 'Invalid Value', value: req.body?.aProjectBaseEmployee || '', location: 'body', param: 'aProjectBaseEmployee' })
    // }

    // if (req.body.aProjectBaseEmployee) {
    //   const arrayValidate = req.body.aProjectBaseEmployee.filter(employee => {
    //     if (!employee.iEmployeeId || !isValidId(employee.iEmployeeId)) {
    //       return true
    //     }
    //     return false
    //   })

    //   if (arrayValidate.length > 0) {
    //     errors.push({ msg: 'Invalid Value', value: arrayValidate || '', location: 'body', param: 'aProjectBaseEmployee' })
    //   }
    // }
  }

  return errors
}
function flag3(req) {
  const errors = []
  if (!req.body.iProjectId || !isValidId(req.body.iProjectId)) {
    errors.push({ msg: 'Invalid Value', value: req.body?.iProjectId || '', location: 'body', param: 'iProjectId' })
  }

  if (!req.body.dContractStartDate) {
    errors.push({ msg: 'Invalid Value', value: req.body?.dContractStartDate || '', location: 'body', param: 'dContractStartDate' })
  }
  if (!req.body.dContractEndDate) {
    errors.push({ msg: 'Invalid Value', value: req.body?.dContractEndDate || '', location: 'body', param: 'dContractEndDate' })
  }

  if (req.body.dContractStartDate && req.body.dContractEndDate) {
    const startDate = new Date(req.body.dContractStartDate).getTime()
    const endDate = new Date(req.body.dContractEndDate).getTime()
    const diff = endDate - startDate
    if (diff < 0) {
      errors.push({ msg: 'Invalid Value', value: req.body?.dContractEndDate || '', location: 'body', param: 'dContractEndDate' })
    }
  }

  // if(req.body.aContract.length) {

  // }

  // if (!req.body.aContract || req.body.aContract.length === 0) {
  //   errors.push({ msg: 'Invalid Value', value: req.body?.aContract || '', location: 'body', param: 'aContract' })
  // }
  return errors
}
const validateProjects = function (req, res, next) {
  const errors = []

  if (!req.body.flag) {
    errors.push({ msg: 'Invalid Value', value: req.body?.flag || '', location: 'body', param: 'flag' })
  }

  if (![1, 2, 3].includes(req.body.flag)) {
    errors.push({ msg: 'Invalid Value', value: req.body?.flag || '', location: 'body', param: 'flag' })
  }

  if (!req.body.eProjectType) {
    // console.log('req.body.eProjectType', req.body.eProjectType)
    errors.push({ msg: 'Invalid Value', value: req.body?.flag || '', location: 'body', param: 'eProjectType' })
  }

  if (!['Fixed', 'Dedicated'].includes(req.body.eProjectType)) {
    errors.push({ msg: 'Invalid Value', value: req.body?.flag || '', location: 'body', param: 'eProjectType' })
  }

  if (req.body.flag === 1) {
    errors.push(...flag1(req))
  }
  if (req.body.flag === 2) {
    errors.push(...flag2(req))
  }
  if (req.body.flag === 3) {
    errors.push(...flag3(req))
  }

  if (errors.length) {
    return res
      .status(status.UnprocessableEntity)
      .jsonp({ status: jsonStatus.UnprocessableEntity, errors })
  }
  next()
}

const preSignedUrlValidate = [
  body('iProjectId').not().isEmpty().isMongoId(),
  body('sFileName').not().isEmpty(),
  body('sContentType').not().isEmpty()
]

const getProjectCheck = [
  param('id').not().isEmpty().isMongoId()
]

const deleteProjectCheck = [
  param('id').not().isEmpty().isMongoId()
]

const getProjectsByEmployee = [
  // param('id').not().isEmpty().isMongoId()
]

const deleteContractByProject = [
  param('id').not().isEmpty().isMongoId(),
  body('sFileName').not().isEmpty()
]

const getReviewByEmployeeCheck = [
  param('id').not().isEmpty().isMongoId()
]

const addReviewByEmployeeCheck = [
  param('id').not().isEmpty().isMongoId(),
  body('sReview').not().isEmpty(),
  body('iProjectId').not().isEmpty().isMongoId()
]

const updateReviewByEmployeeCheck = [
  param('id').not().isEmpty().isMongoId(),
  body('sReview').not().isEmpty(),
  body('iProjectId').not().isEmpty().isMongoId()
]

const deleteReviewByEmployeeCheck = [
  param('id').not().isEmpty().isMongoId(),
  body('iProjectId').not().isEmpty().isMongoId()
]

const addProjectDepartmentCheck = [
  body('iProjectId').not().isEmpty().isMongoId(),
  body('iDepartmentId').not().isEmpty().isMongoId(),
  body('nMinutes').not().isEmpty().isNumeric(),
  body('nCost').not().isEmpty().isNumeric()
]

module.exports = {
  validateProjects,
  preSignedUrlValidate,
  getProjectCheck,
  deleteProjectCheck,
  getProjectsByEmployee,
  deleteContractByProject,
  getReviewByEmployeeCheck,
  addReviewByEmployeeCheck,
  updateReviewByEmployeeCheck,
  deleteReviewByEmployeeCheck,
  addProjectDepartmentCheck
}
