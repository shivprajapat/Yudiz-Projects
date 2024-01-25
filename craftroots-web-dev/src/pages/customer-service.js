import React from 'react'
import PropTypes from 'prop-types'
import CMSPage from '@/components/CMS/CMSPage'
import { fetchCMSPageData } from '@/helper'

const CustomerService = ({ customerServiceData }) => {
  return <CMSPage CMSData={customerServiceData} />
}

export default CustomerService
CustomerService.propTypes = {
  customerServiceData: PropTypes.shape({
    cmsPage: PropTypes.shape({
      content: PropTypes.string,
      meta_description: PropTypes.string,
      meta_keywords: PropTypes.string,
      meta_title: PropTypes.string,
      title: PropTypes.string,
    }),
  }),
}
CustomerService.defaultProps = {
  customerServiceData: {
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
    const customerServiceData = await fetchCMSPageData('customer-service')
    return { props: { customerServiceData } }
  } catch (error) {
    console.log('error', error)
    return { props: { customerServiceData: null } }
  }
}
