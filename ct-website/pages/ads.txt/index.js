import PropTypes from 'prop-types'

import queryGraphql from '@shared/components/queryGraphql'
import { GET_ADS } from '@graphql/ads/ads.query'
import { handleApiError } from '@shared/utils'

function Ads({ error }) {
  return (
    <div className="container py-2">
      <p>{error}</p>
    </div>
  )
}
Ads.propTypes = {
  error: PropTypes.any
}
export default Ads

export async function getServerSideProps({ query, res }) {
  try {
    const { data } = await queryGraphql(GET_ADS)
    res.setHeader('Content-Type', 'text/plain')
    res.write(data?.getAdsTxt)
    res.end()
    return {
      props: {}
    }
  } catch (e) {
    const status = handleApiError(e)
    return status
  }
}
