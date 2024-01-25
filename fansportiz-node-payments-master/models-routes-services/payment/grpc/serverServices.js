const { handleCatchError } = require('../../../helper/utilities.services')
const { removeBeneficiary, getBenficiaryDetails } = require('../common')

async function removeCashfreeBeneficiary (call, callback) {
  try {
    const response = await removeBeneficiary(call.request.iUserId)
    callback(null, { success: response.success })
  } catch (error) {
    callback(error, null)
    handleCatchError(error)
  }
}
async function getCashfreeBenficiary (call, callback) {
  try {
    const response = await getBenficiaryDetails(call.request.iUserId)
    callback(null, { success: response.success, message: response.message })
  } catch (error) {
    callback(error, null)
    handleCatchError(error)
  }
}

module.exports = {
  removeCashfreeBeneficiary,
  getCashfreeBenficiary
}
