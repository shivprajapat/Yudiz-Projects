import React, { useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
// import Address from './address'
import {
  CartLayout,
  CheckoutProduct,
  CheckoutSummary,
} from '@/components/checkout'
import {
  CardEmpty,
  SkeletonCart,
  SkeletonCheckoutSummary,
} from '@/components/generic'
import { iconEmptyCart } from '@/assets/images'
import { STORAGE_KEYS } from '@/helper/constant'
import {
  addressLoader,
  cartLoadingHandler,
  miniCartData,
} from '@/actions/cartAction'

// const Cart = () => {
// const [activeKey,setsLoggedIn] =useState()
//   const {addressLoading} = useSelector(state=>state.cartReducer)
//   const steps = (isLoggedIn) => ({
//     0:  Address ,
//     // 0: ShippingAddress,
//     1: ShoppingCart,
//     2: Payment,
//     3: ThankYou,
//   })
//   const [step, setStep] = useState(0)
//   const Step = steps(isLoggedIn())[step]
//   function onNext() {
//     setStep(step + 1)
//   }

//   const intl = useIntl()
//   const stepTitles = [
//     intl.formatMessage({ id: 'page.checkout.title.shoppingCart' }),
//     intl.formatMessage({ id: 'page.checkout.title.address' }),
//     intl.formatMessage({ id: 'page.checkout.title.payment' }),
//   ]

//   return (
//     <>
//       <Breadcrumb />
//       {addressLoading &&
//        <div className='bg-[#ffffff57] fixed inset-0 w-full h-full flex-center z-10'>
//          <div className="shadow-md w-14 h-14 flex-center rounded-full z-20 relative">
//            <SpinnerLoader size={10} />
//          </div>
//        </div> }
//       <Meta title="Cart | CraftRoots" />
//       <div className=" bg-grey-100 p-4">
//         <div className="w-full md:w-10/12 xl:w-1/2 mx-auto">
//           <ul className="flex justify-between sm:justify-center items-center gap-2">
//             {stepTitles?.map((item, index) => (
//               <li
//                 className={`flex items-center sm:items-start sm:gap-3 cursor-pointer ${
//                   index === stepTitles.length - 1
//                     ? 'sm:w-1/5 justify-center sm:justify-start'
//                     : 'sm:w-1/3 justify-center'
//                 }`}
//                 key={index}
//                 onClick={() => setStep(index)}
//               >
//                 <div className="flex items-center gap-2 flex-col md:flex-row">
//                   {step > index ? (
//                     <IconCircleGreen />
//                   ) : (
//                     <span className="text-grey-300">
//                       <IconCircle />
//                     </span>
//                   )}
//                   <span
//                     className={`block capitalize font-medium text-xs sm:text-sm
//                     ${step > index ? '!text-success' : 'text-grey-700'}
//                     ${step === index ? 'text-primary' : ''}
//                     `}
//                   >
//                     {item}
//                   </span>
//                 </div>
//                 {index === stepTitles.length - 1 ? (
//                   ''
//                 ) : (
//                   <div className="flex-1 h-2 mb-3 sm:mb-0 sm:h-5 w-16 xs:w-20 sm:w-full items-center flex">
//                     <span className="border flex-1 border-dashed border-custom-black3 block" />
//                   </div>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//       <section className="section-padding">
//         <div className="container">
//           <Step onNext={onNext} />
//         </div>
//       </section>
//     </>
//   )
// }

// export default Cart

const ShoppingCart = () => {
  const {
    items,
    isLoading,
    updateCartLoading,
    isUpdateCartSuccess,
    prices,
    isError,
    couponCodes,
    appliedCoupon,
    totalItems,
  } = useSelector((state) => state.cartReducer)
  const dispatch = useDispatch()
  const intl = useIntl()

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEYS.cartId)) {
      dispatch(miniCartData())
    }
    dispatch(cartLoadingHandler(false))
    dispatch(addressLoader(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <CartLayout>
      {' '}
      <section>
        {/* <div className="bg-grey-100 border border-grey-300 mb-6 md:mb-10 p-4 md:p-6 cursor-pointer">
        <div
          className="flex items-center justify-between"
          onClick={() => handleToggle(1)}
        >
          <div>
            <h5 className="font-jost text-grey-800 text-lg md:text-xl font-semibold">
              <FormattedMessage id="page.checkout.title.estimateShipping" />
            </h5>
            <p className="text-sm text-grey-800">
              <FormattedMessage id="page.checkout.description.estimateShipping" />
            </p>
          </div>
          <button
            className="w-8 h-8 icon-hover text-center absolute top-1 right-1 sm:relative"
            type="button"
          >
            <Image
              src={active ? iconArrowUp : iconArrowDown}
              alt="icon"
              className="!w-4 h-auto mx-auto"
            />
          </button>
        </div>
        <div
          ref={contentEl}
          className="relative h-0 overflow-hidden transition-all duration-200 ease-in-out"
          style={
            active
              ? { height: 'fit-content', overflow: 'initial' }
              : { height: '0px' }
          }
        >
          <div className="pt-3">
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="max-w-3xl">
                  <div className="flex flex-col md:flex-row gap-x-4 lg:gap-4 flex-wrap lg:flex-nowrap">
                    <div className="form-group text-left w-full md:w-[47%] lg:w-1/2">
                      <Controller
                        name="city"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <CustomSelect
                            value={value}
                            onChange={onChange}
                            options={options}
                            label="Country"
                          />
                        )}
                        rules={{
                          required: `${intl.formatMessage({
                            id: 'form.cityDropDown.errorMessage',
                          })}`,
                        }}
                      />
                      {errors && errors.city && (
                        <div className="error-text">{errors.city.message}</div>
                      )}
                    </div>
                    <div className="form-group text-left w-full md:w-[47%] lg:w-1/2">
                      <Controller
                        name="state"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <CustomSelect
                            value={value}
                            onChange={onChange}
                            options={options}
                            label="state"
                          />
                        )}
                        rules={{
                          required: `${intl.formatMessage({
                            id: 'form.cityDropDown.errorMessage',
                          })}`,
                        }}
                      />
                      {errors && errors.city && (
                        <div className="error-text">{errors.city.message}</div>
                      )}
                    </div>
                    <div className="form-group text-left w-full md:w-[47%] lg:w-1/2">
                      <Controller
                        name="postalCode"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <CustomSelect
                            value={value}
                            onChange={onChange}
                            options={options}
                            label="Pincode"
                          />
                        )}
                        rules={{
                          required: `${intl.formatMessage({
                            id: 'form.stateDropDown.errorMessage',
                          })}`,
                        }}
                      />
                      {errors && errors.state && (
                        <div className="error-text">{errors.state.message}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center flex-wrap">
                  <div className="form-group text-left sm:mb-0">
                    <label className="form-label mb-4 text-left font-semibold text-secondary-800">
                      <FormattedMessage id="form.label.title.selectShippingMethods" />
                    </label>
                    <div className=" flex items-center gap-3 md:gap-8">
                      <Radio
                        title={intl.formatMessage({
                          id: 'form.radio.title.freShipping',
                        })}
                        value="freShipping"
                      />
                      <Radio
                        title={intl.formatMessage({
                          id: 'form.radio.title.fixed',
                        })}
                        value="fixed"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button
                      title={intl.formatMessage({
                        id: 'button.estimateShipping',
                      })}
                      fullWidth
                      type="submit"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div> */}
        {items?.length === 0 && !isLoading ? (
          <div className="py-9 sm:py-12">
            <CardEmpty
              icon={iconEmptyCart}
              title={intl.formatMessage({
                id: 'empty.cart.title',
              })}
              description={intl.formatMessage({
                id: 'empty.cart.description',
              })}
            />
          </div>
        ) : (
          <div className="flex gap-8 md:gap-10 flex-col md:flex-row">
            <div className="w-full md:w-[50%] lg:w-[75%] xl:w-[70%]">
              <div className="mb-4 md:mb-8">
                <h6 className="font-jost font-semibold text-xl">
                  <FormattedMessage id="page.checkout.title.shoppingCart" />
                </h6>
              </div>
              <div>
                {updateCartLoading ? (
                  <div className="fixed w-full h-full inset-0 bg-grey-100 opacity-50" />
                ) : isLoading && !isUpdateCartSuccess ? (
                  <SkeletonCart display={7} />
                ) : null}
                {items?.map((i) => {
                  return (
                    <CheckoutProduct
                      key={i.id}
                      productDetail={i}
                      isError={isError}
                    />
                  )
                })}
              </div>
            </div>
            <div className="w-full md:w-[45%] lg:w-[35%] xl:w-[30%] md:sticky top-40 bottom-64 lg:bottom-72">
              <div className="mb-4 xl:mb-8">
                <div className="flex items-center justify-between">
                  <h6 className="font-jost font-semibold text-xl">
                    <FormattedMessage id="page.checkout.title.shoppingCart" />
                  </h6>
                  <p className="font-jost font-medium text-sm text-grey-800">
                    <FormattedMessage id="page.checkout.title.item" />
                    <span> {totalItems}</span>
                  </p>
                </div>
              </div>
              {isLoading && !isUpdateCartSuccess ? (
                <SkeletonCheckoutSummary />
              ) : (
                <CheckoutSummary
                  // onNext={onNext}
                  prices={prices}
                  couponCodes={couponCodes}
                  appliedCoupon={appliedCoupon}
                  updateCartLoading={updateCartLoading}
                />
              )}
            </div>
          </div>
        )}
      </section>
    </CartLayout>
  )
}

export default ShoppingCart
// ShoppingCart.propTypes = {
//   onNext: PropTypes.func,
// }
