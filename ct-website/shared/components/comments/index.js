import React, { useState, useContext, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { useMutation, useLazyQuery } from '@apollo/client'
import { Button, Offcanvas, Form, Dropdown, Modal, Row, Col, Spinner } from 'react-bootstrap'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'

import styles from './style.module.scss'
import formStyles from '@assets/scss/components/form.module.scss'
import { ActionIcon } from '../ctIcons'
import { validationErrors } from '../../constants/ValidationErrors'
import {
  ADD_COMMENT,
  ADD_FANTASY_ARTICLE_COMMENT,
  DELETE_COMMENT,
  DELETE_FANTASY_ARTICLE_COMMENT,
  REPORT_COMMENT,
  REPORT_FANTASY_ARTICLE_COMMENT
} from '@graphql/article/article.mutation'
import { LIST_COMMENTS, GET_REPORT_PROBLEM, LIST_FANTASY_ARTICLE_COMMENTS } from '@graphql/article/article.query'
import { ToastrContext } from '../toastr'
import { ONLY_SPACE, TOAST_TYPE } from '../../constants'
import { convertDateAMPM, bottomReached } from '@utils'
import { getCurrentUser, getToken } from '@shared/libs/menu'
import { GlobalEventsContext } from '../global-events'

const ConfirmationModal = dynamic(() => import('@shared-components/confirmationModal'))

const Comments = ({ handleComments, showComments, articleId, count, type, isRequireAdminApproval }) => {
  const { t } = useTranslation()
  const { dispatch } = useContext(ToastrContext)
  const { stateGlobalEvents, dispatchGlobalEvents: editGlobalEvent } = useContext(GlobalEventsContext)

  const deleteId = useRef()
  const commentId = useRef()
  const currentUser = getCurrentUser()
  const [commentList, setCommentList] = useState([])
  const [payloads, setPayloads] = useState({ iArticleId: articleId, nLimit: 10, nSkip: 1, sSortBy: 'dCreated', nOrder: -1 })
  const [reportProblemData, setReportProblemData] = useState()
  const isBottomReached = useRef(false)
  const [isConfirm, setIsConfirm] = useState(false)
  const [isReport, setShowReport] = useState(false)
  const [commentCount, setCommentCount] = useState(count || 0)
  const isSorting = useRef(false)
  const [selectedDropDownItem, setSelectedDropDownItem] = useState('Latest')
  const token = getToken()
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm({ mode: 'onTouched' })
  const {
    register: reportRegister,
    handleSubmit: handleSubmitReport,
    formState: { errors: reportErrors },
    reset: reportReset
  } = useForm({ mode: 'onTouched' })

  const [addComment, { loading: addCommentLoading }] = useMutation(ADD_COMMENT, {
    onCompleted: (data) => {
      if (data && data?.addUserComment) {
        reset()
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.addUserComment.sMessage, type: TOAST_TYPE.Success }
        })
      }
    }
  })

  const [addFantasyArticleComment, { loading: addFantasyArticleCommentLoading }] = useMutation(ADD_FANTASY_ARTICLE_COMMENT, {
    onCompleted: (data) => {
      if (data && data?.addFantasyUserComment) {
        reset()
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.addFantasyUserComment.sMessage, type: TOAST_TYPE.Success }
        })
      }
    }
  })

  const [listArticleComments] = useLazyQuery(LIST_COMMENTS, {
    fetchPolicy: 'network-only',
    variables: { input: payloads },
    onCompleted: (data) => {
      if (data && data.listFrontComments) {
        isBottomReached.current = false
        if (isSorting.current) {
          setCommentList(data?.listFrontComments?.aResults)
        } else setCommentList([...commentList, ...data?.listFrontComments?.aResults])
      }
    }
  })

  const [listFantasyArticleComments] = useLazyQuery(LIST_FANTASY_ARTICLE_COMMENTS, {
    fetchPolicy: 'network-only',
    variables: { input: payloads },
    onCompleted: (data) => {
      if (data && data.listFantasyFrontComments) {
        isBottomReached.current = false
        if (isSorting.current) {
          setCommentList(data?.listFantasyFrontComments?.aResults)
        } else setCommentList([...commentList, ...data?.listFantasyFrontComments?.aResults])
      }
    }
  })

  const [getReportProblem] = useLazyQuery(GET_REPORT_PROBLEM, {
    onCompleted: (data) => {
      if (data && data.listFrontCommentReportReason) {
        setReportProblemData(data.listFrontCommentReportReason)
      }
    }
  })

  const [deleteComment] = useMutation(DELETE_COMMENT, {
    onCompleted: (data) => {
      if (data && data.deleteFrontComment) {
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.deleteFrontComment.sMessage, type: TOAST_TYPE.Success }
        })
      }
    }
  })

  const [deleteFantasyArticleComment] = useMutation(DELETE_FANTASY_ARTICLE_COMMENT, {
    onCompleted: (data) => {
      if (data && data.deleteFantasyComment) {
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.deleteFantasyComment.sMessage, type: TOAST_TYPE.Success }
        })
      }
    }
  })

  const [reportComment] = useMutation(REPORT_COMMENT, {
    onCompleted: (data) => {
      if (data && data.reportComment) {
        setShowReport(!isReport)
        reportReset()
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.reportComment.sMessage, type: TOAST_TYPE.Success }
        })
      }
    }
  })

  const [reportFantasyArticleComment] = useMutation(REPORT_FANTASY_ARTICLE_COMMENT, {
    onCompleted: (data) => {
      if (data && data.reportFantasyComment) {
        setShowReport(!isReport)
        reportReset()
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.reportFantasyComment.sMessage, type: TOAST_TYPE.Success }
        })
      }
    }
  })

  useEffect(() => {
    stateGlobalEvents && stateGlobalEvents.commentCount && setCommentCount(stateGlobalEvents.commentCount)
  }, [stateGlobalEvents])

  useEffect(() => {
    if (type === 'article') {
      listArticleComments()
    } else {
      listFantasyArticleComments()
    }
  }, [type])

  const handleReport = (value, id) => {
    setShowReport(!isReport)
    reportReset()
    commentId.current = id
    if (value === 'APICALL' && !reportProblemData) {
      getReportProblem()
    }
  }
  const closeConfirm = () => setIsConfirm(!isConfirm)

  async function handleConfirm(id) {
    if (!isConfirm) {
      deleteId.current = id
      setIsConfirm(!isConfirm)
    } else {
      setIsConfirm(!isConfirm)
      if (type === 'article') {
        const { data } = await deleteComment({ variables: { input: { _id: deleteId.current } } })
        if (data?.deleteFrontComment) {
          filterComments(deleteId.current)
          editGlobalEvent({
            type: 'UPDATE_ARTICLE_COMMENT_COUNT',
            payload: { commentCount: stateGlobalEvents?.commentCount - 1 }
          })
        }
      } else if (type === 'fantasyArticle') {
        const { data } = await deleteFantasyArticleComment({ variables: { input: { _id: deleteId.current } } })
        if (data?.deleteFantasyComment) {
          filterComments(deleteId.current)
          editGlobalEvent({
            type: 'UPDATE_ARTICLE_COMMENT_COUNT',
            payload: { commentCount: stateGlobalEvents?.commentCount - 1 }
          })
        }
      }
    }
  }

  // function textAreaAdjust() {
  //   commentInput.current.style.height = '1px'
  //   commentInput.current.style.height = (commentInput.current.scrollHeight) + 'px'
  // }

  function handleScroll(e) {
    if (bottomReached(e) && !isBottomReached.current && payloads.nSkip * 10 < commentCount) {
      isBottomReached.current = true
      isSorting.current = false
      setPayloads({ ...payloads, nSkip: payloads.nSkip + 1 })
    }
  }

  async function onSubmit(value) {
    if (type === 'article') {
      const { data } = await addComment({ variables: { input: { iArticleId: articleId, sContent: value.sMessage } } })
      if (data?.addUserComment?.oData) {
        if (isRequireAdminApproval) {
          data.addUserComment.oData.pending = true
        }
        setCommentList([data.addUserComment.oData, ...commentList])
        editGlobalEvent({
          type: 'UPDATE_ARTICLE_COMMENT_COUNT',
          payload: { commentCount: stateGlobalEvents?.commentCount + 1 }
        })
      }
    } else if (type === 'fantasyArticle') {
      const { data } = await addFantasyArticleComment({ variables: { input: { iArticleId: articleId, sContent: value.sMessage } } })
      if (data?.addFantasyUserComment?.oData) {
        if (isRequireAdminApproval) {
          data.addFantasyUserComment.oData.pending = true
        }
        setCommentList([data.addFantasyUserComment.oData, ...commentList])
        editGlobalEvent({
          type: 'UPDATE_ARTICLE_COMMENT_COUNT',
          payload: { commentCount: stateGlobalEvents?.commentCount + 1 }
        })
      }
    }
  }

  const onReportSubmit = (data) => {
    if (type === 'article') {
      reportComment({ variables: { input: { _id: commentId.current, iArticleId: articleId, iReportReasonId: data.iReportReasonId } } })
    } else if (type === 'fantasyArticle') {
      reportFantasyArticleComment({
        variables: { input: { _id: commentId.current, iArticleId: articleId, iReportReasonId: data.iReportReasonId } }
      })
    }
  }

  const filterComments = (deleteComment) => {
    setCommentList(commentList.filter((id) => id._id !== deleteComment))
    editGlobalEvent({
      type: 'UPDATE_ARTICLE_COMMENT_COUNT',
      payload: { commentCount: stateGlobalEvents?.commentCount - 1 }
    })
  }
  function sortComments(type) {
    isSorting.current = true
    setPayloads({ ...payloads, sSortBy: 'dCreated', nOrder: type, nSkip: 1, nLimit: 10 })
  }
  return (
    <>
      <Offcanvas className={styles.offcanvasComments} show={showComments} onHide={handleComments} placement={'end'}>
        <div className={`${styles.offcanvasHead} d-flex justify-content-between`}>
          <p className="big-text font-bold mb-0">
            {stateGlobalEvents?.commentCount} {t('common:Comments')}
          </p>
          <Button variant="link" onClick={handleComments} className={`${styles.closeMenu} btn-close`}></Button>
        </div>
        <Offcanvas.Body className={styles.offcanvasBody} onScroll={handleScroll}>
          <div className={styles.commentsGroup}>
            <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <Form.Group className={`${formStyles.formGroup} ${styles.formGroup} `} controlId="phoneNumber">
                <Form.Control
                  className={`${formStyles.formControl} ${formStyles.formTextarea} ${styles.commentsControl} ${
                    errors.sMessage && formStyles.hasError
                  }`}
                  as="textarea"
                  disabled={!token || token === 'undefined'}
                  name="sMessage"
                  {...register('sMessage', {
                    required: validationErrors.required,
                    minLength: { value: 3, message: validationErrors.minLength(3) },
                    pattern: {
                      value: ONLY_SPACE,
                      message: validationErrors.required
                    }
                  })}
                  // ref={commentInput}
                  // onChange={textAreaAdjust}
                  placeholder="Type your comment"
                />
                {errors.sMessage && (
                  <Form.Control.Feedback type="invalid" className={`${formStyles.invalidFeedback} ${styles.invalidFeedback}`}>
                    {errors.sMessage.message}
                  </Form.Control.Feedback>
                )}
                {(!token || token === 'undefined') && (
                  <Form.Control.Feedback type="invalid" className={`${formStyles.invalidFeedback} ${styles.invalidFeedback}`}>
                    {validationErrors.pleaseLoginToWriteComment}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              <Button
                className="theme-btn outline-btn outline-light small-btn d-none d-sm-inline-block me-2"
                disabled={!token || token === 'undefined'}
                onClick={() => {
                  reset()
                }}
              >
                {t('common:Clear')}
              </Button>
              <Button
                disabled={addCommentLoading || !token || token === 'undefined' || addFantasyArticleCommentLoading}
                className={`${styles.postBtn} theme-btn small-btn`}
                type="submit"
              >
                {t('common:Post')} <span className="d-none d-sm-inline">{t('common:Comment')}</span>
                {(addCommentLoading || addFantasyArticleCommentLoading) && (
                  <Spinner className="ms-2 align-middle" animation="border" size="sm" />
                )}
              </Button>
            </Form>
          </div>
          {commentList?.length !== 0 && (
            <div className={`${styles.sorting} pt-2 pt-sm-4 pb-1 d-flex`}>
              <p className="font-semi mb-0">{t('common:SortBy')} :</p>
              <Dropdown className={styles.sortDropdown}>
                <Dropdown.Toggle variant="link" id="dropdown-sort" className="theme-text">
                  {selectedDropDownItem}
                </Dropdown.Toggle>
                <Dropdown.Menu align="end" className={styles.dropdownMenu} onClick={(e) => setSelectedDropDownItem(e.target.innerText)}>
                  <Dropdown.Item className={`${selectedDropDownItem === 'Latest' && 'active-item'}`} onClick={() => sortComments(-1)}>
                    {t('common:Latest')}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => sortComments(1)} className={`${selectedDropDownItem === 'Oldest' && 'active-item'}`}>
                    {t('common:Oldest')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}
          <div className={styles.commentList}>
            {commentList?.map((comment) => {
              return (
                <div className={styles.comment} key={comment._id}>
                  <div className={`${styles.head} d-flex justify-content-between align-items-start`}>
                    <div>
                      <p className="font-semi mb-1">{comment?.oCreatedBy?.sFullName}</p>
                      <p className="text-secondary xsmall-text mb-2">{convertDateAMPM(comment?.dCreated)}</p>
                    </div>
                    {!comment?.pending && currentUser && (
                      <Dropdown className={styles.commentAction}>
                        <Dropdown.Toggle variant="link" id="comment-action1" className={styles.actionToggle}>
                          <ActionIcon />
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="end" className={`${styles.dropdownMenu} text-end`}>
                          {/* <Dropdown.Item>{t('common:Edit')}</Dropdown.Item> */}
                          {currentUser?._id === comment?.oCreatedBy?._id && (
                            <Dropdown.Item onClick={() => handleConfirm(comment._id)}>{t('common:DeleteComment')}</Dropdown.Item>
                          )}
                          {currentUser?._id !== comment?.oCreatedBy?._id && (
                            <Dropdown.Item onClick={() => handleReport('APICALL', comment._id)}>{t('common:ReportProblem')}</Dropdown.Item>
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                    {comment?.pending && <p className="theme-text">{t('common:CommentApprovalPendingByAdmin')}</p>}
                  </div>
                  <p className="text-secondary mb-2">{comment?.sContent}</p>
                  {/* <div className={`${styles.footerlist} d-flex align-items-center font-semi`}>
                    <Button variant="link" className="text-uppercase me-3">{t('common:Reply')}</Button>
                    <Button variant="link" className="d-flex align-items-center me-3"><LikeIcon /> 21</Button>
                    <Button variant="link" className="d-flex align-items-center me-3"><DislikeIcon /> 21</Button>
                  </div> */}
                </div>
              )
            })}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
      <Modal show={isReport} onHide={handleReport} centered className="modal-medium">
        <Modal.Body className={`${styles.modalBody} mx-auto mt-2`}>
          <h3 className="small-head text-uppercase text-primary mb-1">{t('common:ReportProblem')}</h3>
          <p className="text-secondary">{t('common:SelectTypeProblem')}</p>
          <Form onSubmit={handleSubmitReport(onReportSubmit)} autoComplete="off">
            <Form.Group className="form-group radio-group">
              {reportProblemData?.map((report) => {
                return (
                  <Form.Check
                    key={report._id}
                    {...reportRegister('iReportReasonId', { required: validationErrors.required })}
                    label={report.sTitle}
                    value={report._id}
                    className={`${styles.formCheck} bigcheck font-semi`}
                    name="iReportReasonId"
                    type="radio"
                  />
                )
              })}
              {reportErrors.iReportReasonId && (
                <Form.Control.Feedback type="invalid" className={`${formStyles.invalidFeedback}`}>
                  {reportErrors.iReportReasonId.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <div className={styles.submitBlock}>
              <Row className="justify-content-center">
                <Col xs={9}>
                  <Button className="theme-btn w-100" type="submit">
                    {t('common:Submit')}
                  </Button>
                  <Button variant="link" className="w-100" onClick={handleReport}>
                    {t('common:Cancel')}
                  </Button>
                </Col>
              </Row>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <ConfirmationModal isConfirm={isConfirm} handleConfirm={handleConfirm} closeConfirm={closeConfirm} />
    </>
  )
}
Comments.propTypes = {
  showComments: PropTypes.bool,
  handleComments: PropTypes.func,
  articleId: PropTypes.string,
  count: PropTypes.number,
  type: PropTypes.string,
  isRequireAdminApproval: PropTypes.bool
}

export default Comments
