import { useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import { useRouter } from 'next/router'
import NextImage from '../generic/NextImage'
import { Button } from '../generic'
import BannerSkeleton from './BannerSkeleton'
import { BannerItems } from '@/queries/homePageQueries'
import { request } from '@/services/api.service'
import useWindowSize, { SIZE_BREAKPOINTS } from '@/hooks/useWindowSize'
import useAsync from '@/hooks/useAsync'
import { imgHomeShape } from '@/assets/images'
import 'swiper/css'

function HomePageBanner() {
  const size = useWindowSize()
  const router = useRouter()
  const bannerDataAsync = useAsync()

  function fetchBannerItems() {
    bannerDataAsync.run(request, BannerItems)
  }

  useEffect(() => {
    fetchBannerItems()
  }, [])

  return (
    <section className="home-banner">
      {!bannerDataAsync.state.isLoading ? (
        <Swiper
          spaceBetween={0}
          navigation={false}
          pagination={{ clickable: true }}
          speed={1600}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          modules={[Autoplay, Pagination]}
          className="h-full flex"
        >
          {bannerDataAsync.state?.data?.banner?.data?.map((item, bIndex) => {
            const bannerSrc =
              size.width < SIZE_BREAKPOINTS.sm && item?.bannerMobileImage
                ? item?.bannerMobileImage
                : item.bannerImage
            return (
              <SwiperSlide key={item.bannerTitle}>
                <div
                  className="relative home-banner-inner h-full sm:h-[350px] lg:h-[480px] 2xl:h-[537px] !flex"
                  key={item.bannerTitle}
                >
                  <div className="z-10 relative w-full flex-center">
                    <div
                      className={`px-3 py-4 text-gray-200 text-center absolute banner-slider-${
                        bIndex + 1
                      }`}
                    >
                      {item.bannerTitle && (
                        <div className="banner-text capitalize">
                          {item.bannerTitle}
                        </div>
                      )}
                      {item.bannerTitle && item.bannerButtonText && (
                        <NextImage
                          src={imgHomeShape}
                          alt="banner"
                          className="mx-auto my-2 sm:my-3 lg:my-4 h-auto max-w-full"
                        />
                      )}
                      {item.bannerText && (
                        <div className="capitalize font-josefinSans lg:text-2xl sm:text-base sm:mb-4 mb-2 px-2 sm:px-4 lg:px-8">
                          {item.bannerText}
                        </div>
                      )}
                      {item.bannerButtonText && (
                        <Button
                          title={item.bannerButtonText}
                          white
                          className="hover:!bg-grey-900 hover:!text-white !border-none !py-1.5 sm:!py-[9px]"
                          onClick={() => {
                            router.push(`${item.bannerUrlKey}`)
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="absolute inset-0 h-auto">
                    <NextImage
                      src={bannerSrc}
                      alt="banner"
                      className="h-full w-full object-cover"
                      loading={bIndex < 1 ? 'eager' : 'lazy'}
                      fill
                    />
                    <div className="absolute w-full h-full inset-y-0 bg-grey-900 opacity-20" />
                  </div>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      ) : (
        <BannerSkeleton />
      )}
    </section>
  )
}

export default HomePageBanner
