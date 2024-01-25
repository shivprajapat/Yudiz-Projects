import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'

import { GET_ARTICLE_ID, GET_FANTASY_ARTICLE_PREVIEW, GET_PREVIEW_ARTICLE_DETAILS } from '@graphql/article/article.query'
import { setPreviewMode } from '@shared/libs/menu'
import { pageLoading } from '@shared/libs/allLoader'
import { useAmp } from 'next/amp'
import { checkPageNumberInSlug, handleApiError } from '@shared/utils'
import queryGraphql from '@shared/components/queryGraphql'

const ArticleDetail = dynamic(() => import('@shared/components/articleDetail'))
const ArticleContent = dynamic(() => import('@shared/components/articleDetail/articleContent'))
const FantasyArticleContent = dynamic(() => import('@shared/components/articleDetail/fantasyArticleContent'))

const ArticleDetailAMP = dynamic(() => import('@shared/components/amp/articleDetailAMP'))
const ArticleContentAMP = dynamic(() => import('@shared/components/amp/articleContentAMP'))
const ArticleFantasyContentAMP = dynamic(() => import('@shared/components/amp/articleFantasyContentAMP'))

export const config = { amp: 'hybrid' }

const ArticlePreview = ({ article, seoData }) => {
  setPreviewMode(true)
  const router = useRouter()
  const isAmp = useAmp()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.classList.add('light-mode')
    }
  }, [])

  useEffect(() => {
    if (!router.query.token) {
      handleError()
    }
  }, [router])

  function handleError() {
    router.replace('/404')
  }

  if ('sTitle' in article) {
    if (router.asPath.includes('fantasy-cricket-tips')) {
      if (isAmp) {
        return (
          <ArticleDetailAMP isPreviewMode seoData={seoData} article={article} latestArticles={[]}>
            <ArticleFantasyContentAMP isPreviewMode article={article} />
          </ArticleDetailAMP>
        )
      } else {
        return (
          <ArticleDetail isPreviewMode article={article}>
            <FantasyArticleContent data={article} />
          </ArticleDetail>
        )
      }
    } else {
      if (isAmp) {
        return (
          <ArticleDetailAMP isPreviewMode seoData={seoData} article={article} latestArticles={[]}>
            <ArticleContentAMP isPreviewMode article={article} />
          </ArticleDetailAMP>
        )
      } else {
        return (
          <ArticleDetail isPreviewMode article={article}>
            <ArticleContent article={article} />
          </ArticleDetail>
        )
      }
    }
  } else return pageLoading()
}

export default ArticlePreview

ArticlePreview.propTypes = {
  article: PropTypes.object,
  seoData: PropTypes.object
}

export async function getServerSideProps({ params, query }) {
  try {
    const { slug } = checkPageNumberInSlug(params.slug)
    const mSlug = slug.join('/')

    const { data: idData } = await queryGraphql(GET_ARTICLE_ID, { input: { sSlug: mSlug } })
    if (idData?.getSeoData?.eType === 'ar') {
      const { data: previewArticle } = await queryGraphql(GET_PREVIEW_ARTICLE_DETAILS, { input: { _id: idData?.getSeoData?.iId } }, query?.token)
      return {
        props: {
          seoData: idData?.getSeoData,
          article: previewArticle?.getPreviewArticleFront
        }
      }
    } else {
      const { data: previewFantasyArticle } = await queryGraphql(GET_FANTASY_ARTICLE_PREVIEW, { input: { _id: idData?.getSeoData?.iId } }, query?.token)
      return {
        props: {
          seoData: idData?.getSeoData,
          article: previewFantasyArticle?.getPreviewFantasyArticleFront
        }
      }
    }
  } catch (e) {
    const status = handleApiError(e)
    return status
    // return { notFound: true }
  }
}
