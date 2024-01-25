import React, { useId } from 'react'
import PropTypes from 'prop-types'
import './_description.scss'
import CustomToolTip from 'Components/TooltipInfo'

export default function DescriptionInput({ label, className, errorMessage, info, tooltipContent, ...props }) {
  const id = useId()
  // eslint-disable-next-line react/prop-types
  console.log('props', props?.disabled)
  return (
    <div className="description-input-container">
      {label ?
        <div>
          <label htmlFor={id} className='description-input-label' title={label}>{props.isImportant ? <>{label}<span className='description-input-important'>*</span></> : label}</label>
          <CustomToolTip tooltipContent={tooltipContent} position='left'>
            {({ target }) => (
              <span
                ref={target}
                className='description-input-info'
              >
                {info}
              </span>
            )}
          </CustomToolTip>
        </div>
        : false}
      <textarea id={id} {...props} className={`${className} ${errorMessage ? 'description-errorInput' : ''} description-textarea`} />
      {errorMessage && <p className="description-errorMessage">{errorMessage}</p>}
    </div>
  )
}
DescriptionInput.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.string,
  errorMessage: PropTypes.object,
  info: PropTypes.any,
  tooltipContent: PropTypes.string,
  isImportant: PropTypes.bool
}
