import React from 'react'
import dynamic from 'next/dynamic'

import Layout from '@shared/components/layout'
import WithAuth from '@shared/components/withAuth'
import { allRoutes } from '@shared/constants/allRoutes'
const ProfileEditContent = dynamic(() => import('@shared/components/profile/profileEditContent'), { ssr: false })

const ProfileEdit = () => {
  return (
    <Layout>
      <ProfileEditContent />
    </Layout>
  )
}

export default WithAuth(ProfileEdit, 'private', allRoutes.profileEdit)
