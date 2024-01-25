import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { getMyPosts } from 'modules/post/redux/service'
import { SingleCommunityPost } from 'pages/community/components'
import { arrowBackIcon } from 'assets/images'
import WithAuth from 'shared/components/with-auth'

const CustomPagination = React.lazy(() => import('shared/components/custom-pagination'))

const MyPosts = () => {
  const dispatch = useDispatch()
  const userId = localStorage.getItem('userId')
  const navigate = useNavigate()

  const [myPosts, setMyPosts] = useState()
  const [requestParams, setRequestParams] = useState({ page: 1, perPage: 9, createdBy: userId })

  const postStore = useSelector((state) => state.post.myPosts)

  useEffect(() => {
    if (postStore?.communityAsset) {
      setMyPosts(postStore)
    }
  }, [postStore])

  useEffect(() => {
    dispatch(getMyPosts(requestParams))
  }, [requestParams])

  const onPageChange = (page) => {
    setRequestParams({ ...requestParams, page })
  }

  return (
    <section className="section-padding">
      <Container id="my-posts">
        <Col md={12}>
          <div className="back-arrow-box">
            <Button className="back-btn" onClick={() => navigate(-1)}>
              <img src={arrowBackIcon} alt="back button" />
            </Button>
            <h3 className="arrow-heading">Your Posts</h3>
          </div>
        </Col>
        <Row className="flex-wrap">
          {myPosts?.communityAsset?.length ? (
            myPosts?.communityAsset?.map((post) => <SingleCommunityPost key={post.id} post={post} />)
          ) : (
            <h4>No posts Found</h4>
          )}
        </Row>
      </Container>
      <CustomPagination
        currentPage={requestParams?.page}
        totalCount={myPosts?.metaData?.totalItems}
        pageSize={9}
        onPageChange={onPageChange}
        id="my-posts"
      />
    </section>
  )
}

export default WithAuth(MyPosts)
