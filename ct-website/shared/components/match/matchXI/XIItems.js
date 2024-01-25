import React from 'react'
import PropTypes from 'prop-types'

import useTranslation from 'next-translate/useTranslation'

const XIItems = ({ styles, data }) => {
  const { t } = useTranslation()
  return (
    <>
      <div className={`${styles.item} d-flex justify-content-between align-items-center`}>
        {data?.oPlayer?.sFullName || data?.oPlayer?.sFirstName}
        {data?.sRoleStr === 'cap' && (
          <span className={`${styles.captain} ms-2 me-auto d-block bg-primary text-light text-center xsmall-text rounded-circle`}>
            {t('common:C')}
          </span>
        )}
        {data?.sRoleStr === 'wk' && (
          <span className={`${styles.captain} ms-2 me-auto d-block bg-primary text-light text-center xsmall-text rounded-circle`}>
            {t('common:Wk')}
          </span>
        )}
        {data?.sRoleStr === 'wkcap' && (
          <span className="d-flex me-auto text-center text-light xsmall-text">
            <span className={`${styles.captain} ms-2 d-block bg-primary rounded-circle`}>
              {t('common:C')}
            </span>
            <span className={`${styles.captain} ms-2 d-block bg-primary rounded-circle`}>
              {t('common:Wk')}
            </span>
          </span>
        )}
        <span className="text-muted small-text">{data?.oPlayer?.sPlayingRole && data?.oPlayer?.sPlayingRole?.toUpperCase()}</span>
      </div>
    </>
  )
}

XIItems.propTypes = {
  styles: PropTypes.any,
  data: PropTypes.object
}

export default XIItems
