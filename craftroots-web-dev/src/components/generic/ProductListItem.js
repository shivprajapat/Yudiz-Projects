import { memo } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import Wishlist from '../Product/Wishlist'
import NextImage from './NextImage'
import { Price } from '.'
import useProductListItem from '@/hooks/useProductListItem'
import { IconCart } from '@/assets/images'

function ProductListItem({
  typeName,
  url_key,
  variants,
  name,
  price_range,
  configurableOptions,
  image,
  className,
  style,
  productId,
}) {
  const wishlistStateItems = useSelector(
    (state) => state.productWishlistReducer.data.items
  )

  const {
    productVariants,
    selectedImage,
    handleProductClick,
    handleWishlist,
    removeWishlistLoading,
  } = useProductListItem({
    typeName,
    variants,
    configurableOptions,
    image,
    productId,
    wishlistStateItems,
  })

  return (
    <>
      <div
        className={`product-item bg-white flex justify-between flex-col items-start ${className}`}
        style={style}
      >
        <div className="w-full grow flex flex-col">
          <div className="group block overflow-hidden relative mb-4 w-full pt-[120%] product-image-wrapper">
            <Link
              href={`/product/${url_key}`}
              className="w-full inline-block"
              onClick={handleProductClick}
            >
              <NextImage
                src={selectedImage}
                alt={name}
                className="object-cover duration-500 group-hover:scale-110"
                sizes="33vw"
                fill
              />
            </Link>
            <Wishlist
              className="bg-white w-8 h-8 flex-center rounded-full absolute top-2 right-2"
              handleWishlist={handleWishlist}
              wishlist={wishlistStateItems?.some(
                (i) => i.product.id === productId
              )}
              disabled={removeWishlistLoading}
              imgClass="w-[18px] h-[18px]"
            />
            {/* {PRODUCT_TYPE.configuralProduct.title.includes(typeName) &&
              productVariants?.sizes?.length > 0 && (
              <ProductSizeToggle sizes={productVariants?.sizes} selectedColor={selectedColor} variants={item?.variants} AddToCart={AddToCart} sku={item?.sku}/>
            )} */}
          </div>
          <Link
            href={`/product/${url_key}`}
            className="text-sm xs:text-base font-jost shrink-0 font-medium text-secondary-700 block capitalize hover:text-primary"
            onClick={handleProductClick}
            dangerouslySetInnerHTML={{
              __html: name,
            }}
          ></Link>
        </div>
        <div className="shrink-0 w-full">
          <div className="pt-2 pb-3 flex justify-between">
            <Price
              price={price_range}
              productType={typeName}
              className="text-sm xs:text-base font-jost font-medium text-secondary-700"
            />
            {productVariants?.colors?.length > 0 && (
              <div className="tracking-wider font-normal pl-1 text-grey-600 sm:text-base text-sm block">
                {productVariants.colors.length} Color
                {productVariants.colors.length !== 1 && 's'}
              </div>
            )}
          </div>
          {/* <div className="mt-auto">
            {PRODUCT_TYPE.configuralProduct.title.includes(typeName) ? (
              <>
                <div className='tracking-wider font-normal pl-1 text-grey-600 sm:text-base text-sm block truncate w-56 lg:w-60'>{productVariants?.colors.length} Color</div>
                <RadioGroup
                  allColor={productVariants?.colors}
                  selectedColor={selectedColor}
                  setSelectedColor={setSelectedColor}
                  productURLKey={url_key}
                  setIsLoadingImg={setIsLoadingImg}
                  handleChangeColor={handleChangeColor}
                  name={colorGroupName}
                />
              </>
            ) : (
              <button
                // href={allRoutes.cart}
                onClick={()=>AddToCart(item)}
                className="flex items-center gap-2 text-primary font-medium uppercase "
              >
                {addTocartRes.state.isLoading ? <SpinnerLoader size="6" white className="!border-[3px]" /> :
                  <>
                    <IconCart />
                    <span className="text-sm xs:text-base">
                      <FormattedMessage id="button.AddToCart" />
                    </span> </>}
              </button>
            )}
          </div> */}
          <div className="mt-auto">
            <Link
              // href={allRoutes.cart}
              // onClick={() => AddToCart(item)}
              href={`/product/${url_key}`}
              className="flex items-center gap-2 text-primary font-medium uppercase"
            >
              <>
                <IconCart />
                <span className="text-sm xs:text-base">
                  <FormattedMessage id="button.buyNow" />
                </span>{' '}
              </>
              {/* {addTocartRes.state.isLoading ? (
                <SpinnerLoader size="6" white className="!border-[3px]" />
              ) : (
                <>
                  <IconCart />
                  <span className="text-sm xs:text-base">
                    <FormattedMessage id="button.AddToCart" />
                  </span>{' '}
                </>
              )} */}
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(ProductListItem)
ProductListItem.propTypes = {
  radio: PropTypes.bool,
  img: PropTypes.object,
  title: PropTypes.string,
  price: PropTypes.string.isRequired,
  __typeName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  small_image: PropTypes.object,
  typeName: PropTypes.string.isRequired,
  url_key: PropTypes.string.isRequired,
  variants: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  price_range: PropTypes.object,
  configurableOptions: PropTypes.array.isRequired,
  image: PropTypes.string.isRequired,
  imageWrapperClass: PropTypes.string,
  imageClass: PropTypes.string,
  colorGroupName: PropTypes.string,
  onProductClick: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  productId: PropTypes.number,
}

ProductListItem.defaultProps = {
  imageWrapperClass: '',
  imageClass: '',
  colorGroupName: '',
  onProductClick: () => {},
  className: '',
  style: {},
  price_range: '',
}
