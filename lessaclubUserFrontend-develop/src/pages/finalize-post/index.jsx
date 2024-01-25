import React, { useEffect, useRef, useState } from 'react'
import Select from 'react-select'
import { Container, Row, Col, Button, Form } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'

import './style.scss'
import { validationErrors } from 'shared/constants/validationErrors'
import { userImg } from 'assets/images'
import useDragAndDrop from 'shared/hooks/use-drag-and-drop'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'
import { getAllCommunities } from 'modules/communities/redux/service'
import { debounce, updateToS3 } from 'shared/utils'
import { allRoutes } from 'shared/constants/allRoutes'
import { getPreSignedUrl } from 'shared/functions'
import { getPostDetails, updatePost } from 'modules/post/redux/service'
import WithAuth from 'shared/components/with-auth'

const FinalizePost = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [requestParams, setRequestParams] = useState({ page: 1, perPage: 10 })
  const [communities, setCommunities] = useState()
  const [loading, setLoading] = useState(false)

  const isBottomReached = useRef(false)
  const totalCommunity = useRef(0)

  const allCommunityStore = useSelector((state) => state.communities.allCommunities)
  const resError = useSelector((state) => state.post.resError)
  const postDetailsStore = useSelector((state) => state.post.postDetails)

  const {
    formState: { errors },
    control,
    setValue,
    register,
    watch,
    clearErrors,
    handleSubmit,
    reset
  } = useForm()

  const thumbnailField = watch('thumbnail.files')

  useEffect(() => {
    if (id) {
      dispatch(getPostDetails(id))
    }
  }, [])

  useEffect(() => {
    if (postDetailsStore?.communityAsset && postDetailsStore?.communityAsset?.thumbNailUrl) {
      const { communityAsset } = postDetailsStore
      reset({
        communityId: communityAsset?.community,
        thumbnail: {
          files: { url: communityAsset?.thumbNailUrl, updated: false }
        }
      })
    }
  }, [postDetailsStore])

  useEffect(() => {
    if (allCommunityStore?.community) {
      totalCommunity.current = allCommunityStore?.metaData?.totalItems
      if (isBottomReached.current) {
        setCommunities([...communities, ...allCommunityStore?.community])
      } else {
        setCommunities(allCommunityStore?.community)
      }
    }
  }, [allCommunityStore])

  useEffect(() => {
    if (resError) {
      setLoading(false)
    }
  }, [resError])

  useEffect(() => {
    if (requestParams) {
      dispatch(getAllCommunities(requestParams))
    }
  }, [requestParams])

  const handleArtworkChange = (e, isDrag) => {
    const file = isDrag ? e[0] : e.target.files[0]
    if (file.size > 105000000) {
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: <FormattedMessage id="PleaseUploadAFileSmallerThan100MB" />,
          type: TOAST_TYPE.Error
        }
      })
    } else if (isDrag || (e && e.target.files.length > 0)) {
      setValue('thumbnail.files', { fileObject: file, url: URL.createObjectURL(file), type: file.type.split('/')[1], updated: true })
      clearErrors('thumbnail')
    }
  }

  const { dropRef, isDragging } = useDragAndDrop(handleArtworkChange)

  const handleScroll = () => {
    if (totalCommunity.current > requestParams.page * 10) {
      setRequestParams({ ...requestParams, page: requestParams.page + 1 })
      isBottomReached.current = true
    }
  }

  const optimizedSearch = debounce((txt, { action, prevInputValue }) => {
    if (action === 'input-change') {
      setRequestParams({ ...requestParams, name: txt, page: 1 })
    }
    if (action === 'set-value') {
      prevInputValue && setRequestParams({ ...requestParams, name: '', page: 1 })
    }
    if (action === 'menu-close') {
      prevInputValue && setRequestParams({ ...requestParams, name: '', page: 1 })
    }
  })

  const getCommunityFormattedLabel = (value) => {
    return (
      <div className="d-flex align-items-center">
        <img src={value?.photo || userImg} alt={value?.name} />
        <span className="select-name">{value?.name}</span>
      </div>
    )
  }

  const onSubmit = (data) => {
    setLoading(true)
    if (data?.thumbnail?.files?.updated) {
      getPreSignedUrl({ fileName: data.thumbnail.files.fileObject.name }).then((res) => {
        updateToS3(data.thumbnail.files.fileObject, res.data.result.file.url)
          .then((res) => {
            finalizePost(data, res)
          })
          .catch((err) => {
            dispatch({
              type: SHOW_TOAST,
              payload: {
                message: err?.message || validationErrors.serverError,
                type: TOAST_TYPE.Error
              }
            })
          })
      })
    } else {
      finalizePost(data)
    }
  }

  const finalizePost = (data, thumbnailUrl) => {
    const payload = thumbnailUrl ? { communityId: data.communityId.id, thumbNailUrl: thumbnailUrl } : { communityId: data.communityId.id }
    dispatch(
      updatePost(id, { ...payload, status: 2 }, () => {
        navigate(allRoutes.community)
      })
    )
  }

  return (
    <section className="finalize-post section-padding">
      <Container>
        <Row>
          <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <div className="back-arrow-box">
              <h3 className="arrow-heading">Create Your Blog / Vlog</h3>
            </div>
            <div className="finalize-post-tab">
              <Row className="justify-content-between">
                <Col md={6}>
                  <div className="finalize-post-tab-item">
                    <h6 className="heading">Set thumbnail</h6>
                    <div
                      className="upload-box"
                      ref={dropRef}
                      style={{ border: `${isDragging ? '2px dashed #C7FFBD' : errors?.thumbnail ? '2px dashed #ff0000' : ''}` }}
                    >
                      <input
                        type="file"
                        name="thumbnail"
                        id="thumbnail"
                        accept="image/*"
                        {...register('thumbnail', {
                          required: thumbnailField ? false : validationErrors.required
                        })}
                        hidden
                        onChange={(e) => {
                          handleArtworkChange(e, false)
                        }}
                      />

                      {thumbnailField && (
                        <div className="uploaded-file">
                          <img className="img" src={thumbnailField?.url} alt="thumbnail image" />
                        </div>
                      )}

                      {!thumbnailField && (
                        <div className="upload-desc">
                          <h6>Drag & Drop files here to upload</h6>
                          <label htmlFor="thumbnail" className="browse-btn">
                            Browse File
                          </label>
                          <span>Max size limit - 100MB</span>
                        </div>
                      )}

                      {thumbnailField && (
                        <div>
                          <label htmlFor="thumbnail" className="change-img-btn">
                            Change thumbnail
                          </label>
                        </div>
                      )}
                    </div>
                    {errors?.thumbnail && (
                      <Form.Control.Feedback type="invalid" className="invalidFeedback">
                        {errors?.thumbnail?.message}
                      </Form.Control.Feedback>
                    )}
                    <h6 className="heading second">Blog or Vlog Heading</h6>
                  </div>
                </Col>
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label>Choose a Community</Form.Label>
                    <Controller
                      name="communityId"
                      control={control}
                      rules={{ required: validationErrors.required }}
                      render={({ field: { onChange, value = [], ref } }) => (
                        <Select
                          value={value}
                          ref={ref}
                          className={`react-select ${errors?.communityId && 'error'}`}
                          classNamePrefix="select"
                          formatOptionLabel={getCommunityFormattedLabel}
                          getOptionValue={(option) => option.id}
                          getOptionLabel={(option) => option.name}
                          isSearchable
                          options={communities}
                          onMenuScrollToBottom={handleScroll}
                          onInputChange={(value, action) => optimizedSearch(value, action)}
                          onChange={(e) => {
                            onChange(e)
                          }}
                        />
                      )}
                    />
                    {errors?.communityId && (
                      <Form.Control.Feedback type="invalid" className="invalidFeedback">
                        {errors?.communityId?.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                  <div className="button-footer">
                    <Button className="white-border-btn" as={Link} to={allRoutes.community} disabled={loading}>
                      Go Back
                    </Button>
                    <Button className="white-btn" type="submit" disabled={loading}>
                      Finish
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          </Form>
        </Row>
      </Container>
    </section>
  )
}

export default WithAuth(FinalizePost)
