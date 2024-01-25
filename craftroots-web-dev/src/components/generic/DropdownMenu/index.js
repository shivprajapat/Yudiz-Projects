import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import Button from '../Button'
import DropdownItems from './DropdownItems'
import DropdownItem from './DropdownItem'
import { iconArrowDown } from '@/assets/images'

function DropdownMenu({ children, title, className, menuClass, loading }) {
  return (
    <div tabindex="0" className={`group relative inline-block ${className}`}>
      <Button
        title={title}
        border
        icon={
          !loading && (
            <Image
              src={iconArrowDown}
              alt="arrow"
              className="icon-hover-white"
            />
          )
        }
        className={`!px-3.5 !py-1.5 sm:!py-[9px] flex-row-reverse ${menuClass}`}
        btnLoader={loading}
      />
      {children}
    </div>
  )
}

DropdownMenu.propTypes = {
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
  menuClass: PropTypes.string,
  loading: PropTypes.bool,
  title: PropTypes.string,
}
DropdownMenu.defaultProps = {
  className: '',
  menuClass: '',
  loading: false,
  title: 'Menu',
}

export default Object.assign(DropdownMenu, {
  Items: DropdownItems,
  Item: DropdownItem,
})
