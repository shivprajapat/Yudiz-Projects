import React from 'react'
import PropTypes from 'prop-types'

import CMSPage from '@/components/CMS/CMSPage'
import { fetchCMSPageData } from '@/helper'

const TermsCondition = ({ termsConditionData }) => {
  return <CMSPage CMSData={termsConditionData} />
}

export default TermsCondition
TermsCondition.propTypes = {
  termsConditionData: PropTypes.shape({
    cmsPage: PropTypes.shape({
      content: PropTypes.string,
      meta_description: PropTypes.string,
      meta_keywords: PropTypes.string,
      meta_title: PropTypes.string,
      title: PropTypes.string,
    }),
  }),
}
TermsCondition.defaultProps = {
  termsConditionData: {
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
    const termsConditionData = await fetchCMSPageData('terms-condition')
    return { props: { termsConditionData } }
  } catch (error) {
    console.log('error', error)
    return { props: { termsConditionData: null } }
  }
}
