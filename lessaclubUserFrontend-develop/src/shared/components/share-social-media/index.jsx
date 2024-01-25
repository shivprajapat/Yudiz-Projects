import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal } from 'react-bootstrap'
import { EmailShareButton, EmailIcon, TwitterShareButton, TwitterIcon, FacebookShareButton, FacebookIcon } from 'next-share'
import { FormattedMessage } from 'react-intl'

import './style.scss'
import { GlbViewer } from 'modules/3DFiles'
import ShowZip from '../ShowZip'
import { GLB, ZIP } from 'shared/constants'

const ShareSocialMedia = ({ show, handleClose, asset, url, thumbnail }) => {
  const [copied, setCopied] = useState(false)

  const fileType = asset?.split('.').at(-1)
  const awsUrl = asset
  const isRender3d = fileType === GLB
  const is3dStillZip = fileType === ZIP
  const isRenderImage = !isRender3d && !is3dStillZip

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
  }, [copied])

  const handleCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
  }

  return (
    <>
      <Modal className="asset-share-modal" centered show={show} onHide={handleClose}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          {isRender3d && <GlbViewer
            artwork={awsUrl}
            showThumbnail={true}
            thumbnail={thumbnail}
            isShare={true}
            ignore3DRender={true}
          />}
          {is3dStillZip && (
            <div className="mt-3">
              <ShowZip />
            </div>
          )}
          {isRenderImage && (
            <div className="thumb-row">
              <img src={thumbnail || awsUrl} alt="detail-img" className="img-fluid detail-img" loading="lazy" />
            </div>
          )}
          <p className="text-center share-desc">
            <FormattedMessage id="shareWithYourFriendsAndSocialMedia" />
          </p>
          <ul className="social-links d-flex justify-content-center">
            <li>
              <TwitterShareButton url={url} hashtag={'#Nuuway'}>
                <TwitterIcon size={36} round />
              </TwitterShareButton>
            </li>
            <li>
              <FacebookShareButton url={url} hashtag={'#Nuuway'}>
                <FacebookIcon size={36} round />
              </FacebookShareButton>
            </li>
            <li>
              <EmailShareButton url={url} hashtag={'#Nuuway'}>
                <EmailIcon size={36} round />
              </EmailShareButton>
            </li>
          </ul>

          <div className="link-copy">
            <span className="copy-txt d-block">
              <FormattedMessage id="orCopyLink" />
            </span>
            <span className="link-copy-inner d-block">
              {url}
              <Button className="copy-btn" onClick={handleCopy}>
                {copied ? <FormattedMessage id="copied" /> : <FormattedMessage id="copy" />}
              </Button>
            </span>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}
ShareSocialMedia.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  asset: PropTypes.string,
  thumbnail: PropTypes.string,
  url: PropTypes.string
}
export default ShareSocialMedia
