import React, { memo, useRef } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
import { Heading } from '../generic'
import NextImage from '../generic/NextImage'
import useArtisanStory from '@/hooks/useArtisanStory'
import { IconCircleArrowLeft, IconCircleArrowRight } from '@/assets/images'
import useWindowSize, { SIZE_BREAKPOINTS } from '@/hooks/useWindowSize'

function ArtistStory() {
  const { artisanStory } = useArtisanStory()
  const swiperRef = useRef(null)
  const intl = useIntl()
  const size = useWindowSize()
  const renderArrows = () => {
    return (
      <div className="slider-arrow flex items-center gap-4 text-white z-50">
        <button
          className="arrow-btn prev"
          onClick={() => swiperRef.current.swiper.slidePrev()}
        >
          <IconCircleArrowLeft />
        </button>
        <button
          className="arrow-btn next text-white"
          onClick={() => swiperRef.current.swiper.slideNext()}
        >
          <IconCircleArrowRight />
        </button>
      </div>
    )
  }

  return (
    artisanStory?.data?.length > 0 && (
      <section className="artist-story sm:py-8 lg:py-16 my-5 md:my-0 section-padding bg-cover">
        <div className="container sm:relative">
          <div>
            <Swiper
              ref={swiperRef}
              loop={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              allowTouchMove={size.width < SIZE_BREAKPOINTS.sm ? true : false}
              spaceBetween={0}
              slidesPerView={1}
              breakpoints={{
                480: {
                  slidesPerView: 1,
                  spaceBetween: 0,
                },
              }}
            >
              {artisanStory.data.map((artisan) => {
                return (
                  <SwiperSlide key={artisan.name} className="outline-none px-2">
                    <div className="flex flex-wrap justify-between gap-4">
                      <div className="w-full sm:w-[40%] text-white order-last sm:order-1">
                        <div>
                          <div className="hidden sm:block">
                            <h2 className="text-[18px] sm:text-xl md:text-4xl font-semibold font-playfairDisplay mb-2 sm:mb-5 lg:mb-8">
                              <FormattedMessage id="page.home.artisanStory.title" />
                            </h2>
                          </div>
                          <div className="my-2 sm:my-3">
                            <h5 className="text-[18px] sm:text-xl capitalize font-semibold font-jost">
                              {artisan.name}
                            </h5>
                            <span className="block uppercase tracking-[1.7px] text-xs font-normal">
                              {artisan.occupation}
                            </span>
                          </div>
                          <p className="text-sm sm:text-base font-normal">
                            {artisan.description}
                          </p>
                        </div>
                      </div>
                      <div className="w-full sm:w-1/2 order-2">
                        <div className="relative ml-auto">
                          <div className="block sm:hidden">
                            <Heading
                              title={intl.formatMessage({
                                id: 'page.home.artisanStory.title',
                              })}
                              className="!mb-3 text-white"
                            />
                          </div>
                          <div className="video-container relative">
                            <div className="artist-story-video-wrapper relative h-[220px] xs:h-[250px] lg:h-[350px] xl:h-[396px] w-full bg-black">
                              <NextImage
                                alt={artisan?.name}
                                src={artisan?.profile}
                                fill
                                sizes="33vw"
                                className="object-contain"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                )
              })}
            </Swiper>
            {artisanStory.data.length > 1 && <>{renderArrows()}</>}
          </div>
        </div>
      </section>
    )
  )
}

export default memo(ArtistStory)
