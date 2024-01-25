import React from 'react'
import dynamic from 'next/dynamic'

import Layout from '../../shared/components/layout'
import { pageLoading } from '@shared/libs/allLoader'
import WithAuth from '@shared/components/withAuth'
import { allRoutes } from '@shared/constants/allRoutes'

const ForgotPassword = dynamic(() => import('@shared-components/auth/forgotPassword'), { loading: () => pageLoading() })

function ForgotPasswordPage() {
  return (
    <Layout>
      <ForgotPassword />
    </Layout>
  )
}

export default WithAuth(ForgotPasswordPage, 'public', allRoutes.forgotPassword)
