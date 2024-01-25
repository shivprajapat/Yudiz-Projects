import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { Col, Container, Row, Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AssetShow from 'shared/components/asset-show'
import PermissionProvider from 'shared/components/permission-provider'
import ShareSocialMedia from 'shared/components/share-social-media'
import { allRoutes } from 'shared/constants/allRoutes'
import { apiPaths } from 'shared/constants/apiPaths'
import { GlobalEventsContext } from 'shared/components/global-events'
import axios from 'shared/libs/axios'
import '../../profile/style.scss'
import '../index.scss'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'
import ConfirmationModal from 'shared/components/confirmation-modal'

const Index = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    state: { profileData }
  } = React.useContext(GlobalEventsContext)

  const tabData = {
    1: {
      orderType: 'Mystery Box',
      tabs: ['Assets']
    }
  }

  const params = useParams()
  const [share, setShare] = useState(false)
  const [mysteryBoxData, setMysteryBoxData] = useState({})
  const [mysteryBoxAssets, setmysteryBoxAssets] = useState([])
  const [selectedTab, setSelectedTab] = useState('Assets')
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const loggedInUserId = localStorage.getItem('userId')

  useEffect(() => {
    getMysteryBoxDetails()
    getMysteryBoxAssets()
  }, [])

  const awsUrl = mysteryBoxData?.thumbnailUrl

  const getMysteryBoxAssets = async () => {
    try {
      const response = (await axios.get(`${apiPaths.mysteryBoxDetails}${params.id}`)) || {}
      if (response?.data?.success) {
        const mysteryBoxAssets = response?.data?.result?.mysteryBoxAsset
        setmysteryBoxAssets(mysteryBoxAssets || [])
      }
    } catch (error) {
      console.log('Error', error)
    }
  }

  const getMysteryBoxDetails = async () => {
    try {
      const response = (await axios.get(`${apiPaths.mysteryBoxAssets}/${params.id}`)) || {}
      if (response?.data?.success) {
        const mysteryBoxDetails = response?.data?.result?.mysteryBox
        setMysteryBoxData(mysteryBoxDetails || {})
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

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'Assets':
        return mysteryBoxAssets?.length ? (
          mysteryBoxAssets.map((item) => {
            return (
              <div key={item.id} className="single-asset">
                <AssetShow
                  key={item.id}
                  asset={item}
                  isActionButtonVisible={!(mysteryBoxData?.user?.id === loggedInUserId)}
                  customStyles="w-100"
                />
              </div>
            )
          })
        ) : (
          <div className="description">No Assets are available in this mystery box</div>
        )

      default:
        break
    }
  }

  const mysteryBoxDeleteHandler = async () => {
    const { id } = mysteryBoxData

    try {
      const response = await axios.delete(`${apiPaths.adminMysteryBox}/${id}`)
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

  return (
    <>
      {isConfirmOpen && (
        <ConfirmationModal
          show={isConfirmOpen}
          handleConfirmation={mysteryBoxDeleteHandler}
          handleClose={handleClose}
          title={'Confirm Mystery Box Deletion'}
          description={'Are you sure you want to delete this mystery box?'}
        />
      )}
      {share && <ShareSocialMedia show={share} handleClose={handleShare} asset={awsUrl} url={window.location.href} thumbnail={awsUrl} />}
      <section className="orderDetails section-padding section-lr-m">
        <Container>
          <Row>
            <Col lg={12} className="mx-auto">
              <div className="orderDetails-tab profile-main-page">
                <div className="heading">
                  <h2>Mystery Box Details</h2>
                </div>
                <div className="orderDetails-body">
                  <div className="d-flex p-2">
                    <div className="img-box">
                      <img src={awsUrl} alt="" loading="lazy" />
                    </div>
                    <div className="p-3 d-flex gap-3 flex-column justify-content-center align-items-center">
                      {mysteryBoxData.availableStock > 0 ? (
                        <>
                          <PermissionProvider isUserOnly>
                            <div>
                              <Button
                                className="black-border-btn bg-dark text-light"
                                as={Link}
                                to={allRoutes.mysteryBoxCheckout(mysteryBoxData?.id)}
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
                      ) : (
                        <Button className="black-border-btn bg-dark" disabled>
                          <span className="place-by invalidFeedback">
                            <FormattedMessage id="outOfStock" />
                          </span>
                        </Button>
                      )}
                      <div>
                        <Button className="black-border-btn bg-dark text-light" onClick={handleShare}>
                          <FormattedMessage id="share" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <h4>{mysteryBoxData.name}</h4>
                  <Row>
                    <Col lg={10}>
                      <div className="order-status">
                        <Row>
                          <Col lg={4} md={4}>
                            <div className="order-status-box">
                              <span>Price</span>
                              <h5>£{mysteryBoxData?.price}</h5>
                            </div>
                          </Col>
                          <Col lg={4} md={4}>
                            <div className="order-status-box">
                              <span>Created by</span>
                              <h5>@{mysteryBoxData?.seller?.userName}</h5>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <div className="order-address-details">
                        <AddressDetails title="Description" name={mysteryBoxData?.description} />
                        <AddressDetails
                          title="Name"
                          name={`${mysteryBoxData?.seller?.firstName || ''} ${mysteryBoxData?.seller?.lastName || ''}`}
                        />
                        <AddressDetails title="Email" name={mysteryBoxData?.seller?.email} />
                      </div>
                    </Col>
                  </Row>
                </div>

                {profileData?.role === 'admin' && (
                  <>
                    <div className="profile-page-tabs mb-3" id="profile-tabs">
                      <div className="profile-tab-links">
                        {tabData[1]?.tabs.map((tab) => (
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
