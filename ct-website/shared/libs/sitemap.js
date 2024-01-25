import { GET_SITE_MAP } from '@graphql/sitemap/query.sitemap'
import queryGraphql from '@shared/components/queryGraphql'

export async function getSiteMapData(res, key) {
  const { data } = await queryGraphql(GET_SITE_MAP, { input: { sKey: key } })
  res.setHeader('Content-Type', 'text/xml')
  res.write(data?.getSiteMap)
  res.end()
};
