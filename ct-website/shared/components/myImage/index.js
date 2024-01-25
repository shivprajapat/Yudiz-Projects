import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import PropTypes from 'prop-types'

import noImage from '@assets/images/placeholder/article-placeholder.jpg'

function MyImage({ src, ...rest }) {
  const [url, setUrl] = useState(src)

  useEffect(() => {
    setUrl(src)
  }, [src])

  return (
    <Image
      src={url}
      onError={(e) => setUrl(noImage)}
      {...rest}
    />
  )
}
MyImage.propTypes = {
  src: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ])
}
export default React.memo(MyImage)
