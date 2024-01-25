const enums = require('./enums')
const socialLink = {
  eSocialNetworkType: {
    type: String,
    enum: enums.eSocailLinkType.value
  },

  sDisplayName: {
    type: String
  },

  sLink: {
    type: String
  },

  eStatus: {
    type: String,
    enum: enums.eStatus.value,
    default: enums.eStatus.default
  }
}

module.exports = socialLink
