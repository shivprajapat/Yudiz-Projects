import React from 'react'
import { Button, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import './style.scss'
import { userProfileIcon, checkStarIcon } from 'assets/images'
import { allRoutes } from 'shared/constants/allRoutes'
import DropStartsOrEndsIn from 'shared/components/drop-starts-or-ends-in'

const DropShow = ({ drop }) => {
  return (
    <Col md={6} lg={4} xl={3}>
      <div className="single-drop-list">
        <div className="mark-priv-user d-flex justify-content-between align-items-center">
          <div className="user-details d-flex align-items-center">
            <div className="grid-user-img">
              <img src={drop?.creator?.profilePicUrl || userProfileIcon} alt="user-img" className="img-fluid" />
              <img src={checkStarIcon} alt="user-img" className="img-fluid check-img" />
            </div>
            <span className="user-id">{drop?.creator?.userName}</span>
            <Link to={allRoutes.creatorCollected(drop?.creator?.id)}></Link>
          </div>
        </div>
        <figure>
          <img src={drop?.photo} alt="drop" className="img-fluid" loading="lazy" />
          <span className="img-title">{drop?.name}</span>
        </figure>
        <div className="figure-description">
          <p className="img-title-desc">{drop?.description}</p>
        </div>

        <div className="auction">
          <DropStartsOrEndsIn isAssetList endTime={drop?.endTime} startTime={drop?.startTime} isExpired={drop?.isExpired} />
          {!drop.isExpired && (
            <Button as={Link} to={allRoutes.dropAssets(drop.id)} className="white-btn">
              View
            </Button>
          )}
        </div>
        {!drop.isExpired && <Link to={allRoutes.dropAssets(drop.id)} className="grid-inner-link"></Link>}
      </div>
    </Col>
  )
}
DropShow.propTypes = {
  drop: PropTypes.object
}
export default DropShow
