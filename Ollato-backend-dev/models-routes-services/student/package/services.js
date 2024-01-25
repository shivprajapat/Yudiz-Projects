/* eslint-disable camelcase */
const { catchError, removenull, getPaginationValues, getUniqueString } = require('../../../helper/utilities.services')
const { couponValidate, checkCounponStudentUse, getDiscountPackageAmount } = require('../../../helper/coupon.service')
const studentPackageModel = require('./student.packages.model')
const StudentModel = require('../auth/student.model')
const PackageModel = require('../../admin/package/package.model')
const StudentPackagesHistory = require('./student.package.history.model')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const { Op, Sequelize } = require('sequelize')
const { sequelize } = require('../../../database/sequelize')
const generatePdf = require('../../../helper/generatePdf')
const Rezorpay = require('razorpay')
const shortId = require('shortid')
const config = require('../../../config/config-file')
const JsSHA = require('jssha')

class PackageServices {
  async getPackageById(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body
      const packages = await PackageModel.findOne({ raw: true, where: { id, deleted_at: null, is_active: 'y' } })
      if (!packages) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].package) })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: packages, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('packages.getAllPackage', error, req, res)
    }
  }

  async getAllSub(req, res) {
    try {
      removenull(req.body)
      const { start, limit, sorting, search } = getPaginationValues(req.body)
      const packages = await PackageModel.findAll({
        where: {
          [Op.or]: [{
            title: {
              [Op.like]: `%${search}%`
            }
          }],
          deleted_at: null,
          is_active: 'y',
          package_type: 'subcription'
        },
        order: sorting,
        limit,
        offset: start
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: packages, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      console.log('error: ', error)
      return await catchError('packages.getAllPackage', error, req, res)
    }
  }

  async getAllAddOn(req, res) {
    try {
      removenull(req.body)
      const { start, limit, sorting, search } = getPaginationValues(req.body)
      const packages = await PackageModel.findAll({
        where: {
          [Op.or]: [{
            title: {
              [Op.like]: `%${search}%`
            }
          }],
          deleted_at: null,
          is_active: 'y',
          package_type: 'addon'
        },
        order: sorting,
        limit,
        offset: start
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: packages, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('packages.getAllAddonPackage', error, req, res)
    }
  }

  async purchasePackage(req, res) {
    const transaction = await sequelize.transaction()
    try {
      removenull(req.body)
      const { packageId } = req.body
      const packageDetail = await PackageModel.findOne({ raw: true, where: { id: packageId } })
      console.log(config.REZORPAY_KEY_ID)
      const rezorpay = new Rezorpay({
        key_id: config.REZORPAY_KEY_ID,
        key_secret: config.REZORPAY_KEY_SECRET
      })
      const payment_capture = 1
      const amount = packageDetail.amount
      // const gst_percent = packageDetail.gst_percent
      // const final_amount = amount + ((amount * gst_percent) / 100)
      const final_amount = amount
      const currency = 'INR'
      const options = {
        amount: parseInt(final_amount * 100),
        currency,
        receipt: shortId.generate(),
        payment_capture
      }
      const response = await rezorpay.orders.create(options)
      if (response && response.status === 'created') {
        const onlineTest = packageDetail.online_test ? 1 : 0
        const testReport = packageDetail.test_report ? 1 : 0
        const videoCall = packageDetail.video_call ? 1 : 0
        const f2fCall = packageDetail.f2f_call ? 1 : 0
        const customId = await getUniqueString(8, studentPackageModel)
        const cDate = new Date()
        var expireDate = new Date(cDate.setMonth(cDate.getMonth() + 1))
        await studentPackageModel.create({ onlineTest, testReport, videoCall, f2fCall, student_id: req.user.id, custom_id: customId, package_id: packageId, package_type: packageDetail.package_type, purchase_date: new Date(), expireDate, order_id: response.id }, { transaction })
        await transaction.commit()
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: response })
      } else {
        return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', 'Payment') })
      }

      // await StudentPackagesHistoryModel.create({ custom_id: customId, student_id: req.user.id, package_id: packageId, transaction_id: 'abc123', amount: packageDetail.amount, status: 'P' }, { transaction })

      // return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].package) })
    } catch (error) {
      await transaction.rollback()
      return await catchError('packages.getAllPackage', error, req, res)
    }
  }

  async purchaseSuccess (req, res) {
    const transaction = await sequelize.transaction()
    try {
      removenull(req.body)
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body
      const studentPackage = await studentPackageModel.findOne({ raw: true, where: { order_id: razorpay_order_id } })
      if (!studentPackage) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', 'student package') })

      const packageDetail = await PackageModel.findOne({ raw: true, where: { id: studentPackage.package_id } })

      const customId = await getUniqueString(8, StudentPackagesHistory)
      await StudentPackagesHistory.create(
        {
          custom_id: customId,
          student_id: req.user.id,
          package_id: packageDetail.id,
          transaction_id: razorpay_payment_id,
          order_id: razorpay_order_id,
          order_signature: razorpay_signature,
          amount: packageDetail.amount,
          status: 'C'
        }, { transaction })
      // Update Student package
      const cDate = new Date()
      var expireDate = new Date(cDate.setMonth(cDate.getMonth() + 1))
      await studentPackageModel.update({ purchase_date: new Date(), expireDate, payment_status: 'C' }, { where: { id: studentPackage.id } })
      await transaction.commit()
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].package) })
    } catch (error) {
      await transaction.rollback()
      return await catchError('packages.getAllPackage', error, req, res)
    }
  }

  async paymentPayumoney(req, res) {
    const transaction = await sequelize.transaction()
    try {
      removenull(req.body)
      const studentId = req.user.id
      const student = await StudentModel.findOne({ raw: true, where: { id: studentId, is_active: 'y', deleted_at: null } })
      if (!student) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].auth_failed })

      const { packageId, coupon_code } = req.body
      const packageDetail = await PackageModel.findOne({ raw: true, where: { id: packageId } })
      let amount = packageDetail.amount
      let counponType = null
      let couponCode = null
      const org_amount = amount
      let amountPercentage = null
      if (coupon_code && coupon_code !== '') {
        // check coupon code exist or valid
        const checkCoupon = await couponValidate(coupon_code)
        if (!checkCoupon) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].couponCode) })

        // Check student already used coupon or not
        const checkStudentUseCoupon = await checkCounponStudentUse(coupon_code, studentId)
        if (checkStudentUseCoupon) return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].coupon_already_used })
        counponType = checkCoupon.coupon_type
        couponCode = checkCoupon.code
        amountPercentage = checkCoupon.amount_percentage
        amount = await getDiscountPackageAmount(packageDetail, checkCoupon)
      }

      const key = config.payumoney.key
      const salt = config.payumoney.salt

      const txnid = 'pay_' + await getUniqueString(8, studentPackageModel)
      // const txnid = 'pay_73up9xsz'
      // const amount = 0.5
      const firstname = student.first_name
      const email = student.email
      const phone = student.mobile
      const productinfo = packageDetail.title
      const surl = `${config.DEPLOY_HOST_URL}/payumoney/success`
      const furl = `${config.DEPLOY_HOST_URL}/payumoney/fail`

      const hashString = key +
                  '|' + txnid +
                  '|' + amount + '|' + productinfo + '|' +
                  firstname + '|' + email + '|' +
                  '||||||||||' + salt

      const sha = new JsSHA('SHA-512', 'TEXT')
      sha.update(hashString)
      const hash = sha.getHash('HEX')

      const paymentData = {
        key,
        txnid,
        amount,
        firstname,
        email,
        phone,
        productinfo,
        surl,
        furl,
        hash
      }

      const onlineTest = packageDetail.online_test ? 1 : 0
      const testReport = packageDetail.test_report ? 1 : 0
      const videoCall = packageDetail.video_call ? 1 : 0
      const f2fCall = packageDetail.f2f_call ? 1 : 0
      const customId = await getUniqueString(8, studentPackageModel)
      const cDate = new Date()
      var expireDate = new Date(cDate.setMonth(cDate.getMonth() + 1))
      await studentPackageModel.create({ onlineTest, testReport, videoCall, f2fCall, student_id: req.user.id, custom_id: customId, package_id: packageId, package_type: packageDetail.package_type, amount: org_amount, final_amount: amount, coupon_code: couponCode, coupon_type: counponType, amount_percentage: amountPercentage, purchase_date: new Date(), expireDate, transaction_id: txnid }, { transaction })
      await transaction.commit()
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: paymentData })
      // await StudentPackagesHistoryModel.create({ custom_id: customId, student_id: req.user.id, package_id: packageId, transaction_id: 'abc123', amount: packageDetail.amount, status: 'P' }, { transaction })

      // return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].package) })
    } catch (error) {
      await transaction.rollback()
      return await catchError('packages.getAllPackage', error, req, res)
    }
  }

  async paymentPayumoneyResponse (req, res) {
    const transaction = await sequelize.transaction()
    try {
      removenull(req.body)
      const { txnid, mihpayid, hash, unmappedstatus, txnStatus } = req.body

      if (txnStatus && txnStatus === 'SUCCESS') {
        if (unmappedstatus && unmappedstatus === 'captured') {
          const studentPackage = await studentPackageModel.findOne({ raw: true, where: { transaction_id: txnid } })
          if (!studentPackage) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', 'student package') })

          const packageDetail = await PackageModel.findOne({ raw: true, where: { id: studentPackage.package_id } })

          const customId = await getUniqueString(8, StudentPackagesHistory)
          await StudentPackagesHistory.create(
            {
              custom_id: customId,
              student_id: req.user.id,
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
          await transaction.commit()
          return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].package) })
        }
      }
      return res.status(status.InternalServerError).jsonp({ status: jsonStatus.InternalServerError, message: messages[req.userLanguage].error })
    } catch (error) {
      await transaction.rollback()
      return await catchError('packages.getAllPackage', error, req, res)
    }
  }

  async getPurchasedPackage(req, res) {
    try {
      removenull(req.body)
      const { start, limit, sorting, search } = getPaginationValues(req.body)
      const packages = await studentPackageModel.findAll({
        where: {
          student_id: req.user.id,
          payment_status: 'C',
          [Op.or]: [
            {
              '$packages.title$': {
                [Op.like]: `%${search}%`
              }
            }
          ]
        },
        include: [{
          model: PackageModel,
          as: 'packages',
          attributes: []
        }],
        attributes: ['id', [Sequelize.col('StudentPackages.custom_id'), 'package_custom_id'], [Sequelize.col('packages.id'), 'package_id'], 'package_type', 'purchase_date', 'expireDate', 'onlineTest', 'testReport', 'videoCall', 'f2fCall', 'isExpired', [Sequelize.col('packages.title'), 'package_name'], [Sequelize.col('packages.id'), 'package_id'], [Sequelize.col('packages.description', 'description'), 'description']],
        order: sorting,
        limit,
        offset: start
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: packages, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('packages.getAllAddonPackage', error, req, res)
    }
  }

  async getActivePurchasedPackage(req, res) {
    try {
      removenull(req.body)
      const { start, limit, sorting, search } = getPaginationValues(req.body)
      const packages = await studentPackageModel.findAll({
        where: {
          student_id: req.user.id,
          payment_status: 'C',
          isExpired: false,
          [Op.or]: [
            {
              '$packages.title$': {
                [Op.like]: `%${search}%`
              }
            }
          ]
        },
        include: [{
          model: PackageModel,
          as: 'packages',
          attributes: []
        }],
        attributes: ['id', 'package_type', 'purchase_date', 'expireDate', 'onlineTest', 'testReport', 'videoCall', 'f2fCall', 'isExpired', [Sequelize.col('packages.title'), 'package_name'], [Sequelize.col('packages.description', 'description'), 'description']],
        order: sorting,
        limit,
        offset: start
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: packages, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('packages.getAllAddonPackage', error, req, res)
    }
  }

  async getInvoice(req, res) {
    try {
      removenull(req.params)
      const { id } = req.params
      const gotPackage = await studentPackageModel.findOne({
        raw: true,
        where: { custom_id: id },
        include: [{
          model: PackageModel,
          as: 'packages',
          attributes: []
        }],
        attributes: ['id', 'invoice_path', 'amount', 'final_amount', 'coupon_code', 'coupon_type', 'amount_percentage', 'package_type', 'purchase_date', 'expireDate', 'onlineTest', 'testReport', 'videoCall', 'f2fCall', 'isExpired', [Sequelize.col('packages.title'), 'package_name'], [Sequelize.col('packages.id'), 'package_id'], [Sequelize.col('packages.description', 'description'), 'package_description'], [Sequelize.col('packages.amount', 'amount'), 'package_amount']]
      })
      console.log(gotPackage)
      if (!gotPackage) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].package) })
      const gotInvoicePath = gotPackage.invoice_path
      if (!gotInvoicePath) {
        const pdf = await generatePdf(gotPackage)
        if (pdf) {
          const logged = await studentPackageModel.update({ invoice_path: pdf.imagePath }, { where: { id: gotPackage.id } })
          console.log(logged, 'updated')
          res.set('Content-Type', 'application/pdf')
          res.download(pdf.imagePath)
        } else {
          return res.status(status.InternalServerError).jsonp({ status: jsonStatus.InternalServerError, message: messages[req.userLanguage].error })
        }
      } else {
        res.set('Content-Type', 'application/pdf')
        res.download(gotInvoicePath)
      }
    } catch (error) {
      return await catchError('packages.getTestReport', error, req, res)
    }
  }

  async applyCoupon(req, res) {
    const transaction = await sequelize.transaction()
    try {
      removenull(req.params)
      const { coupon_code, packageId } = req.body
      const student_id = req.user.id

      const packageDetail = await PackageModel.findOne({ raw: true, where: { id: packageId } })
      if (!packageDetail) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].package) })

      // check coupon code exist or valid
      const checkCoupon = await couponValidate(coupon_code)
      if (!checkCoupon) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].couponCode) })

      // Check student already used coupon or not
      const checkStudentUseCoupon = await checkCounponStudentUse(coupon_code, student_id)
      if (checkStudentUseCoupon) return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].coupon_already_used })

      const finalAmount = await getDiscountPackageAmount(packageDetail, checkCoupon)
      await transaction.commit()
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].coupon_applied_success, data: { checkCoupon, package_amount: finalAmount, package_id: packageDetail.id } })
    } catch (error) {
      await transaction.rollback()
      return await catchError('packages.getTestReport', error, req, res)
    }
  }
}

module.exports = new PackageServices()
