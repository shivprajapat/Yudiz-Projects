const enums = {
  platform: ['A', 'I', 'W', 'O', 'AD'], // A = Android, I = iOS, W = Web, O = Other, AD = Admin

  status: ['Y', 'N'],

  // paymentOptionsKey, paymentGetaways and withdrawPaymentGetaways all must be same ( except type ADMIN  )
  paymentOptionsKey: ['PAYTM', 'AMAZON', 'CASHFREE', 'CASHFREE_UPI'],
  paymentGetaways: ['PAYTM', 'ADMIN', 'CASHFREE', 'CASHFREE_UPI'],
  payoutOptionKey: ['PAYTM', 'AMAZON', 'CASHFREE'],
  withdrawPaymentGetaways: ['ADMIN', 'PAYTM', 'AMAZON', 'CASHFREE'],

  payoutOptionType: ['INSTANT', 'STD'],

  paymentStatus: ['P', 'S', 'C', 'R'], // P = pending, S = success, C = cancelled, R = refunded
  payoutStatus: ['P', 'S', 'C', 'R', 'I'], // P = pending, S = success, C = cancelled, R = refunded, I = Initiated

  tdsStatus: ['P', 'A'], // pending active

  transactionType: ['Bonus', 'Refer-Bonus', 'Deposit', 'Withdraw', 'Win', 'Play', 'Bonus-Expire', 'Play-Return', 'Win-Return', 'Opening', 'Creator-Bonus', 'TDS', 'Withdraw-Return', 'Cashback-Contest', 'Cashback-Return', 'Creator-Bonus-Return', 'Loyalty-Point'],
  passbookType: ['Dr', 'Cr'],
  passbookStatus: ['R', 'CMP', 'CNCL'], // CMP = Complete  R = REFUND  CNCL = CANCEL

  imageMimeTypes: ['image/png', 'image/jpeg', 'image/gif'],
  imageExtensions: ['jpeg', 'jpg', 'png', 'gif'],
  imageFormat: [{ extension: 'jpeg', type: 'image/jpeg' }, { extension: 'jpg', type: 'image/jpeg' }, { extension: 'png', type: 'image/png' }, { extension: 'gif', type: 'image/gif' }, { extension: 'svg', type: 'image/svg+xml' }, { extension: 'heic', type: 'image/heic' }, { extension: 'heif', type: 'image/heif' }]

}

module.exports = enums
