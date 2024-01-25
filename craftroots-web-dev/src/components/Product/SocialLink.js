import React, { useState } from 'react'
import Image from 'next/image'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import {
  FacebookShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  WhatsappShareButton,
} from 'react-share'
import { useRouter } from 'next/router'
import {
  iconCopy,
  iconFacebook,
  iconLinkedin,
  iconPinterest,
  iconWhatsapp,
} from '@/assets/images'
function SocialLink({ productDetailsState, productInfo, mediaGallery }) {
  const [copied, setCopied] = useState(false)
  const router = useRouter()
  const copyToClipboard = () => {
    const url = window.location.href
    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === 'function'
    ) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
        .catch((error) => {
          console.error('Error copying to clipboard:', error)
        })
    } else {
      console.error('Clipboard not supported')
    }
  }

  return (
    <>
      <p className="font-medium text-black-100 text-base mb-4">
        <FormattedMessage id="page.productDetails.title.share" />
      </p>
      <div className="flex mt-4 space-x-4 sm:justify-start items-center sm:mt-0">
        <button onClick={copyToClipboard}>
          <Image src={iconCopy} alt="Copy to Clipboard" className="w-6 h-6" />
        </button>
        <FacebookShareButton
          url={`${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}`}
          quote={productInfo?.name}
          hashtag={productInfo?.name}
        >
          <Image src={iconFacebook} alt="Facebook" className="w-6 h-6" />
        </FacebookShareButton>
        <LinkedinShareButton
          url={`${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}`}
          source={`${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}`}
          title={productInfo?.name}
          summary={productDetailsState?.data?.[0]?.description || ''}
        >
          <Image src={iconLinkedin} alt="Linkedin" className="w-6 h-6" />
        </LinkedinShareButton>

        <PinterestShareButton
          media={mediaGallery?.[0]?.url}
          url={`${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}`}
          description={productDetailsState?.data?.[0]?.description || ''}
        >
          <Image src={iconPinterest} alt="Pinterest" className="w-6 h-6" />
        </PinterestShareButton>
        <WhatsappShareButton
          title="Take a look at this"
          separator={' :: '}
          openShareDialogOnClick="true"
          url={`${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}`}
        >
          <Image src={iconWhatsapp} alt="Pinterest" className="w-6 h-6" />
        </WhatsappShareButton>
      </div>
      {copied && (
        <span className="text-success text-xs font-medium">Copied!</span>
      )}
    </>
  )
}

export default SocialLink

SocialLink.propTypes = {
  productDetailsState: PropTypes.object,
  productInfo: PropTypes.object,
  mediaGallery: PropTypes.array,
}

SocialLink.defdefaultPropsa = {
  productDetailsState: {},
  productInfo: {},
  mediaGallery: [],
}
