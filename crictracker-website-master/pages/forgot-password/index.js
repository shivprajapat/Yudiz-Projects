import React from 'react'
import dynamic from 'next/dynamic'

import Layout from '../../shared/components/layout'
import { pageLoading } from '@shared/libs/allLoader'
import authPageMeta from '@shared/libs/meta-details/authPage'
import WithAuth from '@shared/components/withAuth'

const ForgotPassword = dynamic(() => import('@shared-components/auth/forgotPassword'), { loading: () => pageLoading() })

function ForgotPasswordPage() {
  return (
    <Layout data={{ oSeo: authPageMeta({ title: 'Forgot Password - CricTracker', description: 'Forgot password? Please enter your email address so we can send you an email to reset your password.' }) }}>
      <ForgotPassword />
    </Layout>
  )
}

export default WithAuth(ForgotPasswordPage, 'public')
// export default ForgotPasswordPage
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
