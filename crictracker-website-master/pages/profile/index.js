import React from 'react'
import dynamic from 'next/dynamic'

import Layout from '@shared/components/layout'
import authPageMeta from '@shared/libs/meta-details/authPage'
import withAuth from '@shared/components/withAuth'

const ProfileContent = dynamic(() => import('@shared/components/profile/profileContent'))

const Profile = (props) => {
  return (
    <Layout data={{ oSeo: authPageMeta({ title: 'Profile - CricTracker', description: 'Create your profile on CricTracker. Profile shows your bio and give access to check all matches live scores & news.' }) }}>
      <ProfileContent />
    </Layout>
  )
}

export default withAuth(Profile, 'private')
// export default Profile
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
