import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { Container } from 'react-bootstrap'

import Error from '@shared/components/error'
import Layout from '@shared-components/layout'

const BreadcrumbNav = dynamic(() => import('@shared/components/breadcrumbNav'))
const AuthorDetailCard = dynamic(() => import('@shared-components/author/authorDetailCard'))
const AuthorArticles = dynamic(() => import('@shared-components/author/authorArticles'))

function AuthorDetails({ authorData, authorID, articles, fantasyArticles, seoData }) {
  return (
    <Layout
      data={{
        oSeo: {
          ...seoData?.getSeoData,
          sTitle: `${authorData?.sFName} Stories on CricTracker`,
          sDescription: `Read all the latest news from ${authorData?.sFName}. Follow ${authorData?.sFName} for future stories on CricTracker`
        }
      }}
    >
      <Container className="pt-3">
        <BreadcrumbNav />
        <AuthorDetailCard data={authorData} />
        <AuthorArticles articles={articles} fantasyArticles={fantasyArticles} authorID={authorID} />
      </Container>
    </Layout>
  )
}

export async function getServerSideProps({ res, query, resolvedUrl }) {
  const [graphql, articleQuery, authorQuery, utils] = await Promise.all([
    import('@shared-components/queryGraphql'),
    import('@graphql/article/article.query'),
    import('@graphql/author/author.query'),
    import('@shared/utils')
  ])

  try {
    res.setHeader('Cache-Control', 'public, max-age=600')

    const { data: seoData } = await graphql.default(articleQuery.GET_ARTICLE_ID, { input: { sSlug: query.slug || '' } })

    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = utils.checkRedirectionStatus(seoData?.getSeoData, query?.amp)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj

    const authorID = seoData.getSeoData.iId

    const [authorData, articles, fantasyArticles] = await Promise.allSettled([
      graphql.default(authorQuery.GET_AUTHOR_BY_ID, { input: { _id: authorID } }),
      graphql.default(authorQuery.GET_AUTHOR_ARTICLES, {
        input: {
          nSkip: 1,
          nLimit: 10,
          iAuthorDId: authorID
        }
      }),
      graphql.default(authorQuery.GET_AUTHOR_FANTASY_ARTICLES, {
        input: {
          nSkip: 1,
          nLimit: 10,
          iAuthorDId: authorID
        }
      })
    ])

    return {
      props: {
        authorData: authorData?.value?.data?.getAuthor,
        authorID,
        articles: articles?.value?.data?.getAuthorArticles,
        fantasyArticles: fantasyArticles?.value?.data?.getAuthorFantasyArticles,
        seoData
      }
    }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    const status = utils.handleApiError(e, resolvedUrl)
    return status
  }
}

AuthorDetails.propTypes = {
  authorData: PropTypes.object,
  authorID: PropTypes.string,
  articles: PropTypes.object,
  fantasyArticles: PropTypes.object,
  seoData: PropTypes.object
}

export default Error(AuthorDetails)
