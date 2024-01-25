import React, { useEffect, useState, Suspense } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import './style.scss'
import SingleCommunity from './components/single-community'
import { arrowBackIcon } from 'assets/images'
import { getAllCommunities, getPopularCommunities } from 'modules/communities/redux/service'
import { getFollowedCommunity } from 'modules/follower/redux/service'

const CustomPagination = React.lazy(() => import('shared/components/custom-pagination'))

const Communities = () => {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const type = searchParams.get('type')
  const userId = localStorage.getItem('userId')

  const [communities, setCommunities] = useState()

  const allCommunityStore = useSelector((state) => state.communities.allCommunities)
  const getFollowedCommunityStore = useSelector((state) => state.follower.getFollowedCommunity)
  const popularCommunitiesStore = useSelector((state) => state.communities.popularCommunities)

  const [requestParams, setRequestParams] = useState(getRequestParams())

  useEffect(() => {
    if (type === 'own') {
      dispatch(getAllCommunities(requestParams))
    } else if (type === 'popular') {
      dispatch(getPopularCommunities(requestParams))
    } else if (!type) {
      dispatch(getFollowedCommunity({ page: 1, perPage: 5, userId: userId }))
    }
  }, [requestParams])

  useEffect(() => {
    if (getFollowedCommunityStore?.communityFollower && (!type || type === 'regular')) {
      setCommunities(getFollowedCommunityStore)
    }
  }, [getFollowedCommunityStore])

  useEffect(() => {
    if (allCommunityStore?.community && type === 'own') {
      setCommunities(allCommunityStore)
    }
  }, [allCommunityStore])

  useEffect(() => {
    if (popularCommunitiesStore?.community && type === 'popular') {
      setCommunities(popularCommunitiesStore)
    }
  }, [popularCommunitiesStore])

  const handlePageChange = (page) => {
    setRequestParams({ ...requestParams, page })
  }

  function getRequestParams() {
    if (type === 'own') {
      return { createdBy: userId, page: 1, perPage: 10 }
    } else if (type === 'popular') {
      return { page: 1, perPage: 10, sortColumn: 'followerCount', sortOrder: -1 }
    } else {
      return { page: 1, perPage: 10 }
    }
  }
  const communityToBeMapped = !type || type === 'regular' ? communities?.communityFollower : communities?.community

  return (
    <section className="communities section-padding">
      <Container id="single-community">
        <Row>
          <Col md={12}>
            <div className="back-arrow-box">
              <Button className="back-btn" onClick={() => navigate(-1)}>
                <img src={arrowBackIcon} alt="back button" />
              </Button>
              <h3 className="arrow-heading">{type === 'own' ? 'Your' : ''} Communities</h3>
            </div>
          </Col>
          <Col md={12}>
            {communityToBeMapped?.length > 0 ? (
              communityToBeMapped?.map((community) => <SingleCommunity key={community?.id} community={community} type={type} />)
            ) : (
              <div className="no-communities">No communities found</div>
            )}
          </Col>
        </Row>
        <Suspense fallback={<div />}>
          <CustomPagination
            currentPage={requestParams?.page}
            totalCount={communities?.metaData?.totalItems}
            pageSize={10}
            onPageChange={handlePageChange}
            id="single-community"
          />
        </Suspense>
      </Container>
    </section>
  )
}

export default Communities
