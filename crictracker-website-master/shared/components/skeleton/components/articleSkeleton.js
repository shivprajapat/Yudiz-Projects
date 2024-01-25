import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'
import { Col, Row } from 'react-bootstrap'

const Skeleton = dynamic(() => import('..'), { ssr: false })

function ArticleSkeleton({ type }) {
  return (
    <div className="bg-white p-3" style={{ borderRadius: '12px', marginBottom: '10px' }}>
      {type === 's' && (
        <Row>
          <Col sm={3} xs={5}>
            <Skeleton height={'100%'} radius="5px" />
          </Col>
          <Col sm={9} xs={7} className="d-flex flex-column justify-content-between">
            <Skeleton height={'15px'} />
            <Skeleton width={'50%'} height={'15px'} className="mt-2" />
            <Skeleton height={'8px'} className="mt-3" />
            <Skeleton height={'8px'} className="mt-2" />
            <Skeleton height={'8px'} width={'40px'} className="mt-2 mb-4" />
          </Col>
        </Row>
      )}
      {type === 'g' && (
        <>
          <Skeleton height={'150px'} radius="5px" className={'mb-3'} />
          <Skeleton height={'15px'} />
          <Skeleton height={'15px'} width={'50%'} className={'mt-2'} />
        </>
      )}
      {type === 't' && (
        <div className="d-flex align-items-center">
          <Skeleton height={'60px'} radius={'100%'} width={'60px'} className={'me-2'} />
          <Skeleton height={'15px'} width={'100px'} />
        </div>
      )}
    </div>
  )
}
ArticleSkeleton.propTypes = {
  type: PropTypes.string
}
export default ArticleSkeleton
