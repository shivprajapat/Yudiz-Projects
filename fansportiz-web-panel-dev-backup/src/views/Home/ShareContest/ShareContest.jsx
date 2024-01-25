/* eslint-disable promise/param-names */
import React, { useEffect, useState, useRef, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import {
  LinkedinShareButton, LinkedinIcon, WhatsappShareButton, WhatsappIcon, FacebookShareButton, FacebookIcon, FacebookMessengerShareButton, FacebookMessengerIcon, TwitterShareButton, TwitterIcon,
  EmailIcon, EmailShareButton, TelegramShareButton, TelegramIcon
} from 'react-share'
import { Alert, Button } from 'reactstrap'
import config from '../../../config/config'
import { isUpperCase } from '../../../utils/helper'
import Loading from '../../../component/Loading'
import share from '../../../assests/images/shareWhite.svg'
import CommonInviteFriend from '../../../HOC/SportsLeagueList/CommonInviteFriend'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
const Match = lazy(() => import('../components/Match'))
const _ = require('lodash')

function ShareContestPage (props) {
  const { loading, getDetails, token } = props
  const [matchDetails, setMatchDetails] = useState({})
  const [matchLeagueDetails, setMatchLeagueDetails] = useState({})
  const [redirectData, setRedirectData] = useState({})
  const matchList = useSelector(state => state.match.matchList)
  const matchLeagueDetail = useSelector(state => state.league.matchLeagueDetails)
  const amountData = useSelector(state => state.contest.joincontestDetails)
  const [copied, setCopied] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [message, setMessage] = useState('')
  const myRef = useRef()
  const previousProps = useRef({ matchList, matchLeagueDetail, amountData }).current

  const { sMatchId, sContestId, sportsType } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location && location.state && location.state.matchDetails && location.state.matchLeagueDetails) {
      setMatchDetails(location.state.matchDetails)
      setMatchLeagueDetails(location.state.matchLeagueDetails)
    } else {
      getDetails(sContestId, 'Cricket')
    }
    if (sportsType) {
      const sport = sportsType
      isUpperCase(sport) && navigate(`/create-contest/${sport.toLowerCase()}/${sMatchId}/${sContestId}/invite`)
    }
  }, [token])

  useEffect(() => { // handle the response
    if (previousProps.matchList !== matchList) {
      setMatchDetails(matchList)
      if (matchList && matchList.length > 0 && sMatchId) {
        const matchData = matchList.filter(data => data._id === sMatchId)
        if (matchData && matchData.length > 0) {
          setMatchDetails(matchData[0])
        }
      }
    }
    return () => {
      previousProps.matchList = matchList
    }
  }, [matchList])

  useEffect(() => {
    if (redirectData.nAmount) {
      navigate('/deposit',
        {
          state: {
            amountData: redirectData,
            message: 'Insufficient Balance'
          // joinData: {
          //   userTeams: data.userTeams, verifiedId: data.id, finalPromocode: data.finalPromocode
          // }
          }
        })
    }
  }, [redirectData])

  useEffect(() => { // handle the response
    if (previousProps.amountData !== amountData) {
      if (amountData && amountData?.oValue?.nAmount > 0) {
        if (redirectData.nAmount !== amountData.oValue.nAmount) {
          setRedirectData(amountData?.oValue)
        } else {
          setRedirectData({})
        }
      }
    }
    return () => {
      previousProps.amountData = amountData
    }
  }, [amountData])

  useEffect(() => {
    if (previousProps.matchLeagueDetail !== matchLeagueDetail) {
      setMatchLeagueDetails(matchLeagueDetail)
    }
    return () => {
      previousProps.matchLeagueDetail = matchLeagueDetail
    }
  }, [matchLeagueDetail])

  function copyToClipboard (textToCopy) {
    if (matchLeagueDetails && matchLeagueDetails.sShareCode) {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = textToCopy
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        return new Promise(function (res, rej) {
          if (document.execCommand('copy')) {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }
          textArea.remove()
        })
      }
    }
  }

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

  function Copied () {
    if (matchLeagueDetails && matchLeagueDetails.sShareCode) {
      copyToClipboard(matchLeagueDetails.sShareCode)
    }
  }
  return (
    <div className="user-container no-footer">
      { loading && <Loading />}
      { copied && <Alert color="primary"><FormattedMessage id="Copied_Successfully" /></Alert>}
      {modalMessage && message ? <Alert color="primary" isOpen={modalMessage}>{message}</Alert> : ''}
      {
        !_.isEmpty(matchDetails) && (
        <Suspense fallback={<Loading />}>
          <Match {...props} data={matchDetails} loading={false} noRedirect/>
        </Suspense>
        )}
      <div className="share-box">
        <p className="share-t text-center"><FormattedMessage id="Share_the_contest_code" /></p>
        <div className="code-b d-flex align-items-center justify-content-between">
          <p ref={myRef} className="m-0">{matchLeagueDetails && matchLeagueDetails.sShareCode}</p>
          <button onClick={Copied}><FormattedMessage id="Copy" /></button>
        </div>
      </div>
      {navigator.canShare
        ? (
          <div className='native-contest-share-box'>
            <Button className="w-100"
              color='primary-orange'
              onClick={() => handleShare(
                {
                  text: `${config.shareMessage1} ${matchDetails && matchDetails.sName} ${config.shareMessage2} ${matchLeagueDetails && matchLeagueDetails.sShareCode}`,
                  url: `${matchLeagueDetails?.sShareLink ? matchLeagueDetails?.sShareLink : ''}`
                }
              )}
            >
              <img className='float-left ms-3' src={share} />
              <span className='text-center'><FormattedMessage id="Share" /></span>
            </Button>
          </div>
          )
        : (
          <div className="share-box text-center">
            <div>
              <WhatsappShareButton
                className="Demo__some-network__share-button me-2 mt-2"
                separator=":"
                title={config.shareMessage1 + `${matchDetails && matchDetails.sName} ` + config.shareMessage2 + `${matchLeagueDetails && matchLeagueDetails.sShareCode} `}
                url={matchLeagueDetails?.sShareLink ? matchLeagueDetails?.sShareLink : ''}
              >
                <WhatsappIcon round size={40} />
              </WhatsappShareButton>
              <FacebookShareButton
                appId={config.facebookAppID}
                className="Demo__some-network__share-button me-2 mt-2"
                quote={config.shareMessage1 + `${matchDetails && matchDetails.sName} ` + config.shareMessage2 + `${matchLeagueDetails && matchLeagueDetails.sShareCode} `}
                url={matchLeagueDetails?.sShareLink ? matchLeagueDetails?.sShareLink : ''}
              >
                <FacebookIcon round size={40} />
              </FacebookShareButton>
              <TwitterShareButton
                className="Demo__some-network__share-button me-2 mt-2"
                title={config.shareMessage1 + `${matchDetails && matchDetails.sName} ` + config.shareMessage2 + `${matchLeagueDetails && matchLeagueDetails.sShareCode} `}
                url={matchLeagueDetails?.sShareLink ? matchLeagueDetails?.sShareLink : ''}
              >
                <TwitterIcon round size={40} />
              </TwitterShareButton>
              <LinkedinShareButton
                className="Demo__some-network__share-button me-2 mt-2"
                title={config.shareMessage1 + `${matchDetails && matchDetails.sName} ` + config.shareMessage2 + `${matchLeagueDetails && matchLeagueDetails.sShareCode} `}
                url={matchLeagueDetails?.sShareLink ? matchLeagueDetails?.sShareLink : ''}
              >
                <LinkedinIcon round size={40} />
              </LinkedinShareButton>
              <FacebookMessengerShareButton
                appId={config.facebookAppID}
                className="Demo__some-network__share-button me-2 mt-2"
                title={config.shareMessage1 + `${matchDetails && matchDetails.sName} ` + config.shareMessage2 + `${matchLeagueDetails && matchLeagueDetails.sShareCode} `}
                url={matchLeagueDetails?.sShareLink ? matchLeagueDetails?.sShareLink : ''}
              >
                <FacebookMessengerIcon round size={40} />
              </FacebookMessengerShareButton>
              <TelegramShareButton
                className="Demo__some-network__share-button me-2 mt-2"
                title={config.shareMessage1 + `${matchDetails && matchDetails.sName} ` + config.shareMessage2 + `${matchLeagueDetails && matchLeagueDetails.sShareCode} `}
                url={matchLeagueDetails?.sShareLink ? matchLeagueDetails?.sShareLink : ''}
              >
                <TelegramIcon round size={40} />
              </TelegramShareButton>
              <EmailShareButton
                body={config.shareMessage1 + `${matchDetails && matchDetails.sName} ` + config.shareMessage2 + `${matchLeagueDetails && matchLeagueDetails.sShareCode} `}
                className="Demo__some-network__share-button me-2 mt-2"
                onClick={ (_, link) => {
                  window.open(link, '_blank')
                }}
                onShareWindowClose={true}
                openShareDialogOnClick={true}
                resetButtonStyle={false}
                separator=' '
                url={matchLeagueDetails?.sShareLink ? matchLeagueDetails?.sShareLink : ''}
              >
                <EmailIcon round size={40} />
              </EmailShareButton>
            </div>
          </div>
          )}
    </div>
  )
}

ShareContestPage.propTypes = {
  getDetailsFun: PropTypes.func,
  getDetails: PropTypes.func,
  token: PropTypes.string,
  copyToClipboard: PropTypes.func,
  setLoading: PropTypes.func,
  loading: PropTypes.bool,
  history: PropTypes.shape({
    push: PropTypes.func
  })
}

export default CommonInviteFriend(ShareContestPage)
