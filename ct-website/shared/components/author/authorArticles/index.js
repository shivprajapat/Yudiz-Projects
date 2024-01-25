import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Nav, Tab } from 'react-bootstrap'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'
import { useLazyQuery } from '@apollo/client'

import { GET_AUTHOR_ARTICLES, GET_AUTHOR_FANTASY_ARTICLES } from '@graphql/author/author.query'
import { isBottomReached } from '@utils'
import { articleListLoader } from '@shared/libs/allLoader'
import articleStyles from '@shared/components/article/style.module.scss'
import style from './style.module.scss'

const ArticleListCard = dynamic(() => import('../articleListCard'), { loading: () => articleListLoader(2) })
const TABS_KEY = { articles: 'articles', fantasyArticles: 'fantasyArticles' }
function AuthorArticles({ articles: allArticles, fantasyArticles: allFantasyArticles, authorID }) {
  const { t } = useTranslation()
  const [tabKey, setTabKey] = useState(TABS_KEY.articles)
  const [articles, setArticles] = useState(allArticles?.aResults)
  const [fantasyArticles, setFantasyArticles] = useState(allFantasyArticles?.aResults)
  const isLoading = useRef(false)
  const total = useRef({ [TABS_KEY.articles]: allArticles?.nTotal, [TABS_KEY.fantasyArticles]: allFantasyArticles?.nTotal })
  const payload = useRef({
    [TABS_KEY.articles]: { nLimit: 10, nSkip: 1, iAuthorDId: authorID },
    [TABS_KEY.fantasyArticles]: { nLimit: 10, nSkip: 1, iAuthorDId: authorID }
  })
  const [getArticle, { data: articleData, loading: isArticleLoading }] = useLazyQuery(GET_AUTHOR_ARTICLES, {
    variables: { input: payload.current[TABS_KEY.articles] }
  })
  const [getFantasyArticle, { data: fantasyArticleData, loading: isFantasyArticleLoading }] = useLazyQuery(GET_AUTHOR_FANTASY_ARTICLES, {
    variables: { input: payload.current[TABS_KEY.fantasyArticles] }
  })

  useEffect(() => {
    isLoading.current = false
    let lastArticleElementID = articles[articles.length - 1]?._id
    if (tabKey === TABS_KEY.fantasyArticles) {
      lastArticleElementID = fantasyArticles[fantasyArticles.length - 1]?._id
    }
    isBottomReached(lastArticleElementID, isReached)
  }, [articles, fantasyArticles])

  useEffect(() => {
    const articleResponse = articleData?.getAuthorArticles
    const totalArticles = articleResponse?.aResults
    if (totalArticles && totalArticles.length) {
      setArticles([...articles, ...totalArticles])
      total.current[tabKey] = articleResponse.nTotal
    }
    const fantasyArticleReponse = fantasyArticleData?.getAuthorFantasyArticles
    const totalFantasyArticles = fantasyArticleReponse?.aResults
    if (totalFantasyArticles && totalFantasyArticles.length) {
      setFantasyArticles([...fantasyArticles, ...totalFantasyArticles])
      total.current[tabKey] = fantasyArticleReponse.nTotal
    }
  }, [articleData, fantasyArticleData])

  function isReached(reach) {
    const articlesLength = tabKey === TABS_KEY.articles ? articles.length : fantasyArticles.length
    if (reach && articlesLength < total.current[tabKey] && !isLoading.current) {
      isLoading.current = true
      payload.current[tabKey].nSkip += 1
      if (tabKey === TABS_KEY.articles) {
        getArticle()
      } else if (tabKey === TABS_KEY.fantasyArticles) {
        getFantasyArticle()
      }
    }
  }

  return (
    <Tab.Container defaultActiveKey={tabKey} onSelect={(k) => setTabKey(k)}>
      <div className={`${style['tab-wrapper']} d-flex mb-3`}>
        <Nav variant="pills" className="bg-white flex-shrink-0 rounded-pill p-2">
          <Nav.Item className="me-2">
            <Nav.Link eventKey={TABS_KEY.articles} className="text-dark">
              {t('common:NormalArticles')}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={TABS_KEY.fantasyArticles}>{t('common:FantasyArticles')}</Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
      <Tab.Content>
        <Tab.Pane eventKey={TABS_KEY.articles}>
          {articles.length === 0 ? (
            <div className={articleStyles.article}>{t('common:NoArticlesFound')}</div>
          ) : (
            articles.map((article) => <ArticleListCard key={article._id} article={article} />)
          )}
          {(isArticleLoading) && articleListLoader(1)}
        </Tab.Pane>
        <Tab.Pane eventKey={TABS_KEY.fantasyArticles}>
          {fantasyArticles.length === 0 ? (
            <div className={articleStyles.article}>{t('common:NoArticlesFound')}</div>
          ) : (
            fantasyArticles.map((article) => <ArticleListCard key={article._id} article={article} />)
          )}
          {(isFantasyArticleLoading) && articleListLoader(1)}
        </Tab.Pane>
      </Tab.Content>
    </Tab.Container>
  )
}

AuthorArticles.propTypes = {
  articles: PropTypes.object,
  fantasyArticles: PropTypes.object,
  authorID: PropTypes.string
}
AuthorArticles.defaultProps = {
  articles: [],
  fantasyArticles: []
}

export default AuthorArticles
