import React from 'react'
import PropTypes from 'prop-types'
import CMSPage from '@/components/CMS/CMSPage'
import { fetchCMSPageData } from '@/helper'

const ShippingPolicy = ({ shippingPolicyData }) => {
  return <CMSPage CMSData={shippingPolicyData} />
}

export default ShippingPolicy

ShippingPolicy.propTypes = {
  shippingPolicyData: PropTypes.shape({
    cmsPage: PropTypes.shape({
      content: PropTypes.string,
      meta_description: PropTypes.string,
      meta_keywords: PropTypes.string,
      meta_title: PropTypes.string,
      title: PropTypes.string,
    }),
  }),
}
ShippingPolicy.defaultProps = {
  shippingPolicyData: {
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
    const shippingPolicyData = await fetchCMSPageData('shipping-payment')
    return { props: { shippingPolicyData } }
  } catch (error) {
    console.log('error', error)
    return { props: { shippingPolicyData: null } }
  }
}
