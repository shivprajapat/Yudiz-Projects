/* eslint-disable camelcase */
const { removenull, catchError, getUniqueString, getPaginationValues } = require('../../../helper/utilities.services')
const { couponValidate, checkCounponCenterUse, getDiscountPackageAmount } = require('../../../helper/coupon.service')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const { sequelize } = require('../../../database/sequelize')
const centerModel = require('../Auth/center.model')
const { Op, Sequelize } = require('sequelize')
const Razorpay = require('razorpay')
const shortId = require('shortid')
const config = require('../../../config/config-file')
const generateCenterInvoicePdf = require('../../../helper/generateCenterInvoicePdf')
const PackageModel = require('../../admin/package/package.model')
const centerPackageModel = require('../../center/packages/center.packages.model')
const centerPaymentHistories = require('../packages/center.package.history.model')
const JsSHA = require('jssha')

class CenterServices {
  async getPackages(req, res) {
    try {
      removenull(req.body)
      const packages = await PackageModel.findAll({
        where: { deleted_at: null, package_type: 'subcription', is_active: 'y' },
        order: [['id', 'ASC']],
        limit: 2,
        offset: 0
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: packages, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('packages.getAllPackage', error, req, res)
    }
  }

  async purchasePackage(req, res) {
    const transaction = await sequelize.transaction()
    try {
      removenull(req.body)

      const { packageId, total_packages } = req.body
      const packageDetail = await PackageModel.findOne({ raw: true, where: { id: packageId } })
      const razorpay = new Razorpay({
        key_id: config.REZORPAY_KEY_ID,
        key_secret: config.REZORPAY_KEY_SECRET
      })

      const payment_capture = 1
      const packageAmount = packageDetail.amount * total_packages
      // const gst = packageAmount * 0.18
      const gst = 0
      // const totalAmount = packageAmount + gst
      const totalAmount = packageAmount
      const currency = 'INR'

      const options = {
        amount: parseInt(totalAmount * 100),
        currency,
        receipt: shortId.generate(),
        payment_capture
      }

      const response = await razorpay.orders.create(options)
      if (response && response.status === 'created') {
        const onlineTest = packageDetail.online_test ? 1 : 0
        const testReport = packageDetail.test_report ? 1 : 0
        const videoCall = packageDetail.video_call ? 1 : 0
        const f2fCall = packageDetail.f2f_call ? 1 : 0
        const customId = await getUniqueString(8, centerPackageModel)

        await centerPackageModel.create({ center_id: req.user.id, custom_id: customId, package_id: packageId, package_type: packageDetail.package_type, purchase_date: new Date(), order_id: response.id, total_packages, remaining_packages: total_packages, total_amount: totalAmount, package_amount: packageAmount, gst_amount: gst, onlineTest, testReport, videoCall, f2fCall }, { transaction })

        await transaction.commit()
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: response })
      } else {
        return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', 'Payment') })
      }
    } catch (error) {
      await transaction.rollback()
      return await catchError('packages.getAllPackage', error, req, res)
    }
  }

  async paymentPayumoney(req, res) {
    const transaction = await sequelize.transaction()
    try {
      removenull(req.body)

      const centerId = req.user.id
      const center = await centerModel.findOne({ raw: true, where: { id: centerId, is_active: 'y', deleted_at: null } })
      if (!center) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].auth_failed })

      const { packageId, total_packages, coupon_code } = req.body
      const packageDetail = await PackageModel.findOne({ raw: true, where: { id: packageId } })

      const packageAmount = packageDetail.amount * total_packages
      // const gst = packageAmount * 0.18
      const gst = 0
      // const totalAmount = packageAmount + gst

      let totalAmount = packageAmount
      let counponType = null
      let couponCode = null
      const org_amount = totalAmount
      let amountPercentage = null
      if (coupon_code && coupon_code !== '') {
        // check coupon code exist or valid
        const checkCoupon = await couponValidate(coupon_code)
        if (!checkCoupon) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].couponCode) })

        // Check student already used coupon or not
        const checkStudentUseCoupon = await checkCounponCenterUse(coupon_code, centerId)
        if (checkStudentUseCoupon) return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].coupon_already_used })
        counponType = checkCoupon.coupon_type
        couponCode = checkCoupon.code
        amountPercentage = checkCoupon.amount_percentage
        totalAmount = await getDiscountPackageAmount(packageDetail, checkCoupon, total_packages)
      }

      const key = config.payumoney.key
      const salt = config.payumoney.salt
      const txnid = 'pay_' + await getUniqueString(8, centerPackageModel)
      // const txnid = 'pay_73up9xsz'
      const amount = totalAmount
      // const amount = 0.5
      const firstname = center.title
      const email = center.email
      const phone = center.mobile
      const productinfo = packageDetail.title
      const surl = `${config.DEPLOY_HOST_URL}/center/payumoney/success`
      const furl = `${config.DEPLOY_HOST_URL}/center/payumoney/fail`

      const hashString = key +
                  '|' + txnid +
                  '|' + amount + '|' + productinfo + '|' +
                  firstname + '|' + email + '|' +
                  '||||||||||' + salt
      console.log(hashString)
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
      const customId = await getUniqueString(8, centerPackageModel)

      await centerPackageModel.create({ center_id: req.user.id, custom_id: customId, package_id: packageId, package_type: packageDetail.package_type, purchase_date: new Date(), total_packages, remaining_packages: total_packages, total_amount: org_amount, final_amount: amount, coupon_code: couponCode, coupon_type: counponType, amount_percentage: amountPercentage, package_amount: packageAmount, gst_amount: gst, onlineTest, testReport, videoCall, f2fCall, transaction_id: txnid }, { transaction })

      await transaction.commit()
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: paymentData })
    } catch (error) {
      await transaction.rollback()
      return await catchError('packages.getAllPackage', error, req, res)
    }
  }

  // dashboard
  async purchasedLicense(req, res) {
    try {
      const packages = await centerPackageModel.findAll({ where: { center_id: req.user.id, payment_status: 'C' } })
      let basicPackages = 0
      let advacedPackages = 0
      let assignedBasicPackages = 0
      let remainingBasicPackages = 0
      let assignedAdvPackages = 0
      let remainingAdvPackages = 0

      for (let i = 0; i < packages.length; i++) {
        if (packages[i].package_id === 1) {
          basicPackages = basicPackages + packages[i].total_packages
          assignedBasicPackages = assignedBasicPackages + packages[i].assigned_packages
          remainingBasicPackages = remainingBasicPackages + packages[i].remaining_packages
        }
        if (packages[i].package_id === 2) {
          advacedPackages = advacedPackages + packages[i].total_packages
          assignedAdvPackages = assignedAdvPackages + packages[i].assigned_packages
          remainingAdvPackages = remainingAdvPackages + packages[i].remaining_packages
        }
      }

      const data = {
        basicPackageTitle: { basicPackages, assignedBasicPackages, remainingBasicPackages },
        advancedPackageTitle: { advacedPackages, assignedAdvPackages, remainingAdvPackages }
      }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data })
    } catch (error) {
      return await catchError('packages.getAllPackage', error, req, res)
    }
  }

  // purchase status
  async purchaseSuccess (req, res) {
    const transaction = await sequelize.transaction()
    try {
      removenull(req.body)
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body

      const centerPackage = await centerPackageModel.findOne({ raw: true, where: { order_id: razorpay_order_id } })
      if (!centerPackage) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', 'center package') })

      const packageDetail = await PackageModel.findOne({ raw: true, where: { id: centerPackage.package_id } })

      const customId = await getUniqueString(8, centerPaymentHistories)
      await centerPaymentHistories.create(
        {
          custom_id: customId,
          center_id: req.user.id,
          package_id: packageDetail.id,
          transaction_id: razorpay_payment_id,
          order_id: razorpay_order_id,
          razorpay_signature,
          amount: centerPackage.total_amount,
          status: 'C'
        }, { transaction })
      await centerPackageModel.update({ purchase_date: new Date(), payment_status: 'C' }, { where: { id: centerPackage.id } }, { transaction })

      await transaction.commit()
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].package) })
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
          const centerPackage = await centerPackageModel.findOne({ raw: true, where: { transaction_id: txnid } })
          if (!centerPackage) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', 'center package') })

          const packageDetail = await PackageModel.findOne({ raw: true, where: { id: centerPackage.package_id } })

          const customId = await getUniqueString(8, centerPaymentHistories)
          await centerPaymentHistories.create(
            {
              custom_id: customId,
              center_id: req.user.id,
              package_id: packageDetail.id,
              transaction_id: txnid,
              order_id: mihpayid,
              order_signature: hash,
              amount: centerPackage.total_amount,
              status: 'C'
            }, { transaction })
          await centerPackageModel.update({ purchase_date: new Date(), payment_status: 'C' }, { where: { id: centerPackage.id } }, { transaction })

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
      const packages = await centerPackageModel.findAll({
        where: {
          center_id: req.user.id,
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
        attributes: ['id', 'total_packages', 'total_amount', [Sequelize.col('CenterPackages.custom_id'), 'package_custom_id'], [Sequelize.col('packages.id'), 'package_id'], 'package_type', 'purchase_date', 'onlineTest', 'testReport', 'videoCall', 'f2fCall', [Sequelize.col('packages.title'), 'package_name'], [Sequelize.col('packages.id'), 'package_id'], [Sequelize.col('packages.description', 'description'), 'description']],
        order: sorting,
        limit,
        offset: start
      })

      const total = await centerPackageModel.findAndCountAll({
        where: {
          center_id: req.user.id,
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
        }]
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: packages, total: total.count, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('packages.getAllAddonPackage', error, req, res)
    }
  }

  async getInvoice(req, res) {
    try {
      removenull(req.params)
      const { id } = req.params
      const gotPackage = await centerPackageModel.findOne({
        raw: true,
        where: { custom_id: id },
        include: [{
          model: PackageModel,
          as: 'packages',
          attributes: []
        }],
        attributes: ['id', 'total_packages', 'total_amount', 'final_amount', 'coupon_code', 'coupon_type', 'amount_percentage', 'invoice_path', 'package_type', 'purchase_date', 'onlineTest', 'testReport', 'videoCall', 'f2fCall', [Sequelize.col('packages.title'), 'package_name'], [Sequelize.col('packages.id'), 'package_id'], [Sequelize.col('packages.description', 'description'), 'package_description'], [Sequelize.col('packages.amount', 'amount'), 'package_amount']]
      })
      if (!gotPackage) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].package) })
      const gotInvoicePath = gotPackage.invoice_path
      if (!gotInvoicePath) {
        console.log(gotPackage)
        const pdf = await generateCenterInvoicePdf(gotPackage)
        const logged = await centerPackageModel.update({ invoice_path: pdf.imagePath }, { where: { id: gotPackage.id } })
        console.log(logged, 'updated')
        res.set('Content-Type', 'application/pdf')
        res.download(pdf.imagePath)
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
      const center_id = req.user.id

      const packageDetail = await PackageModel.findOne({ raw: true, where: { id: packageId } })
      if (!packageDetail) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].package) })

      // check coupon code exist or valid
      const checkCoupon = await couponValidate(coupon_code)
      if (!checkCoupon) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].couponCode) })

      // Check center already used coupon or not
      const checkCenterUseCoupon = await checkCounponCenterUse(coupon_code, center_id)
      if (checkCenterUseCoupon) return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].coupon_already_used })

      const finalAmount = await getDiscountPackageAmount(packageDetail, checkCoupon)
      await transaction.commit()
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].coupon_applied_success, data: { checkCoupon, package_amount: finalAmount, package_id: packageDetail.id } })
    } catch (error) {
      await transaction.rollback()
      return await catchError('packages.getTestReport', error, req, res)
    }
  }
}

module.exports = new CenterServices()
