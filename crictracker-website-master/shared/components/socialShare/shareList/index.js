import React, { useState, useEffect, useContext } from 'react'
import { Dropdown } from 'react-bootstrap'
import PropTypes from 'prop-types'
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TelegramShareButton,
  TelegramIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TwitterShareButton,
  TwitterIcon
} from 'next-share'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'

import styles from './style.module.scss'
import copyIcon from '@assets/images/icon/copy-link.svg'
import ToastrContext from '@shared-components/toastr/ToastrContext'
import { TOAST_TYPE } from '@shared/constants'
import MyImage from '@shared/components/myImage'

const SocialShareList = ({ seoData }) => {
  const { t } = useTranslation()
  const { dispatch } = useContext(ToastrContext)
  const [pageUrl, setPageUrl] = useState()
  const router = useRouter()

  useEffect(() => {
    setPageUrl(window?.location?.href)
  }, [router?.asPath])

  const handleCopy = (e) => {
    navigator.clipboard.writeText(pageUrl)
    dispatch({
      type: 'SHOW_TOAST',
      payload: { message: t('common:Copied'), type: TOAST_TYPE.Success }
    })
  }

  return (
    <div className={`${styles.socialShareList} d-flex mx-n1`}>
      <Dropdown.Item className={`${styles.item} p-0 mx-1`}>
        <FacebookShareButton
          url={pageUrl}
          quote={seoData?.oFB?.sTitle || seoData?.sTitle}
        >
          <FacebookIcon size={32} round />
        </FacebookShareButton>
      </Dropdown.Item>
      <Dropdown.Item className={`${styles.item} p-0 mx-1`}>
        <WhatsappShareButton
          url={pageUrl}
          title={seoData?.sTitle}
        >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </Dropdown.Item>
      <Dropdown.Item className={`${styles.item} p-0 mx-1`}>
        <TelegramShareButton
          url={pageUrl}
          title={seoData?.sTitle}
        >
          <TelegramIcon size={32} round />
        </TelegramShareButton>
      </Dropdown.Item>
      <Dropdown.Item className={`${styles.item} p-0 mx-1`}>
        <LinkedinShareButton
          url={pageUrl}
          title={seoData?.sTitle}
        >
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
      </Dropdown.Item>
      <Dropdown.Item className={`${styles.item} p-0 mx-1`}>
        <TwitterShareButton
          url={pageUrl}
          title={seoData?.oTwitter?.sTitle || seoData?.sTitle}
        >
          <TwitterIcon size={32} round />
        </TwitterShareButton>
      </Dropdown.Item>
      <Dropdown.Item onClick={(e) => handleCopy(e)} className={`${styles.item} ${styles.copy} p-0 mx-1 d-flex align-items-center justify-content-center rounded-circle`}>
        <MyImage src={copyIcon} alt="copy" />
      </Dropdown.Item>
    </div>
  )
}

SocialShareList.propTypes = {
  seoData: PropTypes.object
}

export default SocialShareList
