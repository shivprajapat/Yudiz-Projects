import React from 'react'
import { FormattedMessage } from 'react-intl'
import Image from 'next/image'

import { imgTreeShapeLeft, imgTreeShapeRight } from '@/assets/images'

const Error = () => {
  return (
    <section className="section-padding">
      <div className="container">
        <div className="w-[90%] md:w-[70%] lg:w-[60%] mx-auto">
          <div className="relative border bg-secondary-600 border-secondary-300 p-5 text-center h-[240px] sm:h-[320px] flex-center">
            <Image
              src={imgTreeShapeLeft}
              alt="imgTreeShapeLeft"
              className="absolute left-0 top-0 bg-cover bg-no-repeat h-[240px] sm:h-[320px]"
            />
            <div className="">
              <h1 className="text-6xl md:text-7xl lg:text-8xl text-grey-900 mb-5 font-medium">
                404
              </h1>
              <p className="text-lg lg:text-xl text-grey-800 font-normal">
                <FormattedMessage id="page.404.description" />
              </p>
            </div>
            <Image
              src={imgTreeShapeRight}
              alt="imgTreeShapeRight"
              className="absolute top-0 right-0 bg-cover bg-no-repeat h-[240px] sm:h-[320px]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Error
