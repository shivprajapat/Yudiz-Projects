import React from 'react'
import dynamic from 'next/dynamic'
import { Row, Col } from 'react-bootstrap'

const Skeleton = dynamic(() => import('..'), { ssr: false })

function AuthorListSkeleton() {
  return (
    <div className="bg-white p-3" style={{ borderRadius: '12px', marginBottom: '10px' }}>
      <Row>
        <Col xs="5">
          <Skeleton height="128px" radius="12px" />
        </Col>
        <Col className="d-flex flex-column">
          <div className="flex-grow-1">
            <Skeleton height="20px" width="40%" radius="5px" className="mb-2" />
            <Skeleton height="15px" width="50%" radius="5px" className="mb-2" />
            <Row>
              <Col xs="6">
                <Skeleton height="15px" width="50%" radius="5px" className="mb-2" />
              </Col>
              <Col xs="6">
                <Skeleton height="15px" width="50%" radius="5px" className="mb-2" />
              </Col>
            </Row>
          </div>
          <div className="flex-shrink-0">
            <Skeleton height="15px" width="50%" radius="5px" />
          </div>
        </Col>
      </Row>
    </div>
  )
}
export default AuthorListSkeleton
