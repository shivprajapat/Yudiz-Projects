import React from 'react'
import PropTypes from 'prop-types'

import CMSPage from '@/components/CMS/CMSPage'
import { fetchCMSPageData } from '@/helper'

const RefundPolicy = ({ refundPolicyData }) => {
  return <CMSPage CMSData={refundPolicyData} />
}

export default RefundPolicy
RefundPolicy.propTypes = {
  refundPolicyData: PropTypes.shape({
    cmsPage: PropTypes.shape({
      content: PropTypes.string,
      meta_description: PropTypes.string,
      meta_keywords: PropTypes.string,
      meta_title: PropTypes.string,
      title: PropTypes.string,
    }),
  }),
}
RefundPolicy.defaultProps = {
  refundPolicyData: {
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
    const refundPolicyData = await fetchCMSPageData('refund-policy')
    return { props: { refundPolicyData } }
  } catch (error) {
    console.log('error', error)
    return { props: { refundPolicyData: null } }
  }
}
