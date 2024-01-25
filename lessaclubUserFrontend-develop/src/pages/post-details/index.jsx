import React, { useEffect, useRef, useState } from 'react'
import { Container, Button, Col, Row } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ReactPlayer from 'react-player'
import PermissionProvider from 'shared/components/permission-provider'

import { arrowBackIcon, userImg } from 'assets/images'
import './style.scss'
import { deletePost, getPostDetails } from 'modules/post/redux/service'
import { convertDateToLocaleString } from 'shared/utils'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { validationErrors } from 'shared/constants/validationErrors'
import { TOAST_TYPE } from 'shared/constants'
import { allRoutes } from 'shared/constants/allRoutes'
import MoreFromArtist from './components/more-from-artist'
import CommentSection from './components/comment-section'
import PostFooter from './components/post-footer'
import ConfirmationModal from 'shared/components/confirmation-modal'

const PostDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const userId = localStorage.getItem('userId')
  const navigate = useNavigate()
  const loading = useRef()

  const [postDetails, setPostDetails] = useState()
  const [show, setShow] = useState(false)

  const postDetailsStore = useSelector((state) => state.post.postDetails)
  const resError = useSelector((state) => state.post.resError)

  useEffect(() => {
    if (id) {
      dispatch(getPostDetails(id, { likedByLoggedInUser: true }))
    }
  }, [id])

  useEffect(() => {
    if (resError) {
      loading.current = false
    }
  }, [resError])

  useEffect(async () => {
    if (postDetailsStore?.communityAsset) {
      if (postDetailsStore?.communityAsset?.blogType === 2) {
        document.body.classList.add('global-loader')
        try {
          await fetch(postDetailsStore?.communityAsset?.contentUrl)
            .then((res) => res.text())
            .then((text) =>
              setPostDetails({
                ...postDetailsStore?.communityAsset,
                contentUrl: text
              })
            )
        } catch (err) {
          dispatch({
            type: SHOW_TOAST,
            payload: {
              message: err?.message || validationErrors.serverError,
              type: TOAST_TYPE.Error
            }
          })
        }
        document.body.classList.remove('global-loader')
      } else setPostDetails(postDetailsStore?.communityAsset)
    }
  }, [postDetailsStore])

  const handleConfirmation = () => {
    loading.current = true
    dispatch(
      deletePost(id, () => {
        loading.current = false
        navigate(allRoutes.community)
      })
    )
  }

  const toggleConfirmationModal = () => {
    setShow((prev) => !prev)
  }
  return (
    <>
      {show && (
        <ConfirmationModal
          show={show}
          handleConfirmation={handleConfirmation}
          handleClose={toggleConfirmationModal}
          loading={loading.current}
        />
      )}
      <section className="post-details section-padding">
        {postDetails && (
          <Container>
            <Row>
              <Col xxl={12} lg={11} className="mx-auto">
                <div className="back-arrow-box">
                  <Button className="back-btn" onClick={() => navigate(-1)}>
                    <img src={arrowBackIcon} />
                  </Button>
                  <h3 className="arrow-heading">{postDetails?.title}</h3>
                </div>
                <div className="post-description">
                  <p>{postDetails?.description}</p>
                </div>

                <div className="tab">
                  <img src={postDetails?.thumbNailUrl} className="img-fluid tab-banner" />

                  <div className="tab-user">
                    <div className="tab-user-box">
                      <img src={postDetails?.creator?.profilePicUrl || userImg} className="img-fluid" />
                      <div className="tab-user-box-desc">
                        <h6>{postDetails?.creator?.userName}</h6>
                        <p>{convertDateToLocaleString(postDetails?.updatedAt)}</p>
                      </div>
                    </div>
                    {postDetails?.creator?.id === userId ? (
                      <div>
                        <Button as={Link} to={allRoutes.editPost(id)} className="me-2 white-btn">
                          Edit
                        </Button>
                        <Button className="white-btn" onClick={toggleConfirmationModal}>
                          Delete
                        </Button>
                      </div>
                    ) : (
                      <>
                        <PermissionProvider>
                          <Button className="white-btn" onClick={toggleConfirmationModal}>
                            Delete
                          </Button>
                        </PermissionProvider>
                      </>
                    )}

                  </div>
                  <div className="tab-description">
                    {postDetails?.blogType === 2 ? (
                      <p dangerouslySetInnerHTML={{ __html: postDetails?.contentUrl }} />
                    ) : (
                      <ReactPlayer
                        config={{ file: { attributes: { controlsList: 'nodownload' } } }}
                        url={postDetails?.contentUrl}
                        controls={true}
                        width="100%"
                        height="100%"
                      />
                    )}
                  </div>
                </div>
                <PostFooter postDetails={postDetails} />
                {postDetails && <CommentSection communityId={postDetails?.community?.id} />}
              </Col>
            </Row>
            {postDetails && <MoreFromArtist creatorId={postDetails?.creator?.id} />}
          </Container>
        )}
      </section>
    </>
  )
}

export default PostDetails
