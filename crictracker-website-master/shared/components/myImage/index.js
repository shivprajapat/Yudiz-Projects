import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import PropTypes from 'prop-types'

import noImage from '@assets/images/placeholder/article-placeholder.jpg'
import useOnMouseAndScroll from '@shared/hooks/useOnMouseAndScroll'

function MyImage({ src, isLoadOnInteraction, errorSrc, ...rest }) {
  const [url, setUrl] = useState(isLoadOnInteraction ? noImage : src)
  const { isLoaded } = useOnMouseAndScroll()

  useEffect(() => {
    if (isLoadOnInteraction) {
      if (isLoaded) setUrl(src)
      else setUrl(noImage)
    } else {
      setUrl(src)
    }
  }, [src, isLoaded])

  return (
    <Image
      src={url}
      onError={(e) => setUrl(errorSrc || noImage)}
      {...rest}
    />
  )
}
MyImage.propTypes = {
  src: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  isLoadOnInteraction: PropTypes.bool,
  errorSrc: PropTypes.object
}
export default React.memo(MyImage)
