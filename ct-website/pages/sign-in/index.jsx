import React from 'react'
import dynamic from 'next/dynamic'
import { Container } from 'react-bootstrap'

import Layout from '../../shared/components/layout'
import { formLoader } from '@shared/libs/allLoader'
import WithAuth from '@shared/components/withAuth'
import { allRoutes } from '@shared/constants/allRoutes'

const Skeleton = dynamic(() => import('@shared/components/skeleton'), { ssr: false })
const SignIn = dynamic(() => import('@shared/components/auth/signIn'), {
  loading: () => (
    <div className="bg-white rounded p-5 d-flex align-items-center">
      <div className="w-50 pe-3">
        {formLoader()}
        {formLoader()}
      </div>
      <div className="w-50 ps-2">
        <Skeleton height={'35px'} className={'mb-3'} />
        <Skeleton height={'35px'} />
      </div>
    </div>
  ),
  ssr: false
})

function SignInPage() {
  return (
    <Layout>
      <section className="common-section common-height">
        <Container>
          <SignIn />
        </Container>
      </section>
    </Layout>
  )
}

export default WithAuth(SignInPage, 'public', allRoutes.signIn)
