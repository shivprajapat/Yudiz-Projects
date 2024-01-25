const axios = require('axios')
const { queuePush, redisClient } = require('../../helper/redis')
const config = require('./../../config/config')
const { handleCatchError } = require('./../../helper/utilities.services')
const { decryption } = require('./../../middlewares/middleware')
const { CASHFREE_ORDERID_PREFIX } = require('./../../config/common')
const { findUser } = require('../userDeposit/grpc/clientServices')
const { findBankDetail } = require('../userWithdraw/grpc/clientServices')
const { findState, findCity } = require('./grpc/clientServices')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

// Get Payments for an Order
async function getPaymentStatus(payload) {
  return new Promise((resolve, reject) => {
    const { iDepositId, orderId } = payload
    return axios.get(`${config.CASHFREE_STABLE_URL}/orders/${orderId}/payments`, { headers: { 'x-client-id': config.CASHFREE_APPID, 'x-client-secret': config.CASHFREE_SECRETKEY, 'x-api-version': '2022-01-01' } })
      .then(res => {
        const logData = { iDepositId, ePlatform: 'W', eGateway: 'CASHFREE', eType: 'D', oBody: payload, oReq: { url: `${config.CASHFREE_STABLE_URL}/orders/${orderId}/payments`, orderId }, oRes: res.data }
        queuePush('TransactionLog', logData)
        const result = res ? (res.data && res.data.length ? res.data[0] : '') : ''
        resolve({ result, isSuccess: true })
      })
      .catch(err => {
        const res = { status: err.response.status, message: err.response.data, isSuccess: false }
        const logData = { iDepositId, ePlatform: 'W', eGateway: 'CASHFREE', eType: 'D', oBody: payload, oReq: { url: `${config.CASHFREE_STABLE_URL}/orders/${orderId}/payments`, orderId }, oRes: res }
        queuePush('TransactionLog', logData)
        resolve(res)
      })
  })
}

async function validateCashfreeToken(iUserId, iWithdrawId, iPassbookId) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        let existToken = await redisClient.get('CashfreePayoutToken')
        if (!existToken) {
          const response = await axios.post(`${config.CASHFREE_BASEURL}/${config.CASHFREE_AUTHORIZE_PATH}`, {}, { headers: { 'X-Client-Id': config.CASHFREE_CLIENTID, 'X-Client-Secret': config.CASHFREE_CLIENTSECRET } })
          if (response.data.subCode === '200') {
            existToken = response.data.data.token
            await redisClient.setex('CashfreePayoutToken', 300, existToken)
          }
          const error = { isVerify: false, ...response.data }
          if (response.data.subCode === '403' && response.data.message === 'IP not whitelisted') {
            return reject(error)
          }
        }
        const getVerifyFirst = await axios.post(`${config.CASHFREE_BASEURL}/${config.CASHFREE_VERIFY_PATH}`, {}, { headers: { Authorization: `Bearer ${existToken}` } })

        // const logData = { iUserId, iWithdrawId, iPassbookId, eGateway: 'CASHFREE', eType: 'W', oRes: getVerifyFirst ? getVerifyFirst.data : {} }
        // await queuePush('TransactionLog', logData)

        if (getVerifyFirst.data.subCode === '200') {
          return resolve({ isVerify: true, Token: existToken })
        }
      } catch (error) {
        const rejectReason = { success: false, ...error }
        handleCatchError(rejectReason)
      }
    })()
  })
}

async function getBenficiaryDetails(iUserId, iWithdrawId, iPassbookId) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const { isVerify, Token } = await validateCashfreeToken(iUserId, iWithdrawId, iPassbookId)
        if (isVerify) {
          const response = await axios.get(`${config.CASHFREE_BASEURL}/${config.CASHFREE_GETBENEFICIARY_PATH}/${iUserId}`, { headers: { Authorization: `Bearer ${Token}` } })

          const logData = { iUserId, iWithdrawId, iPassbookId, eGateway: 'CASHFREE', eType: 'W', oRes: response ? response.data : {} }
          await queuePush('TransactionLog', logData)

          const { success, status, message } = await handleCashfreeError(response)
          if (!success && status !== '404') {
            const err = { success, status, message }
            return resolve(err)
          } else if (!success && status === '404') {
            const add = await addBeneficiary(iUserId, iWithdrawId, iPassbookId)
            return resolve(add)
          } else {
            return resolve({ success: true })
          }
        }
      } catch (error) {
        return resolve({ success: false, ...error })
      }
    })()
  })
}

async function addBeneficiary(iUserId, iWithdrawId, iPassbookId) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const { isVerify, Token } = await validateCashfreeToken(iUserId, iWithdrawId, iPassbookId)
        if (isVerify) {
          const [bankDetails, user] = await Promise.all([
            findBankDetail({ iUserId }, {}, { readPreference: 'primary' }),
            findUser({ _id: iUserId }, { iStateId: 1, iCityId: 1, sAddress: 1, nPinCode: 1, sMobNum: 1, sEmail: 1 })
          ])

          if (user?.iStateId && isNaN(Number(user?.iStateId)) && ObjectId.isValid(user?.iStateId)) {
            user.iStateId = await findState({ _id: user.iStateId }, { sName: 1 })
          }
          if (user?.iCityId && isNaN(Number(user?.iCityId)) && ObjectId.isValid(user?.iCityId)) {
            user.iCityId = await findCity({ _id: user.iCityId }, { sName: 1 })
          }

          let { sBranchName: address1, sAccountHolderName: name, sAccountNo: bankAccount, sIFSC: ifsc } = bankDetails
          let { _id: beneId, sEmail: email, sMobNum: phone, iStateId: state = 'Gujarat', iCityId: city = 'Ahmedabad', nPinCode: pincode = 350005 } = user
          email = !email ? config.CASHFREE_MAIL_DEFAULT_ACCOUNT : email

          if (typeof state === 'number') {
            const stateData = await findState({ id: state }, { sName: 1 })
            state = stateData.sName
          }
          if (typeof city === 'number') {
            const cityData = await findCity({ id: city }, { sName: 1 })
            city = cityData.sName
          }

          bankAccount = decryption(bankAccount)
          const benData = JSON.stringify({ beneId, name, email, phone, bankAccount, ifsc, address1, city, state, pincode })

          const response = await axios.post(`${config.CASHFREE_BASEURL}/${config.CASHFREE_ADDBENEFICIARY_PATH}`, benData, { headers: { Authorization: `Bearer ${Token}` } })

          const logData = { iUserId, iWithdrawId, iPassbookId, eGateway: 'CASHFREE', eType: 'W', oReq: JSON.parse(benData), oRes: response ? response.data : {} }
          await queuePush('TransactionLog', logData)

          const { success, status, message } = await handleCashfreeError(response)
          if (!success) {
            if (status === '409' && message === 'Entered bank Account is already registered') {
              const { success, status, message, beneId } = await getBeneficiaryId(bankAccount, ifsc, iWithdrawId, iPassbookId, iUserId)
              if (success) {
                await removeBeneficiary(beneId, iWithdrawId, iPassbookId)
                const add = await addBeneficiary(iUserId, iWithdrawId, iPassbookId)
                return resolve(add)
              } else {
                const err = { success, status, message }
                return resolve(err)
              }
            } else {
              const err = { success, status, message }
              return resolve(err)
            }
          } else { return resolve({ success: true }) }
        }
      } catch (error) {
        return resolve({ success: false, ...error })
      }
    })()
  })
}

async function getBeneficiaryId(bankAccount, ifsc, iWithdrawId, iPassbookId, iUserId) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const { isVerify, Token } = await validateCashfreeToken(iUserId, iWithdrawId, iPassbookId)
        if (isVerify) {
          const response = await axios.get(`${config.CASHFREE_BASEURL}/${config.CASHFREE_GETBENEFICIARYID_PATH}?bankAccount=${bankAccount}&ifsc=${ifsc}`, { headers: { Authorization: `Bearer ${Token}` } })

          const logData = { iWithdrawId, iPassbookId, eGateway: 'CASHFREE', eType: 'W', oReq: { bankAccount, ifsc }, oRes: response ? response.data : {} }
          await queuePush('TransactionLog', logData)

          const { success, status, message } = await handleCashfreeError(response)
          if (success) {
            return resolve({ success: true, beneId: response.data.data.beneId })
          } else {
            const err = { success, status, message }
            return resolve(err)
          }
        }
      } catch (error) {
        return resolve({ success: false, ...error })
      }
    })()
  })
}

async function removeBeneficiary(iUserId, iWithdrawId, iPassbookId) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const { isVerify, Token } = await validateCashfreeToken(iUserId, iWithdrawId, iPassbookId)
        if (isVerify) {
          const benData = JSON.stringify({ beneId: iUserId })
          const response = await axios.post(`${config.CASHFREE_BASEURL}/${config.CASHFREE_REMOVEBENEFICIARY_PATH}`, benData, { headers: { Authorization: `Bearer ${Token}` } })

          const logData = { iUserId, iWithdrawId, iPassbookId, eGateway: 'CASHFREE', eType: 'W', oReq: {}, oRes: response ? response.data : {} }
          await queuePush('TransactionLog', logData)

          return resolve({ success: true })
        }
      } catch (error) {
        return resolve({ success: false, ...error })
      }
    })()
  })
}

async function handleCashfreeError(response) {
  return new Promise((resolve, reject) => {
    const { data } = response
    const { subCode, message, status } = data
    if (subCode === '200') {
      return resolve({ success: true })
    }
    return resolve({ success: false, status: subCode, message, sCurrentStatus: status })
  })
}

async function requestTransfer(data) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const { iUserId, nFinalAmount, iWithdrawId, iAdminId, iPassbookId, id } = data
        const { isVerify, Token } = await validateCashfreeToken(iUserId, iWithdrawId, iPassbookId)
        const tranferData = JSON.stringify({
          beneId: iUserId,
          amount: nFinalAmount,
          transferId: id.toString() || iWithdrawId.toString()
        })
        if (isVerify) {
          const response = await axios.post(`${config.CASHFREE_BASEURL}/${config.CASHFREE_TRANSFER_PATH}`, tranferData, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${Token}` } })

          const logData = { iUserId, iAdminId, iWithdrawId, iPassbookId, eGateway: 'CASHFREE', eType: 'W', oReq: { nFinalAmount, transferId: id || iWithdrawId }, oRes: response ? response.data : {} }
          await queuePush('TransactionLog', logData)

          const { success, status, message, sCurrentStatus } = await handleCashfreeError(response)
          if (!success) {
            if (status === '400' && message === 'Transfer Id already exists') {
              const iNewWithdrawId = data.id || iWithdrawId
              const id = `${CASHFREE_ORDERID_PREFIX}${iNewWithdrawId}`
              const reqTransData = { iUserId, nFinalAmount, iWithdrawId, iAdminId, iPassbookId, id }
              const newData = await requestTransfer(reqTransData)
              return resolve(newData)
            } else {
              const err = { success, status, message, sCurrentStatus }
              return resolve(err)
            }
          } else { return resolve({ success: true, referenceId: response.data.data.referenceId }) }
        }
      } catch (error) {
        return resolve({ success: false, ...error })
      }
    })()
  })
}

async function getUserBalance(iUserId, iWithdrawId, iPassbookId) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const { isVerify, Token } = await validateCashfreeToken(iUserId, iWithdrawId, iPassbookId)
        if (isVerify) {
          const response = await axios.get(`${config.CASHFREE_BASEURL}/${config.CASHFREE_GETBALANCE_PATH}`, { headers: { Authorization: `Bearer ${Token}` } })

          const logData = { iUserId, iWithdrawId, iPassbookId, eGateway: 'CASHFREE', eType: 'W', oRes: response ? response.data : {} }
          await queuePush('TransactionLog', logData)

          const { success, status, message } = await handleCashfreeError(response)
          if (!success) {
            const err = { success, status, message }
            return resolve(err)
          } else {
            return resolve({ success: true })
          }
        }
      } catch (error) {
        return resolve({ success: false, ...error })
      }
    })()
  })
}

module.exports = {
  getPaymentStatus,
  validateCashfreeToken,
  getBenficiaryDetails,
  addBeneficiary,
  getBeneficiaryId,
  removeBeneficiary,
  handleCashfreeError,
  requestTransfer,
  getUserBalance
}
