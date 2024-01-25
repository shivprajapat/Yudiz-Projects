import React from 'react'
import { useIntl } from 'react-intl'
import Link from 'next/link'
import { imgCareerBanner } from '@/assets/images'
import { Meta } from '@/components/generic'
import META from '@/helper/meta-constant'
import { BUTTON_CLASSES } from '@/components/generic/Button'
import NextImage from '@/components/generic/NextImage'

const Careers = () => {
  const intl = useIntl()
  return (
    <>
      <Meta
        title={META.careers.title}
        description={META.careers.description}
        keyword={META.commonContent.keywords}
      />
      <section className="h-full py-12 md:py-16 xl:py-24 relative grid place-items-center">
        <div className="z-10 relative mx-auto">
          <div className="relative p-4 max-w-[736px] w-[95%] mx-auto text-center">
            <div className="border-2 border-secondary-300 flex flex-col gap-7 px-[20px] py-8 sm:px-[40px] sm:py-11 lg:px-[52px] lg:py-16">
              <div>
                <h4 className="text-secondary-100 mb-3 sm:mb-4 md:mb-6">
                  {intl.formatMessage({ id: 'careers.title' })}
                </h4>

                <p className="text-sm sm:text-base md:text-lg text-secondary-800 font-normal">
                  {intl.formatMessage({ id: 'careers.subTitle' })}
                </p>
              </div>
              <div>
                <Link
                  href="https://docs.google.com/forms/d/e/1FAIpQLSfmlTatQ9iJtBwtbPT3pv414Cu3CvKkJECTf_YdVD-8a3vuSw/viewform"
                  target="_blank"
                  className={BUTTON_CLASSES.base + ' ' + BUTTON_CLASSES.default}
                >
                  {intl.formatMessage({
                    id: 'button.applyNow',
                  })}
                </Link>
              </div>
            </div>
            <div className="absolute inset-0 bg-white opacity-90 -z-10" />
          </div>
        </div>
        <div className="absolute inset-0 h-auto">
          <NextImage
            src={imgCareerBanner}
            alt="banner"
            className="h-full w-full object-cover"
          />
          <div className="absolute w-full h-full inset-y-0 bg-grey-900 opacity-30" />
        </div>
      </section>
    </>
  )
}

export default Careers
