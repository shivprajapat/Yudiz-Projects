import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { Container } from 'react-bootstrap'
import useTranslation from 'next-translate/useTranslation'

import queryGraphql from '@shared/components/queryGraphql'
import { GET_AUTHOR_BY_ID, GET_AUTHOR_ARTICLES, GET_AUTHOR_FANTASY_ARTICLES } from '@graphql/author/author.query'
import Error from '@shared/components/error'
import Layout from '@shared-components/layout'
import { GET_ARTICLE_ID } from '@graphql/article/article.query'
import { checkRedirectionStatus, handleApiError } from '@shared/utils'

const BreadcrumbNav = dynamic(() => import('@shared/components/breadcrumbNav'))
const AuthorDetailCard = dynamic(() => import('@shared-components/author/authorDetailCard'))
const AuthorArticles = dynamic(() => import('@shared-components/author/authorArticles'))

function AuthorDetails({ authorData, authorID, articles, fantasyArticles, seoData }) {
  const { t } = useTranslation('common')
  return (
    <Layout
      data={{
        oSeo: {
          ...seoData?.getSeoData,
          sTitle: t('AuthorDetails.Title', { name: authorData?.sFName }),
          sDescription: t('AuthorDetails.Description', { name: authorData?.sFName })
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

export async function getServerSideProps({ res, query }) {
  try {
    res.setHeader('Cache-Control', 'public, max-age=600')
    const { data: seoData } = await queryGraphql(GET_ARTICLE_ID, { input: { sSlug: query.slug || '' } })
    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = checkRedirectionStatus(seoData?.getSeoData)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj

    const authorID = seoData.getSeoData.iId
    const {
      data: { getAuthor: authorData }
    } = await queryGraphql(GET_AUTHOR_BY_ID, { input: { _id: authorID } })
    const {
      data: { getAuthorArticles: articles }
    } = await queryGraphql(GET_AUTHOR_ARTICLES, {
      input: {
        nSkip: 1,
        nLimit: 10,
        iAuthorDId: authorID
      }
    })
    const {
      data: { getAuthorFantasyArticles: fantasyArticles }
    } = await queryGraphql(GET_AUTHOR_FANTASY_ARTICLES, {
      input: {
        nSkip: 1,
        nLimit: 10,
        iAuthorDId: authorID
      }
    })
    return {
      props: {
        authorData,
        authorID,
        articles,
        fantasyArticles,
        seoData
      }
    }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    const status = handleApiError(e)
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
