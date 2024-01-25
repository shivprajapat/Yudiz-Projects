const operationLogModel = require('./model')
const addLog = async ({ iOperationBy, sOperationType, sOperationName, oOperationBody }) => {
  try {
    const insertResponse = await operationLogModel.create({ oOperationBody, sOperationName, sOperationType, iOperationBy })
    return insertResponse
  } catch (error) {
    console.log('error ', error)
  }
}
module.exports = { addLog }
