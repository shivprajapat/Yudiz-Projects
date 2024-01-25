import React from 'react'
import Image from 'next/image'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { Price } from '../generic'
import { iconAngleRight, iconClose } from '@/assets/images'

function StoreCredit({
  amount,
  credit,
  setCredit,
  creditHandler,
  appliedCredits,
}) {
  const { storeCreditAmount } = useSelector((state) => state.cartReducer)

  return (
    <div className="mt-10">
      <h6 className="mb-4 md:mb-8 font-jost font-semibold text-xl">
        <FormattedMessage id="page.checkout.applyStoreCredit" />
      </h6>
      <div className="flex gap-2">
        <p className="text-base font-semibold text-custom-black2">
          <FormattedMessage id="page.storeCredit.title.yourBalanceIs" />
        </p>
        <Price price={amount} />
      </div>
      <div className="w-full sm:w-60 h-12 mb-1 relative mt-3">
        <input
          type="text"
          className="border border-grey-800 h-full w-full p-3 pr-9 "
          placeholder="Enter Credit Amount"
          value={credit}
          onChange={(e) => {
            const enteredValue = e.target.value.replace(/[^0-9.]/g, '')
            // Check if the entered value starts with zero
            if (enteredValue.startsWith('0')) {
              // Handle starting with zero (e.g., set to an empty string)
              setCredit('')
            } else {
              setCredit(enteredValue)
              // Update state with the cleaned value
            }
          }}
          disabled={storeCreditAmount}
          maxLength={8}
        />
        <button
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={creditHandler}
          type="button"
        >
          <Image
            src={storeCreditAmount ? iconClose : iconAngleRight}
            alt="pincode-checker"
            className="w-4 h-4"
          />
        </button>
        <p
          className={`text-sm font-medium ${
            storeCreditAmount ? 'text-success' : 'text-error'
          }`}
        >
          {storeCreditAmount && (
            <FormattedMessage id="page.storeCredit.applySuccess" />
          )}
          {!appliedCredits?.state?.data?.applyStoreCreditToCart?.status &&
            appliedCredits?.state?.data?.applyStoreCreditToCart?.message}
        </p>
      </div>
    </div>
  )
}

export default StoreCredit
StoreCredit.propTypes = {
  amount: PropTypes.number.isRequired,
  credit: PropTypes.string,
  setCredit: PropTypes.func.isRequired,
  creditHandler: PropTypes.func.isRequired,
  appliedCredits: PropTypes.shape({
    resetData: PropTypes.func.isRequired,
    run: PropTypes.func.isRequired,
    setData: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
    state: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      isSuccess: PropTypes.bool.isRequired,
      isFailed: PropTypes.bool.isRequired,
      data: PropTypes.object.isRequired,
      error: PropTypes.object.isRequired,
    }),
  }),
}

StoreCredit.defaultProps = {
  credit: '',
}
