import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Alert, Button } from 'reactstrap'
import { FormattedMessage, injectIntl } from 'react-intl'
import { useSelector, useDispatch } from 'react-redux'

// APIs
import { GetUserProfile } from '../../../redux/actions/profile'

function OtherContentPage (props) {
  const { intl: { formatMessage }, contentDetails, bannerImg } = props
  const dispatch = useDispatch()
  const [modalMessage, setModalMessage] = useState(false)
  const [message, setMessage] = useState('')
  const profileData = useSelector((state) => state.profile.userInfo)
  const token = useSelector((state) => state.auth.token)

  useEffect(() => {
    if (token) {
      dispatch(GetUserProfile(token))
    }
  }, [token])

  async function handleShare ({ text, url }) {
    const shareData = {
      // title: 'Title',
      text,
      url
    }
    if (navigator.canShare) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        setMessage(error?.message)
        setModalMessage(true)
        setTimeout(() => setModalMessage(false), 3000)
      }
    } else {
      setMessage(<FormattedMessage id="Your_browser_doesnot_support_the_Web_Share" />)
      setModalMessage(true)
      setTimeout(() => setModalMessage(false), 3000)
    }
  }

  return (
    <>
      {modalMessage && message ? <Alert color="primary" isOpen={modalMessage}>{message}</Alert> : ''}
      <div className="user-container no-footer bg-white">
        {
          bannerImg && (
            <img alt="bannerImg" className="banner-img" src={bannerImg} />
          )
        }
        <div className="cms">
          {
            contentDetails && (
              <div dangerouslySetInnerHTML={{ __html: contentDetails }} className="offer-d-txt" />
            )
          }
          {navigator.canShare && (
          <div className="btn-bottom p-0 text-center">
            <Button
              className="w-100"
              color="primary-two"
              onClick={() => handleShare(
                {
                  text: `${formatMessage({ id: 'Please_use_my_refer_code' })} ${profileData && profileData.sReferCode && profileData.sReferCode} ${formatMessage({ id: 'In_fansportiz' })} `,
                  url: `${profileData && profileData.sReferLink && profileData.sReferLink}`
                }
              )}
              type="submit"
            >
              <FormattedMessage id="Share" />
            </Button>
          </div>
          )}
        </div>
      </div>
    </>
  )
}

OtherContentPage.propTypes = {
  contentDetails: PropTypes.string.isRequired,
  bannerImg: PropTypes.string.isRequired,
  intl: PropTypes.shape().isRequired
}

export default injectIntl(OtherContentPage)
