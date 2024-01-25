import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { FormattedMessage } from 'react-intl'
import { SpinnerLoader } from '../generic'
import { iconAngleRight, iconClose } from '@/assets/images'
import { request } from '@/services/api.service'
import { PinCodeCheck } from '@/queries/productDetailQueries'
import useAsync from '@/hooks/useAsync'

function CheckAvailability() {
  const [pinCode, setPinCode] = useState()
  const [applied, setApplied] = useState(false)
  const pinCodeRes = useAsync(null, null)

  const pinCodeHandler = () => {
    if (applied) {
      setApplied(false)
      setPinCode('')
    } else if (pinCode) {
      pinCodeRes.run(request, {
        ...PinCodeCheck,
        variables: {
          pin_code: pinCode,
        },
      })
    }
  }

  useEffect(() => {
    if (pinCodeRes?.state?.data?.pincodecheck) {
      setApplied(true)
    }
  }, [pinCodeRes?.state?.data])

  return (
    <>
      <p className="font-medium text-base mb-1 text-grey-900">
        <FormattedMessage id="page.productDetails.title.deliveryAvailability" />
      </p>
      <p className="font-medium text-sm mb-2 text-grey-500 hidden sm:block">
        <FormattedMessage id="page.productDetails.title.pinCodeForDeliveryAvailability" />
      </p>
      <div className="w-full sm:w-60 h-12 mb-1 relative">
        <input
          type="text"
          className="border border-grey-800 h-full w-full p-3 pr-9"
          placeholder="Enter pincode"
          value={pinCode}
          onChange={(e) => setPinCode(e.target.value.replace(/[^0-9]/g, ''))}
          disabled={applied}
          maxLength={8}
        />
        <button
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={pinCodeHandler}
          type="button"
        >
          {pinCodeRes.state.isLoading ? (
            <SpinnerLoader size="5" />
          ) : (
            <Image
              src={applied ? iconClose : iconAngleRight}
              alt="pincode-checker"
              className="w-4 h-4"
            />
          )}
        </button>
      </div>
      <p
        className={`text-sm font-medium ${
          pinCodeRes?.state?.data?.pincodecheck?.status
            ? 'text-success'
            : 'text-error'
        }`}
      >
        {applied && pinCodeRes?.state?.data?.pincodecheck?.message}
      </p>
    </>
  )
}

export default CheckAvailability
