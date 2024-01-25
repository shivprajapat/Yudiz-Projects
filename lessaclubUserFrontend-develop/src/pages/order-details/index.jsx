import { ManualLogistics } from 'modules/manualLogistics'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import { Col, Container, Overlay, Popover, Row } from 'react-bootstrap'
import AssetShow from 'shared/components/asset-show'
import { apiPaths } from 'shared/constants/apiPaths'
import axios from 'shared/libs/axios'
import { convertDateToLocaleString, parseParams } from 'shared/utils'
import '../profile/style.scss'
import './style.scss'

const OrderDetails = () => {
  const tabData = {
    0: {
      orderType: 'Asset',
      tabs: []
    },
    1: {
      orderType: 'Mystery Box',
      tabs: ['Assets']
    },
    2: {
      orderType: 'Loot Box',
      tabs: ['Assets', 'Nuucoins', 'Coupons']
    },
    3: {
      orderType: 'Gift',
      tabs: []
    }
  }

  const params = parseParams(window.location.search)
  const [orderData, setOrderData] = useState({})
  const [orderAssets, setOrderAssets] = useState([])
  const [selectedTab, setSelectedTab] = useState('Assets')
  const loggedInUserId = localStorage.getItem('userId')

  useEffect(() => {
    getOrderDetails()
  }, [])

  const isOrderFailed = (asset) => {
    return [5, 10, 14].includes(asset?.status)
  }

  let awsUrl = orderData?.asset?.awsUrl
  if (orderData?.mysteryBoxId) {
    awsUrl = orderData.mysteryBox?.thumbnailUrl
  }
  if (orderData?.lootBoxId) {
    awsUrl = orderData.lootBox?.thumbnailUrl
  }

  const getOrderDetails = async () => {
    try {
      const response = (await axios.get(`${apiPaths.orderDetails}/${params.orderId}`)) || {}
      if (response?.data?.success) {
        const orderDetails = response?.data?.result.order
        setOrderData(orderDetails || {})
        if (orderDetails?.orderType && [1, 2].includes(orderDetails?.orderType)) {
          getOrderAssets()
        }
      }
    } catch (error) {
      console.log('Error', error)
    }
  }

  const getOrderAssets = async () => {
    try {
      const response = (await axios.get(`${apiPaths.orderAssets}/${params.orderId}`)) || {}
      if (response?.data?.success) {
        const orderDetails = response?.data?.result?.orderAssets
        setOrderAssets(orderDetails || [])
      }
    } catch (error) {
      console.log('Error', error)
    }
  }

  const handleTabClick = (ev, tab) => {
    ev.preventDefault()
    setSelectedTab(tab)
  }

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'Assets':
        return orderAssets?.length ? (
          orderAssets.map((item) => {
            return (
              <div key={item.id} className="single-asset">
                <AssetShow asset={item} isActionButtonVisible={!(orderData?.user?.id === loggedInUserId)} customStyles="w-100" />
                <div className="description d-flex flex-column cpn-hint">
                  <span className="mt-2">
                    Minimum Count: <span className="value"> {orderData?.lootBox?.assetHints?.minAmount || 0}</span>
                  </span>
                  <span className="mt-2">
                    Maximum Count: <span className="value"> {orderData?.lootBox?.assetHints?.maxAmount || 0}</span>
                  </span>
                </div>
              </div>
            )
          })
        ) : (
          <div className="description">No Assets are available in this order</div>
        )
      case 'Nuucoins':
        return (
          <div className="description d-flex flex-column cpn-hint">
            <span>
              Total Nuucoin available: <span className="value"> {orderData?.lootBox?.nuuCoinCount || 0}</span>
            </span>
            <span className="mt-2">
              Minimum Count: <span className="value"> {orderData?.lootBox?.nuuCoinHints?.minCount || 0}</span>
            </span>
            <span className="mt-2">
              Maximum Count: <span className="value"> {orderData?.lootBox?.nuuCoinHints?.maxCount || 0}</span>
            </span>
          </div>
        )
      case 'Coupons':
        return (
          <div className="d-flex flex-column">
            <div className="d-flex flex-wrap">
              {orderData?.lootBox?.coupons?.length ? (
                orderData?.lootBox?.coupons.map((coupon) => {
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
                        <span className="title">
                          Link
                          <span className="seperator px-1">:</span>
                        </span>
                        <span className="value">{coupon?.link ? <a href={coupon.link}>Click Here</a> : '-'}</span>
                      </div>
                      <RenderDescription description={coupon.description} />
                    </div>
                  )
                })
              ) : (
                <div className="description">No Coupons are available in this order</div>
              )}
            </div>
            <div className="description cpn-hint">
              <span className="title">
                Coupon Hint
                <span className="seperator px-1">:</span>
              </span>
              <span className="value"> {orderData?.lootBox?.couponsHints?.description}</span>
            </div>
          </div>
        )
      default:
        break
    }
  }

  return (
    <section className="orderDetails section-padding section-lr-m">
      <Container>
        <Row>
          <Col lg={12} className="mx-auto">
            <div className="orderDetails-tab profile-main-page">
              <div className="heading">
                <h2>Order Details</h2>
              </div>
              <div className="orderDetails-body">
                <div className="img-box">
                  <img src={orderData?.asset?.thumbnailAwsUrl || awsUrl} alt="" loading="lazy" />
                </div>
                <h4>{orderData?.asset?.name || orderData?.lootBox?.name || orderData?.mysteryBox?.name || ''}</h4>
                <Row>
                  <Col lg={10}>
                    <div className="order-status">
                      <Row>
                        <Col lg={4} md={4}>
                          <div className="order-status-box">
                            <span>Bought for</span>
                            <h5>£{orderData?.totalPrice}</h5>
                          </div>
                        </Col>
                        <Col lg={4} md={4}>
                          <div className="order-status-box">
                            <span>Owned by</span>
                            <h5>@{orderData?.user?.userName}</h5>
                          </div>
                        </Col>
                        <Col lg={4} md={4}>
                          <div className="order-status-box">
                            <span>Order Status</span>
                            <h5>
                              <i className={isOrderFailed() ? 'failed' : 'success'}></i> {orderData?.statusName}
                            </h5>
                          </div>
                        </Col>
                      </Row>
                    </div>
                    <div className="order-address-details">
                      {orderData?.paymentCurrencyName && <AddressDetails title="Payment Method" name={orderData?.paymentCurrencyName} />}
                      <AddressDetails title="Wallet Address" name={orderData?.toWalletAddress} />
                      <AddressDetails title="Order Id" name={orderData?.orderNumber} />
                      <AddressDetails title="Order Placed" name={convertDateToLocaleString(orderData?.createdAt)} />
                      <AddressDetails title="Email" name={orderData?.email} />
                      {orderData?.addressLine1 && <AddressDetails title="Address" name={orderData?.addressLine1} />}
                      <AddressDetails title="Number" name={orderData?.phone} />
                    </div>
                    <Row>
                      <Col lg={12}>
                        {orderData?.asset?.isPhysical && [9, 18, 20, 21, 22, 23, 24, 25, 26, 27].includes(orderData?.status) && (
                          <ManualLogistics order={orderData} getOrderDetails={getOrderDetails} />
                        )}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
              {orderData?.orderType !== 0 && orderData?.orderType !== 3 && (
                <>
                  <div className="profile-page-tabs mb-3" id="profile-tabs">
                    <div className="profile-tab-links">
                      {tabData[orderData?.orderType]?.tabs.map((tab) => (
                        <a href="" key={tab} onClick={(ev) => handleTabClick(ev, tab)} className={selectedTab === tab ? 'active' : ''}>
                          <span>{tab}</span>
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="tab-content">
                    <Row className={selectedTab === 'Coupons' ? 'justify-content-start px-4' : 'px-4'}>{renderTabContent()}</Row>
                  </div>
                </>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default OrderDetails

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
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

const RenderDescription = ({ description = '' }) => {
  const [show, setShow] = useState(false)
  const target = useRef(null)

  return (
    <>
      <div className="description" ref={target} onMouseEnter={() => setShow(description.length > 20)} onMouseLeave={() => setShow(false)}>
        <span className="title">
          Description
          <span className="seperator">:</span>
        </span>
        <span className="value">{description}</span>
      </div>
      <Overlay target={target} show={show} placement="top">
        {(props) => (
          <Popover id="overlay-example" {...props}>
            <Popover.Body>{description}</Popover.Body>
          </Popover>
        )}
      </Overlay>
    </>
  )
}
RenderDescription.propTypes = {
  description: PropTypes.string
}
