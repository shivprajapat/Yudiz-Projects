import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Dropdown, Form, Spinner } from 'react-bootstrap'

import styles from './style.module.scss'
import { bottomReached, debounce, searchFromArray } from '@shared/utils'
import { CloseIcon } from '../ctIcons'
import Trans from 'next-translate/Trans'

function CustomSelect({ options, labelKey = 'label', valueKey = 'value', defaultValue, value = {}, onChange, className = '', isBottomReached, isLoading, isClearable, isSearchable, onInputChange, align, isSmall, isDark, placeholder }) {
  const placeholderInner = { [labelKey]: placeholder || 'Select...' }
  const [selected, setSelected] = useState(defaultValue || value || placeholderInner)
  const [menu, setMenu] = useState(options)
  const inputRef = useRef()

  useEffect(() => {
    setMenu(options)
  }, [options])

  useEffect(() => {
    value && setSelected(value[labelKey] ? value : placeholderInner)
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

  // eslint-disable-next-line react/prop-types
  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <div className={`${styles.selectContainer} position-relative`}>
      <Form.Control
        onClick={onClick}
        ref={(e) => {
          ref = e
          inputRef.current = e
        }}
        onChange={handleSearch}
        placeholder={children}
        className={`${styles.formControl} ${styles.formSelect} ${isLoading && styles.isLoading} ${isDark && styles.isDark} ${isClearable && styles.isClearable} ${className === 'hasError' && styles.hasError}`}
        readOnly={!isSearchable}
      />
      {isLoading && <Spinner className={`${styles.spinner}`} animation="border" size="sm" />}
      {(isClearable && selected[valueKey]) && (
        <Button variant="light" onClick={onClear} className={styles.selectContainer}>
          <CloseIcon />
        </Button>
      )}
    </div>
  ))
  CustomToggle.displayName = 'CustomToggle'

  return (
    <Dropdown onToggle={handleToggle}>
      <Dropdown.Toggle as={CustomToggle}>
        {selected[labelKey]}
      </Dropdown.Toggle>

      <Dropdown.Menu onScroll={handleScroll} className={`${styles.dropdownMenu} common-dropdown`} align={align}>
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
          <p><Trans i18nKey="common:NoOptions" /></p>
        )}
      </Dropdown.Menu>
    </Dropdown>
  )
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
  placeholder: PropTypes.string
}
export default CustomSelect
