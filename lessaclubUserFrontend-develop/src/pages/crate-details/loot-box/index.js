import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Col, Container, Row, Button, Overlay, Popover } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { Link, useParams, useNavigate } from 'react-router-dom'
import AssetShow from 'shared/components/asset-show'
import ConfirmationModal from 'shared/components/confirmation-modal'
import { GlobalEventsContext } from 'shared/components/global-events'
import PermissionProvider from 'shared/components/permission-provider'
import ShareSocialMedia from 'shared/components/share-social-media'
import { allRoutes } from 'shared/constants/allRoutes'
import { apiPaths } from 'shared/constants/apiPaths'
import axios from 'shared/libs/axios'
import '../../profile/style.scss'
import '../index.scss'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'

const Index = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    state: { profileData }
  } = React.useContext(GlobalEventsContext)

  const tabData = {
    2: {
      orderType: 'Loot Box',
      tabs: ['Assets', 'Nuucoins', 'Coupons']
    }
  }

  const params = useParams()
  const [share, setShare] = useState(false)
  const [lootBoxData, setLootBoxData] = useState({})
  const [lootBoxAssets, setLootBoxAssets] = useState([])
  const [selectedTab, setSelectedTab] = useState('Assets')
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const loggedInUserId = localStorage.getItem('userId')

  useEffect(() => {
    getLootBoxDetails()
    getLootBoxAssets()
  }, [])

  const awsUrl = lootBoxData?.thumbnailUrl

  const getLootBoxAssets = async () => {
    try {
      const response = (await axios.get(`${apiPaths.lootBoxAssets}${params.id}`)) || {}
      if (response?.data?.success) {
        const lootBoxAssets = response?.data?.result?.lootBoxAsset
        setLootBoxAssets(lootBoxAssets || [])
      }
    } catch (error) {
      console.log('Error', error)
    }
  }

  const getLootBoxDetails = async () => {
    try {
      const response = (await axios.get(`${apiPaths.getlootBoxDetails}/${params.id}`)) || {}
      if (response?.data?.success) {
        const mysteryBoxDetails = response?.data?.result?.lootBox
        setLootBoxData(mysteryBoxDetails || {})
      }
    } catch (error) {
      console.log('Error', error)
    }
  }

  const handleTabClick = (ev, tab) => {
    ev.preventDefault()
    setSelectedTab(tab)
  }

  const handleShare = () => {
    setShare(!share)
  }

  const lootBoxDeleteHandler = async () => {
    const { id } = lootBoxData

    try {
      const response = await axios.delete(`${apiPaths.adminLootBoxDelete}/${id}`)
      if (response.data) {
        handleClose()
        dispatch({
          type: SHOW_TOAST,
          payload: {
            message: response.data.message,
            type: TOAST_TYPE.Success
          }
        })
        navigate(-1)
      }
    } catch (error) {
      handleClose()
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: error.message,
          type: TOAST_TYPE.Error
        }
      })
    }
  }

  const handleClose = () => {
    setIsConfirmOpen(false)
  }

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'Assets':
        return lootBoxAssets?.length ? (
          lootBoxAssets.map((item) => {
            return <div key={item.id} className='single-asset'>
              <AssetShow
                key={item.id}
                asset={item}
                isActionButtonVisible={!(lootBoxData?.user?.id === loggedInUserId)}
                customStyles='w-100'
              />
              {profileData?.role === 'admin' ? <div className="description d-flex flex-column cpn-hint">
                <span className="mt-2">
                  Minimum Count: <span className="value"> {lootBoxData?.assetHints?.minAmount || 0}</span>
                </span>
                <span className="mt-2">
                  Maximum Count: <span className="value"> {lootBoxData?.assetHints?.maxAmount || 0}</span>
                </span>
              </div> : null }
            </div>
          })
        ) : (
          <div className="description">No Assets are available in this loot box</div>
        )
      case 'Nuucoins':
        return (
          <div className="description d-flex flex-column">
            <span>
              Total Nuucoin available: <span className="value"> {lootBoxData?.nuuCoinCount || 0}</span>
            </span>
            <span>
              Minimum Count: <span className="value"> {lootBoxData?.nuuCoinHints?.minCount || 0}</span>
            </span>
            <span>
              Maximum Count: <span className="value"> {lootBoxData?.nuuCoinHints?.maxCount || 0}</span>
            </span>
          </div>
        )
      case 'Coupons':
        return <div className='d-flex flex-column'>
          <div className='d-flex flex-wrap'>
            {
              lootBoxData?.coupons?.length ? (
                lootBoxData?.coupons.map((coupon) => {
                  return (
                    <div className="card" key={coupon.code}>
                      <div className="description">
                        <span className="title">
                          Code
                          <span className="seperator">:</span>
                        </span>
                        <span className="value"> {coupon.code}</span>
                      </div>
                      <div className="description">
                        <span className="title">
                          Name
                          <span className="seperator">:</span>
                        </span>
                        <span className="value"> {coupon.name}</span>
                      </div>
                      <div className="description">
                        <span className='title'>
                          Link
                          <span className='seperator px-1'>:</span>
                        </span>
                        <span className='value'>
                          {
                            coupon?.link ? <a href={coupon.link}>Click Here</a> : '-'
                          }
                        </span>
                      </div>
                      <RenderDescription description={coupon.description} />
                    </div>
                  )
                })
              ) : (
                <div className="description">No Coupons are available in this loot box</div>
              )
            }
          </div>
          <div className="description cpn-hint">
            <span className="title">
              Hint Description
              <span className="seperator">:</span>
            </span>
            <span className="value"> {lootBoxData?.couponsHints.description}</span>
          </div>
        </div>
      default:
        break
    }
  }

  return (
    <>
      {isConfirmOpen && (
        <ConfirmationModal
          show={isConfirmOpen}
          handleConfirmation={lootBoxDeleteHandler}
          handleClose={handleClose}
          title={'Confirm Loot Box Deletion'}
          description={'Are you sure you want to delete this loot box?'}
        />
      )}
      {share && <ShareSocialMedia show={share} handleClose={handleShare} asset={awsUrl} url={window.location.href} thumbnail={awsUrl} />}
      <section className="orderDetails section-padding section-lr-m">
        <Container>
          <Row>
            <Col lg={12} className="mx-auto">
              <div className="orderDetails-tab profile-main-page">
                <div className="heading">
                  <h2>Loot Box Details</h2>
                </div>
                <div className="orderDetails-body">
                  <div className="d-flex p-2">
                    <div className="img-box">
                      <img src={awsUrl} alt="" loading="lazy" />
                    </div>
                    <div className="p-3 d-flex gap-3 flex-column justify-content-center align-items-center">
                      {
                        lootBoxData.availableStock > 0 ? (
                        <>
                        <PermissionProvider isUserOnly>
                          <div>
                            <Button
                              className="black-border-btn bg-dark text-light mr-2"
                              as={Link}
                              to={allRoutes.lootBoxCheckout(lootBoxData?.id)}
                            >
                              <FormattedMessage id="buyNow" />
                            </Button>
                          </div>
                        </PermissionProvider>

                        <PermissionProvider>
                            <div>
                              <Button className="black-border-btn bg-dark text-light" onClick={() => setIsConfirmOpen(true)}>
                                Delete
                              </Button>
                            </div>
                          </PermissionProvider>
                        </>
                        ) : <Button className="black-border-btn bg-dark" disabled>
                          <span className="place-by invalidFeedback">
                            <FormattedMessage id="outOfStock" />
                          </span>
                        </Button>
                      }
                      <div>
                        <Button className="black-border-btn bg-dark text-light" onClick={handleShare}>
                          <FormattedMessage id="share" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <h4>{lootBoxData.name}</h4>
                  <Row>
                    <Col lg={10}>
                      <div className="order-status">
                        <Row>
                          <Col lg={4} md={4}>
                            <div className="order-status-box">
                              <span>Price</span>
                              <h5>£{lootBoxData?.price}</h5>
                            </div>
                          </Col>
                          <Col lg={4} md={4}>
                            <div className="order-status-box">
                              <span>Created by</span>
                              <h5>@{lootBoxData?.seller?.userName}</h5>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <div className="order-address-details">
                        <AddressDetails title="Description" name={lootBoxData?.description} />
                        <AddressDetails
                          title="Name"
                          name={`${lootBoxData?.seller?.firstName || ''} ${lootBoxData?.seller?.lastName || ''}`}
                        />
                        <AddressDetails title="Email" name={lootBoxData?.seller?.email} />
                      </div>
                    </Col>
                  </Row>
                </div>

                {profileData?.role === 'admin' && (
                  <>
                    <div className="profile-page-tabs mb-3" id="profile-tabs">
                      <div className="profile-tab-links">
                        {tabData[2]?.tabs.map((tab) => (
                          <a href="" key={tab} onClick={(ev) => handleTabClick(ev, tab)} className={selectedTab === tab ? 'active' : ''}>
                            <span>{tab}</span>
                          </a>
                        ))}
                      </div>
                    </div>

                    <div className="tab-content">
                      <Row className={selectedTab === 'Coupons' ? 'justify-content-start px-4' : 'px-4'}>
                        {renderTabContent()}
                      </Row>
                    </div>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default Index

const AddressDetails = ({ title, name }) => {
  return (
    <div>
      <div className="title">
        {title} <span>:</span>{' '}
      </div>
      <p className="name">{name}</p>
    </div>
  )
}
AddressDetails.propTypes = {
  title: PropTypes.string,
  name: PropTypes.string
}

const RenderDescription = ({ description = '' }) => {
  const [show, setShow] = useState(false)
  const target = useRef(null)

  return <>
    <div
      className="description"
      ref={target}
      onMouseEnter={() => setShow(description.length > 20)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="title">
        Description
        <span className="seperator">:</span>
      </span>
      <span className="value">
        {description}
      </span>
    </div>
    <Overlay target={target} show={show} placement="top">
      {(props) => (
        <Popover id="overlay-example" {...props}>
          <Popover.Body>
            {description}
          </Popover.Body>
        </Popover>
      )}
    </Overlay>
  </>
}
RenderDescription.propTypes = {
  description: PropTypes.string
}
