import React, { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
import PropTypes from 'prop-types'
import Link from 'next/link'
import NextImage from '../generic/NextImage'
import { Heading } from '../generic'
import { BUTTON_CLASSES } from '../generic/Button'
import { request } from '@/services/api.service'
import { RegionData } from '@/queries/homePageQueries'
import { IconCircleArrowLeft, IconCircleArrowRight } from '@/assets/images'
import useWindowSize, { SIZE_BREAKPOINTS } from '@/hooks/useWindowSize'
import { generateSliderItemForLoop } from '@/helper'
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

function DiscoverRegion() {
  const size = useWindowSize()
  const intl = useIntl()
  const [regionData, setRegionData] = useState({ items: [], maxLength: 0 })
  const swiperRef = useRef(null)

  async function regionItems() {
    try {
      const maxRegionDataLength =
        size.width <= 598 ? 4 : size.width <= SIZE_BREAKPOINTS.lg ? 6 : 8

      const result = await request({
        ...RegionData,
      })
      let discoverRegionData
      discoverRegionData = [...result?.discoverByRegion?.data]

      const updatedRegionData = generateSliderItemForLoop(
        discoverRegionData,
        maxRegionDataLength
      )
      setRegionData({
        items: updatedRegionData,
        maxLength: maxRegionDataLength,
      })
    } catch (error) {
      console.error('discoverRegion error', error)
    }
  }

  useEffect(() => {
    regionItems()
  }, [size])

  return (
    <section className="discover small-padding -mt-1 lg:mt-0">
      <div className="container">
        <div className="flex justify-between items-center mb-4 md:mb-10">
          <Heading
            title={intl.formatMessage({
              id: 'page.home.discoverRegion.title',
            })}
          />
          <div className="lg:hidden sm:block -mt-8">
            <RenderArrows swiperRef={swiperRef} />
          </div>
        </div>

        <Swiper
          ref={swiperRef}
          loop={regionData?.items?.length >= regionData?.maxLength}
          navigation={false}
          spaceBetween={10}
          slidesPerView={2}
          slidesPerGroup={1}
          breakpoints={{
            1024: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
            600: {
              slidesPerView: 3,
              spaceBetween: 15,
            },
          }}
        >
          {regionData?.items?.map((item) => {
            const { profile, title, attributes } = item
            return (
              <SwiperSlide key={title}>
                <div className="h-fit group">
                  <div className="relative overflow-hidden">
                    <div className="aspect-[1.5/2]">
                      <NextImage
                        src={profile}
                        alt={title}
                        fill
                        className="object-center object-cover"
                      />
                    </div>
                    <div className="overlay px-2">
                      <Link href={`/search?query=${attributes.trim()}`}>
                        <span
                          white
                          className={`!leading-4 !tracking-[1px] sm:!tracking-[1.7px] sm:!leading-6 ${BUTTON_CLASSES.base} ${BUTTON_CLASSES.white}`}
                        >
                          {title}
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    </section>
  )
}

export default DiscoverRegion

RenderArrows.propTypes = {
  swiperRef: PropTypes.object.isRequired,
}
