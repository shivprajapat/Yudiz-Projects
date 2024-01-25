const axios = require('axios')
const config = require('../../../config')

const getSeriesMiniScorecard = async (iSeriesId) => {
  return new Promise((resolve, reject) => {
    try {
      axios.get(`${config.MATCH_MANAGEMENT_SUBGRAPH_URL}/api/series-mini-scorecard/${iSeriesId}`).then(res => {
        if (res?.data?.data) resolve({ isError: false, data: res.data.data, error: null })
        else resolve({ isError: true, data: null })
      }).catch(error => resolve({ isError: true, data: null, error }))
    } catch (error) {
      resolve({ isError: true, data: null, error })
    }
  })
}

module.exports = { getSeriesMiniScorecard }
