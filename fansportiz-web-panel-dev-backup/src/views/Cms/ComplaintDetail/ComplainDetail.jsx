import React, { useEffect } from 'react'
import { Button } from 'reactstrap'
import { useParams } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'

// Components
import Loading from '../../../component/Loading'

// APIs
import useComplaintDetails from '../../../api/complaints/queries/useComplaintDetails'
import useGetUrl from '../../../api/url/queries/useGetUrl'

const classNames = require('classnames')

function ComplainDetail (props) {
  const {
    getTitle
  } = props

  const { sComplaintId } = useParams()
  const { sMediaUrl } = useGetUrl()

  const { data: complaintDetails, isLoading: isComplaintDetailsLoading } = useComplaintDetails(sComplaintId)

  useEffect(() => {
    if (complaintDetails) {
      getTitle(complaintDetails?.eType === 'C' ? <FormattedMessage id='Complaint Details' /> : <FormattedMessage id='Feedback Details' />)
    }
  }, [complaintDetails])

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

  if (isComplaintDetailsLoading) {
    return <Loading />
  }

  return (
    <>
      <div className="user-container bg-white">
        <div className={classNames('complaint-box', { readed: complaintDetails?.eStatus === 1 })}>
          <div className="align-items-center justify-content-between footer-m d-flex">
            {complaintDetails && complaintDetails.dCreatedAt && (
              <span className="time">
                {new Intl.DateTimeFormat('en-GB', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour12: true
                }).format(new Date(complaintDetails.dCreatedAt))}

              </span>
            )}
            {complaintDetails?.eStatus && (
              <Button className={`complain-status ${getComplaintStatus(complaintDetails?.eStatus)?.props?.id}`}>
                {getComplaintStatus(complaintDetails?.eStatus)}
              </Button>
            )}
          </div>
          <h3 className="mt-2">{complaintDetails?.sTitle}</h3>
          <p>{complaintDetails?.sDescription}</p>
          {complaintDetails?.sImage && sMediaUrl && (
            <img alt="" className="square-image" src={complaintDetails?.sImage ? sMediaUrl + complaintDetails.sImage : ''} />
          )}
          <hr />
          {complaintDetails && complaintDetails.sComment && (
            <>
              <h4 className="mt-3 comment"><FormattedMessage id="Reply" /></h4>
              <p>{complaintDetails?.sComment}</p>
            </>
          )}
        </div>
      </div>
    </>
  )
}

ComplainDetail.propTypes = {
  getTitle: PropTypes.func.isRequired
}

export default ComplainDetail
