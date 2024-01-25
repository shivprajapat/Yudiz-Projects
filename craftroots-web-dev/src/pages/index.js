import { Fragment } from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { HomePageBanner, NewCollections } from '@/components/Home'
import { Meta } from '@/components/generic'
import META from '@/helper/meta-constant'
import { fetchCMSPageData } from '@/helper'

const JoinUsForm = dynamic(() => import('../components/Home/JoinUsForm'), {
  ssr: false,
})
const RecentExhibitions = dynamic(
  () => import('../components/Home/RecentExhibitions'),
  {
    ssr: false,
  }
)
const ArtistStory = dynamic(() => import('../components/Home/ArtistStory'), {
  ssr: false,
})

const HarmoniousCombination = dynamic(
  () => import('../components/Home/HarmoniousCombination'),
  {
    ssr: false,
  }
)
const DiscoverRegion = dynamic(
  () => import('../components/Home/DiscoverRegion'),
  {
    ssr: false,
  }
)
const FeatureOn = dynamic(() => import('../components/Home/FeatureOn'), {
  ssr: false,
})
const FollowUs = dynamic(() => import('../components/Home/FollowUs'), {
  ssr: false,
})
function Home({ seoDataRes }) {
  return (
    <Fragment>
      <Meta
        title={seoDataRes?.cmsPage?.meta_title || META.home.title}
        description={
          seoDataRes?.cmsPage?.meta_description ||
          META.commonContent.description
        }
        keyword={
          seoDataRes?.cmsPage?.meta_keywords || META.commonContent.keywords
        }
      />
      <HomePageBanner />
      {/* map product details component */}
      <NewCollections />
      <ArtistStory />

      <section className="pt-5 md:pt-16 lg:pt-20 pb-10 md:pb-16 lg:pb-20 relative recent-exhibitions">
        <div className="absolute inset-x-0 inset-y-0 w-full -z-10 bg-[length:250%] md:bg-contain recent-exhibitions-shape" />
        <div className="container">
          <RecentExhibitions />
          <JoinUsForm />
        </div>
      </section>

      <HarmoniousCombination />
      <DiscoverRegion />
      <FeatureOn />
      <FollowUs />
    </Fragment>
  )
}

Home.propTypes = {
  seoDataRes: PropTypes.shape({
    cmsPage: PropTypes.shape({
      content: PropTypes.string,
      meta_description: PropTypes.string,
      meta_keywords: PropTypes.string,
      meta_title: PropTypes.string,
      title: PropTypes.string,
    }),
  }),
}
Home.defaultProps = {
  seoDataRes: {
    cmsPage: {
      content: '',
      meta_description: '',
      meta_keywords: '',
      meta_title: '',
      title: '',
    },
  },
}
export default Home

export async function getServerSideProps(context) {
  const { res } = context
  try {
    res.setHeader('Cache-Control', 'public, max-age=120')
    const seoDataRes = await fetchCMSPageData('home')
    return { props: { seoDataRes } }
  } catch (error) {
    console.error('error', error)
    return { props: { seoDataRes: null } }
  }
}
