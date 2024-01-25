import React, { useContext, useEffect, useState, useRef } from 'react'
import { Button, Dropdown } from 'react-bootstrap'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { useLazyQuery, useMutation } from '@apollo/client'
import useTranslation from 'next-translate/useTranslation'

import styles from './style.module.scss'
import { GET_BOOKMARK_DETAILS, GET_USER_CLAP, GET_USER_FANTASY_CLAP } from '@graphql/article/article.query'
import { ToastrContext } from '@shared/components/toastr'
import { ADD_BOOKMARK, ADD_CLAP, ADD_FANTASY_CLAP, REMOVE_BOOKMARK } from '@graphql/article/article.mutation'
import { DOMAIN, TOAST_TYPE } from '@shared/constants'
import { getToken } from '@shared/libs/menu'
import { GlobalEventsContext } from '@shared/components/global-events'
import useModal from '@shared/hooks/useModal'
import bookmarkIcon from '@assets/images/icon/bookmark-theme-icon.svg'
import bookmarkOutlineIcon from '@assets/images/icon/bookmark-o-theme-icon.svg'
import clapIcon from '@assets/images/icon/clap-theme-icon.svg'
import commentIcon from '@assets/images/icon/comment-theme-icon.svg'
import shareIcon from '@assets/images/icon/share-theme-icon.svg'
import { useRouter } from 'next/router'
import { sendMobileWebViewEvent } from '@shared/utils'

const Comments = dynamic(() => import('@shared-components/comments'))
const SocialShareList = dynamic(() => import('@shared-components/socialShare/shareList'))
const LoginModal = dynamic(() => import('@shared/components/loginModal'))
const MyImage = dynamic(() => import('@shared/components/myImage'))
export default function ArticleActions({ article, type, seoData }) {
  const { t } = useTranslation()
  const router = useRouter()
  const previewImg = `${DOMAIN}images/CricTracker-Facebook-Preview.jpg`
  const { dispatch } = useContext(ToastrContext)
  const [currentClap, setCurrentClap] = useState(0)
  const [clapAnimation, setClapAnimation] = useState()
  const [showComments, setShowComments] = useState(false)
  const [isNativeShare, setIsNativeShare] = useState(false)
  const [commentCount, setCommentCount] = useState(article?.nCommentCount || 0)
  const [isBookmark, setIsBookmark] = useState(false)
  const bookmarkId = useRef()
  const nTotalClap = useRef(article?.nClaps)
  const { isShowing, toggle } = useModal()
  const { stateGlobalEvents, dispatchGlobalEvents: editGlobalEvent } = useContext(GlobalEventsContext)

  const [getUserClap, { data: clapCount }] = useLazyQuery(GET_USER_CLAP, {
    fetchPolicy: 'network-only'
  })
  const [getUserFantasyClap, { data: clapFantasyCount }] = useLazyQuery(GET_USER_FANTASY_CLAP, {
    fetchPolicy: 'network-only'
  })
  const [getBookmarkDetails] = useLazyQuery(GET_BOOKMARK_DETAILS, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data && data.getBookmarks) {
        setIsBookmark(data?.getBookmarks?.bIsBookmarked)
        bookmarkId.current = data?.getBookmarks?._id
      }
    }
  })

  const [addClap] = useMutation(ADD_CLAP)
  const [addFantasyClap] = useMutation(ADD_FANTASY_CLAP)

  const [addBookmark] = useMutation(ADD_BOOKMARK, {
    onCompleted: (data) => {
      if (data && data.addUserBookmark) {
        bookmarkId.current = data.addUserBookmark?._id
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.addUserBookmark.sMessage, type: TOAST_TYPE.Success }
        })
        editGlobalEvent({
          type: 'CHANGE_PROFILE',
          payload: { profileData: { ...stateGlobalEvents.profileData, nBookmarkCount: stateGlobalEvents.profileData.nBookmarkCount + 1 } }
        })
      }
    }
  })

  const [removeBookmark] = useMutation(REMOVE_BOOKMARK, {
    onCompleted: (data) => {
      if (data && data.deleteBookmark) {
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.deleteBookmark.sMessage, type: TOAST_TYPE.Success }
        })
        editGlobalEvent({
          type: 'CHANGE_PROFILE',
          payload: { profileData: { ...stateGlobalEvents.profileData, nBookmarkCount: stateGlobalEvents.profileData.nBookmarkCount - 1 } }
        })
      }
    }
  })

  function handleClap() {
    const t = getToken()
    if (t && t !== 'undefined') {
      setClapAnimation(false)
      setTimeout(() => {
        setClapAnimation(true)
      }, 100)
      if (currentClap < 5) {
        nTotalClap.current++
        if (article?.oSeo?.eType === 'ar') {
          addClap({ variables: { input: { iArticleId: article?._id } } })
        } else {
          addFantasyClap({ variables: { input: { iArticleId: article?._id } } })
        }
        setCurrentClap(currentClap + 1)
      }
    } else {
      if (router.query.isMobileWebView) {
        sendMobileWebViewEvent('notLoggedIn')
      } else {
        toggle()
      }
    }
  }

  function handleBookmark() {
    const t = getToken()
    if (t && t !== 'undefined') {
      if (isBookmark) {
        removeBookmark({ variables: { input: { _id: bookmarkId.current } } })
        setIsBookmark(false)
      } else {
        addBookmark({ variables: { input: { eBookmarkType: article?.oSeo?.eType, iArticleId: article?._id } } })
        setIsBookmark(true)
      }
    } else {
      if (router.query.isMobileWebView) {
        sendMobileWebViewEvent('notLoggedIn')
      } else {
        toggle()
      }
    }
  }
  useEffect(() => {
    if (stateGlobalEvents) {
      setCommentCount(stateGlobalEvents?.commentCount)
    }
  }, [stateGlobalEvents])

  useEffect(() => {
    const t = getToken()
    if (t && t !== 'undefined') {
      if (article?.oSeo?.eType === 'ar') {
        getUserClap({ variables: { input: { iArticleId: article?._id } } })
      } else {
        getUserFantasyClap({ variables: { input: { iArticleId: article?._id } } })
      }
      getBookmarkDetails({ variables: { input: { iId: article?._id, eType: article?.oSeo?.eType } } })
    }
  }, [])

  useEffect(() => {
    clapCount && setCurrentClap(clapCount?.getUserArticleClap?.nTotalClap)
  }, [clapCount])

  useEffect(() => {
    clapFantasyCount && setCurrentClap(clapFantasyCount?.getUserFantasyArticleClap?.nTotalClap)
  }, [clapFantasyCount])

  useEffect(() => {
    if (navigator.share) {
      setIsNativeShare(true)
    } else {
      setIsNativeShare(false)
    }
  }, [])

  async function nativeShare() {
    const url = `${DOMAIN}${seoData?.sSlug}`
    const title = seoData?.sTitle || article?.sTitle
    const postImg = article?.oImg?.sUrl ? `${DOMAIN}${article?.oImg?.sUrl}` : previewImg
    try {
      await navigator
        .share({
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
      <div className={`${styles.shareList} d-flex align-items-start justify-content-center mb-2 mb-md-4`}>
        <Button
          variant="link"
          title={t('common:Claps')}
          className={`${styles.item} ${styles.clap} ${clapAnimation && styles.active
            } d-flex justify-content-center align-items-center position-relative`}
          onClick={handleClap}
        >
          <span className={`${styles.icon} d-block`}>
            <MyImage src={clapIcon} alt="clap" layout="responsive" />
          </span>
          {nTotalClap.current}
          <span className={`${styles.currentClap} d-block text-center bg-secondary text-light rounded-circle`}>
            {currentClap ? `${currentClap}` : ''}
          </span>
        </Button>
        {article?.oAdvanceFeature?.bAllowComments && (
          <Button
            variant="link"
            title={t('common:Comments')}
            className={`${styles.item} d-flex justify-content-center align-items-center `}
            onClick={() => setShowComments(!showComments)}
          >
            <span className={`${styles.icon} d-block`}>
              <MyImage src={commentIcon} alt="comment" layout="responsive" />
            </span>
            {commentCount}
          </Button>
        )}
        {
          isNativeShare ? <Button variant="link" onClick={() => nativeShare()} className={`${styles.item} ${styles.share} d-flex justify-content-center align-items-center mx-auto`}>
            <span className={`${styles.icon} d-block mx-auto`}>
              <MyImage src={shareIcon} alt="share" layout="responsive" />
            </span></Button> : <Dropdown>
            <Dropdown.Toggle variant="link" title={t('common:Share')} id="dropdown-basic" className={`${styles.item} ${styles.share} d-flex justify-content-center align-items-center mx-auto`}>
              <span className={`${styles.icon} d-block mx-auto`}>
                <MyImage src={shareIcon} alt="share" layout="responsive" />
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu align={{ lg: 'start' }} className={`${styles.socialShareMenu}`} >
              <SocialShareList seoData={seoData} />
            </Dropdown.Menu>
          </Dropdown>
        }
        <Button title={t('common:Bookmark')} variant="link" className={`${styles.item} ${styles.bookmark} ${isBookmark && styles.active}`} onClick={handleBookmark}>
          <span className={`${styles.icon} d-block mx-auto`}>
            <MyImage src={isBookmark ? bookmarkIcon : bookmarkOutlineIcon} alt="bookmark" layout="responsive" />
          </span>
        </Button>
        {/* <Button variant="link" className={styles.item}>
          <span className={`${styles.icon} d-block mx-auto`}>
            <BigTextIcon />
          </span>
        </Button> */}
      </div>
      {showComments && (
        <Comments
          type={type}
          showComments={showComments}
          handleComments={() => setShowComments(!showComments)}
          articleId={article?._id}
          count={article?.nCommentCount}
          isRequireAdminApproval={article?.oAdvanceFeature?.bRequireAdminApproval}
        />
      )}
      {isShowing && <LoginModal isConfirm={isShowing} closeConfirm={toggle} />}
    </>
  )
}

ArticleActions.propTypes = {
  article: PropTypes.object,
  type: PropTypes.string,
  seoData: PropTypes.object
}
