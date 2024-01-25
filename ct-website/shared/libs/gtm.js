import { PUBLIC_GTM_ID } from '@shared/constants'

export const GTM_ID = PUBLIC_GTM_ID

export const tagPageview = (url) => {
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'pageview',
      page: url
    })
  }
}
