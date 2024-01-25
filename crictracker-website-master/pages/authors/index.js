import React from 'react'
import PropTypes from 'prop-types'
import { Container } from 'react-bootstrap'
import dynamic from 'next/dynamic'

import Error from '@shared/components/error'
import Layout from '@shared-components/layout'

const AuthorList = dynamic(() => import('@shared-components/author'))
const AuthorListBanner = dynamic(() => import('@shared-components/author/authorListBanner'))

function Authors({ authorList, seoData }) {
  return (
    <Layout
      data={{
        oSeo: {
          ...seoData?.getSeoData,
          sTitle: 'Authors at CricTracker',
          sDescription: 'Check out the list of Authors who writes on CricTracker'
        }
      }}
    >
      <AuthorListBanner />
      <Container>
        <AuthorList list={authorList?.listAuthors} />
      </Container>
    </Layout>
  )
}

export async function getServerSideProps({ res, resolvedUrl, query }) {
  const [graphql, articleQuery, authorQuery, utils] = await Promise.all([
    import('@shared-components/queryGraphql'),
    import('@graphql/article/article.query'),
    import('@graphql/author/author.query'),
    import('@shared/utils')
  ])

  try {
    res.setHeader('Cache-Control', 'public, max-age=600')
    const url = resolvedUrl?.split('?')[0]

    const [seoData, authorList] = await Promise.allSettled([
      graphql.default(articleQuery.GET_ARTICLE_ID, { input: { sSlug: url.replaceAll('/', '') || '' } }),
      graphql.default(authorQuery.LIST_AUTHORS, {
        input: {
          nLimit: 30,
          nSkip: 1,
          sSearch: query?.search || '',
          sAlphaSearch: query?.alpha || ''
        }
      })
    ])

    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = utils.checkRedirectionStatus(seoData?.value?.data?.getSeoData, query?.amp)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj

    return {
      props: {
        authorList: authorList?.value?.data,
        seoData: seoData?.value?.data
      }
    }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    const status = utils.handleApiError(e, resolvedUrl)
    return status
  }
}

Authors.propTypes = {
  authorList: PropTypes.object,
  seoData: PropTypes.object
}

export default Error(Authors)
// export default Authors
