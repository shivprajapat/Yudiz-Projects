import React, { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import PropTypes from 'prop-types'

import 'swiper/swiper-bundle.css' // Import Swiper styles
import { useIntl } from 'react-intl'
import Image from 'next/image'
import { Heading } from '../generic'
import useWindowSize, { SIZE_BREAKPOINTS } from '@/hooks/useWindowSize'
import useFooter from '@/hooks/useFooter'
import { generateSliderItemForLoop } from '@/helper'
import { IconCircleArrowLeft, IconCircleArrowRight } from '@/assets/images'

function RenderArrows({ swiperRef }) {
  return (
    <div className="slider-arrow flex items-center gap-3  z-50">
      <button
        className="arrow-btn prev text-grey-600"
        onClick={() => swiperRef.current.swiper.slidePrev()}
      >
        <IconCircleArrowLeft />
      </button>
      <button
        className="arrow-btn next text-grey-600"
        onClick={() => swiperRef.current.swiper.slideNext()}
      >
        <IconCircleArrowRight />
      </button>
    </div>
  )
}
function FeatureOn() {
  const swiperRef = useRef(null)

  const { featuredOnLinks } = useFooter()
  const size = useWindowSize()
  const [currentFeaturedOnLinks, setCurrentFeaturedOnLinks] = useState({
    items: [],
    maxLength: 0,
  })

  const intl = useIntl()

  function featuredItems() {
    const maxFeaturedOnLength =
      size.width <= 598 ? 4 : size.width <= SIZE_BREAKPOINTS.lg ? 6 : 8
    const updatedFeaturedItems = generateSliderItemForLoop(
      featuredOnLinks,
      maxFeaturedOnLength
    )
    setCurrentFeaturedOnLinks({
      items: updatedFeaturedItems,
      maxLength: maxFeaturedOnLength,
    })
  }

  useEffect(() => {
    if (featuredOnLinks && size.width) {
      featuredItems()
    }
  }, [featuredOnLinks, size.width])

  return (
    <section className="featured pt-0 pb-10 md:pb-14 lg:pb-20">
      <div className="container">
        <div className="flex justify-between items-center mb-4 md:mb-10">
          <Heading
            title={intl.formatMessage({ id: 'page.home.featured.title' })}
            className="!mb-0"
          />
          {currentFeaturedOnLinks?.items?.length >=
            currentFeaturedOnLinks?.maxLength && (
            <RenderArrows swiperRef={swiperRef} />
          )}
        </div>

        <Swiper
          ref={swiperRef}
          spaceBetween={20}
          slidesPerView={2}
          loop={
            currentFeaturedOnLinks?.items?.length >=
            currentFeaturedOnLinks?.maxLength
          }
          navigation={false}
          slidesPerGroup={1}
          className="h-full flex"
          breakpoints={{
            1024: {
              slidesPerView: 4,
            },
            600: {
              slidesPerView: 3,
            },
          }}
        >
          {currentFeaturedOnLinks?.items?.map((logo, lIndex) => (
            <SwiperSlide key={logo?.image + '' + lIndex}>
              <div className="flex items-center justify-center">
                <a href={logo.link} target="_blank" rel="noopener noreferrer">
                  <Image
                    width={200}
                    height={58}
                    quality={100}
                    src={logo.image}
                    alt=""
                    className="object-contain !h-[58px] sm:!h-[65px] hover:cursor-pointer"
                  />
                </a>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default FeatureOn
RenderArrows.propTypes = {
  swiperRef: PropTypes.object.isRequired,
}
