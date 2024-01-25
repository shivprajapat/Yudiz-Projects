import React from 'react'
import { Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import styles from './style.module.scss'
import useTranslation from 'next-translate/useTranslation'

const SearchFilter = ({ formStyles, mobilefilter, handleSearch }) => {
  const { t } = useTranslation()
  return (
    <Form.Group
      controlId="search"
      className={`${formStyles?.formGroup} ${mobilefilter?.formGroup} ${styles?.formGroup} ${styles.searchFilter} flex-grow-1`}
    >
      <Form.Control
        type="input"
        placeholder={t('common:SearchByTeamSeries')}
        className={`${formStyles?.formControl} d-flex`}
        onChange={(e) => {
          handleSearch(e.target.value)
        }}
      />
    </Form.Group>
  )
}

SearchFilter.propTypes = {
  formStyles: PropTypes.any,
  mobilefilter: PropTypes.any,
  handleSearch: PropTypes.func
}

export default SearchFilter
