import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import nodataArt from '@assets/images/no-data.svg'

const MyImage = dynamic(() => import('@shared/components/myImage'))

const NoData = (props) => {
  return (
    <div className={`${styles.NoData} my-2 my-md-3  text-center`}>
      <h3 className="text-capitalize">{props?.title || 'No Data Found'}</h3>
      <div className={`${styles.artwork} mx-auto mb-2`}>
        <MyImage src={nodataArt} alt="user" layout="responsive" />
      </div>
    </div>
  )
}
NoData.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ])
}

export default NoData
