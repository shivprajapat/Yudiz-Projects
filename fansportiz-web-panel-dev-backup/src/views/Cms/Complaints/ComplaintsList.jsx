import React, { useEffect, useState } from 'react'
import { Button, Alert } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import Skeleton from 'react-loading-skeleton'
import { useLocation, useNavigate } from 'react-router-dom'
import 'react-loading-skeleton/dist/skeleton.css'

// APIs
import useComplaintsList from '../../../api/complaints/queries/useComplaintsList'

const classNames = require('classnames')

function ComplaintsList () {
  const navigate = useNavigate()
  const location = useLocation()

  const [message, setMessage] = useState('')
  const [alert, setAlert] = useState(false)

  const { data: complaintList, isLoading: isComplaintListLoading } = useComplaintsList()

  useEffect(() => {
    if (location && location.state && location.state.resMessage) {
      setMessage(location.state.resMessage)
      setAlert(true)
      setTimeout(() => {
        setAlert(false)
      }, 2000)
    }
  }, [])

  function getComplaintStatus (status) {
    if (status === 'P') {
      return <FormattedMessage id='Pending' >{msg => msg}</FormattedMessage>
    } if (status === 'I') {
      return <FormattedMessage id='In-Progress' >{msg => msg}</FormattedMessage>
    } if (status === 'D') {
      return <FormattedMessage id='Declined' >{msg => msg}</FormattedMessage>
    } if (status === 'R') {
      return <FormattedMessage id='Resolved' >{msg => msg}</FormattedMessage>
    }
    return ''
  }

  return (
    <>
      {alert
        ? (
          <Alert color="primary" isOpen={alert}>
            {message}
          </Alert>
          )
        : ''}
      <div className="user-container with-footer">
        {isComplaintListLoading &&
          Array(5).fill().map((item) => (
            <div key={item} className="complaint-box">
              <Skeleton height={20} width={200} />
              <Skeleton className="my-2" height={10} width={`${100}%`} />
              <Skeleton className="my-2" height={10} width={`${50}%`} />
              <div className="text-end d-flex justify-content-end">
                <Skeleton height={10} width={70} />
              </div>
            </div>
          ))}
        {complaintList?.length > 0
          ? complaintList?.map((data) => (
            <div
              key={data._id}
              className={classNames('complaint-box', { readed: data.eStatus === 1 })}
              onClick={() => navigate(`/complaints/${data._id}`)}
              onFocus={(e) => e.preventDefault}
              onKeyDown={(e) => e.preventDefault}
              role="button"
              tabIndex="0"
            >
              <div className="align-items-center justify-content-between footer-m d-flex">
                <span className="time">
                  {new Intl.DateTimeFormat('en-GB', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour12: true
                  }).format(new Date(data.dCreatedAt))}
                </span>
                {
                      data?.eStatus && (
                        <Button className={`complain-status ${getComplaintStatus(data?.eStatus)?.props?.id}`}>
                          {getComplaintStatus(data?.eStatus)}
                        </Button>
                      )
                    }
              </div>
              <h3 className="mt-2">{data.sTitle}</h3>
              <p>{data && data.sDescription && data.sDescription.length > 100 ? data && `${data.sDescription.slice(0, 100)}...` : data && data.sDescription}</p>
            </div>
          ))
          : complaintList && complaintList.length === 0 &&
            (
              <div className="no-team complaint-page d-flex align-items-center justify-content-center">
                <div className="">
                  <i className="icon-trophy" />
                  <h6 className="m-3"><FormattedMessage id="No_data_found_Please_check_back_after_while" /></h6>
                </div>
              </div>
            )}
        <div className="btn-bottom p-0 text-center">
          <Button className="w-100" color="primary-two" onClick={() => navigate('/contact-us')} type="submit"><FormattedMessage id="Add_Complaint_or_Feedback" /></Button>
        </div>
      </div>
    </>
  )
}

export default ComplaintsList
