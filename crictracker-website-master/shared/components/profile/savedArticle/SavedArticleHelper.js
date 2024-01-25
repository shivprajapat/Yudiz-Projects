import React, { useContext, useEffect, useRef, useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import dynamic from 'next/dynamic'
import { Col, Row, Button } from 'react-bootstrap'
import useTranslation from 'next-translate/useTranslation'

import { REMOVE_BOOKMARK } from '@graphql/article/article.mutation'
import { SAVED_ARTICLES } from '@graphql/profile/profile.query'
import ArticleSmall from '@shared/components/article/articleSmall'
import ToastrContext from '@shared-components/toastr/ToastrContext'
import { TOAST_TYPE } from '@shared/constants'
import profileStyles from '../profile-style.module.scss'
import styles from './style.module.scss'
import GlobalEventsContext from '@shared/components/global-events/GlobalEventsContext'

const NoData = dynamic(() => import('@shared/components/noData'), { ssr: false })
const ConfirmationModal = dynamic(() => import('@shared/components/confirmationModal'))

function SavedArticleHelper() {
  const { t } = useTranslation()
  const deleteId = useRef()
  const { dispatch } = useContext(ToastrContext)
  const [savedArticles, setSavedArticles] = useState()
  const [getSavedArticle, { data: savedArticlesData }] = useLazyQuery(SAVED_ARTICLES, {
    fetchPolicy: 'network-only'
  })
  const [isConfirm, setIsConfirm] = useState(false)
  const closeConfirm = () => setIsConfirm(!isConfirm)
  const { stateGlobalEvents, dispatchGlobalEvents: editProfileEvent } = useContext(GlobalEventsContext)

  const handleConfirm = (id) => {
    if (!isConfirm) {
      deleteId.current = id
      setIsConfirm(!isConfirm)
    } else {
      setIsConfirm(!isConfirm)
      handleBookmark(deleteId.current)
    }
  }

  useEffect(() => {
    if (savedArticlesData) {
      setSavedArticles(savedArticlesData?.listBookmarks?.aResults)
    }
  }, [savedArticlesData])

  useEffect(() => {
    getSavedArticle({
      variables: {
        input: {
          nLimit: 10,
          nSkip: 0
        }
      }
    })
  }, [])

  const [removeBookmark] = useMutation(REMOVE_BOOKMARK, {
    onCompleted: (data) => {
      if (data && data.deleteBookmark) {
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.deleteBookmark.sMessage, type: TOAST_TYPE.Success }
        })
        editProfileEvent({
          type: 'CHANGE_PROFILE',
          payload: { profileData: { ...stateGlobalEvents.profileData, nBookmarkCount: stateGlobalEvents.profileData.nBookmarkCount - 1 } }
        })
        setIsConfirm(false)
      }
    }
  })

  const handleBookmark = async (articleId) => {
    const deleteData = await removeBookmark({ variables: { input: { _id: articleId } } })
    if (deleteData?.data?.deleteBookmark) {
      setSavedArticles(savedArticles.filter((article) => article?._id !== articleId))
    }
  }

  function getArticleData(article) {
    if (article.eBookmarkType === 'ar') {
      const data = { ...article.oArticle }
      data.oCategory = article.oCategory
      return data
    } else if (article.eBookmarkType === 'fa') {
      const data = { ...article.oFantasyArticle }
      data.oCategory = article.oCategory
      return data
    } else if (article.eBookmarkType === 'v') {
      const data = { ...article.oVideo }
      data.oCategory = article.oCategory
      return data
    }
  }

  return (
    <div className={`${profileStyles.profileInner} flex-grow-1`}>
      <Row className="justify-content-center">
        <Col xl={10}>
          <h3>
            {t('common:SavedArticles')} ({savedArticles?.length})
          </h3>
          <div className={styles.articlesList}>
            {savedArticles?.map((article) => {
              return (
                <div key={article?._id} className={`${styles.item} position-relative`}>
                  <ArticleSmall data={getArticleData(article)} isVideo={article?.oVideo?._id && true} />
                  <Button variant="link" onClick={() => handleConfirm(article?._id)} className={`${styles.closeMenu} btn-close position-absolute`}></Button>
                </div>
              )
            })}
            {savedArticles?.length === 0 && <NoData />}
          </div>
        </Col>
      </Row>
      <ConfirmationModal isConfirm={isConfirm} handleConfirm={handleConfirm} closeConfirm={closeConfirm} />
    </div>
  )
}

export default SavedArticleHelper
