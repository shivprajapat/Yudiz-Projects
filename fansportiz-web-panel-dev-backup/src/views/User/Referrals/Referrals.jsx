import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import ReferFriendImg from '../../../assests/images/ReferAFriend.svg'
import {
  TelegramShareButton, LinkedinShareButton, LinkedinIcon, TelegramIcon, WhatsappShareButton, WhatsappIcon, FacebookShareButton, FacebookIcon, FacebookMessengerShareButton, FacebookMessengerIcon, TwitterShareButton, TwitterIcon, EmailShareButton, EmailIcon
} from 'react-share'
import config from '../../../config/config'
import share from '../../../assests/images/refer-share.svg'
import invite from '../../../assests/images/invite.svg'
import money from '../../../assests/images/money.svg'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Alert, Button, Collapse } from 'reactstrap'
import LoginPage from '../../../HOC/Auth/LoginPage'
import downArrow from '../../../assests/images/down-arrow-gray.svg'
import upArrow from '../../../assests/images/up-arrow-gray.svg'
import NoData from '../../../assests/images/ic_no_data_found.svg'
import classNames from 'classnames'

function ReferFriend (props) {
  const {
    intl: { formatMessage }, profileData, setMessage, setModalMessage, getReferRuleFunc,
    getUserReferralsListFunc, userReferralsList, currencyLogo, userInformation, currentReferRule,
    remindUser, profileMessage, modalMessage
  } = props
  const [howItWorks, setOpenHowItWorks] = useState(false)
  const [bonusHistory, setBonusHistory] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    getReferRuleFunc()
    getUserReferralsListFunc()
  }, [])

  async function handleShare ({ text, url }) {
    const shareData = {
      // title: 'Title',
      text: text,
      url: url
    }
    if (navigator.canShare) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        setMessage(error?.message)
        setModalMessage(true)
        setTimeout(() => setModalMessage(false), 3000)
      }
    }
  }

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
  }, [copied])

  function copyToClipboard () {
    if (userInformation?.sReferCode) {
      if (navigator?.clipboard && window?.isSecureContext) {
        navigator?.clipboard?.writeText(userInformation?.sReferCode).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        }).catch(() => console.log('error'))
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = userInformation.sReferCode
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        return new Promise(function () {
          if (document.execCommand('copy')) {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }
          textArea.remove()
        })
      }
    }
  }

  function refToFunc (data) {
    if (data?.eReferStatus === 'P') {
      return (
        <>
          <FormattedMessage id='Reference_reward' />
          {' '}
          {data?.eReferStatus === 'P' ? 'pending' : 'success'}
          <FormattedMessage id='For' />
          {data?.sReferrerRewardsOn.toLowerCase().replace(/_/g, ' ')}
          ,
          {' '}
          <FormattedMessage id='remind' />
          {' '}
          {data?.sUsername}
          {' '}
          <FormattedMessage id='to' />
          <FormattedMessage id={data?.sReferrerRewardsOn} />
        </>
      )
    } else if (data?.eReferStatus === 'S') {
      return (
        <>
          <FormattedMessage id='Reference_reward_received_for' />
          {' '}
          {data?.sReferrerRewardsOn.toLowerCase().replace(/_/g, ' ')}
        </>
      )
    }
  }

  return (
    <div className='userprofile refer-friend'>
      {copied && <Alert color='primary'>Copied into a Clipboard</Alert>}
      {modalMessage && <Alert color='primary'>{profileMessage}</Alert>}
      <div className='bg-white'>
        <div className='text-center p-4'>
          <img src={ReferFriendImg} />
        </div>
        <div className='userprofile_second_container'>
          <p className='share-code-text'><FormattedMessage id='Share_your_code' /></p>
          <div className='d-flex justify-content-between align-items-center code-block'>
            <div className='refferal-code'>{userInformation?.sReferCode.toUpperCase()}</div>
            <div className='tap-to-copy' onClick={copyToClipboard}><FormattedMessage id='Tap_to_copy' /></div>
          </div>
          <div className="text-center">
            {navigator.canShare
              ? (
                <div className="row my-4 text-center">
                  <div className='col-12'>
                    <Button className='share-class'
                      onClick={() => handleShare(
                        {
                          text: `${formatMessage({ id: 'Please_use_my_refer_code' })} ${profileData && profileData.sReferCode && profileData.sReferCode} ${formatMessage({ id: 'In_fansportiz' })} `,
                          url: `${profileData?.sReferLink}`
                        }
                      )}
                    >
                      <img className='pe-2' src={share} />
                      <FormattedMessage id="Share" />
                    </Button>
                  </div>
                </div>
                )
              : (
                <div className='m-3'>
                  <WhatsappShareButton
                    className="Demo__some-network__share-button me-2 mt-2"
                    separator=":"
                    title={`${formatMessage({ id: 'Please_use_my_refer_code' })} ${profileData && profileData.sReferCode && profileData.sReferCode} ${formatMessage({ id: 'In_fansportiz' })} `}
                    url={`${profileData?.sReferLink}`}
                  >
                    <WhatsappIcon round size={30} />
                  </WhatsappShareButton>
                  <FacebookShareButton
                    className="Demo__some-network__share-button me-2 mt-2"
                    quote={<FormattedMessage id="Facebook" />}
                    url={`${profileData?.sReferLink}`}
                  >
                    <FacebookIcon round size={30} />
                  </FacebookShareButton>
                  <TwitterShareButton
                    className="Demo__some-network__share-button me-2 mt-2"
                    title={`${formatMessage({ id: 'Please_use_my_refer_code' })} ${profileData && profileData.sReferCode && profileData.sReferCode} ${formatMessage({ id: 'In_fansportiz' })} `}
                    url={`${profileData?.sReferLink}`}
                  >
                    <TwitterIcon round size={30} />
                  </TwitterShareButton>
                  <LinkedinShareButton
                    className="Demo__some-network__share-button me-2 mt-2"
                    title={`${formatMessage({ id: 'Please_use_my_refer_code' })} ${profileData && profileData.sReferCode && profileData.sReferCode} ${formatMessage({ id: 'In_fansportiz' })} `}
                    url={`${profileData?.sReferLink}`}
                  >
                    <LinkedinIcon round size={30} />
                  </LinkedinShareButton>
                  <FacebookMessengerShareButton
                    appId={config.facebookAppID}
                    className="Demo__some-network__share-button me-2 mt-2"
                    title={`${formatMessage({ id: 'Please_use_my_refer_code' })} ${profileData && profileData.sReferCode && profileData.sReferCode} ${formatMessage({ id: 'In_fansportiz' })} `}
                    url={`${profileData?.sReferLink}`}
                  >
                    <FacebookMessengerIcon round size={30} />
                  </FacebookMessengerShareButton>
                  <TelegramShareButton
                    className="Demo__some-network__share-button me-2 mt-2"
                    title={`${formatMessage({ id: 'Please_use_my_refer_code' })} ${profileData && profileData.sReferCode && profileData.sReferCode} ${formatMessage({ id: 'In_fansportiz' })} `}
                    url={`${profileData?.sReferLink}`}
                  >
                    <TelegramIcon round size={30} />
                  </TelegramShareButton>
                  <EmailShareButton
                    body={`${formatMessage({ id: 'Please_use_my_refer_code' })} ${profileData && profileData.sReferCode && profileData.sReferCode} ${formatMessage({ id: 'In_fansportiz' })} `}
                    className="Demo__some-network__share-button me-2 mt-2"
                    onClick={ (_, link) => {
                      window.open(link, '_blank')
                    }}
                    onShareWindowClose={true}
                    openShareDialogOnClick={true}
                    separator=' '
                    subject={`${formatMessage({ id: 'My_Refer_Code' })} ${profileData && profileData.sReferCode && profileData.sReferCode} `}
                    url={`${profileData?.sReferLink}`}
                  >
                    <EmailIcon round size={30} />
                  </EmailShareButton>
                </div>
                )}
          </div>
        </div>
      </div>
      <div className='pt-2'>
        <div className='bg-white'>
          <div className="how-it-works-container p-3">
            <div className='toggle-title d-flex align-items-center justify-content-between' onClick={() => setOpenHowItWorks(!howItWorks)}>
              <FormattedMessage id='How_it_works' />
              {howItWorks ? <img className='me-2' src={upArrow} /> : <img className='me-2' src={downArrow} />}
            </div>
            <Collapse isOpen={howItWorks}>
              <div>
                <div className='d-flex justify-content-start mt-4 mb-3'>
                  <div><img src={invite} /></div>
                  <div className={classNames({ 'me-3 text-end': document.dir === 'rtl', 'ms-3 text-start': document.dir !== 'rtl' })}>
                    <p className='title'><FormattedMessage id='Invite_friends' /></p>
                    <p className='text'><FormattedMessage id='Invite_your_friends_to_join_the_Fansportiz_with_your_referral_code_or_Link' /></p>
                  </div>
                </div>
                <div className='line-class' />
                <div className='d-flex justify-content-around'>
                  <div><img src={money} width={50} /></div>
                  <div className={classNames({ 'me-3 text-end': document.dir === 'rtl', 'ms-3 text-start': document.dir !== 'rtl' })}>
                    <p className='title'><FormattedMessage id='Collect_bonus_cash' /></p>
                    <p className='text'>
                      <FormattedMessage id='You_will_get' />
                      {currencyLogo}
                      {currentReferRule?.oUserReward?.nAmount}
                      {' '}
                      {currentReferRule?.oUserReward?.eType === 'B' ? 'Bonus' : 'Cash'}
                      <FormattedMessage id=' when_you_refer_the_app_to_a_new_user_New_users_will_get_Refer_amount_of' />
                      {' '}
                      {currencyLogo}
                      {currentReferRule?.oNewUserReward?.nAmount}
                      {' '}
                      {currentReferRule?.oNewUserReward?.eType === 'B' ? 'Bonus' : 'Cash'}
                      <FormattedMessage id='if_they_register_on_our_app_with_the_referral_code' />
                    </p>
                  </div>
                </div>
              </div>
            </Collapse>
          </div>
        </div>
      </div>
      <div className='pt-2'>
        <div className="bonus-history-container bg-white p-3">
          <div className='toggle-title d-flex align-items-center justify-content-between' onClick={() => setBonusHistory(!bonusHistory)}>
            <FormattedMessage id='Bonus_history' />
            {bonusHistory ? <img className='me-2' src={upArrow} /> : <img className='me-2' src={downArrow} />}
          </div>
          <Collapse isOpen={bonusHistory}>
            <ul className="referral-list py-3">
              {userReferralsList?.aResult?.length > 0
                ? userReferralsList?.aResult?.map(data => (
                  <li key={data?.id} className='d-flex justify-content-between align-items-center py-3'>
                    <div>
                      <p className='title'>
                        Reference to
                        {data?.sUsername}
                      </p>
                      <p className='text'>{refToFunc(data)}</p>
                    </div>
                    {data?.nReferrerAmount && data?.eReferStatus === 'S'
                      ? (
                        <div className='refer-class'>
                          {currencyLogo}
                          {data?.nReferrerAmount}
                        </div>
                        )
                      : <div><Button className='remind-btn' onClick={() => remindUser(data?._id)}><FormattedMessage id='Remind' /></Button></div>}
                  </li>
                ))
                : (
                  <div className='no-bonus-class'>
                    <img src={NoData} />
                    <div><FormattedMessage id='You_do_not_have_any_bonus_cash' /></div>
                  </div>
                  )}
            </ul>
          </Collapse>
        </div>
      </div>
    </div>
  )
}

ReferFriend.propTypes = {
  referralCode: PropTypes.string,
  intl: PropTypes.object,
  profileData: PropTypes.object,
  setMessage: PropTypes.func,
  setModalMessage: PropTypes.func,
  getReferRuleFunc: PropTypes.func,
  currentReferRule: PropTypes.object,
  getUserReferralsListFunc: PropTypes.func,
  userReferralsList: PropTypes.object,
  currencyLogo: PropTypes.string,
  userInformation: PropTypes.object,
  remindUser: PropTypes.func,
  profileMessage: PropTypes.string,
  modalMessage: PropTypes.bool
}

export default injectIntl(LoginPage(ReferFriend))
