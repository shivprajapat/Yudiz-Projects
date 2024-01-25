import dynamic from 'next/dynamic'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import { iconTrash } from '@/assets/images'
const Image = dynamic(() => import('next/image'))
const IconCart = dynamic(() =>
  import('@/assets/images').then((mod) => mod.IconCart)
)

function WishlistItem({
  product,
  onDeleteClick,
  disableDelete,
  wishListState,
}) {
  const intl = useIntl()
  return (
    <div className="flex items-start border-b border-grey-400 pb-4 pt-8">
      <div
        className={`flex grow mr-3 gap-4 md:gap-6 ${
          wishListState?.isLoading ? 'opacity-50' : ''
        }`}
      >
        <Image
          src={product?.small_image?.url}
          alt={product?.name}
          className="object-contain shrink-0"
          width={64}
          height={64}
          quality={100}
        />
        <div className="grow">
          <Link
            href={`/product/${product?.url_key}`}
            className="font-jost text-grey-900 font-medium mb-0 sm:mb-1 lg:text-lg"
          >
            {product?.name}
          </Link>
          <div className="mb-1 flex items-center gap-4">
            <p className="text-base sm:text-lg text-grey-900 font-medium">
              ₹{product?.price?.regularPrice?.amount?.value}
            </p>
          </div>
          <div className="flex items-center gap-4 pt-2">
            <Link
              href={`/product/${product?.url_key}`}
              className="flex gap-2 items-center text-primary"
            >
              <IconCart size="14" />
              <span className="text-sm sm:text-base text-primary font-medium uppercase">
                {intl.formatMessage({
                  id: 'button.buyNow',
                })}
              </span>
            </Link>
          </div>
        </div>
      </div>
      <button
        className="icon-hover shrink-0"
        type="button"
        onClick={() => {
          onDeleteClick(product.id)
        }}
        disabled={disableDelete}
      >
        <Image src={iconTrash} alt="trash" className="w-4 h-4" />
      </button>
    </div>
  )
}

WishlistItem.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number,
    sku: PropTypes.string,
    name: PropTypes.string,
    small_image: {
      url: PropTypes.string,
      __typename: PropTypes.string,
    },
    type_id: PropTypes.string,
    url_key: PropTypes.string,
    price: {
      regularPrice: {
        amount: {
          value: PropTypes.number,
          currency: PropTypes.string,
          __typename: PropTypes.string,
        },
        __typename: PropTypes.string,
      },
      __typename: PropTypes.string,
    },
    __typename: PropTypes.string,
  }).isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  disableDelete: PropTypes.bool.isRequired,
  wishListState: PropTypes.shape({
    isLoading: PropTypes.bool,
    isSuccess: PropTypes.bool,
    isFailed: PropTypes.bool,
    data: PropTypes.any,
    error: PropTypes.any,
  }),
}

export default WishlistItem
