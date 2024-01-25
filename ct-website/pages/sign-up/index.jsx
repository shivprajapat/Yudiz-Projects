import React from 'react'
import dynamic from 'next/dynamic'
import { Container } from 'react-bootstrap'

import Layout from '../../shared/components/layout'
import { formLoader } from '@shared/libs/allLoader'
import WithAuth from '@shared/components/withAuth'

import Skeleton from '@shared/components/skeleton'
import { allRoutes } from '@shared/constants/allRoutes'
const SignUp = dynamic(() => import('@shared/components/auth/signUp'), {
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
  )
})

function SignupPage() {
  return (
    <Layout>
      <section className="common-section">
        <Container>
          <SignUp />
        </Container>
      </section>
    </Layout>
  )
}

export default WithAuth(SignupPage, 'public', allRoutes.signUp)
