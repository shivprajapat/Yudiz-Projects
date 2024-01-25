import React, { useState } from 'react'
import Image from 'next/image'

import CustomSelect, {
  SELECT_CLASSES,
  SELECT_CLASSNAMES,
} from '../generic/select/CustomSelect'
import {
  iconFlagEur,
  iconFlagGbp,
  iconFlagIn,
  iconFlagUsd,
} from '@/assets/images'

const CountriesList = () => {
  const data = [
    {
      value: 1,
      text: 'IND',
      icon: iconFlagIn,
    },
    {
      value: 2,
      text: 'USD',
      icon: iconFlagUsd,
    },
    {
      value: 3,
      text: 'GBP',
      icon: iconFlagGbp,
    },
    {
      value: 4,
      text: 'EUR',
      icon: iconFlagEur,
    },
  ]

  const [selectedOption, setSelectedOption] = useState(null)

  const handleChange = (e) => {
    setSelectedOption(e)
  }
  const FILTER_SELECT_CLASSES = {
    menu: () => '!w-[104px]',
    input: () => '!m-0 !hidden',
    singleValue: () => '!text-sm',
    placeholder: () => '!m-0 capitalize',
    indicatorsContainer: () => 'cursor-pointer',
    indicatorSeparator: () => 'hidden',
    valueContainer: () => '!p-0 !flex-none w-9',
    control: (state) => {
      let classes = 'py-0 justify-end !border-0 !bg-transparent'

      if (state.isFocused) {
        classes += SELECT_CLASSES.control.focused
      }
      return classes
    },
    option: (state) => {
      let classes =
        state.options[state.options.length - 1].id !== state.value
          ? 'border-b p-0'
          : '!cursor-pointer !bg-transparent !px-2 !py-1'
      const selected = state
        .getValue()
        .filter((option) => option.value === state.data.value)
      if (selected.length || state.isFocused) {
        classes += ''
      }
      return classes
    },
  }
  return (
    <div className="header-countries-list w-14">
      <CustomSelect
        label={
          <Image
            src={iconFlagIn}
            alt="india"
            className="w-6 h-6 sm:w-7 sm:h-7"
          />
        }
        value={selectedOption}
        options={data}
        onChange={handleChange}
        getOptionLabel={(e) => (
          <div className="flex gap-2.5 items-center justify-start">
            <Image
              src={e.icon}
              alt={e.text}
              className="w-6 h-6 sm:w-7 sm:h-7"
            />
            <span className="text-grey-800 text-base font-normal">
              {e.text}
            </span>
          </div>
        )}
        classNames={{
          ...SELECT_CLASSNAMES,
          ...FILTER_SELECT_CLASSES,
        }}
      />
    </div>
  )
}

export default CountriesList
