import React from 'react'
import PropTypes from 'prop-types'
import CMSPageWithImages from '@/components/CMS/CMSPageWithImages'
import { fetchCMSPageData } from '@/helper'

const About = ({ aboutUsData }) => {
  return (
    <>
      <section className="pt-10 md:pt-20 about-page">
        <CMSPageWithImages CMSData={aboutUsData} />
      </section>
    </>
  )
}

export default About
About.propTypes = {
  aboutUsData: PropTypes.shape({
    cmsPage: PropTypes.shape({
      content: PropTypes.string,
      meta_description: PropTypes.string,
      meta_keywords: PropTypes.string,
      meta_title: PropTypes.string,
      title: PropTypes.string,
    }),
  }),
}
About.defaultProps = {
  aboutUsData: {
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
    const aboutUsData = await fetchCMSPageData('about-us')
    return { props: { aboutUsData } }
  } catch (error) {
    return { props: { aboutUsData: null } }
  }
}
