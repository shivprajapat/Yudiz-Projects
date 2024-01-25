import React, { useEffect } from 'react'
// import { FormattedMessage, useIntl } from 'react-intl'
// import Image from 'next/image'

// import { Heading } from '@/components/generic'
// import { IconCalendar, IconMap, imgBanner } from '@/assets/images'
import useAsync from '@/hooks/useAsync'
import { request } from '@/services/api.service'
import { CmsPage } from '@/queries'
import CMSPage from '@/components/CMS/CMSPage'

const OurExhibition = () => {
  // const intl = useIntl()

  const ourExhibitionData = useAsync(null, null)
  useEffect(() => {
    ourExhibitionData.run(request, {
      ...CmsPage,
      variables: {
        identifier: 'our-exhibitions',
      },
    })
  }, [])

  return (
    <>
      <CMSPage CMSData={ourExhibitionData} />
      {/*
     <section className="py-10 md:py-20 our-exhibition-page">
        <div className="container">
          <Heading
            title={intl.formatMessage({
              id: 'page.exhibition.title.upcomingExhibitions',
            })}
          />
          <div className="exhibition-card relative bg-secondary-600 border border-secondary-300 px-4 pt-4 pb-6 sm:pb-8 mb-10 md:mb-20">
            <div className="shapes absolute bottom-0 inset-x-0 w-full h-4 block" />
            <h3 className="text-grey-900 text-lg md:text-2xl font-bold mb-2 sm:mb-4">
              <FormattedMessage id="page.exhibition.title.hyderabad" />
            </h3>
            <ul className="space-y-1 sm:space-y-4 lg:space-y-2 w-full md:w-2/3 lg:w-1/2">
              <li className="flex gap-[10px]">
                <div className="w-4 h-auto text-grey-800">
                  <IconCalendar />
                </div>
                <p className="text-grey-800 text-sm sm:text-base font-light leading-6">
                  2nd May, 2023 - 5th May, 2023
                </p>
              </li>
              <li className="flex gap-[10px]">
                <div className="w-4 h-auto mt-[2px] text-grey-800">
                  <IconMap />
                </div>
                <p className="text-grey-800 text-sm sm:text-base font-light leading-6">
                  Veer House, Ground Floor, Judges Bungalow Rd, opp. WIAA -
                  Castrol Institute Of Motoring, Satya Marg, Bodakdev,
                  Ahmedabad, Gujarat 380054
                </p>
              </li>
            </ul>
          </div>
          <Heading
            title={intl.formatMessage({
              id: 'page.exhibition.title.ourExhibitions',
            })}
          />
          <div className="bg-grey-100  border border-secondary-300 p-4 sm:p-6 mb-6 md:mb-12">
            <div className="pb-4 sm:pb-6 md:pb-10">
              <h3 className="text-grey-900 text-lg md:text-2xl font-bold mb-2 sm:mb-4">
                <FormattedMessage id="page.exhibition.title.hyderabad" />
              </h3>
              <ul className="space-y-1 sm:space-y-4 lg:space-y-2 w-full md:w-2/3 lg:w-1/2">
                <li className="flex gap-[10px]">
                  <div className="w-4 h-auto text-grey-800">
                    <IconCalendar />
                  </div>
                  <p className="text-grey-800 text-sm sm:text-base font-light leading-6">
                    2nd May, 2023 <span className="mx-1">-</span> 5th May, 2023
                  </p>
                </li>
                <li className="flex gap-[10px]">
                  <div className="w-4 h-auto mt-[2px] text-grey-800">
                    <IconMap />
                  </div>
                  <p className="text-grey-800 text-sm sm:text-base font-light leading-6">
                    Veer House, Ground Floor, Judges Bungalow Rd, opp. WIAA -
                    Castrol Institute Of Motoring, Satya Marg, Bodakdev,
                    Ahmedabad, Gujarat 380054
                  </p>
                </li>
              </ul>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex flex-wrap w-full lg:w-[69%] xl:w-[72%]">
                <div className="h-[260px] sm:h-[300px] object-cover md:h-[400px] w-full group block overflow-hidden">
                  <Image
                    alt="gallery"
                    className="w-full h-full object-cover object-center duration-500 group-hover:scale-110"
                    src={imgBanner}
                  />
                </div>
              </div>
              <div className="w-full lg:w-[30%] xl:w-[27%] grid grid-cols-2 gap-2">
                <div className="exhibition-thumbnail relative w-full">
                  <Image
                    alt="gallery"
                    src={imgBanner}
                    className="w-full h-28 object-cover object-center block sm:h-full"
                  />
                </div>
                <div className="exhibition-thumbnail relative w-full">
                  <Image
                    alt="gallery"
                    src={imgBanner}
                    className="w-full h-28 object-cover object-center block sm:h-full"
                  />
                </div>
                <div className="exhibition-thumbnail relative w-full">
                  <Image
                    alt="gallery"
                    src={imgBanner}
                    className="w-full h-28 object-cover object-center block sm:h-full"
                  />
                </div>
                <div className="exhibition-thumbnail relative w-full">
                  <Image
                    alt="gallery"
                    src={imgBanner}
                    className="w-full h-28 object-cover object-center block sm:h-full"
                  />
                  <span className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2 text-white text-lg md:text-xl font-normal w-full text-center">
                    +2 More
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-grey-100 border border-secondary-300 p-4 sm:p-6">
            <div className="pb-4 sm:pb-6 md:pb-10">
              <h3 className="text-grey-900 text-lg md:text-2xl font-bold mb-2 sm:mb-4">
                <FormattedMessage id="page.exhibition.title.surat" />
              </h3>
              <ul className="space-y-1 sm:space-y-4 lg:space-y-2 w-full md:w-2/3 lg:w-1/2">
                <li className="flex gap-[10px]">
                  <div className="w-4 h-auto text-grey-800">
                    <IconCalendar />
                  </div>
                  <p className="text-grey-800 text-sm sm:text-base font-light leading-6">
                    2nd May, 2023 <span className="mx-1">-</span> 5th May, 2023
                  </p>
                </li>
                <li className="flex gap-[10px]">
                  <div className="w-4 h-auto mt-[2px] text-grey-800">
                    <IconMap />
                  </div>
                  <p className="text-grey-800 text-sm sm:text-base font-light leading-6">
                    Science Center Amphitheater, City Light Rd, Athwa, Surat
                  </p>
                </li>
              </ul>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex flex-wrap w-full lg:w-[69%] xl:w-[72%]">
                <div className="h-[260px] sm:h-[300px] object-cover md:h-[400px] w-full group block overflow-hidden">
                  <Image
                    alt="gallery"
                    className="w-full h-full object-cover object-center duration-500 group-hover:scale-110"
                    src={imgBanner}
                  />
                </div>
              </div>
              <div className="w-full lg:w-[30%] xl:w-[27%] grid grid-cols-2 gap-2">
                <div className="exhibition-thumbnail relative w-full">
                  <Image
                    alt="gallery"
                    src={imgBanner}
                    className="w-full h-28 object-cover object-center block sm:h-full"
                  />
                </div>
                <div className="exhibition-thumbnail relative w-full">
                  <Image
                    alt="gallery"
                    src={imgBanner}
                    className="w-full h-28 object-cover object-center block sm:h-full"
                  />
                </div>
                <div className="exhibition-thumbnail relative w-full">
                  <Image
                    alt="gallery"
                    src={imgBanner}
                    className="w-full h-28 object-cover object-center block sm:h-full"
                  />
                </div>
                <div className="exhibition-thumbnail relative w-full">
                  <Image
                    alt="gallery"
                    src={imgBanner}
                    className="w-full h-28 object-cover object-center block sm:h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
          </section> */}
    </>
  )
}

export default OurExhibition
