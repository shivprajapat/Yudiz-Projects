import React, { memo, useEffect, useState } from 'react'
import Image from 'next/image'
import PropTypes from 'prop-types'
import { imgNo } from '@/assets/images'
function MyImage({ src, ...rest }) {
  const [url, setUrl] = useState(src)

  useEffect(() => {
    setUrl(src)
  }, [src])

  return (
    <Image
      src={url}
      onError={() => setUrl(imgNo)}
      {...rest}
      alt="/"
    />
  )
}
MyImage.propTypes = {
  src: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ])
}
export default memo(MyImage)
