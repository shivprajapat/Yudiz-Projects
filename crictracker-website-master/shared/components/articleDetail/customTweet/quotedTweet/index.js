import React from 'react'
import PropTypes from 'prop-types'
import TweetHead from '../tweetHead'
import TweetBody from '../tweetBody'
function QuotedTweet({ quotedData }) {
  return (
    <div className="p-3" style={{ border: '1px solid rgb(207, 217, 222)', borderRadius: '10px' }}>
      <TweetHead authorData={quotedData?.oAuthor} isQuotedTweet/>
      <TweetBody postContent={quotedData?.sContent} media={quotedData?.aMedia} isQuotedTweet/>
    </div>
  )
}

QuotedTweet.propTypes = {
  type: PropTypes.string,
  quotedData: PropTypes.object,
  isRepliedPost: PropTypes.bool,
  media: PropTypes.array,
  categoryId: PropTypes.string,
  articleId: PropTypes.string
}

export default QuotedTweet
