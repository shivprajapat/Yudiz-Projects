import React from 'react'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'

import playerPlaceholder from '@assets/images/placeholder/head-placeholder.png'
import jerseyPlaceholder from '@assets/images/placeholder/jersey-placeholder.png'
import { getImgURL } from '@shared/utils'

const MyImage = dynamic(() => import('@shared/components/myImage'))

const PlayerImg = ({ head, jersey, enableBg }) => {
  const style = {
    playerImg: { backgroundColor: enableBg ? '#d2d3d3' : 'transparent' }
  }
  return (
    <div className={`w-100 position-relative overflow-hidden ${enableBg ? 'rounded-circle' : ''}`} style={style.playerImg}>
      <div className='w-100'>
        <MyImage
          src={head?.sUrl ? getImgURL(head?.sUrl) : playerPlaceholder}
          errorSrc={playerPlaceholder}
          width="100"
          height="100"
          alt={head?.sText || 'CT'}
          layout="responsive"
        />
      </div>
      <div className='position-absolute w-100 h-100 bottom-0 start-0'>
        <MyImage
          src={jersey?.sUrl ? getImgURL(jersey?.sUrl) : jerseyPlaceholder}
          errorSrc={jerseyPlaceholder}
          width="100"
          height="100"
          alt={jersey?.sText || 'CT'}
          layout="responsive"
        />
      </div>
    </div>
  )
}
PlayerImg.propTypes = {
  head: PropTypes.shape({
    sUrl: PropTypes.string,
    sText: PropTypes.string
  }),
  jersey: PropTypes.shape({
    sUrl: PropTypes.string,
    sText: PropTypes.string
  }),
  enableBg: PropTypes.bool
}
export default PlayerImg
