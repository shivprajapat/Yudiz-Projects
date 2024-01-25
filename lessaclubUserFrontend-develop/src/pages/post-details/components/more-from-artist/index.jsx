import React, { Suspense, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import { getPosts } from 'modules/post/redux/service'
import { SingleCommunityPost } from 'pages/community/components'

const CustomPagination = React.lazy(() => import('shared/components/custom-pagination'))

const MoreFromArtist = ({ creatorId }) => {
  const dispatch = useDispatch()

  const [requestParams, setRequestParams] = useState({ page: 1, perPage: 12, createdBy: creatorId })
  const [posts, setPosts] = useState()

  const postStore = useSelector((state) => state.post.posts)

  useEffect(() => {
    if (postStore?.communityAsset) {
      setPosts(postStore)
    }
  }, [postStore])

  useEffect(() => {
    dispatch(getPosts(requestParams))
  }, [requestParams])

  const handlePageChange = (page) => {
    setRequestParams({ ...requestParams, page })
  }

  return (
    <>
      {posts?.communityAsset?.length > 0 && (
        <>
          <section className="section-padding more-from-artist" id="more-from-artist-post">
            <Row>
              {posts.communityAsset.map((post) => (
                <SingleCommunityPost key={post?.id} post={post} />
              ))}
            </Row>
          </section>
        </>
      )}

      <Suspense fallback={<div />}>
        <CustomPagination
          currentPage={requestParams?.page}
          totalCount={posts?.metaData?.totalItems}
          pageSize={12}
          onPageChange={handlePageChange}
          id="more-from-artist-post"
        />
      </Suspense>
    </>
  )
}
MoreFromArtist.propTypes = {
  creatorId: PropTypes.string
}
export default MoreFromArtist
