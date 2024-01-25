import PropTypes from 'prop-types'
import { GET_RSS_FEED } from '@graphql/rss-feed/rss-feed.query'
import queryGraphql from '@shared/components/queryGraphql'
import { handleApiError } from '@shared/utils'

function InstantArticles({ error }) {
  return (
    <div className="container py-2">
      <p>{error}</p>
    </div>
  )
}
InstantArticles.propTypes = {
  error: PropTypes.any
}

export default InstantArticles
export async function getServerSideProps({ res }) {
  try {
    const { data } = await queryGraphql(GET_RSS_FEED, { input: { sSlug: 'instant-articles' } })
    res.setHeader('Content-Type', 'application/rss+xml; charset=UTF-8')
    res.write(data?.getRssFeed)
    res.end()
    return {
      props: {}
    }
  } catch (e) {
    const status = handleApiError(e)
    return status
  }
}
