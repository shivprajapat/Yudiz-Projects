import React, { useEffect, useState } from 'react'
import { Button, Container, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { getDrops } from 'modules/drop/redux/service'
import './style.scss'
import DropShow from 'shared/components/drop-show'
import { arrowBackIcon } from 'assets/images'
import WithAuth from 'shared/components/with-auth'

const CustomPagination = React.lazy(() => import('shared/components/custom-pagination'))

const Drop = () => {
  const userId = localStorage.getItem('userId')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [requestParams, setRequestParams] = useState({ page: 1, perPage: 12, createdBy: userId, isExpired: false })
  const [drops, setDrops] = useState()

  const dropStore = useSelector((state) => state.drop.getDrops)

  useEffect(() => {
    if (dropStore?.nftDrop) {
      setDrops(dropStore)
    }
  }, [dropStore])

  useEffect(() => {
    if (requestParams) {
      dispatch(getDrops(requestParams))
    }
  }, [requestParams])

  const onPageChange = (page) => {
    setRequestParams({ ...requestParams, page })
  }

  return (
    <>
      <section className="section-padding my-drop-section" id="my-drop-list">
        <Container fluid>
          <div className="my-drop-header">
            <div className="back-arrow-box">
              <Button className="back-btn" onClick={() => navigate(-1)}>
                <img src={arrowBackIcon} alt="arrowBackIcon" className="img-fluid" />
              </Button>
            </div>
            <h3>My Drops</h3>
          </div>
          <div className="drop-section-list mt-3">
            <Row>
              {drops?.nftDrop?.length > 0 ? (
                drops?.nftDrop?.map((drop) => <DropShow key={drop.id} drop={drop} />)
              ) : (
                <h4 className="d-flex justify-content-center m-5">No Drops Found</h4>
              )}
            </Row>
          </div>
        </Container>
      </section>
      <CustomPagination
        currentPage={requestParams?.page}
        totalCount={drops?.metaData?.totalItems}
        pageSize={12}
        onPageChange={onPageChange}
        id="my-drop-list"
      />
    </>
  )
}

export default WithAuth(Drop)
