import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import { Swiper, SwiperSlide } from 'swiper/react'
import ProductListItem from '../generic/ProductListItem'
import { RelatedProduct } from '@/queries'
import { Heading } from '@/components/generic'
import { request } from '@/services/api.service'
import { extractChildData } from '@/helper/productList-helper'
import { PRODUCT_TYPE } from '@/helper/constant'
import { IconCircleArrowLeft, IconCircleArrowRight } from '@/assets/images'

function SliderArrows({ slidePrev, slideNext }) {
  return (
    <>
      <button
        className="absolute right-8 xl:right-auto xl:-left-0 2xl:-left-8 text-grey-600 mr-3 xl:mr-0 xl:-translate-y-2/4 top-1 xl:top-[47%] z-10"
        onClick={slidePrev}
      >
        <IconCircleArrowLeft />
      </button>
      <button
        className="absolute -right-0 2xl:-right-8 text-grey-600 xl:mr-0 xl:-translate-y-2/4 top-1 xl:top-[47%] z-10"
        onClick={slideNext}
      >
        <IconCircleArrowRight />
      </button>
    </>
  )
}

SliderArrows.propTypes = {
  slidePrev: PropTypes.func.isRequired,
  slideNext: PropTypes.func.isRequired,
}

function RelatedProducts({ sku }) {
  const intl = useIntl()
  const [relatedProduct, setRelatedProduct] = useState([])
  const sliderRef = useRef(null)
  const [swiperRef, setSwiperRef] = useState()

  useEffect(() => {
    relatedProducts()
  }, [sku])

  const relatedProducts = async () => {
    const relatedProductData = await request({
      ...RelatedProduct,
      variables: { sku: sku },
    })
    setRelatedProduct(relatedProductData.relatedProduct.data)
  }

  const handlePrevious = useCallback(() => {
    swiperRef?.slidePrev()
  }, [swiperRef])

  const handleNext = useCallback(() => {
    swiperRef?.slideNext()
  }, [swiperRef])

  return (
    relatedProduct?.length > 0 && (
      <section className="discover pb-8 md:pb-10 relative">
        <div className="container">
          <div className="flex justify-between mb-6 lg:mb-8 xl:mb-10 relative">
            <Heading
              title={intl.formatMessage({
                id: 'page.productDetails.relatedProducts',
              })}
              className="!mb-0"
            />
            <div className="block xl:hidden slider-arrow">
              <SliderArrows slidePrev={handlePrevious} slideNext={handleNext} />
            </div>
          </div>
          <div className="relative slider-arrow xl:px-10 2xl:px-3">
            <Swiper
              loop={true}
              onSwiper={setSwiperRef}
              ref={sliderRef}
              slidesPerView={2}
              spaceBetween={16}
              slidesPerGroup={1}
              breakpoints={{
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 30,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 16,
                },
              }}
            >
              {relatedProduct.map((item) => {
                const { data } = extractChildData({
                  productChild: item?.child,
                })
                return (
                  <SwiperSlide
                    key={item?.id}
                    className="related-product h-full"
                  >
                    <ProductListItem
                      typeName={item.type}
                      productId={item.id}
                      url_key={item.urlkey}
                      variants={data?.variant}
                      name={item?.name}
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
            <div className="hidden xl:block">
              <SliderArrows slidePrev={handlePrevious} slideNext={handleNext} />
            </div>
          </div>
        </div>
      </section>
    )
  )
}

export default memo(RelatedProducts)

RelatedProducts.propTypes = {
  sku: PropTypes.string.isRequired,
}
