const axios = require('axios')
const config = require('../../../config')

const getCategoryIdBySlug = async (sSlug, context) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const seoResponse = await axios({
          url: config.SEO_SUBGRAPH_URL,
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            language: 'english',
            authorization: context?.headers?.authorization
          },
          data: {
            query: `
            query GetCategoryIdBySlug($input: oSlugInput) {
                getCategoryIdBySlug(input: $input) {
                  iId
                }
              }
              `,
            variables: {
              input: {
                sSlug
              }
            }
          }
        })

        const data = seoResponse.data?.data?.getCategoryIdBySlug
        if (!data) resolve({ error: seoResponse.data?.errors, isError: true })
        resolve({ data, isError: false })
      } catch (error) {
        resolve({ error, isError: true })
      }
    })()
  })
}

module.exports = {
  getCategoryIdBySlug
}
