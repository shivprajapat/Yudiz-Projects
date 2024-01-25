import React from 'react'
import PropTypes from 'prop-types'
import CMSPage from '@/components/CMS/CMSPage'
import { fetchCMSPageData } from '@/helper'

const FrequentlyAskedQuestions = ({ frequentlyAskedQuestionsData }) => {
  return <CMSPage CMSData={frequentlyAskedQuestionsData} />
}

export default FrequentlyAskedQuestions
FrequentlyAskedQuestions.propTypes = {
  frequentlyAskedQuestionsData: PropTypes.shape({
    cmsPage: PropTypes.shape({
      content: PropTypes.string,
      meta_description: PropTypes.string,
      meta_keywords: PropTypes.string,
      meta_title: PropTypes.string,
      title: PropTypes.string,
    }),
  }),
}
FrequentlyAskedQuestions.defaultProps = {
  frequentlyAskedQuestionsData: {
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
    const frequentlyAskedQuestionsData = await fetchCMSPageData(
      'frequently-asked-questions-faqs'
    )
    return { props: { frequentlyAskedQuestionsData } }
  } catch (error) {
    console.log('error', error)
    return { props: { frequentlyAskedQuestionsData: null } }
  }
}
