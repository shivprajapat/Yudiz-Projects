import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'

import { useRouter } from 'next/router'
import Button from './Button'
import { allRoutes } from '@/constants/allRoutes'

const CardEmpty = ({
  icon,
  title,
  description,
  btnTitle,
  TitleSize,
  DescriptionSize,
  iconComponent,
}) => {
  const router = useRouter()
  const handleClick = () => {
    router.push(allRoutes.home, undefined, { shallow: true })
  }
  return (
    <div className="text-center">
      <div>
        <div className="mb-6">
          {iconComponent ? (
            <div className="failed">{iconComponent}</div>
          ) : (
            <Image
              src={icon}
              alt={title}
              className="mx-auto w-20 h-20 sm:w-32 sm:h-32"
            />
          )}
        </div>

        <h6
          className={`text-grey-800 font-semibold text-base font-jost mb-1 ${TitleSize}`}
        >
          {title}
        </h6>
        <p className={`text-grey-500 font-light text-sm ${DescriptionSize}`}>
          {description ? description : null}
        </p>
      </div>
      {btnTitle && (
        <div className="mt-12">
          <Button title={btnTitle} onClick={handleClick} />
        </div>
      )}
    </div>
  )
}

export default CardEmpty
CardEmpty.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  title: PropTypes.string,
  btnTitle: PropTypes.string,
  btnTitle: PropTypes.string,
  btnTitle: PropTypes.string,
  description: PropTypes.string,
  TitleSize: PropTypes.string,
  DescriptionSize: PropTypes.string,
  iconComponent: PropTypes.element,
}
CardEmpty.defaultProp = {
  iconComponent: null,
}
