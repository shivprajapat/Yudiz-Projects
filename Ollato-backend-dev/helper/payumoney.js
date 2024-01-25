/* eslint-disable camelcase */
const { getUniqueString, removenull } = require('./utilities.services')
const { updateCouponCount } = require('./coupon.service')
const studentPackageModel = require('../models-routes-services/student/package/student.packages.model')
const PackageModel = require('../models-routes-services/admin/package/package.model')
const StudentPackagesHistory = require('../models-routes-services/student/package/student.package.history.model')
const centerPackageModel = require('../models-routes-services/center/packages/center.packages.model')
const centerPaymentHistories = require('../models-routes-services/center/packages/center.package.history.model')
const StudentModel = require('../models-routes-services/student/auth/student.model')
const CenterModel = require('../models-routes-services/center/Auth/center.model')
const { sequelize } = require('../database/sequelize')
const { sendMailStudentPaymentSuccess, sendMailCenterPaymentSuccess } = require('../helper/email.service')

const paymentPayumoneyResponse = async(data) => {
  const transaction = await sequelize.transaction()
  try {
    removenull(data)
    const { txnid, mihpayid, hash, unmappedstatus, status } = data

    if (status && status === 'success') {
      if (unmappedstatus && unmappedstatus === 'captured') {
        const studentPackage = await studentPackageModel.findOne({ raw: true, where: { transaction_id: txnid } })
        if (!studentPackage) return false

        const packageDetail = await PackageModel.findOne({ raw: true, where: { id: studentPackage.package_id } })
        const student = await StudentModel.findOne({ raw: true, where: { id: studentPackage.student_id } })

        const customId = await getUniqueString(8, StudentPackagesHistory)
        await StudentPackagesHistory.create(
          {
            custom_id: customId,
            student_id: studentPackage.student_id,
            package_id: packageDetail.id,
            transaction_id: txnid,
            order_id: mihpayid,
            order_signature: hash,
            amount: packageDetail.amount,
            status: 'C'
          }, { transaction })
        // Update Student package
        const cDate = new Date()
        var expireDate = new Date(cDate.setMonth(cDate.getMonth() + 1))
        await studentPackageModel.update({ purchase_date: new Date(), expireDate, payment_status: 'C', order_id: mihpayid }, { where: { id: studentPackage.id } })
        if (studentPackage.coupon_code) {
          await updateCouponCount(studentPackage.coupon_code)
        }
        await transaction.commit()
        // email for payment success
        if (student.email) {
          const resp = await sendMailStudentPaymentSuccess(student.email, studentPackage, packageDetail)
          if (resp === undefined) throw Error()
        }
        // else {
        //   const resp = await sendMailStudentPaymentSuccess('seracedu@gmail.com', studentPackage, packageDetail)
        //   if (resp === undefined) throw Error()
        // }
        return true
      }
    }
    return false
  } catch (error) {
    console.log(error)
    await transaction.rollback()
    return false
  }
}

const paymentPayumoneyFail = async(data) => {
  const transaction = await sequelize.transaction()
  try {
    removenull(data)
    const { txnid, mihpayid, hash } = data

    const studentPackage = await studentPackageModel.findOne({ raw: true, where: { transaction_id: txnid } })
    if (!studentPackage) return false

    const packageDetail = await PackageModel.findOne({ raw: true, where: { id: studentPackage.package_id } })

    const customId = await getUniqueString(8, StudentPackagesHistory)
    await StudentPackagesHistory.create(
      {
        custom_id: customId,
        student_id: studentPackage.student_id,
        package_id: packageDetail.id,
        transaction_id: txnid,
        order_id: mihpayid,
        order_signature: hash,
        amount: packageDetail.amount,
        status: 'R'
      }, { transaction })
    // Update Student package
    const cDate = new Date()
    var expireDate = new Date(cDate.setMonth(cDate.getMonth() + 1))
    await studentPackageModel.update({ purchase_date: new Date(), expireDate, payment_status: 'R', order_id: mihpayid }, { where: { id: studentPackage.id } })
    await transaction.commit()
    return true
  } catch (error) {
    await transaction.rollback()
    return false
  }
}

const paymentCenterPayumoneyResponse = async(data) => {
  const transaction = await sequelize.transaction()
  try {
    removenull(data)
    const { txnid, mihpayid, hash, unmappedstatus, status } = data

    if (status && status === 'success') {
      if (unmappedstatus && unmappedstatus === 'captured') {
        const centerPackage = await centerPackageModel.findOne({ raw: true, where: { transaction_id: txnid } })
        if (!centerPackage) return false

        const packageDetail = await PackageModel.findOne({ raw: true, where: { id: centerPackage.package_id } })
        const center = await CenterModel.findOne({ raw: true, where: { id: centerPackage.center_id } })

        const customId = await getUniqueString(8, centerPaymentHistories)
        await centerPaymentHistories.create(
          {
            custom_id: customId,
            center_id: centerPackage.center_id,
            package_id: packageDetail.id,
            transaction_id: txnid,
            order_id: mihpayid,
            order_signature: hash,
            amount: centerPackage.total_amount,
            status: 'C'
          }, { transaction })
        await centerPackageModel.update({ purchase_date: new Date(), payment_status: 'C', order_id: mihpayid }, { where: { id: centerPackage.id } }, { transaction })
        if (centerPackage.coupon_code) {
          await updateCouponCount(centerPackage.coupon_code)
        }
        await transaction.commit()
        // email for payment success
        const resp = await sendMailCenterPaymentSuccess(center.email, centerPackage, packageDetail)
        if (resp === undefined) throw Error()
        return true
      }
    }
    return false
  } catch (error) {
    await transaction.rollback()
    return false
  }
}

const paymentCenterPayumoneyFail = async(data) => {
  const transaction = await sequelize.transaction()
  try {
    removenull(data)
    const { txnid, mihpayid, hash } = data

    const centerPackage = await centerPackageModel.findOne({ raw: true, where: { transaction_id: txnid } })
    if (!centerPackage) return false

    const packageDetail = await PackageModel.findOne({ raw: true, where: { id: centerPackage.package_id } })

    const customId = await getUniqueString(8, centerPaymentHistories)
    await centerPaymentHistories.create(
      {
        custom_id: customId,
        center_id: centerPackage.center_id,
        package_id: packageDetail.id,
        transaction_id: txnid,
        order_id: mihpayid,
        order_signature: hash,
        amount: centerPackage.total_amount,
        status: 'R'
      }, { transaction })
    await centerPackageModel.update({ purchase_date: new Date(), payment_status: 'R', order_id: mihpayid }, { where: { id: centerPackage.id } }, { transaction })

    await transaction.commit()
    return true
  } catch (error) {
    await transaction.rollback()
    return false
  }
}

module.exports = {
  paymentPayumoneyResponse,
  paymentPayumoneyFail,
  paymentCenterPayumoneyResponse,
  paymentCenterPayumoneyFail
}
