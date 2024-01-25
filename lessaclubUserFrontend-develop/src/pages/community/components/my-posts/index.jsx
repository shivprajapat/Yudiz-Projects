import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { getMyPosts } from 'modules/post/redux/service'
import { allRoutes } from 'shared/constants/allRoutes'
import { userProfileIcon } from 'assets/images'

const MyPosts = () => {
  const dispatch = useDispatch()
  const userId = localStorage.getItem('userId')

  const [myPosts, setMyPosts] = useState()

  const postStore = useSelector((state) => state.post.myPosts)

  useEffect(() => {
    if (postStore?.communityAsset) {
      setMyPosts(postStore)
    }
  }, [postStore])

  useEffect(() => {
    dispatch(getMyPosts({ page: 1, perPage: 2, createdBy: userId }))
  }, [])

  return (
    <>
      <div className="item">
        <div className="item-head">
          <h6>My posts</h6>
          {myPosts?.communityAsset?.length > 0 && (
            <Button className="view-all btn" as={Link} to={allRoutes.myPosts}>
              View all
            </Button>
          )}
        </div>
        <div className="items-box">
          {myPosts?.communityAsset?.length ? (
            myPosts?.communityAsset?.map((post, index) => index <= 2 && <SingleMyPost key={post.id} post={post} />)
          ) : (
            <div className="no-community">No posts</div>
          )}
        </div>
      </div>
    </>
  )
}

export default MyPosts

const SingleMyPost = ({ post }) => {
  return (
    <div className="item_box">
      <Link className="item-user-img" to={allRoutes.postDetails(post.id)}>
        <img src={post?.thumbNailUrl || userProfileIcon} alt="user-img" className="img-fluid" />
        <span className="user-id">{post?.title}</span>
      </Link>
      <Button className="black-btn" as={Link} to={allRoutes.postDetails(post.id)}>
        View
      </Button>
    </div>
  )
}
SingleMyPost.propTypes = {
  post: PropTypes.object
}
