import React, { memo } from 'react'
import { useIntl } from 'react-intl'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import { Heading } from '../generic'
import NextImage from '../generic/NextImage'
import useExhibitionBanner from '@/hooks/useExhibitionBanner'

function RecentExhibitions() {
  const intl = useIntl()
  const { exhibitionBanner } = useExhibitionBanner()

  return (
    exhibitionBanner?.data?.length > 0 && (
      <>
        <Heading
          center
          title={intl.formatMessage({
            id: 'page.home.recentExhibitions.title',
          })}
          className="!mb-3 md:!mb-5 lg:!mb-10"
        />
        <div className="overflow-hidden pb-2 md:pb-5 lg:pb-12">
          <Swiper
            spaceBetween={0}
            slidesPerView={1}
            navigation={false}
            pagination={{ clickable: true }}
            loop={true}
            modules={[Autoplay, Pagination]}
          >
            {exhibitionBanner.data.map((banner) => (
              <SwiperSlide key={banner.exhibitionBannerImage}>
                <div className="outline-none">
                  <div className="exhibition-banner-image">
                    <NextImage
                      src={banner.exhibitionBannerImage}
                      alt="banner"
                      width={0}
                      height={0}
                      sizes="600"
                      className="render-exhibition-banner-image"
                      quality={100}
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </>
    )
  )
}

export default memo(RecentExhibitions)
