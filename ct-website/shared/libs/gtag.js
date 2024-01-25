import { PUBLIC_GA_TRACKING_ID } from '@shared/constants'

export const GA_TRACKING_ID = PUBLIC_GA_TRACKING_ID

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const analyticsPageview = (url) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url
  })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value
  })
}
