import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import { ShareIcon } from '@shared-components/ctIcons'

const NativeShare = dynamic(() => import('@shared/components/socialShare/nativeShare'))

const SocialShare = ({ seoData }) => {
  return (
    <NativeShare seoData={seoData} buttonClass={`${styles.share} d-inline-flex align-items-center justify-content-center flex-shrink-0 text-primary rounded-circle`} align="end">
      <ShareIcon />
    </NativeShare>
  )
}
SocialShare.propTypes = {
  seoData: PropTypes.object
}
export default SocialShare
