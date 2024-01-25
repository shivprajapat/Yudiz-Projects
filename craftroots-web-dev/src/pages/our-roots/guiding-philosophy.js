import React from 'react'
import PropTypes from 'prop-types'

import { Meta, SkeletonBox } from '@/components/generic'
import { BRAND_NAME } from '@/helper/constant'
import META from '@/helper/meta-constant'
import { fetchCMSPageData } from '@/helper'

const GuidingPhilosophy = ({ guidingPhilosophyData }) => {
  const guidingPhilosophyPageData = guidingPhilosophyData?.cmsPage
  const isLoading = !guidingPhilosophyData?.cmsPage
  return (
    <>
      <Meta
        title={
          guidingPhilosophyPageData?.meta_title ||
          guidingPhilosophyPageData.title + ' | ' + BRAND_NAME
        }
        keyword={
          guidingPhilosophyPageData?.meta_keywords ||
          META.commonContent.keywords
        }
        description={
          guidingPhilosophyPageData?.meta_description ||
          META.commonContent.description
        }
      />

      {isLoading ? (
        <SkeletonBox />
      ) : (
        <>
          <div
            dangerouslySetInnerHTML={{
              __html: guidingPhilosophyPageData?.content,
            }}
          />
        </>
      )}
    </>
  )
}

export default GuidingPhilosophy
GuidingPhilosophy.propTypes = {
  guidingPhilosophyData: PropTypes.shape({
    cmsPage: PropTypes.shape({
      content: PropTypes.string,
      meta_description: PropTypes.string,
      meta_keywords: PropTypes.string,
      meta_title: PropTypes.string,
      title: PropTypes.string,
    }),
  }),
}
GuidingPhilosophy.defaultProps = {
  guidingPhilosophyData: {
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
    const guidingPhilosophyData = await fetchCMSPageData('guiding-philosophy')
    return { props: { guidingPhilosophyData } }
  } catch (error) {
    console.log('error', error)
    return { props: { guidingPhilosophyData: null } }
  }
}
