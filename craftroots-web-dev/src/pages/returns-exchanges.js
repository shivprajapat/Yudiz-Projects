import React from 'react'
import PropTypes from 'prop-types'

import CMSPage from '@/components/CMS/CMSPage'
import { fetchCMSPageData } from '@/helper'

const ReturnAndExchangePolicy = ({ returnAndExchangePolicyData }) => {
  return <CMSPage CMSData={returnAndExchangePolicyData} />
}

export default ReturnAndExchangePolicy

ReturnAndExchangePolicy.propTypes = {
  returnAndExchangePolicyData: PropTypes.shape({
    cmsPage: PropTypes.shape({
      content: PropTypes.string,
      meta_description: PropTypes.string,
      meta_keywords: PropTypes.string,
      meta_title: PropTypes.string,
      title: PropTypes.string,
    }),
  }),
}
ReturnAndExchangePolicy.defaultProps = {
  returnAndExchangePolicyData: {
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
    const returnAndExchangePolicyData = await fetchCMSPageData(
      'return-exchange-policy'
    )
    return { props: { returnAndExchangePolicyData } }
  } catch (error) {
    console.log('error', error)
    return { props: { returnAndExchangePolicyData: null } }
  }
}
