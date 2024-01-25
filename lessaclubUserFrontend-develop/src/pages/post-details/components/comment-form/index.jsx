import React, { useEffect, useState } from 'react'
import { Row, Col, Button, Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import { validationErrors } from 'shared/constants/validationErrors'
import { addComment } from 'modules/comments/redux/service'
import useHeader from 'shared/components/header/use-header'
import TruliooKyc from 'modules/truliooKyc'
import KycModal from 'shared/components/kyc-modal'
import { kycStatus } from 'shared/constants'

const CommentForm = ({ autoFocus = false, communityAssetId, communityId, parentId, closeCommentForm }) => {
  const userId = localStorage.getItem('userId')
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const resError = useSelector((state) => state.comments.resError)
  const userStore = useSelector((state) => state.user.user)
  const { truliooKyc, kyc, onConfirm, onClose, handleKyc } = useHeader()

  const {
    register,
    formState: { errors },
    handleSubmit,
    resetField
  } = useForm()

  useEffect(() => {
    if (resError) {
      setLoading(false)
    }
  }, [resError])

  const onSubmit = (data) => {
    setLoading(true)
    dispatch(
      addComment(
        !!parentId,
        {
          communityAssetId: communityAssetId?.toString(),
          communityId: communityId?.toString(),
          parentId: parentId?.toString(),
          text: data.comment
        },
        () => {
          resetField('comment')
          setLoading(false)
          closeCommentForm && closeCommentForm()
        }
      )
    )
  }

  return (
    <>
      {
        userStore?.kycVerified ? <div className="comment-form">
          <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="form-group align-items-center" as={Row}>
              <Col sm="10">
                <div className="comment-form-box">
                  {/* TODO: no need for now */}
                  {/* <div className="comment-form-user-icon">
              <img src={emojiIcon} alt="user" />
            </div> */}
                  <Form.Control
                    type="text"
                    as="textarea"
                    disabled={!userId}
                    autoFocus={autoFocus}
                    className={errors.comment && 'error'}
                    placeholder={autoFocus ? 'Reply to comment' : 'Join the discussion'}
                    {...register('comment', {
                      required: validationErrors.required,
                      maxLength: {
                        value: 255,
                        message: validationErrors.maxLength(255)
                      }
                    })}
                  />
                </div>
                {errors.comment && (
                  <Form.Control.Feedback type="invalid" className="invalidFeedback position-relative">
                    {errors.comment.message}
                  </Form.Control.Feedback>
                )}
                {!userId && (
                  <Form.Control.Feedback type="invalid" className="invalidFeedback position-relative">
                    Login to write comment
                  </Form.Control.Feedback>
                )}
              </Col>
              <Col sm="2">
                <div className="comment-form-button">
                  <Button type="submit" className="white-btn" disabled={loading || !userId}>
                    Post
                  </Button>
                </div>
              </Col>
            </Form.Group>
          </Form>
        </div> : <div className="comment-form">
          {!parentId ? (
            <>
              {userStore?.kycStatus && !kycStatus.includes(userStore?.kycStatus) && (
                <Button className="kyc-btn white-btn ms-3" onClick={() => handleKyc(true)}>
                  Please complete your KYC process to add a comment
                </Button>
              )}
              {kyc && <KycModal show={kyc} onConfirm={onConfirm} onClose={onClose} />}
              {truliooKyc && <TruliooKyc />}
            </>
          ) : <div style={{ color: 'red' }}>Please complete your KYC process to add a comment</div>
          }
        </div>
      }
    </>
  )
}
CommentForm.propTypes = {
  communityAssetId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  communityId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  parentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  autoFocus: PropTypes.bool,
  initialValue: PropTypes.string,
  closeCommentForm: PropTypes.func
}
export default CommentForm
