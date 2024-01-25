import React from 'react'
import dynamic from 'next/dynamic'

import Layout from '../../../shared/components/layout'
import authPageMeta from '@shared/libs/meta-details/authPage'
import WithAuth from '@shared/components/withAuth'

const SavedArticle = dynamic(() => import('@shared/components/profile/savedArticle'))

const SavedForLater = () => {
  return (
    <Layout data={{ oSeo: authPageMeta({ title: 'Save for later - CricTracker', description: 'Simply save it for later. You can now save your favourite cricket news articles & videos to read and watch later.' }) }}>
      <SavedArticle />
    </Layout>
  )
}

export default WithAuth(SavedForLater, 'private')
// export default SavedForLater
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
