import { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { useIntl } from 'react-intl'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Heading, SkeletonProductItem } from '../generic'

import { PRODUCT_TYPE } from '@/helper/constant'
import useNewCollection from '@/hooks/useNewCollection'
import { extractChildData } from '@/helper/productList-helper'
import { IconCircleArrowLeft, IconCircleArrowRight } from '@/assets/images'
import 'swiper/css'

const ProductListItem = dynamic(() => import('../generic/ProductListItem'), {
  loading: () => <SkeletonProductItem />,
  ssr: false,
})

function SliderArrows({ slidePrev, slideNext }) {
  return (
    <div className="absolute left-0 -bottom-11 sm:bottom-auto sm:top-[40%] w-fit gap-3 sm:w-full sm:-translate-y-1/4 z-10 flex justify-between items-center">
      <button className="2xl:-ml-7 text-grey-600" onClick={slidePrev}>
        <IconCircleArrowLeft />
      </button>
      <button className="2xl:-mr-7 text-grey-600" onClick={slideNext}>
        <IconCircleArrowRight />
      </button>
    </div>
  )
}

SliderArrows.propTypes = {
  slidePrev: PropTypes.func.isRequired,
  slideNext: PropTypes.func.isRequired,
}

const NewCollections = () => {
  const intl = useIntl()
  const { viewall, newCollection, loadingNewCollection } = useNewCollection()
  const [swiperRef, setSwiperRef] = useState()
  const handlePrevious = useCallback(() => {
    swiperRef?.slidePrev()
  }, [swiperRef])

  const handleNext = useCallback(() => {
    swiperRef?.slideNext()
  }, [swiperRef])
  if (!newCollection?.items?.length) return null
  return (
    <section className="new-collection pb-16 lg:pb-20 pt-8 md:pt-16 lg:pt-20 relative">
      <div className="container">
        <Heading
          title={intl.formatMessage({
            id: 'page.home.newCollection.title',
          })}
          showButton
          btnTitle={intl.formatMessage({
            id: 'button.viewAll',
          })}
          handleClick={viewall}
        />
        {!loadingNewCollection ? (
          <div className="relative slider-arrow sm:px-3 md:px-10 2xl:px-3">
            <Swiper
              onSwiper={setSwiperRef}
              loop={newCollection?.items?.length >= newCollection?.maxLength}
              spaceBetween={10}
              slidesPerView={2}
              breakpoints={{
                1024: {
                  slidesPerView: 4,
                },
                768: {
                  slidesPerView: 3,
                },
              }}
            >
              {newCollection?.items?.map((item) => {
                const { data } = extractChildData({
                  productChild: item?.child,
                })
                return (
                  <SwiperSlide key={item?.id}>
                    <ProductListItem
                      className="h-full"
                      typeName={item.type}
                      productId={item?.id}
                      url_key={item?.urlkey}
                      variants={data?.variant}
                      name={item.name}
                      price_range={item.price_range}
                      configurableOptions={data?.configurable_options}
                      image={
                        PRODUCT_TYPE.simpleProduct.title.includes(item.type)
                          ? item.image
                          : null
                      }
                    />
                  </SwiperSlide>
                )
              })}
            </Swiper>
            <SliderArrows slidePrev={handlePrevious} slideNext={handleNext} />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-3 md:gap-x-4 lg:gap-x-8 gap-y-8 md:gap-y-12">
            <SkeletonProductItem display={2} />
          </div>
        )}
      </div>
    </section>
  )
}

export default NewCollections
