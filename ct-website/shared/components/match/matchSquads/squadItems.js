import React from 'react'
import PropTypes from 'prop-types'

import useTranslation from 'next-translate/useTranslation'

const SquadItems = ({ styles, data, captainId }) => {
  const { t } = useTranslation()
  return (
    <>
      <div className={`${styles.item} d-flex justify-content-between align-items-center`} key={data?._id}>
        {data?.sShortName}
        {data?._id === captainId && (
          <span className={`${styles.captain} ms-2 me-auto d-block bg-primary text-light text-center xsmall-text rounded-circle`}>
            {t('common:C')}
          </span>
        )}
        <span className="text-muted small-text">{data?.sPlayingRole && data?.sPlayingRole?.toUpperCase()}</span>
      </div>
    </>
  )
}

SquadItems.propTypes = {
  styles: PropTypes.any,
  data: PropTypes.object,
  captainId: PropTypes.string
}

export default SquadItems
