import React, { useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useIntl } from 'react-intl'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import { Controller, useForm } from 'react-hook-form'
import RenderProductPrice from './RenderProductPrice'
import RenderProductSize from './RenderProductSize'
import CheckAvailability from './CheckAvailability'
import ProductReviewSection from './ProductReviewSection'
import Wishlist from './Wishlist'
import MobileAddToCart from './MobileAddToCart'
import SocialLink from './SocialLink'
import ProductInfoTab from './ProductInfoTab'
import NotifyMe from './NotifyMe'
import {
  Badge,
  Breadcrumb,
  Button,
  CustomSelect,
  Heading,
  Meta,
  ProductQuantity,
  SkeletonBox,
  SkeletonProductItem,
} from '@/components/generic'
import useModal from '@/hooks/useModal'
import { useDisableBodyScroll } from '@/hooks/useDisableBodyScroll'
import useProductDetail from '@/hooks/useProductDetail'
import {
  ATTRIBUTE,
  IN_STOCK,
  OUT_OF_STOCK,
  PRODUCT_TYPE,
} from '@/helper/constant'
import { getColor, getSelectedColor } from '@/helper/product-helper'
import META from '@/helper/meta-constant'
import { IconQuickBuy } from '@/assets/images'
const SizeChartModal = dynamic(() => import('../generic/SizeChartModal'))

const RelatedProducts = dynamic(() => import('./RelatedProducts'), {
  loading: () => <SkeletonProductItem />,
  ssr: false,
})

const ProductDetailImageSlider = dynamic(
  () => import('./ProductDetailImageSlider'),
  {
    loading: () => <SkeletonBox />,
    ssr: false,
  }
)
/* const RecentlyViewed = dynamic(() => import('./RecentlyViewed'), {
  // loading: () => <SkeletonProductItem />,
  ssr: false,
}) */
const AddToCart = dynamic(() => import('./AddToCart'), {
  ssr: false,
})

const ProductDetailsPage = ({ productDetail, additionalInfo }) => {
  const {
    productDetailsState,
    handleSize,
    handleChangeColor,
    isLoadingImg,
    // additionalInfo,
    handleProductInfoTab,
    getActiveClass,
    handleWishlist,
    variantsData,
    handleAddToCart,
    addTocartPdpRes,
    quantity,
    setQuantity,
    buyNowHandler,
    buyNowPdpRes,
  } = useProductDetail({ productDetail })
  const intl = useIntl()
  const { isShowing, toggle } = useModal()
  const {
    productVariants,
    productPrices,
    stockStatus,
    mediaGallery,
    variantSku,
    notifyMe,
    totalQuantiy,
  } = variantsData
  const { control } = useForm({ mode: 'onChange' })
  useDisableBodyScroll(isShowing)
  const productId = productDetail?.products?.items?.[0]?.id
  const productDetailData = productDetail?.products?.items?.[0]
  const breadCrumbLastChild =
    productDetailData?.categories[productDetailData?.categories?.length - 1]
  const productDetailStateData = productDetailsState?.data?.[0]

  const color = getColor(productVariants)
  const extractSelectedColor = getSelectedColor({
    color,
    productState: productDetailsState,
  })
  const wishlistStateItems = useSelector(
    (state) => state.productWishlistReducer.data.items
  )

  const isInWishlist = useCallback(
    (productId) => {
      return wishlistStateItems?.some((i) => i.product.id === productId)
    },
    [wishlistStateItems]
  )
  return (
    <>
      <Meta
        title={productDetailData?.meta_title || productDetailData?.name}
        keyword={productDetailData?.meta_keyword || META.commonContent.keywords}
        description={
          productDetailData?.meta_description || META.commonContent.description
        }
        img={productDetailData?.small_image?.url}
        imgDescription={
          productDetailData?.meta_description || META.commonContent.description
        }
        canonicaUrl={productDetailData?.canonical_url}
      />
      {productDetailsState?.data?.length > 0 &&
        !productDetailsState?.loading && (
        <Breadcrumb breadcrumb={breadCrumbLastChild} />
      )}
      <section className="section-padding">
        <div className="container">
          <div
            className="flex flex-col md:flex-row"
            key={productDetailStateData?.name}
          >
            <div className="w-full md:w-[45%]">
              {mediaGallery && (
                <ProductDetailImageSlider
                  isLoadingImg={isLoadingImg}
                  mediaGallery={mediaGallery}
                />
              )}
            </div>

            <div className="w-full md:w-[65%] pl-0 md:pl-4 lg:pl-6 xl:pl-11 pt-10 md:pt-0">
              <div className="mb-1">
                <Heading
                  title={productDetail?.products?.items?.[0]?.name}
                  smallSpace
                />
              </div>
              <div className="flex flex-col items-start sm:mb-4">
                <div className="flex lg:items-center items-start lg:flex-row flex-col w-full mb-5 lg:gap-0 gap-3 lg:pt-0 pt-2">
                  <div className="flex items-center gap-4">
                    <Badge
                      title={
                        stockStatus === IN_STOCK
                          ? intl.formatMessage({
                            id: 'page.productDetails.stock.inStock',
                          })
                          : intl.formatMessage({
                            id: 'page.productDetails.stock.outStock',
                          })
                      }
                      className={`${
                        stockStatus && stockStatus === IN_STOCK
                          ? 'bg-success'
                          : 'bg-error'
                      } block sm:hidden`}
                    />
                    {/* <StarRating
                      totalStars={5}
                      initialRating={
                        productDetailStateData?.rating_summary &&
                        Number(productDetailStateData?.rating_summary / 20)
                      }
                    />
                    <span className="text-grey-500 text-sm font-medium">{`${productDetailStateData?.review_count} Reviews`}</span> */}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-grey-900 sm:text-base text-sm tracking-wider">
                      SKU :{' '}
                    </span>
                    <span
                      className="tracking-wider font-normal pl-1 text-grey-500 sm:text-base text-sm block truncate w-56 lg:w-60"
                      title={variantSku || productDetailData?.sku}
                    >
                      {variantSku || productDetailData?.sku}
                    </span>
                  </div>
                </div>
                <Badge
                  title={
                    stockStatus === IN_STOCK
                      ? intl.formatMessage({
                        id: 'page.productDetails.stock.inStock',
                      })
                      : intl.formatMessage({
                        id: 'page.productDetails.stock.outStock',
                      })
                  }
                  className={`${
                    stockStatus && stockStatus === IN_STOCK
                      ? 'bg-success'
                      : 'bg-error'
                  } hidden sm:block`}
                />
              </div>
              {productPrices && (
                <div className="flex items-start flex-col mb-4 sm:mb-5 border-b sm:border-none pb-4 sm:pb-0 border-grey-400">
                  <div className="flex items-center gap-2">
                    <RenderProductPrice productPrices={productPrices} />
                  </div>
                  <span className="text-grey-500 text-sm font-medium mt-1">
                    (Inclusive of all taxes)
                  </span>
                </div>
              )}
              <RenderProductSize
                productInfo={productDetailStateData}
                toggle={toggle}
                productVariants={productVariants}
                selectedSize={productDetailsState?.selectedSize}
                selectedColor={productDetailsState?.selectedColor}
                handleSize={(sizeValueIdx) => handleSize(sizeValueIdx)}
                sizeChart={!!productDetailData?.mp_sizeChart}
              />
              {PRODUCT_TYPE.configuralProduct.title.includes(
                productDetailsState?.data?.[0]?.__typename
              ) && color?.length > 0 ? (
                  <div className="mb-4 sm:mb-7 border-b sm:border-none pb-5 sm:pb-0 border-grey-400">
                    <p className="font-medium text-base mb-2">
                    Colors<span className="text-error">*</span>
                    </p>
                    {/* <RadioGroup
                            big
                            allColor={productVariants?.colors}
                            selectedColor={productDetailsState?.selectedColor}
                            setSelectedColor={
                              productDetailsState?.setSelectedColor
                            }
                            productURLKey={productDetailsState?.data?.[0].url_key}
                            handleChangeColor={handleChangeColor}
                          /> */}
                    <div className="w-full sm:max-w-[240px]">
                      <Controller
                        name={ATTRIBUTE.color.title}
                        control={control}
                        render={({ field: { onChange } }) => (
                          <CustomSelect
                            id={ATTRIBUTE.color.title}
                            value={extractSelectedColor}
                            options={color}
                            onChange={(e) => {
                              onChange(e)
                              handleChangeColor(e.value)
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>
                ) : null}

              <div className="mb-4 sm:mb-7">
                <CheckAvailability />
              </div>
              {productDetail?.products?.items?.[0]?.short_description.html && (
                <>
                  {/* <div className="mb-4 sm:mb-0">
                    <p className="font-medium text-base text-grey-900">
                      {intl.formatMessage({
                        id: 'shortDescriptionTitle',
                      })}
                    </p>
                  </div> */}
                  <div
                    className="mb-4 sm:mb-7"
                    dangerouslySetInnerHTML={{
                      __html:
                        productDetail?.products?.items?.[0]?.short_description
                          .html,
                    }}
                  ></div>
                </>
              )}
              <div
                className={`flex items-start flex-col gap-2 border-t border-grey-400 py-7 ${
                  stockStatus === OUT_OF_STOCK ? 'hidden sm:block' : ''
                }`}
              >
                <Wishlist
                  className="hidden items-center gap-2 mb-2 sm:flex"
                  handleWishlist={handleWishlist}
                  wishlist={isInWishlist(productId)}
                  displayText
                  imgClass="w-5 h-5"
                />
                {stockStatus && (
                  <div className="items-start gap-3 flex flex-row sm:flex-col">
                    {stockStatus !== OUT_OF_STOCK ? (
                      <>
                        <ProductQuantity
                          quantity={quantity}
                          setSelectedQuantity={setQuantity}
                          totalQuantiy={totalQuantiy}
                        />
                        <div className="items-center gap-2 sm:gap-4 flex">
                          <AddToCart
                            stockStatus={stockStatus}
                            shorBtn
                            className="hidden sm:block"
                            addtocart={handleAddToCart}
                            btnLoader={addTocartPdpRes.state.isLoading}
                            disabled={addTocartPdpRes.state.isLoading}
                          />
                          <Button
                            title={intl.formatMessage({
                              id: 'button.quickBuy',
                            })}
                            border
                            icon={<IconQuickBuy />}
                            className="!py-2"
                            onClick={buyNowHandler}
                            btnLoader={buyNowPdpRes.state.isLoading}
                            disabled={buyNowPdpRes.state.isLoading}
                          />
                        </div>
                      </>
                    ) : notifyMe ? (
                      <NotifyMe
                        className="hidden sm:block"
                        intl={intl}
                        productSku={variantSku}
                      />
                    ) : null}
                  </div>
                )}
              </div>
              <div className="border-t border-grey-400 gap-2 pt-5">
                <SocialLink
                  productDetailStateData={productDetailStateData}
                  productDetailsState={productDetailsState}
                  mediaGallery={mediaGallery}
                />
              </div>
            </div>
          </div>
          {/* )
            })} */}
          <div>
            <ProductInfoTab
              getActiveClass={getActiveClass}
              handleProductInfoTab={handleProductInfoTab}
              description={productDetail?.products?.items?.[0]?.description}
              additionalInfo={additionalInfo}
            />
          </div>
          {productDetail?.products?.items?.[0]?.review_count > 0 && (
            <div className="mt-6 md:mt-10 lg:mt-16 flex gap-10 flex-col md:flex-row">
              <ProductReviewSection
                intl={intl}
                productId={productDetail?.products?.items?.[0]?.id}
              />
            </div>
          )}
        </div>
      </section>
      <div className="bg-grey-100">
        <section className="section-padding">
          <div className="container">
            {productDetail?.products?.items[0]?.sku && (
              <RelatedProducts sku={productDetail?.products?.items[0]?.sku} />
            )}
            <div className="flex items-center justify-between gap-6 fixed bottom-0 w-full left-0 z-[99] p-2 bg-white sm:hidden">
              <MobileAddToCart
                stockStatus={stockStatus}
                showNotifyMeBtn={notifyMe}
                productSku={variantSku}
                intl={intl}
                isInWishlist={isInWishlist(productId)}
                addtocart={handleAddToCart}
                handleWishlist={handleWishlist}
                btnLoader={addTocartPdpRes.state.isLoading}
                disabled={addTocartPdpRes.state.isLoading}
              />
            </div>
            {/* <div>
              <RecentlyViewed intl={intl} />
            </div> */}
          </div>
        </section>
      </div>
      {productDetailData?.mp_sizeChart && (
        <SizeChartModal
          isShowing={isShowing}
          closeConfirm={toggle}
          data={productDetailData?.mp_sizeChart}
        />
        /* <SideSizeChartModal
          isShowing={isShowing}
          closeConfirm={toggle}
          data={productDetailData?.mp_sizeChart}
        /> */
      )}
    </>
  )
}

export default ProductDetailsPage
ProductDetailsPage.propTypes = {
  productDetail: PropTypes.object.isRequired,
  additionalInfo: PropTypes.object,
}
ProductDetailsPage.propTypes = {
  additionalInfo: '',
}
