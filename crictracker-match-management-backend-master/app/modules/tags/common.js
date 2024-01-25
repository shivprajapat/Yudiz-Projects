const _ = require('../../../global')
const axios = require('axios')
const config = require('../../../config')

const getSeo = async (iId, context) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const seoResponse = await axios({
          url: process.env.SEO_SUBGRAPH_URL,
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            language: 'english'
          },
          data: {
            query: `
            query GetSeoById($input: getSeoByIdInput) {
              getSeoById(input: $input) {
                aKeywords
                eType
                iId
                sSlug
                sTitle
              }
            }
            `,
            variables: {
              input: {
                iId
              }
            }
          }
        })
        const data = seoResponse.data?.data?.getSeoById
        if (!data) resolve({ error: seoResponse.data?.errors, isError: true })
        resolve({ data, isError: false })
      } catch (error) {
        resolve({ error, isError: true })
      }
    })()
  })
}

const createTag = async (tagParams, context) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const { authorization } = context.headers
        if (!authorization) _.throwError('requiredField', context)
        const decodedToken = _.decodeToken(authorization)
        if (!decodedToken || decodedToken === 'jwt expired' || !decodedToken?.iAdminId || decodedToken === 'invalid signature' || decodedToken === 'jwt malformed') _.throwError('authorizationError', context)

        const { sName, eType, eStatus, iId } = tagParams

        const tagResponse = await axios({
          url: `${process.env.ARTICLE_SUBGRAPH_URL}/graphql`,
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            authorization: authorization
          },
          data: {
            query: `
            mutation CreateTag($input: createTagInput) {
              createTag(input: $input) {
                oData {
                  _id
                  dUpdated
                  dCreated
                }
                sMessage
              }
            }
            `,
            variables: {
              input: {
                sName,
                eType,
                eStatus,
                iId
              }
            }
          }
        })
        const data = tagResponse.data?.data?.createTag
        if (!data) resolve({ error: tagResponse.data?.errors, isError: true })
        resolve({ data, isError: false })
      } catch (error) {
        resolve({ error, isError: true })
      }
    })()
  })
}

const updateTag = async (tagParams, context) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const tagResponse = await axios({
          url: process.env.ARTICLE_SUBGRAPH_URL,
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            language: 'english'
          },
          data: {
            query: `
            mutation UpdateOtherTags($input: updateOtherTagsInput) {
              updateOtherTags(input: $input) {
                sMessage
              }
            }
            `,
            variables: {
              input: tagParams
            }
          }
        })
        const data = tagResponse.data?.data?.updateOtherTags
        if (!data) resolve({ error: tagResponse.data?.errors, isError: true })
        resolve({ data, isError: false })
      } catch (error) {
        resolve({ error, isError: true })
      }
    })()
  })
}

const addSeo = async (seoParams) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        if (!seoParams.eType || !seoParams.iId || !seoParams.sSlug) resolve({ isError: true })
        const seoResponse = await axios.post(`${config.SEO_REST_URL}api/addTagSeo`, seoParams)
        const { data } = seoResponse
        if (!data) resolve({ isError: true })
        resolve({ data, isError: false })
      } catch (error) {
        resolve({ error, isError: true })
      }
    })()
  })
}

module.exports = {
  getSeo,
  createTag,
  updateTag,
  addSeo
}
