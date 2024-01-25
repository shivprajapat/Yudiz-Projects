import React from 'react'
import { Col, Row } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import './style.scss'
import { CommunityMain, CommunitySideBar, ViewCommunity, WriteInCommunity } from './components'
import { allRoutes } from 'shared/constants/allRoutes'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'
import MyPosts from './components/my-posts'

const Community = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const isAuthenticated = localStorage.getItem('userToken')
  const userStore = useSelector((state) => state.user.user)

  const handleCommunityCreation = () => {
    if (!isAuthenticated) {
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: 'Please Login to continue',
          type: TOAST_TYPE.Error
        }
      })
    }
  }

  const handleCommunityCreationForVerifiedUsers = () => {
    if (!userStore.kycVerified) {
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: 'Please verify your KYC to proceed',
          type: TOAST_TYPE.Error
        }
      })
    }
  }
  return (
    <>
      <section className="communities">
        <div className="container-fluid">
          <Row>
            {id ? (
              <Col xxl={12}>
                <ViewCommunity id={id} handleCommunityCreationForVerifiedUsers={handleCommunityCreationForVerifiedUsers} />
              </Col>
            ) : (
              <>
                <Col xxl={8} lg={8}>
                  <Link
                    state={!isAuthenticated && { previousPath: location.pathname }}
                    to={isAuthenticated ? (userStore?.kycVerified ? allRoutes.createPost : allRoutes.community) : allRoutes.login}
                    onClick={handleCommunityCreation}
                  >
                    <WriteInCommunity handleCommunityCreationForVerifiedUsers={handleCommunityCreationForVerifiedUsers} />
                  </Link>
                </Col>
                <Col xxl={4} lg={4}>
                  {isAuthenticated && <MyPosts />}
                </Col>
              </>
            )}

            <Col xxl={8} lg={8} md={6}>
              <CommunityMain id={id} />
            </Col>

            <Col xxl={4} lg={4} md={6}>
              <CommunitySideBar />
            </Col>
          </Row>
        </div>
      </section>
    </>
  )
}

export default Community
