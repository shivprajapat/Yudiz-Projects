import React from 'react'
import PropTypes from 'prop-types'

// import styles from './style.module.scss'
import playerPlaceholder from '@assets/images/placeholder/head-placeholder.png'
import jerseyPlaceholder from '@assets/images/placeholder/jersey-placeholder.png'
import { getImgURL } from '@shared/utils'

const PlayerImgAMP = ({ head, jersey, height, width, enableBg }) => {
  return (
    <>
      <style jsx amp-custom>{`
      .player{width:100%}.jersey{bottom:0}.enable-bg{background-color:#d2d3d3}/*# sourceMappingURL=style.css.map */

      `}
      </style>
      <div
        className={`w-100 position-relative playerImg overflow-hidden ${enableBg ? 'enable-bg rounded-circle' : ''}`}
        style={{ width: width || height, height: height || width }}
      >
        <div className='player'>
          <amp-img
            src={head?.sUrl ? getImgURL(head?.sUrl) : playerPlaceholder.src}
            width="100"
            height="100"
            alt={head?.sText || 'CT'}
            layout="responsive"
          >
            <amp-img
              fallback=""
              src={playerPlaceholder.src}
              width="100"
              height="100"
              alt={head?.sText || 'CT'}
              layout="responsive"
            />
          </amp-img>
        </div>
        <div className='position-absolute jersey w-100 bottom-0 start-0'>
          <amp-img
            src={jersey?.sUrl ? getImgURL(jersey?.sUrl) : jerseyPlaceholder.src}
            width="100"
            height="100"
            alt={jersey?.sText || 'CT'}
            layout="responsive"
          >
            <amp-img
              fallback=""
              src={jerseyPlaceholder.src}
              width="100"
              height="100"
              alt={jersey?.sText || 'CT'}
              layout="responsive"
            />
          </amp-img>
        </div>
      </div>
    </>
  )
}

PlayerImgAMP.propTypes = {
  head: PropTypes.shape({
    sUrl: PropTypes.string,
    sText: PropTypes.string
  }),
  jersey: PropTypes.shape({
    sUrl: PropTypes.string,
    sText: PropTypes.string
  }),
  height: PropTypes.string,
  width: PropTypes.string,
  enableBg: PropTypes.bool
}

export default PlayerImgAMP
