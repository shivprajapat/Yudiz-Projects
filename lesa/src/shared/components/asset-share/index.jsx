import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal } from 'react-bootstrap'
import { EmailShareButton, EmailIcon, TwitterShareButton, TwitterIcon, FacebookShareButton, FacebookIcon } from 'next-share'

import './style.scss'

const AssetShare = ({ show, handleClose, assetImage }) => {
  const [pageUrl, setPageUrl] = useState()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setPageUrl(window.location.href)
  }, [])

  const handleCopy = (e) => {
    navigator.clipboard.writeText(pageUrl)
    setCopied(true)
  }

  return (
    <>
      <Modal className="asset-share-modal" centered show={show} onHide={handleClose}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <img src={assetImage} alt="detail-img" className="img-fluid detail-img" loading="lazy" />
          <p className="text-center share-desc">Share the asset with your social media and friends</p>
          <ul className="social-links d-flex justify-content-center">
            <li>
              <TwitterShareButton url={pageUrl} hashtag={'#Nuuway'}>
                <TwitterIcon size={36} round />
              </TwitterShareButton>
            </li>
            <li>
              <FacebookShareButton url={pageUrl} hashtag={'#Nuuway'}>
                <FacebookIcon size={36} round />
              </FacebookShareButton>
            </li>
            <li>
              <EmailShareButton url={pageUrl} hashtag={'#Nuuway'}>
                <EmailIcon size={36} round />
              </EmailShareButton>
            </li>
          </ul>

          <div className="link-copy">
            <span className="copy-txt d-block">Or copy link</span>
            <span className="link-copy-inner d-block">
              {pageUrl}
              <Button className="copy-btn" onClick={handleCopy}>
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </span>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}
AssetShare.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  assetImage: PropTypes.string
}
export default AssetShare
