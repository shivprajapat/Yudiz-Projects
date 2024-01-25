const studentPackageModel = require('../models-routes-services/student/package/student.packages.model')
const centerPackageModel = require('../models-routes-services/center/packages/center.packages.model')
const couponCodeModel = require('../models-routes-services/admin/coupon-code/coupon_code.model')
const { Op, Sequelize } = require('sequelize')

const couponValidate = async (couponCode) => {
  const coupon = couponCodeModel.findOne({
    raw: true,
    where: {
      code: Sequelize.where(Sequelize.fn('BINARY', Sequelize.col('code')), couponCode),
      is_active: 'y',
      deleted_at: null,
      from_date: { [Op.lte]: new Date() },
      to_date: { [Op.gte]: new Date() },
      remaining_time_use: { [Op.gt]: 0 }
    }
  })
  return coupon
}

const checkCounponStudentUse = async (couponCode, studentId) => {
  const checkCounponUse = studentPackageModel.findOne({
    raw: true,
    where: {
      student_id: studentId,
      coupon_code: Sequelize.where(Sequelize.fn('BINARY', Sequelize.col('coupon_code')), couponCode),
      payment_status: 'C'
    }
  })
  return checkCounponUse
}

const checkCounponCenterUse = async (couponCode, centerId) => {
  const checkCounponUse = centerPackageModel.findOne({
    raw: true,
    where: {
      center_id: centerId,
      coupon_code: Sequelize.where(Sequelize.fn('BINARY', Sequelize.col('coupon_code')), couponCode),
      payment_status: 'C'
    }
  })
  return checkCounponUse
}

const getDiscountPackageAmount = async (packageDetail, checkCoupon, totalPackages = 1) => {
  let finalAmount = packageDetail.amount * totalPackages
  if (checkCoupon.coupon_type === 'fixed_amount') {
    finalAmount = finalAmount - checkCoupon.amount_percentage
  } else {
    finalAmount = finalAmount - ((finalAmount * checkCoupon.amount_percentage) / 100)
  }
  if (finalAmount < 0) {
    finalAmount = 0
  }
  console.log(finalAmount)
  console.log(finalAmount.toFixed(2))
  finalAmount = finalAmount.toFixed(2)
  return finalAmount
}

const updateCouponCount = async (couponCode) => {
  console.log('couponCode', couponCode)
  const counpon = await couponCodeModel.findOne({
    raw: true,
    where: {
      code: Sequelize.where(Sequelize.fn('BINARY', Sequelize.col('code')), couponCode),
      is_active: 'y',
      deleted_at: null
    }
  })

  if (counpon) {
    const updatedCount = counpon.remaining_time_use - 1
    await couponCodeModel.update({ remaining_time_use: updatedCount }, { where: { id: counpon.id } })
  }
  return true
}

module.exports = {
  couponValidate,
  checkCounponStudentUse,
  getDiscountPackageAmount,
  updateCouponCount,
  checkCounponCenterUse
}
