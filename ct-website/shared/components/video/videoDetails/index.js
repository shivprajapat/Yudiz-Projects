import React, { useContext, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Container, Row, Col, Button, Dropdown } from 'react-bootstrap'
import { useLazyQuery, useMutation } from '@apollo/client'
import useTranslation from 'next-translate/useTranslation'
import Trans from 'next-translate/Trans'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import videoStyles from '@assets/scss/pages/video.module.scss'
import BreadcrumbNav from '@shared-components/breadcrumbNav'
import { ShareIcon, SaveIcon } from '@shared-components/ctIcons'
import { pageLoading } from '@shared/libs/allLoader'
import { getCurrentUser, getToken } from '@shared/libs/menu'
import { GET_BOOKMARK_DETAILS } from '@graphql/article/article.query'
import { ADD_BOOKMARK, REMOVE_BOOKMARK } from '@graphql/article/article.mutation'
import { ToastrContext } from '@shared/components/toastr'
import { TOAST_TYPE } from '@shared/constants'
import { GlobalEventsContext } from '@shared/components/global-events'

const ArticleGrid = dynamic(() => import('@shared-components/article/articleGrid'), { loading: () => pageLoading() })
const SocialShareList = dynamic(() => import('@shared-components/socialShare/shareList'))

const VideoDetails = ({ videoData, videoList }) => {
  const { t } = useTranslation()
  const { dispatch } = useContext(ToastrContext)
  const [isBookmark, setIsBookmark] = useState(false)
  const bookmarkId = useRef()
  const { stateGlobalEvents, dispatchGlobalEvents: editProfileEvent } = useContext(GlobalEventsContext)
  const [getBookmarkDetails] = useLazyQuery(GET_BOOKMARK_DETAILS, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data && data.getBookmarks) {
        setIsBookmark(data?.getBookmarks?.bIsBookmarked)
        bookmarkId.current = data?.getBookmarks?._id
      }
    }
  })

  useEffect(() => {
    if (getToken()) {
      getBookmarkDetails({ variables: { input: { iId: videoData?._id, eType: 'v' } } })
    }
  }, [])

  const [removeBookmark] = useMutation(REMOVE_BOOKMARK, {
    fetchPolicy: 'network-only',
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
      }
    }
  })

  const [addBookmark] = useMutation(ADD_BOOKMARK, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data && data.addUserBookmark) {
        bookmarkId.current = data.addUserBookmark?._id
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.addUserBookmark.sMessage, type: TOAST_TYPE.Success }
        })
        editProfileEvent({
          type: 'CHANGE_PROFILE',
          payload: { profileData: { ...stateGlobalEvents.profileData, nBookmarkCount: stateGlobalEvents.profileData.nBookmarkCount + 1 } }
        })
      }
    }
  })

  function handleBookmark() {
    if (getCurrentUser()) {
      if (isBookmark) {
        removeBookmark({ variables: { input: { _id: bookmarkId.current } } })
        setIsBookmark(false)
      } else {
        addBookmark({ variables: { input: { eBookmarkType: 'v', iVideoId: videoData?._id } } })
        setIsBookmark(true)
      }
    } else {
      login()
    }
  }

  function login() {
    dispatch({
      type: 'SHOW_TOAST',
      payload: { message: <Trans i18nKey="common:YouAreNotLogin" />, type: TOAST_TYPE.Error }
    })
  }

  return (
    <main>
      <iframe
        className={`${styles.videoMain} d-block`}
        src={`https://${videoData?.oPlayer?.sEmbedUrl}`}
        title={videoData?.sTitle}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <Container>
        <Row className={`${styles.videoDesc} d-flex justify-content-between align-items-start pt-3 pb-2`}>
          <Col xxl={9} lg={8}>
            <BreadcrumbNav />
            <h3 className="small-head mb-1">{videoData?.sTitle}</h3>
          </Col>
          <Col lg="auto" className={`${styles.btnBlock} d-flex align-items-center mb-3`}>
            {/* <Button className={`${styles.playlistBtn} theme-btn xsmall-btn text-center ps-0 pe-0 me-2 me-sm-3`}>
              <PlaylistIcon />
            </Button> */}
            <Dropdown>
              <Dropdown.Toggle
                variant="link"
                id="dropdown-basic"
                className={`${styles.outlineBtn} ${styles.share} theme-btn outline-btn outline-light xsmall-btn d-flex align-items-center text-uppercase me-2 me-sm-3`}
              >
                <ShareIcon />
                <Trans i18nKey="common:Share" />
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <SocialShareList />
              </Dropdown.Menu>
            </Dropdown>
            <Button
              className={`${styles.bookmark} ${styles.outlineBtn} ${isBookmark && styles.active} theme-btn outline-btn outline-light xsmall-btn d-flex align-items-center text-uppercase ms-auto`}
              onClick={handleBookmark}
            >
              <SaveIcon />
              {isBookmark ? <Trans i18nKey="common:Saved" /> : <Trans i18nKey="common:Save" />}
            </Button>
          </Col>
        </Row>
        <h4 className="text-muted font-semi">{t('common:RelatedVideos')}</h4>
        <Row className={videoStyles.videoList}>
          {videoList?.map((video) => {
            return (
              <Col key={video?._id} lg={3} md={4} sm={6} id={video?._id}>
                <ArticleGrid data={video} isVideo={true} />
              </Col>
            )
          })}
        </Row>
        {/* <section className="common-section pt-0">
            <div className={'mb-3 d-flex justify-content-between align-items-center'}>
              <h4 className="text-uppercase mb-0">IPL 2021</h4>
              <Link href="/">
                <a className={`${videoStyles.link} text-primary font-bold text-uppercase`}>View All</a>
              </Link>
            </div>
            <Row className="scroll-list article-grid-list flex-nowrap">
              <Col lg={3} md={4} sm={5} xs="auto">
                <ArticleGrid
                  title={'ICC CEO Lauds NZ\'s " Skill And Temperament " In WTC Final Win Against India'}
                  category="1:12"
                  isVideo={true}
                  imgURL={postImg}
                />
              </Col>
              <Col lg={3} md={4} sm={5} xs="auto">
                <ArticleGrid
                  title={'ICC CEO Lauds NZ\'s " Skill And Temperament " In WTC Final Win Against India'}
                  category="1:12"
                  isVideo={true}
                  imgURL={postImg}
                />
              </Col>
              <Col lg={3} md={4} sm={5} xs="auto">
                <ArticleGrid
                  title={'ICC CEO Lauds NZ\'s " Skill And Temperament " In WTC Final Win Against India'}
                  category="1:12"
                  isVideo={true}
                  imgURL={postImg}
                />
              </Col>
              <Col lg={3} md={4} sm={5} xs="auto" className="align-self-center">
                <div className={videoStyles.adsItem}>
                  <MyImage src={ads1} alt="post" placeholder="blur" layout="responsive" />
                </div>
              </Col>
            </Row>
          </section>
          <section className="common-section pt-0">
            <div className={'mb-3 d-flex justify-content-between align-items-center'}>
              <h4 className="text-uppercase mb-0">News Flash</h4>
              <Link href="/">
                <a className={`${videoStyles.link} text-primary font-bold text-uppercase`}>View All</a>
              </Link>
            </div>
            <Row className="scroll-list article-grid-list flex-nowrap">
              <Col lg={3} md={4} sm={5} xs="auto">
                <ArticleGrid
                  title={'ICC CEO Lauds NZ\'s " Skill And Temperament " In WTC Final Win Against India'}
                  category="1:12"
                  isVideo={true}
                  imgURL={postImg}
                />
              </Col>
              <Col lg={3} md={4} sm={5} xs="auto">
                <ArticleGrid
                  title={'ICC CEO Lauds NZ\'s " Skill And Temperament " In WTC Final Win Against India'}
                  category="1:12"
                  isVideo={true}
                  imgURL={postImg}
                />
              </Col>
              <Col lg={3} md={4} sm={5} xs="auto">
                <ArticleGrid
                  title={'ICC CEO Lauds NZ\'s " Skill And Temperament " In WTC Final Win Against India'}
                  category="1:12"
                  isVideo={true}
                  imgURL={postImg}
                />
              </Col>
              <Col lg={3} md={4} sm={5} xs="auto" className="align-self-center">
                <div className={videoStyles.adsItem}>
                  <MyImage src={ads1} alt="post" placeholder="blur" layout="responsive" />
                </div>
              </Col>
            </Row>
          </section> */}
      </Container>
    </main>
  )
}

VideoDetails.propTypes = {
  videoList: PropTypes.array,
  videoData: PropTypes.object
}

export default VideoDetails
