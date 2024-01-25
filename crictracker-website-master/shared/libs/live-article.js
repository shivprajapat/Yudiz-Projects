import { GET_LIVE_BLOGS } from '@graphql/article/article.query'
import queryGraphql from '@shared-components/queryGraphql'
import { addAdsInsideParagraph, addAmpAdsInsideParagraph, addEditorAds } from '@shared/utils'

export async function getLiveArticleData(data) {
  const { data: { listLiveBlogContentFront } } = await queryGraphql(GET_LIVE_BLOGS, { input: { iEventId: data?.iEventId, nLimit: 15 } }, data?.token || '')
  const oLiveArticleList = listLiveBlogContentFront?.aResults
  const oLiveArticleEvent = listLiveBlogContentFront?.oEvent

  const splitter = '<div class="ct-liveBlog mceNonEditable" id="ct-liveBlog"></div>'

  const [sFirstContent, sLastContent] = data?.sContent ? addEditorAds(addAdsInsideParagraph(data?.sContent, [0, 1, 2, 5])).split(splitter) : ['', '']
  const [sFirstAmpContent, sLastAmpContent] = data?.sAmpContent ? addEditorAds(addAmpAdsInsideParagraph({
    content: data?.sAmpContent,
    ad1: '138639789/Crictracker2022_AMP_MID_300x250',
    ad2: '138639789/Crictracker2022_AMP_MID2_300x250',
    paragraph: [1, 3],
    customAd: {
      1: `
                    <div>
                      <amp-fx-flying-carpet height="300px">
                        <amp-ad width="300" height="600" layout="fixed" type="doubleclick" data-slot="138639789/Crictracker2022_AMP_FC_300x600" data-enable-refresh="30"></amp-ad>
                      </amp-fx-flying-carpet>
                    </div>
                    `
    }
  })).split(splitter) : ['', '']

  const oLiveArticleContent = { sFirstContent: sFirstContent || '', sLastContent: sLastContent || '' }
  const oLiveArticleAmpContent = { sFirstAmpContent: sFirstAmpContent || '', sLastAmpContent: sLastAmpContent || '' }

  return { oLiveArticleContent, oLiveArticleAmpContent, oLiveArticleList, oLiveArticleEvent }
}
