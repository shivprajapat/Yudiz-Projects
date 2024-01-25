import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button, Col, Form } from 'react-bootstrap'
import UserInfo from 'shared/components/user-info'
import { createAssetReview, deleteAssetReview, listAssetReview, updateAssetReview } from 'modules/assets/redux/service'
import { useDispatch } from 'react-redux'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'
import ConfirmationModal from 'shared/components/confirmation-modal'
import { GlobalEventsContext } from 'shared/components/global-events'

const Reviews = (props) => {
  const { userStore = {}, assetDetails, isCurrentUserOwner, isCurrentUserCreator } = props

  const dispatch = useDispatch()

  const {
    state: { profileData }
  } = React.useContext(GlobalEventsContext)

  const [comment, setComment] = useState({ value: '' })
  const [reviews, setReviews] = useState([])
  const [confirm, setConfirm] = useState(false)

  useEffect(() => {
    if (assetDetails?.assetId) {
      listReview()
    }
  }, [assetDetails?.assetId])

  const createReview = async () => {
    const payload = { assetId: assetDetails?.assetId, comment: comment.value }
    const response = await createAssetReview(payload)
    if (response) {
      listReview()
      setComment({ value: '' })
      setConfirm(false)
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: response?.data.message,
          type: TOAST_TYPE.Success
        }
      })
    }
  }

  const updateReview = async () => {
    const payload = { assetId: assetDetails?.assetId, comment: comment.value }
    const response = await updateAssetReview(payload, comment.id)
    if (response) {
      listReview()
      setComment({ value: '' })
      setConfirm(false)
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: response?.data.message,
          type: TOAST_TYPE.Success
        }
      })
    }
  }

  const listReview = async () => {
    const response = await listAssetReview(assetDetails?.assetId)
    setReviews(response?.data?.result?.assetReviewData || [])
  }

  const deleteReview = async () => {
    const response = await deleteAssetReview(comment.id, { assetId: assetDetails?.assetId })
    if (response) {
      listReview()
      setComment({ value: '' })
      setConfirm(false)
    }
  }

  const handleReviewAction = (review, action) => {
    switch (action) {
      case 'Edit':
        setComment({ value: review.comment, id: review.id })
        break
      case 'Delete':
        setComment({ id: review.id })
        setConfirm(true)
        break
      default:
        break
    }
  }

  return (
    <div className="asset-detail-desc create-list-reviews">
      <h6 className="text-dark">Reviews</h6>
      {
        confirm && (
          <ConfirmationModal
            show={confirm}
            handleConfirmation={deleteReview}
            handleClose={() => setConfirm(false)}
            title={'Confirm Delete'}
            description={'Are you sure you want to delete this review?'}
          />
        )
      }
      {
        (isCurrentUserOwner || isCurrentUserCreator) ? <div className="create-review">
          <Form.Group as={Col} lg="12" className='review-form'>
            <UserInfo isDark profileImage={userStore?.profilePicUrl} />
            <Form.Control
              type="text"
              as="textarea"
              maxlength={200}
              placeholder="Write your Comment (Max 200 characters allowed)"
              value={comment.value}
              onChange={ev => setComment({ ...comment, value: ev.target.value })}
            />
          </Form.Group>
          <div className="actions py-3">
            <Button
              className='black-border-btn btn btn-primary'
              onClick={() => setComment({ value: '' })}
            >
              Cancel
            </Button>
            <Button
              className='black-border-btn btn btn-primary ml-3'
              onClick={comment.id ? updateReview : createReview}
              disabled={!comment?.value?.length}
            >
              {comment.id ? 'Update' : 'Create'}
            </Button>
          </div>
        </div> : null
      }
      {
        reviews.length ? <div className="review-list">
          {
            reviews.map(review => {
              return (
                <div className="review-box" key={review.id}>
                  <UserInfo isDark profileImage={userStore?.profilePicUrl} />
                  <div className="review">
                    {review.comment}
                    {
                      <div className="review-actions">
                        {
                          review.modifiedBy === userStore?.id ? <span
                            className='text-muted'
                            onClick={() => handleReviewAction(review, 'Edit')}
                          >
                            Edit
                          </span> : null
                        }
                        {
                          (review.modifiedBy === userStore?.id || profileData?.role === 'admin') ? <span
                            className='text-muted'
                            onClick={() => handleReviewAction(review, 'Delete')}
                          >
                            Delete
                          </span> : null
                        }
                      </div>
                    }
                  </div>
                </div>
              )
            })
          }
        </div> : <div className="review-list d-flex align-items-center justify-content-center">
          No reviews added
        </div>
      }
    </div>

  )
}

export default Reviews

Reviews.propTypes = {
  userStore: PropTypes.object,
  assetDetails: PropTypes.object,
  isCurrentUserOwner: PropTypes.bool,
  isCurrentUserCreator: PropTypes.bool
}
