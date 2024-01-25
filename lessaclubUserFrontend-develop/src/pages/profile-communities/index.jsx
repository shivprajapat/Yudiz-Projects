import React, { Suspense, useEffect, useState } from 'react'
import { Col, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import ProfileCommunityList from './components/profile-community-list'
import { getMyCommunities } from 'modules/communities/redux/service'
import './style.scss'

const CustomPagination = React.lazy(() => import('shared/components/custom-pagination'))

const ProfileCommunities = () => {
  const userId = localStorage.getItem('userId')
  const dispatch = useDispatch()

  const [communities, setCommunities] = useState()
  const [requestParams, setRequestParams] = useState({ createdBy: userId, page: 1, perPage: 10 })

  const myCommunitiesStore = useSelector((state) => state.communities.myCommunities)

  useEffect(() => {
    dispatch(getMyCommunities(requestParams))
  }, [requestParams])

  useEffect(() => {
    if (myCommunitiesStore?.community) {
      setCommunities(myCommunitiesStore?.community)
    }
  }, [myCommunitiesStore])

  const handlePageChange = (page) => {
    setRequestParams({ ...requestParams, page })
  }

  return (
    <div className="profile_communities" id="profile-communities">
      <Col lg={10} className="mx-auto">
        <div className="table-responsive">
          <Table size="sm">
            <thead>
              <tr>
                <th>Community </th>
                <th colSpan={2}>Members</th>
                <th style={{ textAlign: 'left' }}>Created On</th>
              </tr>
            </thead>
            {communities?.length > 0 ? (
              <tbody>
                {communities.map((community) => (
                  <ProfileCommunityList key={community?.id} community={community} />
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td>No Community</td>
                </tr>
              </tbody>
            )}
          </Table>
        </div>
      </Col>
      <Suspense fallback={<div />}>
        <CustomPagination
          currentPage={requestParams?.page}
          totalCount={myCommunitiesStore?.metaData?.totalItems}
          pageSize={10}
          onPageChange={handlePageChange}
          id="profile-communities"
        />
      </Suspense>
    </div>
  )
}

export default ProfileCommunities
