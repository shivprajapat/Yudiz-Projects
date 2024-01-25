import { GET_FANTASY_ARTICLE_OF_CATEGORY } from '@graphql/series/home.query'
import { GET_TAG_ARTICLE, GET_TAG_BY_ID } from '@graphql/tag/tag.query'
import queryGraphql from '@shared-components/queryGraphql'
import { payload } from './category'

export async function getTagData(seo, type, token) {
  const { data: tagData } = await queryGraphql(GET_TAG_BY_ID, { input: { _id: seo?.iId, eType: seo?.eType } }, token)

  // if (type === 'news') {
  //   const { data: article } = await queryGraphql(
  //     GET_TAG_ARTICLE,
  //     {
  //       input: { _id: seo?.iId, eType: seo?.eType, nLimit: 7, nSkip: 0, sSortBy: 'dCreated', nOrder: -1 }
  //     },
  //     token
  //   )
  //   return { data: tagData?.getTagByIdFront, articles: article?.getTagArticlesFront, type }
  // } else if (type === 'fantasy-articles') {
  //   const { data: fantasyArticle } = await queryGraphql(
  //     GET_FANTASY_ARTICLE_OF_CATEGORY,
  //     {
  //       input: { ...payload(7), iId: tagData?.getTagByIdFront?._id }
  //     },
  //     token
  //   )
  //   return {
  //     data: tagData?.getTagByIdFront,
  //     fantasyArticle: fantasyArticle?.listFrontTagCategoryFantasyArticle,
  //     type
  //   }
  // } else {
  const { data: article } = await queryGraphql(
    GET_TAG_ARTICLE,
    {
      input: { _id: seo?.iId, eType: seo?.eType, nLimit: 7, nSkip: 0, sSortBy: 'dCreated', nOrder: -1 }
    },
    token
  )
  const { data: fantasyArticle } = await queryGraphql(
    GET_FANTASY_ARTICLE_OF_CATEGORY,
    {
      input: { ...payload(7), iId: tagData?.getTagByIdFront?._id }
    },
    token
  )
  return {
    data: tagData?.getTagByIdFront,
    home: { fantasyArticle: fantasyArticle?.listFrontTagCategoryFantasyArticle, oArticles: article?.getTagArticlesFront },
    type
  }
  // }
}
