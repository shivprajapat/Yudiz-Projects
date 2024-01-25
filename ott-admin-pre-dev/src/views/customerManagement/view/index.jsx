/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { useParams } from 'react-router-dom'
import userImage from 'assets/images/user-pic.jpg'
import { viewUser, viewUserOprations } from 'query/user/user.query'
import { useQuery } from 'react-query'
import DataTable from 'shared/components/data-table'
import CustomerViewItemRow from 'shared/components/customer-view-item-row'

function CustomerView() {
  const paramsData = {
    size: 10,
    search: '',
    pageNumber: 1,
    eStatus: 'y',
    startDate: '',
    endDate: '',
    date: '',
    sort: '',
    column: '',
    orderBy: 1
  }
  const [requestParams, setRequestParams] = useState(paramsData)
  const [userData, setUserData] = useState()
  const [logData, setLogData] = useState()
  const { id } = useParams()

  useQuery('view-user', () => viewUser(id), {
    select: (data) => data.data.data,
    onSuccess: (response) => {
      setUserData(response?.oUser)
    },
    onError: () => {
      setUserData()
    }
  })

  useQuery('view-user-oprations', () => viewUserOprations(id, requestParams), {
    select: (data) => data.data.data,
    onSuccess: (response) => {
      setLogData(response)
    },
    onError: (error) => {
      setLogData()
    }
  })

  const tableColumns = [
    { name: 'Remote Address', internalName: 'sRemoteAddress', type: 0 },
    { name: 'Device', internalName: 'oDeviceInfo.eDeviceType', type: 0 },
    { name: 'Device Token', internalName: 'oDeviceInfo.sDeviceToken', type: 0 },
    { name: 'Mobile', internalName: 'oMeta.sMobile', type: 0 },
    { name: 'OTP', internalName: 'oMeta.sCode', type: 0 },
    { name: 'Oprations', internalName: 'sOperation', type: 0 },
    { name: 'watch History', internalName: 'sSubOperation', type: 0 },
    { name: 'watch Percentage', internalName: 'oWatchedInfo?.watchedPercentage', type: 0 },
    { name: 'Movie Name', internalName: 'movies?.sName', type: 0 },
    { name: 'Web Series Name', internalName: 'episodes?.sName', type: 0 },
    { name: 'Season', internalName: 'seasons?.sSeasonNumber', type: 0 },
    { name: 'Episode', internalName: 'episodes?.sEpisodeNumber', type: 0 },
    { name: 'Date Created', internalName: 'dCreatedDate', type: 0 }
  ]
  const [columns] = useState(tableColumns)
  return (
    <div className='end-user-details'>
      <div>
        <div className='d-flex'>
          <div className='img-box'>
            <img src={userData?.sAvatar ? userData?.sAvatar : userImage} alt={userData?.sFullName} />
          </div>
          <div className='user-personal-info'>
            <h4>{userData?.sFullName ? userData?.sFullName : userData?.sUserName}</h4>
            <h5 className='username'>{userData?.eUserType || '-'}</h5>
            <Row className='mt-5'>
              <Col sm={4}>
                <div className='d-flex item'>
                  <p className='label'>
                    <FormattedMessage id='email' />
                  </p>
                  <p className='form-data'>: {userData?.sEmail || '-'}</p>
                </div>
              </Col>
              <Col sm={4}>
                <div className='d-flex item'>
                  <p className='label'>
                    <FormattedMessage id='Email Verified' />
                  </p>
                  <p className='form-data'>{userData?.isEmailVerified ? 'Yes' : 'No'}</p>
                </div>
              </Col>
              <Col sm={3}>
                <div className='d-flex item'>
                  <p className='label'>
                    <FormattedMessage id='Status' />
                  </p>
                  <p className='form-data'>{userData?.eStatus || '-'}</p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={4}>
                <div className='d-flex item'>
                  <p className='label'>
                    <FormattedMessage id='phoneNumber' />
                  </p>
                  <p className='form-data'> {userData?.sMobile || '-'}</p>
                </div>
              </Col>
              <Col sm={4}>
                <div className='d-flex item'>
                  <p className='label'>
                    <FormattedMessage id='Mobile Verified' />
                  </p>
                  <p className='form-data'>{userData?.isMobileVerified ? 'Yes' : 'No'}</p>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      <hr />
      <Row>
        <Col sm={12} className='mt-5'>
          <h1 className='label'>
            <FormattedMessage id='Operational Log' />
          </h1>
        </Col>
      </Row>
      <DataTable columns={columns}>
        {logData?.operations?.map((user, index) => {
          return <CustomerViewItemRow key={user._id} index={index} user={user} />
        })}
      </DataTable>
    </div>
  )
}

export default CustomerView
