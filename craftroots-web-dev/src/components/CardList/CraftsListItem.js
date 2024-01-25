import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'

import { iconPlay, imgCircleShape } from '@/assets/images'

const CraftsListItem = ({ img, title, description }) => {
  const [iconShow, setIconShow] = useState(true)
  const vidRef = useRef(null)
  const handlePlayVideo = () => {
    vidRef.current.play()
    setIconShow(false)
  }
  return (
    <div className="bg-grey-100 border border-grey-400 crafts-list-item">
      <div className="relative">
        <video
          width="100%"
          height="240px"
          ref={vidRef}
          controls={!iconShow && true}
          muted
          poster={img.src}
        >
          <source
            src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            type="video/mp4"
          />
        </video>

        {iconShow && (
          <button
            onClick={handlePlayVideo}
            className="absolute -translate-x-1/2 -translate-y-1/2 rotate-2 top-2/4 left-1/2 z-10"
          >
            <Image src={imgCircleShape} alt="imgCircleShape" />
            <span className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2 z-10">
              <Image src={iconPlay} alt="iconPlay" />
            </span>
          </button>
        )}
      </div>
      <div className="px-4 pt-4 sm:pt-6 pb-4">
        <h6 className="mb-1 xs:mb-2 text-lg xs:text-xl md:text-2xl font-medium text-grey-900">
          {title}
        </h6>
        <p className="text-sm md:text-base font-normal text-grey-800 line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  )
}

export default CraftsListItem
CraftsListItem.propTypes = {
  img: PropTypes.object,
  title: PropTypes.string,
  description: PropTypes.string,
}
