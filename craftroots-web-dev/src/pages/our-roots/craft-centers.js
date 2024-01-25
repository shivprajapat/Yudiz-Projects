import React from 'react'
import PropTypes from 'prop-types'

import { Heading, Meta, SkeletonBox, SkeletonTitle } from '@/components/generic'
import { BRAND_NAME } from '@/helper/constant'
import META from '@/helper/meta-constant'
import { fetchCMSPageData } from '@/helper'

const CraftCenters = ({ craftCentersData }) => {
  const craftCentersPageData = craftCentersData?.cmsPage
  const isLoading = !craftCentersData
  return (
    <section className="py-10 md:py-20 craft-centers">
      <Meta
        title={
          craftCentersPageData?.meta_title ||
          craftCentersPageData.title + ' | ' + BRAND_NAME
        }
        keyword={
          craftCentersPageData?.meta_keywords || META.commonContent.keywords
        }
        description={
          craftCentersPageData?.meta_description ||
          META.commonContent.description
        }
      />
      <div className="container">
        {isLoading ? (
          <SkeletonTitle />
        ) : (
          <Heading title={craftCentersPageData?.title} />
        )}
      </div>
      {isLoading ? (
        <SkeletonBox />
      ) : (
        <div
          dangerouslySetInnerHTML={{
            __html: craftCentersPageData?.content,
          }}
        />
      )}
    </section>
  )
}

export default CraftCenters
CraftCenters.propTypes = {
  craftCentersData: PropTypes.shape({
    cmsPage: PropTypes.shape({
      content: PropTypes.string,
      meta_description: PropTypes.string,
      meta_keywords: PropTypes.string,
      meta_title: PropTypes.string,
      title: PropTypes.string,
    }),
  }),
}
CraftCenters.defaultProps = {
  craftCentersData: {
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
    const craftCentersData = await fetchCMSPageData('craft-centers')
    return { props: { craftCentersData } }
  } catch (error) {
    console.log('error', error)
    return { props: { craftCentersData: null } }
  }
}
