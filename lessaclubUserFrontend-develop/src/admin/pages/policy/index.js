import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import { useDispatch } from 'react-redux'
import { Document, Page, pdfjs } from 'react-pdf'

import axios from 'shared/libs/axios'
import { policyOptions, TOAST_TYPE } from 'shared/constants'
import { validationErrors } from 'shared/constants/validationErrors'
import useDragAndDrop from 'shared/hooks/use-drag-and-drop'

import './style.scss'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { FormattedMessage } from 'react-intl'
import { getPreSignedUrl } from 'shared/functions'
import { setParamsForGetRequest, updateToS3 } from 'shared/utils'
import { apiPaths } from 'shared/constants/apiPaths'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const AdminPolicy = () => {
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [documentLink, setDocumentLink] = useState(null)
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

  const [numPagesOfView, setNumPagesOfView] = useState(null)
  const [pageNumberOfView, setPageNumberOfView] = useState(1)

  const {
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
    control,
    setValue,
    setError,
    clearErrors
  } = useForm({ mode: 'all' })

  const pdfField = watch('policy.files')
  const viewPolicyType = watch('viewPolicyType')

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
  }

  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset)
  }

  function previousPage() {
    changePage(-1)
  }

  function nextPage() {
    changePage(1)
  }

  function onDocumentLoadSuccessOfView({ numPages }) {
    setNumPagesOfView(numPages)
  }

  function changePageOfView(offset) {
    setPageNumberOfView((prevPageNumber) => prevPageNumber + offset)
  }

  function previousPageOfView() {
    changePageOfView(-1)
  }

  function nextPageOfView() {
    changePageOfView(1)
  }

  const handleArtworkChange = (e, isDrag) => {
    setPageNumber(1)
    const file = isDrag ? e[0] : e.target.files[0]
    if (!file.type.startsWith('application/pdf')) {
      setValue('policy', null)
      setError('policy', {
        type: 'fileType',
        message: 'Only pdf is valid in this field.'
      })
    }

    if (file.size > 105000000) {
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: <FormattedMessage id="PleaseUploadAFileSmallerThan100MB" />,
          type: TOAST_TYPE.Error
        }
      })
    } else if (isDrag || (e && e.target.files.length > 0)) {
      setValue('policy.files', { fileObject: file, url: URL.createObjectURL(file), type: file.type.split('/')[1], updated: true })
      clearErrors('policy')
    }
  }

  const { dropRef, isDragging } = useDragAndDrop(handleArtworkChange)

  const onSubmit = async (data) => {
    setLoading(true)

    try {
      const presignedUrl = await getPreSignedUrl({ fileName: data.policy.files.fileObject.name })
      const pdfS3Link = await updateToS3(data.policy.files.fileObject, presignedUrl.data.result.file.url)

      const payload = {
        pdfS3Link,
        type: data.policyType.value
      }

      const response = await axios.post(apiPaths.adminPolicy, payload)
      if (response.data) {
        dispatch({
          type: SHOW_TOAST,
          payload: {
            message: response.data.message,
            type: TOAST_TYPE.Success
          }
        })
        setLoading(false)
        reset()
      }
    } catch (error) {
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: error.message || validationErrors.serverError,
          type: TOAST_TYPE.Error
        }
      })
      setLoading(false)
      reset()
    }
  }

  useEffect(() => {
    setPageNumberOfView(1)
    const fetchDoc = async () => {
      const params = {
        isActive: true,
        type: viewPolicyType.value
      }
      const response = await axios.get(`${apiPaths.getAdminPolicy}${setParamsForGetRequest(params)}`)
      setDocumentLink(response.data?.result?.perviousTerms?.[0]?.pdfS3Link)
    }

    viewPolicyType && fetchDoc()
  }, [viewPolicyType])

  return (
    <>
      <div className="content-headers mb-5">
        <h2 className="admin-heading">Policies, Terms & Conditions</h2>
      </div>

      <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)} id="policy-form">
        <div className="policy-container">
          <Row className="gap-l">
            <Col md={4} className="m-auto">
              <div className="upload-policy">
                <h3 className="admin-heading text-center mb-3">Upload Documents</h3>
                <h4 className="admin-heading h-s">Select the document type</h4>

                <Form.Group className="form-group mb-4">
                  <Controller
                    name="policyType"
                    control={control}
                    render={({ field: { onChange, value = [], ref } }) => (
                      <Select
                        ref={ref}
                        value={value}
                        className={`react-select ${errors.policyType && 'error'}`}
                        classNamePrefix="select"
                        options={policyOptions}
                        {...register('policyType', {
                          required: validationErrors.required
                        })}
                        onChange={(e) => {
                          onChange(e)
                        }}
                      />
                    )}
                  />
                  {errors?.policyType && (
                    <Form.Control.Feedback type="invalid" className="invalidFeedback">
                      {errors?.policyType?.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                <h4 className="admin-heading h-s">Upload the document as pdf</h4>

                <div className="upload-artwork">
                  <div className="upload-box-container">
                    <div
                      className="upload-box"
                      ref={dropRef}
                      style={{ border: `${isDragging ? '2px dashed #C7FFBD' : errors?.policy ? '2px dashed #ff0000' : ''}` }}
                    >
                      <input
                        type="file"
                        name="policy"
                        id="policy-pdf"
                        accept="application/pdf"
                        {...register('policy', {
                          required: pdfField ? false : validationErrors.required
                        })}
                        hidden
                        onChange={(e) => {
                          handleArtworkChange(e, false)
                        }}
                      />

                      {pdfField && (
                        <>
                          <div className="uploaded-file d-flex justify-content-center">
                            <Document file={pdfField?.url} onLoadSuccess={onDocumentLoadSuccess} options={{ workerSrc: '/pdf.worker.js' }}>
                              <Page pageNumber={pageNumber} scale={0.38} />
                              <p className="mt-1">
                                <span className="me-2">
                                  Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
                                </span>
                                <Button
                                  className="bg-secondary text-light approve-btn border-0 me-1"
                                  type="button"
                                  disabled={pageNumber <= 1}
                                  onClick={previousPage}
                                >
                                  Previous
                                </Button>
                                <Button
                                  className="bg-success text-light approve-btn border-0"
                                  type="button"
                                  disabled={pageNumber >= numPages}
                                  onClick={nextPage}
                                >
                                  Next
                                </Button>
                              </p>
                            </Document>
                          </div>
                          <div>
                            <label htmlFor="policy-pdf" className="change-img-btn">
                              Change file
                            </label>
                          </div>
                        </>
                      )}

                      {!pdfField && (
                        <div className="upload-desc">
                          <h6>Drag &amp; drop files here to upload</h6>
                          <label htmlFor="policy-pdf" className="browse-btn">
                            Browse file
                          </label>
                          <span>Max size limit - 100MB</span>
                        </div>
                      )}
                    </div>
                    {errors?.policy && (
                      <Form.Control.Feedback type="invalid" className="invalidFeedback">
                        {errors?.policy?.message}
                      </Form.Control.Feedback>
                    )}
                  </div>
                  <div className="upload-end-btns d-flex justify-content-between">
                    <Button className="white-border-btn" disabled={loading} onClick={() => reset()}>
                      Cancel
                    </Button>
                    <Button className="white-btn" type="submit" disabled={loading} form="policy-form">
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <Row className="mb-5">
            <Col md={6} className="m-auto">
              <div className="view-policy">
                <h3 className="admin-heading text-center mb-3">View Documents</h3>
                <h4 className="admin-heading h-s">Select the document type</h4>

                <Form.Group className="form-group mb-4">
                  <Controller
                    name="viewPolicyType"
                    control={control}
                    render={({ field: { onChange, value = [], ref } }) => (
                      <Select
                        ref={ref}
                        value={value}
                        className={`react-select ${errors.viewPolicyType && 'error'}`}
                        classNamePrefix="select"
                        options={policyOptions}
                        {...register('viewPolicyType')}
                        onChange={(e) => {
                          onChange(e)
                        }}
                      />
                    )}
                  />
                  {errors?.policyType && (
                    <Form.Control.Feedback type="invalid" className="invalidFeedback">
                      {errors?.policyType?.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                <div className="view-policy-container d-flex justify-content-center">
                  <Document
                    className="text-center"
                    file={documentLink}
                    onLoadSuccess={onDocumentLoadSuccessOfView}
                    options={{ workerSrc: '/pdf.worker.js' }}
                  >
                    <Page pageNumber={pageNumberOfView} scale={2} />
                    <p className="mt-1">
                      <span className="me-2">
                        Page {pageNumberOfView || (numPagesOfView ? 1 : '--')} of {numPagesOfView || '--'}
                      </span>
                      <Button
                        className="bg-secondary text-light approve-btn border-0 me-1"
                        type="button"
                        disabled={pageNumberOfView <= 1}
                        onClick={previousPageOfView}
                      >
                        Previous
                      </Button>
                      <Button
                        className="bg-success text-light approve-btn border-0"
                        type="button"
                        disabled={pageNumberOfView >= numPagesOfView}
                        onClick={nextPageOfView}
                      >
                        Next
                      </Button>
                    </p>
                  </Document>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Form>

      <div className="view-policy"></div>
    </>
  )
}

export default AdminPolicy
