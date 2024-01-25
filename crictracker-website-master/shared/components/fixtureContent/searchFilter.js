import React from 'react'
import PropTypes from 'prop-types'
import styles from './style.module.scss'
import useTranslation from 'next-translate/useTranslation'
import CustomFormGroup from '@shared/components/customForm/customFormGroup'
import CustomInput from '@shared/components/customForm/customInput'

const SearchFilter = ({ formStyles, mobilefilter, handleSearch, placeholder, isMobile }) => {
  const { t } = useTranslation()
  return (
    <CustomFormGroup
      controlId="search"
      className={`${formStyles?.formGroup} ${mobilefilter?.formGroup} ${styles?.formGroup} ${styles.searchFilter} flex-grow-1`}
    >
      <CustomInput
        type="input"
        placeholder={placeholder || t('common:SearchByTeamSeries')}
        className={`${formStyles?.formControl} d-flex`}
        onChange={(e) => {
          isMobile && window.scrollTo(0, 150)
          handleSearch(e.target.value)
        }}
      />
    </CustomFormGroup>
  )
}

SearchFilter.propTypes = {
  formStyles: PropTypes.any,
  mobilefilter: PropTypes.any,
  placeholder: PropTypes.string,
  handleSearch: PropTypes.func,
  isMobile: PropTypes.bool
}

export default SearchFilter
