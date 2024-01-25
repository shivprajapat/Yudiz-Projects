import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import './style.scss'
import AssetShow from 'shared/components/asset-show'
import { getTrendingNfts } from 'modules/assets/redux/service'
import { allRoutes } from 'shared/constants/allRoutes'
import useHeader from '../header/use-header'
import TruliooKyc from 'modules/truliooKyc'
import KycModal from '../kyc-modal'
import { kycStatus } from 'shared/constants'

function TrendingNft() {
  const dispatch = useDispatch()
  const [assets, setAssets] = useState()
  const [currentSelectedId, setCurrentSelectedId] = useState(null)
  const { truliooKyc, kyc, onConfirm, onClose, handleKyc } = useHeader()

  const trendingNfts = useSelector((state) => state.asset.trendingNfts)
  const userStore = useSelector((state) => state.user.user)

  useEffect(() => {
    dispatch(
      getTrendingNfts({
        page: 1,
        perPage: 4,
        fetchTrendingNft: true,
        wishlistByLoggedInUser: true,
        isSold: false,
        isSaleInProgress: false,
        isExpired: false
      })
    )
  }, [])

  useEffect(() => {
    trendingNfts && setAssets(trendingNfts)
  }, [trendingNfts])

  return (
    <>
      <Container className="home-kyc-wrapper" fluid>
        <Row>
          <Col lg="12" className='ms-1'>
            {userStore?.kycStatus && !kycStatus.includes(userStore?.kycStatus) && (
              <Button type="button" className="kyc-btn white-btn" onClick={() => handleKyc(true)}>
                Please verify your KYC to create your art work and contribute
              </Button>
            )}
          </Col>
        </Row>
        {kyc && <KycModal show={kyc} onConfirm={onConfirm} onClose={onClose} />}
        {truliooKyc && <TruliooKyc />}
      </Container>
      <div className="common-grid-section common-desc-padding">
        <Container fluid>
          <div className="common-grid-title">
            <div className="d-flex align-items-center justify-content-between">
              <h4>
                <FormattedMessage id="trendingNfts" />
              </h4>
              <Button className="white-border-btn" as={Link} to={allRoutes.trendingNfts}>
                <FormattedMessage id="viewAll" />
              </Button>
            </div>
          </div>
          <div className="common-grid-list">
            <Row>
              {assets?.assetsOnSale?.map((asset) => (
                <AssetShow
                  key={asset?.id}
                  isForAuction={!!asset?.auctionId}
                  asset={asset}
                  isTrending
                  currentSelectedId={currentSelectedId}
                  setCurrentSelectedId={setCurrentSelectedId}
                />
              ))}
            </Row>
          </div>
        </Container>
      </div>
    </>
  )
}

export default TrendingNft
