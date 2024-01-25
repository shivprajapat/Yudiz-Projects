import React from 'react'
import dynamic from 'next/dynamic'

import Layout from '@shared/components/layout'
import WithAuth from '@shared/components/withAuth'
import { allRoutes } from '@shared/constants/allRoutes'
const ProfileContent = dynamic(() => import('@shared/components/profile/profileContent'))

const Profile = () => {
  return (
    <Layout>
      <ProfileContent />
    </Layout>
  )
}

export default WithAuth(Profile, 'private', allRoutes.profile)
