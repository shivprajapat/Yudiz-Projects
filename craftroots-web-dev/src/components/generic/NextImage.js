import React from 'react'
import Image from 'next/image'
import { BRAND_NAME, TREE_LOGO_DATA_URI } from '@/helper/constant'

function NextImage(props) {
  return (
    <Image
      alt={BRAND_NAME}
      placeholder="blur"
      blurDataURL={TREE_LOGO_DATA_URI}
      {...props}
    />
  )
}

export default NextImage
