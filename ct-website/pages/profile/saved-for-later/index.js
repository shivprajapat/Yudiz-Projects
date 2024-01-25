import React from 'react'
import dynamic from 'next/dynamic'

import Layout from '../../../shared/components/layout'
import WithAuth from '@shared/components/withAuth'
import { allRoutes } from '@shared/constants/allRoutes'

const SavedArticle = dynamic(() => import('@shared/components/profile/savedArticle'))

const SavedForLater = () => {
  return (
    <Layout>
      <SavedArticle />
    </Layout>
  )
}

export default WithAuth(SavedForLater, 'private', allRoutes.saveForLater)
