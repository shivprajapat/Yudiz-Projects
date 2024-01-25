import React from 'react'
import { Form } from 'react-bootstrap'
import { useIntl } from 'react-intl'

import ArticleTab from 'shared/components/article-tab'

function DisplaySettings() {
  return (
    <ArticleTab title="Display Settings">
      <Form.Check type="checkbox" className="ms-0" label={useIntl().formatMessage({ id: 'showInFeaturedPostOnHomePage' })} id="home-page" />
      <Form.Check
        type="checkbox"
        className="ms-0"
        label={useIntl().formatMessage({ id: 'showInHomePageCategoryArticleList' })}
        id="articleList"
      />
      <Form.Check
        type="checkbox"
        className="ms-0 mb-0"
        label={useIntl().formatMessage({ id: 'makeStickyOnCategoryDetailPage' })}
        id="Sticky"
      />
    </ArticleTab>
  )
}
export default DisplaySettings
