import React from 'react'
import Head from 'next/head'
import { Col, Container, Row } from 'react-bootstrap'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'
import { useQuery } from '@apollo/client'

import styles from './style.module.scss'
import { GET_TOP_ARTICLES } from '@graphql/article/article.query'
import artwork from '@assets/images/404-artwork.svg'
import { SITE_NAME } from '@shared/constants'
import ArticleGrid from '../article/articleGrid'
import { allRoutes } from '@shared/constants/allRoutes'
import CustomLink from '../customLink'

const MyImage = dynamic(() => import('@shared/components/myImage'))

function PageNotFound() {
  const { t } = useTranslation()
  const { data: TopArticleData } = useQuery(GET_TOP_ARTICLES, { variables: { input: { nSkip: 1, nLimit: 3 } } })
  return (
    <>
      <Head>
        <title>{t('common:PageNotFound')} | {SITE_NAME}</title>
      </Head>
      <section
        className={`${styles.pageNotFound} common-section d-flex justify-content-center align-items-center text-center text-secondary`}
      >
        <div className="py-2 py-md-3">
          <h1>{t('common:CleanBowled')}</h1>
          <div className={`${styles.title} d-flex align-items-center font-semi`}>
            4
            <div className={`${styles.artwork} mx-2 mx-md-3`}>
              <MyImage src={artwork} width="162" height="162" alt="post" layout="responsive" />
            </div>
            4
          </div>
          <h5>{t('common:DoesNotExistPage')}</h5>
          <CustomLink href="/">
            <a href="/" className={`${styles.btn} theme-btn mt-2`}>
              {t('common:ReadTopArticles')}
            </a>
          </CustomLink>
        </div>
      </section>
      {TopArticleData?.getTopArticles?.length > 0 && <Container className="mb-4">
        <h3 className="small-head">{t('common:InterestInReadingArticle')}</h3>
        <Row className={styles.topArticles}>
          {TopArticleData?.getTopArticles?.map((data, i) => {
            return (
              <Col sm={4} key={i}>
                <ArticleGrid data={data} />
              </Col>
            )
          })}
        </Row>
        <p className="text-center">{t('common:OrYouCould')} <CustomLink href={allRoutes.home} prefetch={false}><a className="theme-btn xsmall-btn">{t('common:GoBack')}</a></CustomLink></p>
      </Container>}
    </>
  )
}

export default PageNotFound
