import React from 'react'
import { useIntl } from 'react-intl'
import PropTypes from 'prop-types'

import {
  imgStoreLocatorAhmedabad,
  imgStoreLocatorFashionMumbai,
  imgStoreLocatorHomeMumbai,
} from '@/assets/images'
import { Heading, Meta } from '@/components/generic'
import StoreLocatorListItem from '@/components/CardList/StoreLocatorListItem'
import META from '@/helper/meta-constant'
import { fetchCMSPageData } from '@/helper'
import { BRAND_NAME } from '@/helper/constant'

const STORE_LOCATOR_DATA = [
  {
    id: 1,
    img: imgStoreLocatorAhmedabad,
    title: 'Craftroots, Ahmedabad',
    address:
      'Veer House, Ground Floor, Opp. WIAA Castrol Institute of Motoring, Judges Bunglow Road, Bodakdev, Ahmedabad - 380054',
    phone: '9586557711',
    directionLink: 'https://goo.gl/maps/jhJU22zvoDhu53ZT7',
  },
  {
    id: 2,
    img: imgStoreLocatorHomeMumbai,
    title: 'Craftroots - Home, Mumbai',
    address:
      'Shop No. 6, Fiona Building, Nr. Soho house, Juhu Tara Road, Mumbai - 400049',
    phone: '6353446690',
    directionLink: 'https://goo.gl/maps/LefawyMjRoapLGbb8',
  },
  {
    id: 3,
    img: imgStoreLocatorFashionMumbai,
    title: 'Craftroots - Fashion, Mumbai',
    address:
      'Shop No. 8, Sea Palace Premises, Next to Sea Princess Hote, Juhu Tara Road, Mumbai - 400049',
    phone: '6353446690',
    directionLink: 'https://goo.gl/maps/DdCnyPZZ1HQzj6C68',
  },
]

const StoreLocator = ({ seoDataRes }) => {
  const intl = useIntl()
  return (
    <>
      <Meta
        title={
          seoDataRes?.cmsPage?.meta_title ||
          seoDataRes?.cmsPage?.title + ' | ' + BRAND_NAME
        }
        description={
          seoDataRes?.cmsPage?.meta_description ||
          META.commonContent.description
        }
        keyword={
          seoDataRes?.cmsPage?.meta_keywords || META.commonContent.keywords
        }
      />
      <section className="section-padding pb-0">
        <div className="container">
          <Heading
            title={intl.formatMessage({ id: 'page.storeLocator.title' })}
          />
        </div>
        <div className="py-12 md:py-16 lg:py-20 artist-story partnership">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-8 gap-y-6 md:gap-y-12">
              {STORE_LOCATOR_DATA.map((item, index) => {
                return <StoreLocatorListItem {...item} key={index} />
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default StoreLocator
StoreLocator.propTypes = {
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
StoreLocator.defaultProps = {
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

export async function getServerSideProps() {
  try {
    const seoDataRes = await fetchCMSPageData('our-stores')
    return { props: { seoDataRes } }
  } catch (error) {
    console.log('error', error)
    return { props: { seoDataRes: null } }
  }
}
