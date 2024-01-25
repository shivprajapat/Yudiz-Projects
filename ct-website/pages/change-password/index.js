import React from 'react'
import { Container } from 'react-bootstrap'
import dynamic from 'next/dynamic'

import Layout from '@shared/components/layout'
import WithAuth from '@shared/components/withAuth'
import { allRoutes } from '@shared/constants/allRoutes'

const ChangePassword = dynamic(() => import('@shared-components/auth/changePassword'))

function ChangePasswordPage() {
  return (
    <Layout>
      <section className="common-section">
        <Container>
          <ChangePassword />
        </Container>
      </section>
    </Layout>
  )
}

export default WithAuth(ChangePasswordPage, 'private', allRoutes.changePassword)
