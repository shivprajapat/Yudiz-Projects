import React from 'react'
import { Container } from 'react-bootstrap'
import dynamic from 'next/dynamic'

import Layout from '@shared/components/layout'
import authPageMeta from '@shared/libs/meta-details/authPage'
import WithAuth from '@shared/components/withAuth'

const ChangePassword = dynamic(() => import('@shared-components/auth/changePassword'))

function ChangePasswordPage() {
  return (
    <Layout data={{ oSeo: authPageMeta({ title: 'Change or Reset Your Password - CricTracker', description: 'Change or reset your password on CricTracker and personalize your cricket experience' }) }}>
      <section className="common-section">
        <Container>
          <ChangePassword />
        </Container>
      </section>
    </Layout>
  )
}

export default WithAuth(ChangePasswordPage, 'private')
// export default ChangePasswordPage
export async function getServerSideProps({ req, res, params, query }) {
  res.setHeader('Cache-Control', 'public, max-age=600')
  return { props: {} }
}
// export async function getServerSideProps({ req, res, params, query }) {
//   const { token } = req?.cookies
//   res.setHeader('Cache-Control', 'no-store, must-revalidate')
//   if (!token) {
//     res?.writeHead(302, {
//       Location: '/sign-in/'
//     })
//     res?.end()
//   }
//   return { props: {} }
// }
