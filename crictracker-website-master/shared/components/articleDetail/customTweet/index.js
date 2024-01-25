import React from 'react'
import PropTypes from 'prop-types'
import TweetHead from './tweetHead'
import TweetBody from './tweetBody'
import { abbreviateNumber } from '@shared/utils'
import { S3_PREFIX } from '@shared/constants'
function CustomTweet() {
  const post = {
    sTweetId: '1616307291732729857',
    sUrl: 'https://twitter.com/elonmusk/status/1616307291732729857',
    oAuthor: {
      sName: 'Elon Musk',
      bVerified: true,
      sUsername: 'elonmusk',
      sProfilePic: 'https://pbs.twimg.com/profile_images/1590968738358079488/IY9Gx6Ok_normal.jpg',
      sId: '44196397'
    },
    oPublicMetrics: {
      nRetweet: 1557,
      nLikes: 22489
    },
    sContent: '@mualphaxi The pendulum has swung a bit too far',
    aMedia: [],
    aReferencedTweets: [
      {
        type: 'replied_to',
        id: '1616074339480371201'
      }
    ],
    dCreatedAt: '2023-01-20T05:31:02.000Z',
    sHtml: "<a href='https://twitter.com/mualphaxi'>@mualphaxi</a> The pendulum has swung a bit too far",
    oReferenceTweet: {
      sTweetId: '1616074339480371201',
      sUrl: 'https://twitter.com/mualphaxi/status/1616074339480371201',
      oAuthor: {
        sName: 'Maxwell Meyer',
        bVerified: false,
        sUsername: 'mualphaxi',
        sProfilePic: 'https://pbs.twimg.com/profile_images/1559281629494902785/qitavcZe_normal.jpg',
        sId: '968875021753036800'
      },
      oPublicMetrics: {
        nRetweet: 1364,
        nLikes: 10033
      },
      sContent: 'The gay movement, in about 7 years, went from “equal rights!” to “go f***ing die in a trench war if you don’t wear a pride shirt!” https://t.co/5U8rXIi48i',
      aMedia: [],
      aReferencedTweets: [
        {
          type: 'quoted',
          id: '1615866427797389313'
        }
      ],
      dCreatedAt: '2023-01-19T14:05:22.000Z',
      sHtml: "The gay movement, in about 7 years, went from “equal rights!” to “go f***ing die in a trench war if you don’t wear a pride shirt!” <a href='https://twitter.com/claytravis/status/1615866427797389313'>twitter.com/claytravis/sta…</a>",
      oReferenceTweet: {
        eType: 'quoted',
        sTweetId: '1615866427797389313',
        sUrl: 'https://twitter.com/ClayTravis/status/1615866427797389313',
        oAuthor: {
          sName: 'Clay Travis',
          bVerified: true,
          sUsername: 'ClayTravis',
          sProfilePic: 'https://pbs.twimg.com/profile_images/668983225860034564/PIdSf23G_normal.jpg',
          sId: '50772918'
        },
        oPublicMetrics: {
          nRetweet: 3993,
          nLikes: 26259
        },
        sContent: 'NHL analyst says on the NHL Network! that if Philly Flyers Provorov doesn’t want to wear a pro-LBGTQ uniform he should leave America, go back to Russia, and fight in the war against Ukraine. The tolerant left! Holy shit:',
        aMedia: [
          {
            eType: 'video',
            sUrl: 'https://video.twimg.com/ext_tw_video/1615865331645300737/pu/vid/1280x720/mCvFqi8neZt13BiN.mp4?tag=12',
            sPosterUrl: 'https://pbs.twimg.com/ext_tw_video_thumb/1615865331645300737/pu/img/dmvYTvErdjf3a7Xg.jpg'
          }
        ],
        dCreatedAt: '2023-01-19T00:19:12.000Z',
        sShortUrl: 'https://t.co/wWLFBy2stC',
        sHtml: 'NHL analyst says on the NHL Network! that if Philly Flyers Provorov doesn’t want to wear a pro-LBGTQ uniform he should leave America, go back to Russia, and fight in the war against Ukraine. The tolerant left! Holy shit:'
      },
      eType: 'replied_to'
    }
  }
  const isRepliedPost = post?.oReferenceTweet?.eType === 'replied_to'
  return (
    <div className="ctTweet p-3 p-md-4 my-3 mx-auto mceNonEditable border">
    {
      isRepliedPost && <>
        <TweetHead
          authorData={post?.oReferenceTweet?.oAuthor}
          showLogo={isRepliedPost}
          isRepliedPost={isRepliedPost}
        />
        <TweetBody
          postContent={post?.oReferenceTweet?.sContent}
          media={post?.oReferenceTweet?.aMedia}
          isRepliedPost={isRepliedPost}
          isQuoted={post?.oReferenceTweet?.oReferenceTweet?.eType === 'quoted'}
          quotedPost={post?.oReferenceTweet?.oReferenceTweet}
        />
      </>
    }
      <TweetHead
        authorData={post?.oAuthor}
        showLogo={post?.oReferenceTweet?.eType !== 'replied_to'}
      />
      <TweetBody
        postContent={post?.sHtml}
        media={post?.aMedia}
        isQuoted={post?.oReferenceTweet?.eType === 'quoted'}
        quotedPost={post?.oReferenceTweet}
      />
      <div className="tweetFooter d-flex align-items-center">
        <span className="tweetFooterItem tweetLike mb-0 d-flex align-items-center me-3">
          <img className="tweetFooterIcon tLikeIcon mb-0" src={`${S3_PREFIX}static/twitter/like_heart.svg`} alt="like" width="20" height="20" layout="fixed" />
          <span className="tweetCount ms-1">{abbreviateNumber(post?.oPublicMetrics?.nLikes)}</span>
        </span>
        <span className="tweetFooterItem tweetRetweet mb-0 d-flex align-items-center me-3">
          <img className="tweetFooterIcon tRetweetIcon mb-0" src={`${S3_PREFIX}static/twitter/retweet.svg`} alt="retweet" width="20" height="20" layout="fixed" />
          <span className="tweetCount ms-1">{abbreviateNumber(post?.oPublicMetrics?.nRetweet)}</span>
        </span>
      </div>
    </div>
  )
}

CustomTweet.propTypes = {
  type: PropTypes.string,
  data: PropTypes.object,
  categoryId: PropTypes.string,
  articleId: PropTypes.string
}

export default CustomTweet
