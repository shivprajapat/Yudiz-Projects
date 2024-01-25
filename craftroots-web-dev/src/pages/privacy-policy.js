import React from 'react'
import PropTypes from 'prop-types'

import CMSPage from '@/components/CMS/CMSPage'
import { fetchCMSPageData } from '@/helper'

const PrivacyPolicy = ({ privacyPolicyData }) => {
  return <CMSPage CMSData={privacyPolicyData} />
}

export default PrivacyPolicy

PrivacyPolicy.propTypes = {
  privacyPolicyData: PropTypes.shape({
    cmsPage: PropTypes.shape({
      content: PropTypes.string,
      meta_description: PropTypes.string,
      meta_keywords: PropTypes.string,
      meta_title: PropTypes.string,
      title: PropTypes.string,
    }),
  }),
}
PrivacyPolicy.defaultProps = {
  privacyPolicyData: {
    cmsPage: {
      content: '',
      meta_description: '',
      meta_keywords: '',
      meta_title: '',
      title: '',
    },
  },
}

export const getServerSideProps = async () => {
  try {
    const privacyPolicyData = await fetchCMSPageData('privacy-policy')
    return { props: { privacyPolicyData } }
  } catch (error) {
    console.log('error', error)
    return { props: { privacyPolicyData: null } }
  }
}
