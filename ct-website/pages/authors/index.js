import React from 'react'
import PropTypes from 'prop-types'
import { Container } from 'react-bootstrap'
import dynamic from 'next/dynamic'
import queryGraphql from '@shared/components/queryGraphql'
import { LIST_AUTHORS } from '@graphql/author/author.query'
import Error from '@shared/components/error'
import Layout from '@shared-components/layout'
import { GET_ARTICLE_ID } from '@graphql/article/article.query'
import { checkRedirectionStatus, handleApiError } from '@shared/utils'
import useTranslation from 'next-translate/useTranslation'

const AuthorList = dynamic(() => import('@shared-components/author'))
const AuthorListBanner = dynamic(() => import('@shared-components/author/authorListBanner'))

function Authors({ authorList, seoData }) {
  const { t } = useTranslation('common')
  return (
    <Layout
      data={{
        oSeo: {
          ...seoData?.getSeoData,
          sTitle: t('AuthorsMeta.Title'),
          sDescription: t('AuthorsMeta.Description')
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

export async function getServerSideProps({ res, resolvedUrl }) {
  try {
    res.setHeader('Cache-Control', 'public, max-age=600')
    const { data: seoData } = await queryGraphql(GET_ARTICLE_ID, { input: { sSlug: resolvedUrl.replaceAll('/', '') || '' } })
    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = checkRedirectionStatus(seoData?.getSeoData)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj
    const { data: authorList } = await queryGraphql(LIST_AUTHORS, {
      input: {
        nLimit: 9,
        nSkip: 1
      }
    })
    return {
      props: {
        authorList,
        seoData
      }
    }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    const status = handleApiError(e)
    return status
  }
}

Authors.propTypes = {
  authorList: PropTypes.object,
  seoData: PropTypes.object
}

export default Error(Authors)
// export default Authors
