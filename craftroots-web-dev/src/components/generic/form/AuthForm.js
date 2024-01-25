import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Image from 'next/image'

const AuthForm = ({ children, title, icon, className }) => {
  const headingClass = `${className} text-center mb-4 sm:mb-6 md:mb-10`
  return (
    <div className="flex items-center justify-center bg-white w-[320px] xs:w-[340px] sm:w-[404px] max-w-[95%] mx-auto p-5 sm:p-6">
      <div className="w-full">
        {icon && (
          <Image src={icon} alt="icon" className="mx-auto w-28 h-28 pb-3" />
        )}
        {title && (
          <h2 className={headingClass}>
            <FormattedMessage id={title} />
          </h2>
        )}
        {children}
      </div>
    </div>
  )
}

export default AuthForm
AuthForm.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
}

AuthForm.defaultProps = {
  icon: null,
  className: '',
}
