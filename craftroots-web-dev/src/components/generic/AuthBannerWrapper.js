import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'

import { imgLoginBG } from '@/assets/images'

const AuthBannerWrapper = ({ children }) => {
  return (
    <section className="h-full py-12 xl:py-20 relative grid place-items-center">
      <div className="z-10 relative mx-auto">{children}</div>
      <div className="absolute inset-0 h-auto">
        <Image
          src={imgLoginBG}
          alt="banner"
          className="h-full w-full object-cover"
        />
        <div className="absolute w-full h-full inset-y-0 bg-grey-900 mix-blend-normal opacity-50" />
      </div>
    </section>
  )
}

export default AuthBannerWrapper
AuthBannerWrapper.propTypes = {
  children: PropTypes.element,
}
