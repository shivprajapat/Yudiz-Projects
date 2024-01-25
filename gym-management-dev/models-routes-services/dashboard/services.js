// @ts-check
const EmployeeModel = require('../employee/model')
const SubscriptionModel = require('../subscription/model')
const InquiryModel = require('../inquiry/model')
const CustomerModel = require('../customer/model')
const { catchError } = require('../../helper/utilities.services')
const { status, jsonStatus } = require('../../helper/api.response')

class Statistics {
  async cardStatistics (req, res) {
    try {
      const [employee, activeSubscription, inquiry, totalCustomer] = await Promise.all([
        EmployeeModel.aggregate([
          {
            $match: {
              eStatus: {
                $ne: 'D'
              }
            }
          },
          {
            $group: {
              _id: '$eUserType',
              count: {
                $sum: 1
              }
            }
          },
          {
            $project: {
              _id: 0,
              type: '$_id',
              count: 1
            }
          }
        ]),

        SubscriptionModel.aggregate([
          {
            $match: {
              eStatus: {
                $ne: 'D'
              }
            }
          },
          {
            $match: {
              eStatus: 'Y'
            }
          },
          {
            $group: {
              _id: '$eStatus',
              count: {
                $sum: 1
              }
            }
          }, {
            $project: {
              _id: 0,
              type: '$_id',
              count: 1
            }
          }]),

        InquiryModel.aggregate([
          {
            $match: {
              eStatus: {
                $ne: 'D'
              }
            }
          },
          {
            $group: {
              _id: '$eStatus',
              count: {
                $sum: 1
              }
            }
          },
          {
            $project: {
              _id: 0,
              type: '$_id',
              count: 1
            }
          }
        ]),

        CustomerModel.aggregate([
          {
            $match: {
              eStatus: {
                $ne: 'D'
              }
            }
          },
          {
            $match: {
              eStatus: 'Y'
            }
          },
          {
            $group: {
              _id: '$eStatus',
              count: {
                $sum: 1
              }
            }
          },
          {
            $project: {
              _id: 0,
              type: '$_id',
              count: 1
            }
          }
        ])
      ])
      return res.status(status.OK).json({ status: jsonStatus.OK, message: 'Dashboard Fetch Successfully', data: { employee, activeSubscription, inquiry, totalCustomer } })
    } catch (error) {
      catchError('Statistics.Get', error, req, res)
    }
  }
}

module.exports = new Statistics()
