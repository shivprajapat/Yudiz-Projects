const { GatewayDataSource } = require('../../../federation-subscription-tools/GatewayDataSource')
const gql = require('graphql-tag')
const grpcController = require('../../grpc/client')
const _ = require('../../../global')

class LiveBlogDataSource extends GatewayDataSource {
  // eslint-disable-next-line no-useless-constructor
  constructor(gatewayUrl) {
    super(gatewayUrl)
  }

  willSendRequest(request) {
    if (!request.headers) {
      request.headers = {}
    }

    request.headers['apollographql-client-name'] = 'Subscriptions Service'
    request.headers['apollographql-client-version'] = '0.1.0'

    // Forwards the encoded token extracted from the `connectionParams` with
    // the request to the gateway
    request.headers.authorization = `Bearer ${this.context.token}`
  }

  async fetchAndMergeNonPayloadArticleData(iId, payload, info) {
    const selections = this.buildNonPayloadSelections(payload, info)
    const payloadData = Object.values(payload)[0]

    if (!selections) {
      return payloadData
    }

    const subscriptionGetSeo = gql`
    query SubAdminSubscription($input: subAdminSubscriptionInput) {
      subAdminSubscription(input: $input) {
        _id
        sFName
        sEmail
        sNumber
        eStatus
        oRole {
          aRoleId {
            _id
            sName
          }
          aPermissions {
            aRoles {
              sName
              _id
            }
            iPermissionId {
              _id
              eKey
              eType
              sTitle
              ePerType
            }
          }
        }
        dCreated
        eGender
        sDisplayName
        sUName
        eDesignation
        sUrl
        sBio
        sAddress
        sCity
        bIsVerified
        bIsCustom
        oKyc {
          sPName
          sUrl
          sIfsc
          sANumber
          sAName
          sPanNumber
          sBankDetailPic
          sBankName
          sBranchName
        }
        aSLinks {
          sLink
          sDisplayName
          eSocialNetworkType
        }
        eType
        oSeo {
          iId
        }
      }
    }
    `

    try {
      const response = await this.query(subscriptionGetSeo, {
        variables: {
          input: {
            _id: payloadData._id
          }
        }
      })

      return this.mergeFieldData(payloadData, response?.data?.subAdminSubscription)
    } catch (error) {
      console.error(error)
    }
  }

  async fetchAndMergeNonPayloadMiniscorecardData(iId, payload, info) {
    const selections = this.buildNonPayloadSelections(payload, info)
    const payloadData = Object.values(payload)[0]

    const data = []
    if (!selections) {
      return payloadData
    }
    for (let index = 0; index < payloadData.length; index++) {
      try {
        const ele = payloadData[index]
        const oSeo = await grpcController.getSeoData({ iId: ele._id })
        const seriesSeo = await grpcController.getSeoData({ iId: ele.oSeries._id })
        const oSeriesSeo = await grpcController.getSeoData({ iId: ele?.oSeries?.iCategoryId ?? ele.oSeries._id })
        const oSeriesSeos = await grpcController.getSeosData({ iId: ele.oSeries._id })
        Object.assign(ele, { oSeo })
        Object.assign(ele, { oSeriesSeo })
        Object.assign(ele, { oSeriesSeos })
        Object.assign(ele.oSeries, { oSeo: seriesSeo })
        data.push(ele)
      } catch (error) {
        console.error(error)
      }
    }
    return data
  }

  async fetchAndMergeNonPayloadBlogContent(iId, payload, info) {
    const selections = this.buildNonPayloadSelections(payload, info)
    const payloadData = Object.values(payload)[0]

    if (!selections) {
      return payloadData
    }

    const oAuthor = await grpcController.getAdmin({ iAdminId: _.mongify(payloadData?.liveBlogContent?.iDisplayAuthorId) })
    Object.assign(payloadData.liveBlogContent, { oAuthor })

    if (payloadData?.liveBlogContent?.iPollId) {
      const oPoll = await grpcController.getPollById({ iPollId: _.mongify(payloadData?.liveBlogContent?.iPollId) })
      Object.assign(payloadData.liveBlogContent, { oPoll })
    }

    return payloadData
  }
}

module.exports = LiveBlogDataSource
