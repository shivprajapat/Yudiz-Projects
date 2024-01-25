import React from 'react'
import PropTypes from 'prop-types'
import { Heading, Meta, SkeletonBox } from '@/components/generic'
import { ThemeListItem } from '@/components/CardList'
import SkeletonTitle from '@/components/generic/skeleton/SkeletonTitle'
import { BRAND_NAME } from '@/helper/constant'
import META from '@/helper/meta-constant'

const CMSPage = ({ CMSData }) => {
  const cmsPageData = CMSData?.cmsPage
  const isLoading = !cmsPageData
  return (
    <section className="section-padding">
      <div className="container">
        <Meta
          title={
            cmsPageData?.meta_title || cmsPageData?.title + ' | ' + BRAND_NAME
          }
          keyword={cmsPageData?.meta_keywords || META.commonContent.keywords}
          description={
            cmsPageData?.meta_description || META.commonContent.description
          }
        />
        {isLoading ? <SkeletonTitle /> : <Heading title={cmsPageData?.title} />}
        {isLoading ? (
          <SkeletonBox />
        ) : (
          <div className="bg-grey-100 border border-grey-300 p-3 xs:p-5 sm:p-8 lg:p-10">
            <ThemeListItem title={cmsPageData?.content} />
          </div>
        )}
      </div>
    </section>
  )
}

export default CMSPage
CMSPage.propTypes = {
  CMSData: PropTypes.shape({
    cmsPage: PropTypes.shape({
      content: PropTypes.string,
      meta_description: PropTypes.string,
      meta_keywords: PropTypes.string,
      meta_title: PropTypes.string,
      title: PropTypes.string,
    }),
  }),
}

CMSPage.defaultProps = {
  CMSData: {
    cmsPage: {
      content: '',
      meta_description: '',
      meta_keywords: '',
      meta_title: '',
      title: '',
    },
  },
}
