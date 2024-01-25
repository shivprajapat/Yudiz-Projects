import { getPosts } from 'modules/post/redux/service'
import React, { useEffect, useState } from 'react'
import { Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import CustomPagination from 'shared/components/custom-pagination'
import SingleCommunityPost from '../single-community-post'

const CommunityMain = ({ id }) => {
  const dispatch = useDispatch()

  const [requestParams, setRequestParams] = useState({ page: 1, perPage: 9, likedByLoggedInUser: true, status: 2 })
  const [posts, setPosts] = useState()

  const postStore = useSelector((state) => state.post.posts)

  useEffect(() => {
    if (postStore?.communityAsset) {
      setPosts(postStore)
    }
  }, [postStore])

  useEffect(() => {
    if (id) {
      dispatch(getPosts({ ...requestParams, communityId: id }))
    } else if (!id) {
      dispatch(getPosts(requestParams))
    }
  }, [id, requestParams])

  const onPageChange = (page) => {
    setRequestParams({ ...requestParams, page })
  }

  return (
    <div className="d-flex flex-column" id="post-list">
      <Row className="flex-wrap">
        {posts?.communityAsset?.length ? (
          posts?.communityAsset?.map((post) => {
            return <SingleCommunityPost key={post.id} post={post} />
          })
        ) : (
          <h4>No posts found</h4>
        )}
        <CustomPagination
          currentPage={requestParams?.page}
          totalCount={posts?.metaData?.totalItems}
          pageSize={9}
          onPageChange={onPageChange}
          id="post-list"
        />
      </Row>
    </div>
  )
}
CommunityMain.propTypes = {
  id: PropTypes.string
}
export default CommunityMain
