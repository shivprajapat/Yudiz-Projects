import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Dropdown, Spinner } from 'react-bootstrap'
import Trans from 'next-translate/Trans'

import styles from './style.module.scss'
import { bottomReached, debounce, searchFromArray } from '@shared/utils'
import { CloseIcon } from '../ctIcons'
import CustomInput from '@shared/components/customForm/customInput'
import useDeviceType from '@shared/hooks/useDeviceType'

function CustomSelect({ options, labelKey = 'label', valueKey = 'value', defaultValue, value = {}, onChange, className = '', isBottomReached, isLoading, isClearable, isSearchable, onInputChange, align, isSmall, isDark, placeholder, register, name, isNative, defaultSelected }) {
  if (value && !value[valueKey]) value[labelKey] = placeholder
  const placeholderInner = { [labelKey]: placeholder || 'Select...' }
  const [selected, setSelected] = useState(getSelectedValue())
  const [menu, setMenu] = useState(options)
  const inputRef = useRef()
  const { isTouch } = useDeviceType()
  const allMenu = useRef([])

  useEffect(() => {
    setMenu(options)
    const merge = []
    options?.forEach(e => {
      if (e?.options?.length) merge.push(...e?.options)
      else merge.push(e)
    })
    allMenu.current = merge
  }, [options])

  useEffect(() => {
    value && setSelected(value[labelKey] ? value : getSelectedValue())
  }, [value])

  function handleChange(o) {
    setSelected(o)
    onChange && onChange(o)
  }

  const handleSearch = debounce(({ target }) => {
    setMenu(searchFromArray(options, target.value, labelKey))
    inputRef.current.value = target.value
    inputRef.current.focus()
    onInputChange && onInputChange(target.value)
  })

  function handleScroll(e) {
    if (isBottomReached && bottomReached(e)) isBottomReached(e)
  }

  function onClear() {
    onChange(null)
    setSelected(placeholderInner)
  }

  function handleToggle(isOpen, { source }) {
    if ((source === 'rootClose' && inputRef.current.value) || (source === 'select' && inputRef.current.value)) {
      inputRef.current.value = ''
      handleSearch({ target: inputRef.current })
    }
  }

  function getSelectedValue() {
    if (defaultSelected) return options[0]
    return defaultValue || value || placeholderInner
  }

  // eslint-disable-next-line react/prop-types
  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <div className={`${styles.selectContainer} position-relative`}>
      <CustomInput
        onClick={onClick}
        ref={(e) => {
          ref = e
          inputRef.current = e
        }}
        name={name}
        onChange={handleSearch}
        placeholder={children}
        className={`${styles.formControl} ${styles.formSelect} ${isLoading ? styles.isLoading : ''} ${isDark ? styles.isDark : ''} ${isClearable ? styles.isClearable : ''} ${className === 'hasError' ? styles.hasError : ''} br-sm`}
        readOnly={!isSearchable}
      />
      {isLoading && <Spinner className={`${styles.spinner}`} animation="border" />}
      {(isClearable && selected[valueKey]) && (
        <Button variant="light" onClick={onClear} className={styles.selectContainer}>
          <CloseIcon />
        </Button>
      )}
    </div>
  ))
  CustomToggle.displayName = 'CustomToggle'

  if (isTouch && isNative) {
    return (
      <select
        onChange={({ target }) => {
          const obj = allMenu.current?.filter(e => e[valueKey] === target?.value)
          handleChange(obj[0])
        }}
        className={`${styles.selectNative} ${styles.formControl} ${styles.formSelect} ${isLoading ? styles.isLoading : ''} ${isDark ? styles.isDark : ''} ${isClearable ? styles.isClearable : ''} ${className === 'hasError' ? styles.hasError : ''} br-sm`}
        value={selected[valueKey] || ''}
      >
        <option disabled value=''>{placeholderInner[labelKey]}</option>
        {menu?.map((item, index) => {
          if (item?.options) {
            return (
              <optgroup key={item[valueKey] + index || index} label={item[labelKey]}>
                {item?.options?.map((child, ind) => (
                  <option
                    key={`${child[valueKey]}${index}${ind}` || `${index}${ind}`}
                    // value={JSON.stringify(child)}
                    value={child[valueKey]}
                  // selected={selected[valueKey] === child[valueKey]}
                  // selected={index === 1}
                  >
                    {child[labelKey]}
                  </option>

                ))}
              </optgroup>
            )
          } else {
            return (
              <option
                key={item[valueKey] + index || index}
                // value={JSON.stringify(item)}
                value={item[valueKey]}
              // selected={selected[valueKey] === item[valueKey]}
              >
                {item[labelKey]}
              </option>
            )
          }
        })}
      </select>
    )
  } else {
    return (
      <Dropdown onToggle={handleToggle}>
        <Dropdown.Toggle as={CustomToggle}>
          {selected[labelKey]}
        </Dropdown.Toggle>

        <Dropdown.Menu onScroll={handleScroll} className={`${styles.dropdownMenu} common-dropdown br-sm p-0 overflow-auto`} align={align}>
          {menu?.map((item, index) => {
            if (item?.options) {
              return (
                <React.Fragment key={item[valueKey] || index}>
                  <Dropdown.Header className={`${styles.dropdownHeader}`}>{item[labelKey]}</Dropdown.Header>
                  {item?.options?.map((child) => (
                    <Dropdown.Item
                      key={child[valueKey]}
                      className={`${styles.dropdownItem} ${selected[valueKey] === child[valueKey] ? styles.active : ''}`}
                      onClick={() => handleChange(child)}
                    >
                      {child[labelKey]}
                    </Dropdown.Item>
                  ))}
                </React.Fragment>
              )
            } else {
              return (
                <Dropdown.Item
                  key={item[valueKey]}
                  className={`${styles.dropdownItem} ${selected[valueKey] === item[valueKey] ? styles.active : ''}`}
                  onClick={() => handleChange(item)}
                >
                  {item[labelKey]}
                </Dropdown.Item>
              )
            }
          })}
          {menu?.length === 0 && (
            <p className="text-center p-2 my-1"><Trans i18nKey="common:NoOptions" /></p>
          )}
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

CustomSelect.defaultProps = {
  labelKey: 'label',
  valueKey: 'value',
  value: { label: 'Select...' }
}
CustomSelect.propTypes = {
  options: PropTypes.array,
  labelKey: PropTypes.string,
  valueKey: PropTypes.string,
  defaultValue: PropTypes.object,
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  onChange: PropTypes.func,
  className: PropTypes.string,
  isBottomReached: PropTypes.func,
  onInputChange: PropTypes.func,
  isLoading: PropTypes.bool,
  isClearable: PropTypes.bool,
  isSearchable: PropTypes.bool,
  isSmall: PropTypes.bool,
  isDark: PropTypes.bool,
  align: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  register: PropTypes.any,
  isNative: PropTypes.bool,
  defaultSelected: PropTypes.bool
}
export default CustomSelect
