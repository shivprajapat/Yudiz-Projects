import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Thumbs } from 'swiper/modules'
import dynamic from 'next/dynamic'
import LightBox from '../Lightbox'
import RenderImageSlider from './RenderImageSlider'
import useWindowSize, { SIZE_BREAKPOINTS } from '@/hooks/useWindowSize'
import { useDisableBodyScroll } from '@/hooks/useDisableBodyScroll'
import useLightbox from '@/hooks/useLightbox'
// import styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const ProductDetailSliderArrows = dynamic(
  () => import('./ProductDetailSliderArrows'),
  { ssr: false }
)

function ProductDetailImageSlider({ isLoadingImg, mediaGallery }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [open, setOpen] = useState(false)
  useDisableBodyScroll(open)
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const windowSize = useWindowSize()

  const items = mediaGallery.map((item, index) => {
    return {
      index: index,
      id: index,
      src: item.url,
      thumb: item.url,
      /**
       * because in next.config file max deviceSizes is 1536
       */
      height: 1024,
      width: 1536,
    }
  })
  const { slides } = useLightbox({ items })

  const handleImageClick = useCallback(
    (index) => {
      if (selectedImageIndex !== index) {
        setSelectedImageIndex(index)
      }
    },
    [selectedImageIndex]
  )

  return (
    <>
      <div className="sm:mb-2 lg:mb-3 relative overflow-x-clip">
        <Swiper
          className="md:overflow-clip !overflow-visible"
          slidesPerView={1}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          pagination={{
            enabled: true,
            clickable: true,
            horizontalClass: 'md:hidden',
            bulletClass: 'inline-block w-2 h-2 p-0 bg-primary opacity-50 mx-1',
            bulletActiveClass: '!opacity-100',
          }}
          modules={[Navigation, Thumbs, Pagination]}
        >
          {mediaGallery?.length > 0 &&
            mediaGallery?.map((imgUrl, index) => (
              <SwiperSlide
                key={imgUrl.url}
                className={`product-img product-image-wrapper ${
                  isLoadingImg ? 'loading' : ''
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    handleImageClick(index)
                    setOpen(true)
                  }}
                >
                  <RenderImageSlider
                    src={imgUrl.url}
                    width={600}
                    height={100}
                    sizes="min-width(768px) 100vw, 50vw"
                    quality={100}
                    className="render-image-slider"
                    imageLoadType={index < 1 ? 'eager' : 'lazy'}
                  />
                </button>
              </SwiperSlide>
            ))}
          <ProductDetailSliderArrows />
        </Swiper>

        <LightBox
          open={open}
          close={() => setOpen(false)}
          slides={slides}
          index={selectedImageIndex}
          thumbnails
          zoom
        />
      </div>

      {windowSize.width && windowSize.width >= SIZE_BREAKPOINTS.md && (
        <div className="bottom-slider">
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={2}
            watchSlidesProgress={true}
            modules={[Thumbs]}
            breakpoints={{
              768: {
                slidesPerView: 4.5,
              },
            }}
          >
            {mediaGallery?.length > 0 &&
              mediaGallery?.map((imgUrl) => {
                return (
                  <SwiperSlide
                    key={imgUrl.url}
                    className="thumbnail-product-slider"
                  >
                    <RenderImageSlider
                      src={imgUrl.url}
                      width={0}
                      height={0}
                      sizes="10vw"
                      className="w-auto h-32 mx-auto object-contain"
                    />
                  </SwiperSlide>
                )
              })}
          </Swiper>
        </div>
      )}
    </>
  )
}

ProductDetailImageSlider.propTypes = {
  isLoadingImg: PropTypes.bool.isRequired,
  mediaGallery: PropTypes.arrayOf(
    PropTypes.shape({
      __typename: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      label: PropTypes.oneOfType([PropTypes.oneOf[null], PropTypes.string]),
      position: PropTypes.number.isRequired,
      disabled: PropTypes.bool.isRequired,
    })
  ).isRequired,
}

export default ProductDetailImageSlider
