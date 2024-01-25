import React, { useEffect, useRef, useState } from 'react'
import { Container, Row, Col, Button, Form, Tabs, Tab, Spinner } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FormProvider, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'

import './style.scss'
import { arrowBackIcon } from 'assets/images'
import WithAuth from 'shared/components/with-auth'
import BlogTab from './components/blog-tab'
import VlogTab from './components/vlog-tab'
import { createPost, getPostDetails, updatePost, uploadBlogContent } from 'modules/post/redux/service'
import { allRoutes } from 'shared/constants/allRoutes'
import { getPreSignedUrl } from 'shared/functions'
import { updateToS3 } from 'shared/utils'
import { validationErrors } from 'shared/constants/validationErrors'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'

const CreatePost = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const postDataRef = useRef()

  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState()

  const formMethods = useForm({ mode: 'all' })

  const uploadBlogContentStore = useSelector((state) => state.post.uploadBlogContent)
  const resError = useSelector((state) => state.post.resError)
  const postDetailsStore = useSelector((state) => state.post.postDetails)

  useEffect(() => {
    if (id) {
      dispatch(getPostDetails(id))
    } else {
      setTab('blog')
    }
  }, [id])

  useEffect(async () => {
    if (postDetailsStore?.communityAsset) {
      const { communityAsset } = postDetailsStore
      if (communityAsset?.blogType === 2) {
        setTab('blog')
        document.body.classList.add('global-loader')
        formMethods.reset({
          blog: {
            title: communityAsset?.title,
            description: communityAsset?.description,
            content: await fetch(communityAsset?.contentUrl).then((res) =>
              res.text().catch((err) =>
                dispatch({
                  type: SHOW_TOAST,
                  payload: {
                    message: err?.message || validationErrors.serverError,
                    type: TOAST_TYPE.Error
                  }
                })
              )
            )
          }
        })
        document.body.classList.remove('global-loader')
      } else {
        setTab('vlog')
        formMethods.reset({
          vlog: {
            title: communityAsset?.title,
            description: communityAsset?.description,
            video: {
              files: {
                url: communityAsset?.contentUrl,
                updated: false
              }
            }
          }
        })
      }
    }
  }, [postDetailsStore])

  useEffect(() => {
    if (resError) {
      setLoading(false)
    }
  }, [resError])

  useEffect(() => {
    if (uploadBlogContentStore?.uploadedContent) {
      addEditPost(uploadBlogContentStore?.uploadedContent?.contentUrl)
    }
  }, [uploadBlogContentStore])

  const handleTabChange = (tabName) => {
    setTab(tabName)
  }

  const onSubmit = (data, type) => {
    if (tab === 'blog') {
      postDataRef.current = { ...data.blog, type }
      setLoading(true)
      dispatch(uploadBlogContent({ content: data.blog.content }))
    } else if (tab === 'vlog') {
      postDataRef.current = { ...data.vlog, type }
      setLoading(true)

      if (data?.vlog?.video?.files?.updated) {
        getPreSignedUrl({ fileName: data?.vlog?.video?.files?.fileObject?.name }).then((res) => {
          updateToS3(data?.vlog?.video?.files?.fileObject, res?.data?.result?.file?.url)
            .then((res) => {
              addEditPost(res)
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
        addEditPost(data?.vlog?.video?.files?.url)
      }
    }
  }

  const addEditPost = (contentUrl) => {
    const postData = postDataRef.current
    const blogType = tab === 'blog' ? 2 : 1

    if (id) {
      dispatch(
        updatePost(
          id,
          { title: postData?.title, description: postData?.description, contentUrl: contentUrl, blogType: blogType, status: 1 },
          () => {
            setLoading(false)
            postData.type === 'publish' ? navigate(allRoutes.finalizePost(id)) : navigate(allRoutes.community)
          }
        )
      )
    } else {
      dispatch(
        createPost(
          { title: postData?.title, description: postData?.description, contentUrl: contentUrl, blogType: blogType, status: 1 },
          (resData) => {
            setLoading(false)
            postData.type === 'publish' ? navigate(allRoutes.finalizePost(resData?.communityAsset?.id)) : navigate(allRoutes.community)
          }
        )
      )
    }
  }

  return (
    <section className="create_post section-padding">
      <Container>
        <Row>
          <Col md={12}>
            <div className="back-arrow-box">
              <Button className="back-btn" as={Link} to={allRoutes.community}>
                <img src={arrowBackIcon} alt="" />
              </Button>
              <h3 className="arrow-heading">Create Your Blog / Vlog</h3>
            </div>
          </Col>
          <Col md={12}>
            <Form autoComplete="off">
              <div className="tab">
                <div className="publish-btn">
                  <Button
                    className="white-btn mr-2"
                    disabled={loading}
                    onClick={(() => {
                      if (tab === 'blog') {
                        return formMethods.handleSubmit((data) => onSubmit(data, 'draft'))
                      } else {
                        return formMethods.handleSubmit((data) => onSubmit(data, 'draft'))
                      }
                    })()}
                  >
                    Draft
                    {postDataRef?.current?.type === 'draft' && loading && <Spinner animation="border" size="sm" />}
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    onClick={(() => {
                      if (tab === 'blog') {
                        return formMethods.handleSubmit((data) => onSubmit(data, 'publish'))
                      } else return formMethods.handleSubmit((data) => onSubmit(data, 'publish'))
                    })()}
                    className="white-btn"
                  >
                    Publish
                    {postDataRef?.current?.type === 'publish' && loading && <Spinner animation="border" size="sm" />}
                  </Button>
                </div>
                <FormProvider {...formMethods}>
                  <Tabs activeKey={tab} className="mb-3" onSelect={handleTabChange}>
                    <Tab eventKey="blog" title="Blog">
                      <BlogTab currentTab={tab} />
                    </Tab>
                    <Tab eventKey="vlog" title="Vlog">
                      <VlogTab currentTab={tab} />
                    </Tab>
                  </Tabs>
                </FormProvider>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default WithAuth(CreatePost)
