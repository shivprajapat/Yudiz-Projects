import React from 'react'
import PropTypes from 'prop-types'
import { Meta, SkeletonBox } from '@/components/generic'
import META from '@/helper/meta-constant'
import { BRAND_NAME } from '@/helper/constant'

const CMSPageWithImages = ({ CMSData }) => {
  const cmsPageData = CMSData?.cmsPage
  const isLoading = !cmsPageData
  return (
    <>
      <Meta
        title={
          cmsPageData?.meta_title || cmsPageData?.title + ' | ' + BRAND_NAME
        }
        keyword={cmsPageData?.meta_keywords || META.commonContent.keywords}
        description={
          cmsPageData?.meta_description || META.commonContent.description
        }
      />
      {isLoading ? (
        <SkeletonBox />
      ) : (
        <div
          dangerouslySetInnerHTML={{
            __html: cmsPageData?.content,
          }}
        />
      )}
    </>
  )
}

export default CMSPageWithImages
CMSPageWithImages.propTypes = {
  CMSData: PropTypes.any,
}

CMSPageWithImages.defaultProps = {
  CMSData: {},
}
