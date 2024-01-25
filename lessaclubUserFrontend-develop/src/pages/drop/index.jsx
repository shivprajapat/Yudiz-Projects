import React, { useEffect, useState } from 'react'
import { Button, Container, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import AddEditDropModal from './components/add-edit-drop-modal'
import { getDrops } from 'modules/drop/redux/service'
import './style.scss'
import DropFilter from './components/drop-filter'
import DropShow from 'shared/components/drop-show'
import { allRoutes } from 'shared/constants/allRoutes'
import { getTimeZone } from 'shared/utils'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'

const CustomPagination = React.lazy(() => import('shared/components/custom-pagination'))

const Drop = () => {
  const isAuthenticated = localStorage.getItem('userId')
  const dispatch = useDispatch()

  const [show, setShow] = useState(false)
  const [requestParams, setRequestParams] = useState({ page: 1, perPage: 12, isExpired: false })
  const [drops, setDrops] = useState()

  const dropStore = useSelector((state) => state.drop.getDrops)
  const userStore = useSelector((state) => state.user.user)

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

  const handleDrop = () => {
    if (userStore.timezone === getTimeZone()) {
      setShow(!show)
    } else {
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: 'Timezone of application has to be same as system to create an drop',
          type: TOAST_TYPE.Error
        }
      })
    }
  }

  const onPageChange = (page) => {
    setRequestParams({ ...requestParams, page })
  }
  const handleChangeFilter = (data) => {
    setRequestParams({ ...requestParams, type: data })
  }
  const handleReset = () => {
    setRequestParams({ ...requestParams, type: '' })
  }

  return (
    <>
      {show && <AddEditDropModal handleClose={handleDrop} show={show} />}

      <section className="section-padding drop-section" id="drop-list">
        <Container fluid>
          <div className="drop-header">
            <h3>Drops</h3>
            {isAuthenticated && (
              <div>
                <Button className="white-btn me-3" onClick={handleDrop}>
                  Create Drop
                </Button>
                <Button as={Link} to={allRoutes.myDrops} className="white-btn">
                  My Drops
                </Button>
              </div>
            )}
          </div>
          <div className="drop-filter">
            <DropFilter handleChangeFilter={handleChangeFilter} handleReset={handleReset} />
          </div>
          <div className="drop-section-list">
            <Row>
              {drops?.nftDrop?.length > 0 ? drops?.nftDrop?.map((drop) => <DropShow key={drop.id} drop={drop} />) : <h4>No Drops Found</h4>}
            </Row>
          </div>
        </Container>
      </section>
      <CustomPagination
        currentPage={requestParams?.page}
        totalCount={drops?.metaData?.totalItems}
        pageSize={12}
        onPageChange={onPageChange}
        id="drop-list"
      />
    </>
  )
}

export default Drop
