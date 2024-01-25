import PropTypes from 'prop-types'
import { GET_RSS_FEED } from '@graphql/rss-feed/rss-feed.query'
import queryGraphql from '@shared/components/queryGraphql'
import { handleApiError } from '@shared/utils'

function Feed({ error }) {
  return (
    <div className="container py-2">
      <p>{error}</p>
    </div>
  )
}
Feed.propTypes = {
  error: PropTypes.any
}

export default Feed
export async function getServerSideProps({ query, res, resolvedUrl }) {
  try {
    let xmlData
    if (query?.slug && res) {
      const slug = query?.slug?.join('/')
      const { data } = await queryGraphql(GET_RSS_FEED, { input: { sSlug: slug } })
      xmlData = data?.getRssFeed
    } else if (!query?.slug && res) {
      const { data } = await queryGraphql(GET_RSS_FEED, { input: { sSlug: '' } })
      xmlData = data?.getRssFeed
    }
    res.setHeader('Content-Type', 'application/rss+xml; charset=UTF-8')
    res.write(xmlData)
    res.end()
    return {
      props: {}
    }
  } catch (e) {
    const status = handleApiError(e, resolvedUrl)
    return status
  }
}
