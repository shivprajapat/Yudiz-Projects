import React from 'react'
import PageNotFound from '@shared/components/pageNotFound'
import { setPreviewMode } from '@shared/libs/menu'

const ErrorPage = () => {
  setPreviewMode(false)
  return <PageNotFound />
}

export default ErrorPage
