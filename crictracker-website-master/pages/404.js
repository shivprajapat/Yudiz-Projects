import React from 'react'
import dynamic from 'next/dynamic'
import { setPreviewMode } from '@shared/libs/menu'

const PageNotFound = dynamic(() => import('@shared/components/pageNotFound'))

const ErrorPage = () => {
  setPreviewMode(false)
  return <PageNotFound />
}

export default ErrorPage
