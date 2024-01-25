import React from 'react'
import dynamic from 'next/dynamic'
import { Container } from 'react-bootstrap'

import Layout from '../../shared/components/layout'
import { formLoader } from '@shared/libs/allLoader'
import authPageMeta from '@shared/libs/meta-details/authPage'
import withAuth from '@shared/components/withAuth'

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
  )
})

function SignInPage() {
  return (
    <Layout data={{
      oSeo: authPageMeta({
        title: 'Sign in - CricTracker',
        description: 'Sign in to access CricTracker and start tracking cricket updates.',
        robots: 'Follow, Index'
      })
    }}>
      <section className="common-section">
        <Container>
          <SignIn />
        </Container>
      </section>
    </Layout>
  )
}

export default withAuth(SignInPage, 'public')
// export default SignInPage

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
