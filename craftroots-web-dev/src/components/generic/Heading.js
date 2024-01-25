import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import Button from './Button'

const Heading = ({
  icon,
  center,
  className,
  title,
  btnTitle,
  showButton,
  handleClick,
  smallSpace,
}) => {
  const centerClass = center ? 'center' : 'between'
  const smallSpaceClass = smallSpace ? 'mb-4' : 'mb-8'
  return (
    <div
      className={`flex items-center justify-${centerClass} ${smallSpaceClass} ${className} lg:mb-10`}
    >
      <h2 className="flex items-center">
        {icon && <Image src={icon} alt={title} className="mr-2" />} {title}
      </h2>
      {showButton && <Button title={btnTitle} onClick={handleClick} />}
    </div>
  )
}

export default React.memo(Heading)
Heading.propTypes = {
  center: PropTypes.bool,
  icon: PropTypes.object,
  title: PropTypes.string,
  smallSpace: PropTypes.bool,
  btnTitle: PropTypes.string,
  showButton: PropTypes.bool,
  className: PropTypes.string,
  handleClick: PropTypes.func,
}

Heading.defaultProps = {
  handleClick: () => {},
}
