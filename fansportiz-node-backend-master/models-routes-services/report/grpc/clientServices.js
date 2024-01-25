const { DepositClient, WithdrawClient } = require('../../../helper/grpcClient')

// get payment gateway wise sum of total deposit cash
async function getDepositOfPG(query) {
  return new Promise((resolve, reject) => {
    (() => {
      DepositClient.getDepositOfPG({ query: JSON.stringify(query) }, function(err, response) {
        if (err) return reject(err)
        resolve(JSON.parse(response.data))
      })
    })()
  })
}

// get total sum of deposit cash
async function findTotalCashDeposit(query) {
  return new Promise((resolve, reject) => {
    (() => {
      DepositClient.findTotalCashDeposit({ query: JSON.stringify(query) }, function(err, response) {
        if (err) return reject(err)
        resolve(JSON.parse(response.data))
      })
    })()
  })
}

// get total sum of deposit cash between two date
async function getDepositOfDateRange(query, dateRange) {
  return new Promise((resolve, reject) => {
    (() => {
      DepositClient.getDepositOfDateRange({ query: JSON.stringify(query), dateRange: JSON.stringify(dateRange) }, function(err, response) {
        if (err) return reject(err)
        resolve(JSON.parse(response.data))
      })
    })()
  })
}

// get payment gateway wise sum of total deposit cash between two date
async function getDepositOfPgInDateRange(query, dateRange) {
  return new Promise((resolve, reject) => {
    (() => {
      DepositClient.getDepositOfPgInDateRange({ query: JSON.stringify(query), dateRange: JSON.stringify(dateRange) }, function(err, response) {
        if (err) return reject(err)
        resolve(JSON.parse(response.data))
      })
    })()
  })
}

// get payment gateway wise sum of total withdraw amount
async function getWithdrawOfPG(query) {
  return new Promise((resolve, reject) => {
    (() => {
      WithdrawClient.getWithdrawOfPG({ query: JSON.stringify(query) }, function(err, response) {
        if (err) return reject(err)
        resolve(JSON.parse(response.data))
      })
    })()
  })
}

// get payment gateway wise sum of total withdraw amount in between two dates
async function getDateRangeWithdrawOfPG(query, dateRange) {
  return new Promise((resolve, reject) => {
    (() => {
      WithdrawClient.getDateRangeWithdrawOfPG({ query: JSON.stringify(query), dateRange: JSON.stringify(dateRange) }, function(err, response) {
        if (err) return reject(err)
        resolve(JSON.parse(response.data))
      })
    })()
  })
}

module.exports = {
  getDepositOfPG,
  findTotalCashDeposit,
  getDepositOfDateRange,
  getDepositOfPgInDateRange,
  getWithdrawOfPG,
  getDateRangeWithdrawOfPG
}
