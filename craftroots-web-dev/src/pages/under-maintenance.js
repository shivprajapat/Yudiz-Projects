import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { useRouter } from 'next/router'
import { iconLogo, imgUnderMaintenance } from '@/assets/images'
import NextImage from '@/components/generic/NextImage'
import { BRAND_NAME } from '@/helper/constant'
import { Meta, SpinnerLoader } from '@/components/generic'
import META from '@/helper/meta-constant'

const UnderMaintenance = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!router.query?.inMaintenance) {
      router.push('/')
    } else {
      setLoading(false)
    }
  }, [router.query])

  return (
    <section className="w-full grid place-items-center absolute inset-0 h-screen">
      {!loading ? (
        <>
          {' '}
          <Meta
            title={META.underMaintenance.title}
            description={META.underMaintenance.description}
          />
          <div className="fixed top-4 -translate-x-1/2 left-1/2">
            <NextImage
              src={iconLogo}
              alt={BRAND_NAME + ' Logo'}
              width={0}
              height={0}
              loading="eager"
              className="brand-logo"
              sizes="198px"
            />
          </div>
          <div className="w-[90%] sm:w-[500px] mx-auto text-center">
            <div className="mb-6">
              <NextImage
                src={imgUnderMaintenance}
                alt=""
                className="mx-auto w-36 h-36 sm:w-60 sm:h-60 md:w-72 md:h-72"
              />
            </div>
            <h6 className="text-grey-800 font-semibold text-lg sm:text-xl font-jost mb-1">
              <FormattedMessage id="page.underMaintenance.title" />
            </h6>
            <p className="text-grey-500 font-light text-base sm:text-lg">
              <FormattedMessage id="page.underMaintenance,description" />
            </p>
          </div>
        </>
      ) : (
        <SpinnerLoader size={10} />
      )}
    </section>
  )
}

export default UnderMaintenance
