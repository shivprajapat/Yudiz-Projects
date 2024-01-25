import React, { useState, useContext, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { useMutation, useLazyQuery } from '@apollo/client'
import { Button, Form, Dropdown, Modal, Row, Col, Spinner } from 'react-bootstrap'

// import styles from './style.module.scss'
import useTranslation from 'next-translate/useTranslation'
import formStyles from '@assets/scss/components/form.module.scss'
import { ActionIcon } from '@shared-components/ctIcons'
import ConfirmationModal from '@shared-components/confirmationModal'
import { validationErrors } from '@shared/constants/ValidationErrors'
import { ADD_COMMENT, DELETE_COMMENT, REPORT_COMMENT } from '@graphql/article/article.mutation'
import { LIST_COMMENTS, GET_REPORT_PROBLEM } from '@graphql/article/article.query'
import { ToastrContext } from '@shared-components/toastr'
import { TOAST_TYPE } from '@shared/constants'
import { convertDateAMPM, bottomReached } from '@utils'

const CommentsAMP = ({ total, commentData, handleComments, showComments, articleId, count }) => {
  const { t } = useTranslation()
  const { dispatch } = useContext(ToastrContext)
  const deleteId = useRef()
  const totalCount = useRef()
  const commentId = useRef()
  // const commentInput = useRef(null)
  const [commentList, setCommentList] = useState()
  const [payloads, setPayloads] = useState({ iArticleId: articleId, nLimit: 10, nSkip: 1 })
  const reportProblemData = useRef()
  const isBottomReached = useRef(false)
  const [isConfirm, setIsConfirm] = useState(false)
  const [isReport, setShowReport] = useState(false)
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
        data.addUserComment.oData.pending = true
        setCommentList([data.addUserComment.oData, ...commentList])
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.addUserComment.sMessage, type: TOAST_TYPE.Success }
        })
      }
    }
  })

  const [getComment] = useLazyQuery(LIST_COMMENTS, {
    onCompleted: (data) => {
      if (data && data.listFrontComments) {
        isBottomReached.current = false
        setCommentList([...commentList, ...data?.listFrontComments?.aResults])
      }
    }
  })

  const [getReportProblem] = useLazyQuery(GET_REPORT_PROBLEM, {
    onCompleted: (data) => {
      if (data && data.listFrontCommentReportReason) {
        reportProblemData.current = data.listFrontCommentReportReason
      }
    }
  })

  const [deleteComment] = useMutation(DELETE_COMMENT, {
    onCompleted: (data) => {
      if (data && data.deleteFrontComment) {
        filterComments(deleteId.current)
        dispatch({
          type: 'SHOW_TOAST',
          payload: { message: data.deleteFrontComment.sMessage, type: TOAST_TYPE.Success }
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

  const handleReport = (value, id) => {
    setShowReport(!isReport)
    reportReset()
    commentId.current = id
    if (value === 'APICALL' && !reportProblemData.current) {
      getReportProblem()
    }
  }
  const closeConfirm = () => setIsConfirm(!isConfirm)
  const handleConfirm = (id) => {
    if (!isConfirm) {
      deleteId.current = id
      setIsConfirm(!isConfirm)
    } else {
      setIsConfirm(!isConfirm)
      deleteComment({ variables: { input: { _id: deleteId.current } } })
    }
  }
  // function textAreaAdjust() {
  //   commentInput.current.style.height = '1px'
  //   commentInput.current.style.height = (commentInput.current.scrollHeight) + 'px'
  // }

  function handleScroll(e) {
    if (bottomReached(e) && !isBottomReached.current && commentList.length < totalCount.current) {
      isBottomReached.current = true
      setPayloads({ ...payloads, nSkip: payloads.nSkip + 1 })
    }
  }

  const onSubmit = (data) => {
    addComment({ variables: { input: { iArticleId: articleId, sContent: data.sMessage } } })
  }

  const onReportSubmit = (data) => {
    reportComment({ variables: { input: { _id: commentId.current, iArticleId: articleId, iReportReasonId: data.iReportReasonId } } })
  }

  const filterComments = (deleteComment) => {
    setCommentList(commentList.filter((id) => id._id !== deleteComment))
    totalCount.current = totalCount.current - 1
  }

  useEffect(() => {
    commentData && setCommentList(commentData)
  }, [commentData])

  useEffect(() => {
    if (count) totalCount.current = count
  }, [count])

  useEffect(() => {
    payloads.nSkip !== 1 && getComment({ variables: { input: payloads } })
  }, [payloads])

  return (
    <>
      <amp-sidebar className="offcanvasComments" id="sidebar1" layout="nodisplay" side="right">
          <div className="offcanvasHead d-flex justify-content-between">
            <p className="big-text font-bold mb-0">{totalCount.current} {t('common:Comments')}</p>
            <Button variant="link" onClick={handleComments} className="closeMenu btn-close"></Button>
          </div>
          <div className="offcanvasBody" onScroll={handleScroll}>
            <div className="commentsGroup">
              <form action="" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div className="formGroup" controlId="phoneNumber">
                  <input
                    className={`formControl formTextarea commentsControl ${errors.sMessage && 'hasError'} `}
                    as="textarea"
                    name="sMessage"
                    {...register('sMessage', {
                      required: validationErrors.required,
                      minLength: { value: 3, message: validationErrors.minLength(3) }
                    })}
                    placeholder="Type your comment" />
                  {errors.sMessage && (
                    <Form.Control.Feedback type="invalid" className="invalidFeedback">
                      {errors.sMessage.message}
                    </Form.Control.Feedback>
                  )}
                </div>
                <Button className="theme-btn outline-btn outline-light small-btn d-none d-sm-inline-block me-2" onClick={() => { reset() }}>{t('common:Clear')}</Button>
                <Button disabled={addCommentLoading} className="postBtn theme-btn small-btn" type="submit">{t('common:Post')} <span className="d-none d-sm-inline">{t('common:Comment')}</span>
                  {addCommentLoading && <Spinner className="ms-2 align-middle" animation="border" size="sm" />}</Button>
              </form>
            </div>
            <div className="sorting d-flex">
              <p className="font-semi mb-0">{t('common:SortBy')} :</p>
              <Dropdown className="sortDropdown">
                <Dropdown.Toggle variant="link" id="dropdown-sort" className="theme-text">{t('common:Latest')}</Dropdown.Toggle>
                <Dropdown.Menu align="end" className="dropdownMenu">
                  <Dropdown.Item className="active-item">{t('common:Latest')}</Dropdown.Item>
                  <Dropdown.Item>{t('common:Oldest')}</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="commentList">
              {commentList?.map((comment) => {
                return (
                  <div className="comment" key={comment._id}>
                    <div className="head d-flex justify-content-between align-items-start">
                      <div>
                        <p className="font-semi mb-1">{comment?.oCreatedBy?.sUsername}</p>
                        <p className="text-secondary xsmall-text mb-2">{convertDateAMPM(comment?.dCreated)}</p>
                      </div>
                      {!comment?.pending && <Dropdown className="commentAction">
                        <Dropdown.Toggle variant="link" id="comment-action1" className="actionToggle"><ActionIcon /></Dropdown.Toggle>
                        <Dropdown.Menu align="end" className="dropdownMenu text-end">
                          <Dropdown.Item>{t('common:Edit')}</Dropdown.Item>
                          <Dropdown.Item onClick={() => handleConfirm(comment._id)}>{t('common:Delete')}</Dropdown.Item>
                          <Dropdown.Item onClick={() => handleReport('APICALL', comment._id)}>{t('common:ReportProblem')}</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>}
                      {comment?.pending && <p className='theme-text'>Pending</p>}
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
          </div>
      </amp-sidebar>
      <Modal show={isReport} onHide={handleReport} centered className="modal-medium">
        <Modal.Body className="modalBody mx-auto mt-2">
          <h3 className="small-head text-uppercase text-primary mb-1">{t('common:ReportProblem')}</h3>
          <p className="text-secondary">{t('common:SelectTypeProblem')}</p>
          <Form onSubmit={handleSubmitReport(onReportSubmit)} autoComplete="off">
            <Form.Group className="form-group radio-group">
              {reportProblemData.current?.map((report) => {
                return <Form.Check
                  key={report._id}
                  {...reportRegister('iReportReasonId', { required: validationErrors.required })}
                  label={report.sTitle}
                  value={report._id}
                  className="formCheck bigcheck font-semi"
                  name="iReportReasonId"
                  type="radio" />
              })}
              {reportErrors.iReportReasonId && <Form.Control.Feedback type="invalid" className={`${formStyles.invalidFeedback}`}>{reportErrors.iReportReasonId.message}</Form.Control.Feedback>}
            </Form.Group>
            <div className="submitBlock">
              <Row className="justify-content-center">
                <Col xs={9}>
                  <Button className="theme-btn w-100" type="submit">{t('common:Submit')}</Button>
                  <Button variant="link" className="w-100" onClick={handleReport}>{t('common:Cancel')}</Button>
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
CommentsAMP.propTypes = {
  showComments: PropTypes.bool,
  handleComments: PropTypes.func,
  articleId: PropTypes.string,
  commentData: PropTypes.array,
  count: PropTypes.number,
  total: PropTypes.number
}

export default CommentsAMP
