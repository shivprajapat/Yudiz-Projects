import React from 'react'
import dynamic from 'next/dynamic'
import { Container } from 'react-bootstrap'

import Layout from '../../shared/components/layout'
import { formLoader } from '@shared/libs/allLoader'
// import WithAuth from '@shared/components/withAuth'

import Skeleton from '@shared/components/skeleton'
// import { allRoutes } from '@shared/constants/allRoutes'
import authPageMeta from '@shared/libs/meta-details/authPage'
import WithAuth from '@shared/components/withAuth'

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
    <Layout data={{
      oSeo: authPageMeta({
        title: 'Sign up - CricTracker',
        description: 'Sign up for free to start tracking cricket updates. Sign up with CricTracker',
        robots: 'Follow, Index'
      })
    }}>
      <section className="common-section">
        <Container>
          <SignUp />
        </Container>
      </section>
    </Layout>
  )
}

export default WithAuth(SignupPage, 'public')
// export default SignupPage
export async function getServerSideProps({ req, res, params, query }) {
  res.setHeader('Cache-Control', 'public, max-age=600')
  return { props: {} }
}
// export async function getServerSideProps({ req, res, params, query }) {
//   const { token } = req?.cookies
//   res.setHeader('Cache-Control', 'no-store, must-revalidate')
//   if (token) {
//     res?.writeHead(302, {
//       Location: '/'
//     })
//     res?.end()
//   }
//   return { props: {} }
// }
