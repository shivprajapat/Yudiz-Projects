import React from 'react'
import { Col } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { S3_PREFIX } from 'shared/constants'
import BlueTick from 'assets/images/blue-tick.svg'

const SingleImage = ({ data, handleId, selectedImageId }) => {
  const handleClick = () => {
    handleId(data)
  }

  return (
    <>
      <Col xl={2} md={2} xs={3} className="mt-1">
        <div className={`media-item ${selectedImageId?._id === data?._id ? 'selected' : ''}`} id={data._id}>
          <img className="square-img" src={data?.sUrl && S3_PREFIX + data?.sUrl} onClick={handleClick} />
          <div className="icon">
            <img src={BlueTick} />
          </div>
        </div>
      </Col>
    </>
  )
}

SingleImage.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  handleId: PropTypes.func,
  selectedImageId: PropTypes.object
}

export default SingleImage
