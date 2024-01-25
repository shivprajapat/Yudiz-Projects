import React from 'react'
import dynamic from 'next/dynamic'
import { Row, Col } from 'react-bootstrap'

const Skeleton = dynamic(() => import('..'), { ssr: false })

function ArticleListSkeleton() {
  return (
    <div className="bg-white p-3" style={{ borderRadius: '12px', marginBottom: '10px' }}>
      <Row className="justify-content-between">
        <Col sm={6} xs={5}>
          <Skeleton height="20px" radius="5px" className="mb-3" />
          <Skeleton height="15px" width="60%" radius="5px" />
        </Col>
        <Col sm={3} xs={5} className="d-flex flex-column align-items-end">
          <Skeleton height="25px" width="30px" radius="5px" className="mb-2 me-1" />
          <Skeleton height="20px" width="40px" radius="5px" />
        </Col>
      </Row>
    </div>
  )
}
export default ArticleListSkeleton
