import queryGraphql from '@shared/components/queryGraphql'
import { HOME_PAGE_ARTICLE, HOME_PAGE_WIDGET, MINI_SCORECARD } from '@graphql/home/home.query'
import { GET_ARTICLE_BY_ID } from '@graphql/article/article.query'
import { GET_SEO_BY_ID } from '@graphql/seo/seo.query'

export async function getHomePageData(type) {
  const { data: position } = await queryGraphql(HOME_PAGE_WIDGET)
  const { data: miniScorecard } = await queryGraphql(MINI_SCORECARD)
  const { data: article } = await queryGraphql(HOME_PAGE_ARTICLE, { input: { nLimit: 3, nSkip: 1 } })
  const allArticle = article?.getHomePageArticle?.aResults
  const widgetPosition = position?.getHomeWidgets

  return {
    articles: allArticle,
    miniScorecard: miniScorecard?.fetchMiniScorecardData || [],
    widgetPosition
  }
}

export async function redirectToArticleWhenQueryHaveID(id) {
  if (isNaN(id)) {
    const { data } = await queryGraphql(GET_SEO_BY_ID, { input: { iId: id } })
    return {
      returnObj: { redirect: { permanent: true, destination: '/' + data?.oSeoById?.sSlug } }
    }
  } else {
    const { data } = await queryGraphql(GET_ARTICLE_BY_ID, { input: { id: Number(id) } })
    return {
      returnObj: { redirect: { permanent: true, destination: '/' + data?.getArticleById?.oSeo?.sSlug } }
    }
  }
}
