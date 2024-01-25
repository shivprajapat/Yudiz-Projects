import React from 'react'
import dynamic from 'next/dynamic'

import Layout from '@shared/components/layout'
import authPageMeta from '@shared/libs/meta-details/authPage'
import WithAuth from '@shared/components/withAuth'
const ProfileEditContent = dynamic(() => import('@shared/components/profile/profileEditContent'), { ssr: false })

const ProfileEdit = () => {
  return (
    <Layout data={{ oSeo: authPageMeta({ title: 'Edit Profile - CricTracker', description: 'Manage your profile settings on CricTracker and personalize your cricket experience.' }) }}>
      <ProfileEditContent />
    </Layout>
  )
}

export default WithAuth(ProfileEdit, 'private')
// export default ProfileEdit
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
