import React from 'react'
import PropTypes from 'prop-types'
function TweetHead({ authorData, showLogo, isQuotedTweet }) {
  return (
    <div className={`tweetHeader ${isQuotedTweet && 'quotedTweetHead'} d-flex justify-content-between align-items-start`}>
      <a className="tweetUser d-flex justify-content-between align-items-center" href="#">
          <img className="tweetUserImg me-2 mb-0 rounded-circle overflow-hidden" src="https://www.crictracker.com/_next/image/?url=%2F_next%2Fstatic%2Fmedia%2Fsujjad.41f515ac.jpg&w=1900&q=75" alt="username" width="64" height="64" />
          <div className='tweetUserInfo'>
            <p className="tweetUsername fw-bold mb-0 d-flex flex-wrap align-items-center"><span className="me-1">{authorData?.sName}</span> <img className="twitterVerified" src="https://media.crictracker.com/static/twitter/verified_badge.svg" alt="verified" width="15" height="15" /></p>
            <p className="tweetProfile text-secondary mb-0">@{authorData?.sUsername}</p>
          </div>
      </a>
      {
          showLogo && <a href="#" className="twitterLogo">
              <img className="mb-0" src="https://media.crictracker.com/static/twitter/twitter_logo.svg" alt="twitter-logo" width="20" height="20" layout="fixed" />
          </a>
      }
    </div>
  )
}

TweetHead.propTypes = {
  type: PropTypes.string,
  showLogo: PropTypes.bool,
  authorData: PropTypes.object,
  isQuotedTweet: PropTypes.bool,
  categoryId: PropTypes.string,
  articleId: PropTypes.string
}

export default TweetHead
