import React from 'react'
import { useRouter } from 'next/router'
import { imgPartnershipDetails } from '@/assets/images'
import PartnerShipData from '@/helper/partnership'
import { Meta } from '@/components/generic'
import { BRAND_NAME } from '@/helper/constant'
import NextImage from '@/components/generic/NextImage'

const PartnershipDetails = () => {
  const { query } = useRouter()
  const pageData = PartnerShipData[query.partnershipType]
  if (!pageData) return null
  return (
    <>
      <Meta title={pageData.title + ' | ' + BRAND_NAME} />
      <section className="h-full py-12 md:py-16 xl:py-24 relative grid place-items-center">
        <div className="z-10 relative mx-auto">
          <div className="relative p-4 max-w-[736px] w-[95%] mx-auto text-center">
            <div className="border-2 border-secondary-300 flex flex-col gap-7 md:gap-10 px-[20px] py-8 sm:px-[40px] sm:py-11 lg:px-[52px] lg:py-16">
              <div>
                <h4 className="text-secondary-100 mb-3 sm:mb-4 md:mb-6">
                  {pageData.title}
                </h4>
                <p className="text-sm sm:text-base md:text-lg text-secondary-800 font-normal">
                  {pageData.description}
                </p>
              </div>
              <div>
                {pageData?.cataglogue && (
                  <a
                    href={pageData?.cataglogue}
                    className="underline text-xl text-secondary-100 mb-3 sm:mb-4 md:mb-6"
                    download
                    target="_blank"
                  >
                    View Catalogue
                  </a>
                )}
                <h5 className="text-secondary-100 mb-3 sm:mb-4 md:mb-6"></h5>
                <article className="text-sm sm:text-base md:text-lg text-secondary-800 font-normal">
                  For enquiries, write to us at{' '}
                  <a
                    href={'mailto:' + pageData?.enquiry?.email}
                    className="underline"
                  >
                    {pageData?.enquiry?.email}.
                  </a>
                  , or call us at{' '}
                  <a
                    href={'tel:+91' + pageData?.enquiry?.phone}
                    className="underline"
                  >
                    {pageData?.enquiry?.phone}.
                  </a>
                </article>
              </div>
            </div>
            <div className="absolute inset-0 bg-white opacity-90 -z-10" />
          </div>
        </div>
        <div className="absolute inset-0 h-auto">
          <NextImage
            src={pageData?.cover || imgPartnershipDetails}
            alt="banner"
            className="!h-full !w-full object-cover"
            width={0}
            height={0}
            sizes="1920"
          />
          <div className="absolute w-full h-full inset-y-0 bg-grey-900 opacity-30" />
        </div>
      </section>
    </>
  )
}

export default PartnershipDetails
