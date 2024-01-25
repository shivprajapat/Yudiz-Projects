import React from 'react'
import PropTypes from 'prop-types'
import './_select.scss'
import ReactSelect from 'react-select'

export default function Select({ id, labelText, options, className, height, width, errorMessage, errorDisable, fetchMoreData, ...props }) {
  const customStyles = {
    control: (base) => ({
      ...base,
      background: 'transparent',
      borderRadius: 8,
      borderWidth: errorMessage ? 2 : 1,
      borderColor: errorMessage ? 'red' : '#dfe4ec',
      width: width || base.width,
      height: height || base.height,
      minHeight: 34,
    }),
    menu: (base) => ({
      ...base,
      zIndex: 10000,
    }),
    placeholder: (base) => ({
      ...base,
      color: '#b2bfd2',
      // transform: height && 'translateY(-35%)',
    }),
    singleValue: (base) => ({
      ...base,
      color: '#020202',
      // transform: height && 'translateY(-55%)',
    }),
    dropdownIndicator: (base) => ({
      ...base,
      // height: height ? 45 : base.height,
    }),
    indicatorSeparator: (base) => ({
      ...base,
      opacity: 0,
    }),
    clearIndicator: (base) => ({
      ...base,
      // height: height ? 45 : base.height,
    }),
    container: (base) => ({
      ...base,
      marginBottom: '22px',
    }),
    input: (base) => ({
      ...base,
      // paddingTop: 10,
      // transform: 'translateY(-30%)',
    }),
  }
  return (
    <>
      <div className={'select-container ' + className}>
        {labelText && <label htmlFor={id}>{labelText}</label>}
        <ReactSelect styles={customStyles} {...props} options={options} onMenuScrollToBottom={fetchMoreData} />
        {!errorDisable && <p className="errorMessage">{errorMessage}</p>}
      </div>
    </>
  )
}

Select.propTypes = {
  id: PropTypes.string,
  labelText: PropTypes.string,
  options: PropTypes.array,
  fetchMoreData: PropTypes.func,
  errorMessage: PropTypes.string,
  errorDisable: PropTypes.bool,
  className: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}
