import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

const Select = dynamic(() => import('react-select'), {
  ssr: false,
})
export const SELECT_CLASSES = {
  control: {
    base: '!border-grey-800 hover:!border-secondary-200 !rounded-none !py-1',
    focused: ' !border-secondary-100 !shadow-none',
  },
  option: {
    base: '!bg-transparent !text-gray-900',
    focused: '!bg-primary/25 !text-gray-900',
    selected: '!bg-primary !text-white',
  },
}

export const SELECT_CLASSNAMES = {
  control: (state) => {
    let classes = SELECT_CLASSES.control.base
    if (state.isFocused) {
      classes += ' ' + SELECT_CLASSES.control.focused
    }
    return classes
  },
  menuList: () => '!text-sm',
  input: () => '!text-sm',
  singleValue: () => '!text-sm',
  placeholder: () => '!text-sm capitalize',
  indicatorsContainer: () => '!text-custom-black2',
  indicatorContainer: () => '!p-0',
  indicatorSeparator: () => 'hidden',
  option: (state) => {
    const selected = state
      .getValue()
      .filter((option) => option.value === state.data.value)
    let classes = SELECT_CLASSES.option.base
    if (selected.length) {
      classes = SELECT_CLASSES.option.selected
    } else if (state.isFocused) {
      classes = SELECT_CLASSES.option.focused
    }
    return classes
  },
}

const CustomSelect = ({
  label,
  id,
  onChange,
  options,
  value,
  classNames,
  components,
  isSearchable,
  menuPortalTarget,
  getOptionLabel,
}) => {
  const optionalProps = {}
  if (getOptionLabel) {
    optionalProps['getOptionLabel'] = getOptionLabel
  }
  return (
    <Select
      id={id}
      onChange={onChange}
      options={options}
      value={value}
      classNames={{ ...SELECT_CLASSNAMES, ...classNames }}
      className="select"
      placeholder={label}
      getOptionValue={(option) => option.id}
      components={components}
      isSearchable={isSearchable}
      // defaultMenuIsOpen={true}
      menuPortalTarget={menuPortalTarget}
      {...optionalProps}
    />
  )
}

export default CustomSelect

CustomSelect.propTypes = {
  id: PropTypes.string,
  label: PropTypes.object || PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.array,
  value: PropTypes.object,
  classNames: PropTypes.object,
  components: PropTypes.object,
  isSearchable: PropTypes.bool,
  menuPortalTarget: PropTypes.element,
  getOptionLabel: PropTypes.func,
}

CustomSelect.defaultProps = {
  classNames: {},
  components: {},
  isSearchable: false,
  menuPortalTarget: null,
  getOptionLabel: null,
}
