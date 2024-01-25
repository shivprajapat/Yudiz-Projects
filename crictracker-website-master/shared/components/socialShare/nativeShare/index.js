import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import { DOMAIN } from '@shared/constants'
import { Button, Dropdown } from 'react-bootstrap'
import useTranslation from 'next-translate/useTranslation'
const previewImg = `${DOMAIN}images/CricTracker-Facebook-Preview.jpg`

const SocialShareList = dynamic(() => import('@shared/components/socialShare/shareList'))
const CtToolTip = dynamic(() => import('@shared/components/ctToolTip'))

const NativeShare = ({ seoData, article, children, buttonClass, dropDownMenuClassName, ...props }) => {
  const { t } = useTranslation()
  const [isNativeShare, setIsNativeShare] = useState(false)
  useEffect(() => {
    if (navigator.share) {
      setIsNativeShare(true)
    } else {
      setIsNativeShare(false)
    }
  }, [])

  async function nativeShare() {
    const url = `${DOMAIN}${seoData?.sSlug}/`
    const title = seoData?.sTitle || article?.sTitle
    const postImg = article?.oImg?.sUrl ? `${DOMAIN}${article?.oImg?.sUrl}` : previewImg
    try {
      await navigator.share({
        title,
        url,
        postImg
      })
      // alert('Thanks for Sharing!')
    } catch (err) {
      // alert(`Couldn't share ${err}`)
    }
  }

  return (
    <>
      {isNativeShare ? (
        <CtToolTip tooltip={t('common:Share')}>
          <Button variant="link" onClick={() => nativeShare()} className={buttonClass}>
            {children}
          </Button>
        </CtToolTip>
      ) : (
        <CtToolTip tooltip={t('common:Share')}>
          <Dropdown>
            <Dropdown.Toggle variant="link" id="dropdown-basic" className={buttonClass}>
              {children}
            </Dropdown.Toggle>
            <Dropdown.Menu {...props} className={dropDownMenuClassName || ''}>
              <SocialShareList seoData={seoData} />
            </Dropdown.Menu>
          </Dropdown>
        </CtToolTip>
      )}
    </>
  )
}
NativeShare.propTypes = {
  article: PropTypes.object,
  seoData: PropTypes.object,
  buttonClass: PropTypes.string,
  dropDownMenuClassName: PropTypes.string,
  children: PropTypes.node.isRequired
}
export default NativeShare
