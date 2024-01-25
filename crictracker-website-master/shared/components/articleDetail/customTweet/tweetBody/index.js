import React from 'react'
import PropTypes from 'prop-types'
import QuotedTweet from '../quotedTweet'
function TweetBody({ postContent, media, isRepliedPost, isQuoted, quotedPost, isQuotedTweet }) {
  return (
    <div className={`tweetBody ${(isQuotedTweet || isRepliedPost) && 'quotedTweetBody'} ${isQuotedTweet || isRepliedPost ? 'my-1' : 'my-3'} d-flex px-2`}>
    {
        isRepliedPost && <div className="tweetBody-verticle-rule d-flex align-items-center justify-content-center">
          <div className="vr"></div>
        </div>
    }
        <div className={`${isRepliedPost && 'mx-4'}`}>
          <div className={isRepliedPost && 'my-2'}>
            {
              postContent
            }
          </div>
          <div className="tweetImgList imgCount1 d-flex flex-wrap justify-content-between my-2 overflow-hidden">
            <img className="tweetImg flex-grow-1 d-block" src="https://www.crictracker.com/_next/image/?url=https%3A%2F%2Fmedia.crictracker.com%2Fmedia%2Fattachments%2F1670485803507_Rohit-Sharma.jpeg&w=450&q=75" alt="tweet-post" loading="lazy" />
            <img className="tweetImg flex-grow-1 d-block" src="https://www.crictracker.com/_next/image/?url=https%3A%2F%2Fmedia.crictracker.com%2Fmedia%2Fattachments%2F1670485803507_Rohit-Sharma.jpeg&w=450&q=75" alt="tweet-post" loading="lazy" />
            <img className="tweetImg flex-grow-1 d-block" src="https://www.crictracker.com/_next/image/?url=https%3A%2F%2Fmedia.crictracker.com%2Fmedia%2Fattachments%2F1670485803507_Rohit-Sharma.jpeg&w=450&q=75" alt="tweet-post" loading="lazy" />
            <img className="tweetImg flex-grow-1 d-block" src="https://www.crictracker.com/_next/image/?url=https%3A%2F%2Fmedia.crictracker.com%2Fmedia%2Fattachments%2F1670485803507_Rohit-Sharma.jpeg&w=450&q=75" alt="tweet-post" loading="lazy" />
          </div>
        {
          isQuoted && <QuotedTweet quotedData={quotedPost} />
        }
        </div>
      </div>
  )
}

TweetBody.propTypes = {
  type: PropTypes.string,
  postContent: PropTypes.object,
  quotedPost: PropTypes.object,
  isRepliedPost: PropTypes.bool,
  isQuotedTweet: PropTypes.bool,
  isQuoted: PropTypes.bool,
  media: PropTypes.array,
  categoryId: PropTypes.string,
  articleId: PropTypes.string
}

export default TweetBody
