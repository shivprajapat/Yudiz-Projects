import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'

function Meta({
  title,
  keyword,
  description,
  img,
  imgDescription,
  canonicalUrl,
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="keywords" content={keyword} />
      <meta name="description" content={description} />
      {img && <meta property="og:image" content={img} />}
      {imgDescription && (
        <meta property="og:description" content={imgDescription} />
      )}
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  )
}

Meta.propTypes = {
  title: PropTypes.string.isRequired,
  keyword: PropTypes.string,
  description: PropTypes.string,
  img: PropTypes.string,
  imgDescription: PropTypes.string,
  canonicalUrl: PropTypes.string,
}

Meta.defaultProps = {
  img: '',
  imgDescription: '',
  keyword: '',
  description: '',
  canonicalUrl: process.env.NEXT_PUBLIC_BASE_URL,
}

export default Meta
