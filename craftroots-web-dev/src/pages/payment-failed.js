import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { CardEmpty, Meta, SpinnerLoader } from '@/components/generic'
import { PaymentFailedIcon } from '@/assets/images'
import { STORAGE_KEYS } from '@/helper/constant'
import META from '@/helper/meta-constant'

function PaymentFailed() {
  const intl = useIntl()
  const router = useRouter()
  const [canAccesPage, setCanAccessPage] = useState(false)
  useEffect(() => {
    setCanAccessPage(localStorage.getItem(STORAGE_KEYS.canAccess) === 'true')
    if (localStorage.getItem(STORAGE_KEYS.canAccess) !== 'true') {
      router.replace('/', undefined, { shallow: true })
    }
    localStorage.removeItem(STORAGE_KEYS.canAccess)
  }, [])
  return (
    <div className="section-padding">
      <Meta
        title={META.paymentFailed.title}
        description={META.paymentFailed.description}
      />
      {canAccesPage ? (
        <CardEmpty
          title={intl.formatMessage({
            id: 'paymentFailed',
          })}
          description={intl.formatMessage({
            id: 'empty.cart.description',
          })}
          iconComponent={
            <PaymentFailedIcon className="mx-auto w-28 h-28 sm:w-32 sm:h-32" />
          }
          btnTitle={intl.formatMessage({
            id: 'page.confirmEmailAddress.backToHome',
          })}
        />
      ) : (
        <div className="bg-white fixed inset-0 w-full h-full flex-center z-10">
          <div className="shadow-md w-14 h-14 flex-center rounded-full z-20 relative">
            <SpinnerLoader size={10} />
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentFailed
