import React from 'react'
import PropTypes from 'prop-types'
import { S3_PREFIX } from 'shared/constants'
function CustomTweet({ post }) {
  return (
    <div className="position-relative ctTweet p-3 p-md-4 my-3 mx-auto border mceNonEditable overflow-hidden">
    <a className='position-absolute w-100 h-100 top-0 start-0' href={post?.sShortUrl}></a>
      <div className="tweetHeader d-flex justify-content-between align-items-start">
        <div className="tweetUser d-flex justify-content-between align-items-center">
          <img className="tweetUserImg mb-0 me-2 rounded-circle overflow-hidden" src={post?.oAuthor?.sProfilePic} alt="username" width="64" height="64" loading="lazy" />
          <div className="tweetUserInfo">
            <div className="tweetUsername font-bold mb-0 d-flex flex-wrap align-items-center">
            <span className="me-1">{post?.oAuthor?.sName}</span>
            {
              post?.oAuthor?.bVerified && <img src={`${S3_PREFIX}static/twitter/verified_badge.svg`} className='twitterVerified mb-0' alt="verified" width="15" height="15" loading="lazy" />
            }
            </div>
            <span className="tweetProfile text-secondary mb-0">@{post?.oAuthor?.sUsername}</span>
          </div>
        </div>
        <div className="twitterLogo">
          <img src={`${S3_PREFIX}static/twitter/twitter_logo.svg`} alt="twitter-logo" width="20" height="20" layout="fixed" loading="lazy" />
        </div>
      </div>
      <div className="tweetBody my-3">
      {
        post?.sHtml && <div dangerouslySetInnerHTML={{ __html: post?.sHtml }} />
      }
        {/* ADD attribute if GIF:" autoPlay muted loop And remove controls */}
        {/* Add class only as per images Count: "imgCount1, imgCount2", ....  */}
        {
          post?.aMedia?.length > 0 && <div className={`imgCount${post?.aMedia?.length} tweetImgList d-flex flex-wrap justify-content-between my-3 overflow-hidden`}>
            {
              post?.aMedia?.map((image, index) => {
                if (image?.eType === 'video' || image?.eType === 'animated_gif') {
                  const isAnimatedGif = image?.eType === 'animated_gif'
                  return <div key={index} className="tweetVideoBlock my-3 overflow-hidden">
                          <video
                            preload="none"
                            className="tweetImg tweetVideo d-flex w-100 d-block flex-grow-1"
                            autoPlay={isAnimatedGif}
                            muted={isAnimatedGif}
                            loop={isAnimatedGif}
                            poster={image?.sPosterUrl}
                            controls={!isAnimatedGif}
                          >
                            <source src={image?.sUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                } else {
                  return <img key={index} className='tweetImg flex-grow-1 d-block' src={image?.sUrl} alt="tweet-post" loading="lazy" />
                }
              })
            }
          </div>
        }
      </div>
      <div className="tweetFooter d-flex align-items-center">
        <span className="tweetFooterItem tweetLike mb-0 d-flex align-items-center me-3">
          <img className="tweetFooterIcon mb-0 tLikeIcon" src={`${S3_PREFIX}static/twitter/like_heart.svg`} loading="lazy" alt="like" width="16" height="16" layout="fixed" />
          <span className="tweetCount ms-1">{post?.oPublicMetrics?.nLikes}</span>
        </span>
        <div className="tweetFooterItem tweetRetweet mb-0 d-flex align-items-center me-3">
          <img className="tweetFooterIcon mb-0 tRetweetIcon" src={`${S3_PREFIX}static/twitter/retweet.svg`} alt="retweet" width="16" height="16" layout="fixed" loading="lazy" />
          <span className="tweetCount ms-1">{post?.oPublicMetrics?.nRetweet}</span>
        </div>
      </div>
    </div>
  )
}

CustomTweet.propTypes = {
  type: PropTypes.string,
  categoryId: PropTypes.string,
  articleId: PropTypes.string,
  post: PropTypes.object
}

export default CustomTweet
