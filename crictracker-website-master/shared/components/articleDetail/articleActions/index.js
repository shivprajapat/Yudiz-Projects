import React, { useContext, useEffect, useState, useRef } from 'react'
import { Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { useLazyQuery, useMutation } from '@apollo/client'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'

import styles from './style.module.scss'
import { GET_BOOKMARK_DETAILS, UPDATE_NEWS_ARTICLE_VIEWS, UPDATE_FANTASY_ARTICLE_VIEWS } from '@graphql/article/article.query'
import ToastrContext from '@shared/components/toastr/ToastrContext'
import { ADD_BOOKMARK, REMOVE_BOOKMARK } from '@graphql/article/article.mutation'
import { TOAST_TYPE } from '@shared/constants'
import GlobalEventsContext from '@shared/components/global-events/GlobalEventsContext'
import useModal from '@shared/hooks/useModal'
import bookmarkIcon from '@assets/images/icon/bookmark-theme-icon.svg'
import bookmarkOutlineIcon from '@assets/images/icon/bookmark-o-theme-icon.svg'
import clapIcon from '@assets/images/icon/clap-theme-icon.svg'
import commentIcon from '@assets/images/icon/comment-theme-icon.svg'
import shareIcon from '@assets/images/icon/share-theme-icon.svg'
import textBigIcon from '@assets/images/icon/big-text-theme-icon.svg'
import textSmallIcon from '@assets/images/icon/small-text-theme-icon.svg'
import { getCookie, sendMobileWebViewEvent } from '@shared/utils'
import { getToken } from '@shared/libs/token'

const Comments = dynamic(() => import('@shared-components/comments'))
const LoginModal = dynamic(() => import('@shared/components/loginModal'))
const MyImage = dynamic(() => import('@shared/components/myImage'))
const NativeShare = dynamic(() => import('@shared/components/socialShare/nativeShare'))
const CtToolTip = dynamic(() => import('@shared/components/ctToolTip'))

export default function ArticleActions({ article, type, seoData, currentClap, setCurrentClap, totalClaps, commentCount, setCommentCount, showComments, setShowComments, handleAddClap }) {
  const { t } = useTranslation()
  const router = useRouter()
  const { dispatch } = useContext(ToastrContext)
  const [fontSize, setFontSize] = useState()
  const [clapAnimation, setClapAnimation] = useState()
  const [isBookmark, setIsBookmark] = useState(false)
  const bookmarkId = useRef()
  const { isShowing, toggle } = useModal()
  const { stateGlobalEvents, dispatchGlobalEvents: editGlobalEvent } = useContext(GlobalEventsContext)
  const isMobileWebView = router.query.isMobileWebView

  const [getBookmarkDetails] = useLazyQuery(GET_BOOKMARK_DETAILS, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data && data.getBookmarks) {
        setIsBookmark(data?.getBookmarks?.bIsBookmarked)
        bookmarkId.current = data?.getBookmarks?._id
      }
    }
  })

  const [updateNewsArticleViews] = useMutation(UPDATE_NEWS_ARTICLE_VIEWS)
  const [updateFantasyArticleViews] = useMutation(UPDATE_FANTASY_ARTICLE_VIEWS)

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
    setClapAnimation(false)
    setTimeout(() => {
      setClapAnimation(true)
    }, 100)
    handleAddClap()
  }

  function handleBookmark() {
    const t = getToken()
    if (t && t !== 'undefined' && t !== 'null') {
      if (isBookmark) {
        removeBookmark({ variables: { input: { _id: bookmarkId.current } } })
        setIsBookmark(false)
      } else {
        addBookmark({ variables: { input: { eBookmarkType: article?.oSeo?.eType, iArticleId: article?._id } } })
        setIsBookmark(true)
      }
    } else {
      if (isMobileWebView) {
        sendMobileWebViewEvent('notLoggedIn')
      } else {
        toggle()
      }
    }
  }

  useEffect(() => {
    if (article?.oSeo?.eType === 'ar') {
      // getNewsArticleClap()
      updateNewsArticleViews({ variables: { input: { _id: article?._id } } })
    } else {
      // getFantasyArticleClap()
      updateFantasyArticleViews({ variables: { input: { _id: article?._id } } })
    }
  }, [])

  useEffect(() => {
    const t = getToken()
    if (t && t !== 'undefined' && t !== 'null') {
      getBookmarkDetails({ variables: { input: { iId: article?._id, eType: article?.oSeo?.eType } } })
    } else {
      setCurrentClap(Number(getCookie(article._id)))
    }
  }, [article])

  const handleFont = (type) => {
    const element = document?.getElementById('content')
    const computedFontSize = element && window?.getComputedStyle(element)?.fontSize // Get the computed font size
    const currentFontSize = parseFloat(computedFontSize || 18) // Parse the font size value as a float
    if (type === 'inc') {
      setFontSize(currentFontSize + 1)
      const newFontSize = currentFontSize + 1 // Increase the font size by 2 pixels
      element.style.fontSize = newFontSize + 'px'
    }
    if (type === 'dec') {
      setFontSize(currentFontSize + -1)
      const newFontSize = currentFontSize - 1 // Increase the font size by 2 pixels
      element.style.fontSize = newFontSize + 'px'
    }
  }

  return (
    <>
      <div className={`${styles.shareList} d-flex align-items-start justify-content-center mb-2 mb-md-3`}>
        {((article?.oSeo?.eType === 'ar' && article?.oAdvanceFeature?.bAllowLike) || (article?.oSeo?.eType === 'fa')) && (
          <CtToolTip tooltip={t('common:Claps')}>
            <Button
              variant="link"
              className={`${styles.item} ${styles.clap} ${clapAnimation ? styles.active : ''} ${currentClap > 0 ? styles.liked : ''} d-flex justify-content-center align-items-center position-relative`}
              onClick={handleClap}
            >
              <span className={`${styles.icon} d-block`}>
                <MyImage src={clapIcon} alt="clap" layout="responsive" />
              </span>
              <span className="ms-2">{totalClaps}</span>
              <span className={`${styles.currentClap} d-block text-center position-absolute start-50 bg-secondary rounded-circle c-transition`}>
                {currentClap ? `${currentClap}` : ''}
              </span>
            </Button>
          </CtToolTip>
        )}
        {article?.oAdvanceFeature?.bAllowComments && (
          <CtToolTip tooltip={t('common:Comments')}>
            <Button
              variant="link"
              className={`${styles.item} d-flex justify-content-center align-items-center `}
              onClick={() => setShowComments(!showComments)}
            >
              <span className={`${styles.icon} d-block`}>
                <MyImage src={commentIcon} alt="comment" layout="responsive" />
              </span>
              <span className="ms-2">{commentCount}</span>
            </Button>
          </CtToolTip>
        )}
        {
          isMobileWebView ? (
            <CtToolTip tooltip={t('common:Share')}>
              <Button variant="link" className={`${styles.item} ${styles.share} d-flex justify-content-center align-items-center mx-auto`}>
                <span onClick={() => sendMobileWebViewEvent('share')} className={`${styles.icon} d-block mx-auto`}>
                  <MyImage src={shareIcon} alt="share" layout="responsive" />
                </span>
              </Button>
            </CtToolTip>
          ) : (
            <NativeShare seoData={seoData} article={article} buttonClass={`${styles.item} ${styles.share} d-flex justify-content-center align-items-center mx-auto`} dropDownMenuClassName={`${styles.socialShareMenu}`} align={{ lg: 'start' }}>
              <span className={`${styles.icon} d-block mx-auto`}>
                <MyImage src={shareIcon} alt="share" layout="responsive" />
              </span>
            </NativeShare>
          )
        }
        <CtToolTip tooltip={t('common:Bookmark')}>
          <Button title={t('common:Bookmark')} variant="link" className={`${styles.item} ${styles.bookmark} ${isBookmark && styles.active}`} onClick={handleBookmark}>
            <span className={`${styles.icon} d-block mx-auto`}>
              <MyImage src={isBookmark ? bookmarkIcon : bookmarkOutlineIcon} alt="bookmark" layout="responsive" />
            </span>
          </Button>
        </CtToolTip>
        {
          seoData?.eType === 'ar' && (
            <>
              <CtToolTip tooltip={t('common:IncreaseText')}>
                <Button disabled={fontSize >= 22} onClick={() => handleFont('inc')} variant="link" id="dropdown-basic" className={`${styles.item} ${styles.dropdownItem}`}>
                  <span className={`${styles.icon} d-block mx-auto`}>
                    <MyImage src={textBigIcon} alt="text big" layout="responsive" />
                  </span>
                </Button>
              </CtToolTip>
              <CtToolTip tooltip={t('common:DecreaseText')}>
                <Button disabled={fontSize <= 12} onClick={() => handleFont('dec')} variant="link" id="dropdown-basic" className={`${styles.item} ${styles.dropdownItem}`}>
                  <span className={`${styles.icon} d-block mx-auto`}>
                    <MyImage src={textSmallIcon} alt="text small" layout="responsive" />
                  </span>
                </Button>
              </CtToolTip>
            </>
          )
        }
      </div >
      {showComments && (
        <Comments
          type={type}
          showComments={showComments}
          commentCount={commentCount}
          setCommentCount={setCommentCount}
          handleComments={() => setShowComments(!showComments)}
          articleId={article?._id}
          count={article?.nCommentCount}
          isRequireAdminApproval={article?.oAdvanceFeature?.bRequireAdminApproval}
        />
      )
      }
      {isShowing && <LoginModal isConfirm={isShowing} closeConfirm={toggle} />}
    </>
  )
}

ArticleActions.propTypes = {
  article: PropTypes.object,
  type: PropTypes.string,
  seoData: PropTypes.object,
  currentClap: PropTypes.number,
  setCurrentClap: PropTypes.func,
  totalClaps: PropTypes.number,
  // setTotalClaps: PropTypes.func,
  commentCount: PropTypes.number,
  setCommentCount: PropTypes.func,
  // getNewsArticleClap: PropTypes.func,
  // getFantasyArticleClap: PropTypes.func,
  // getUserClap: PropTypes.func,
  // getUserFantasyClap: PropTypes.func,
  // addNewsClap: PropTypes.func,
  // addFantasyClap: PropTypes.func,
  showComments: PropTypes.bool,
  setShowComments: PropTypes.func,
  handleAddClap: PropTypes.func
}
