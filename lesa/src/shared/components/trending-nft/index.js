import React, { useEffect, useState } from 'react'
import { Button, Container, Row } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'

import './style.scss'
import AssetShow from 'shared/components/asset-show'
import { getExploreAssets } from 'modules/explore/redux/service'

function TrendingNft() {
  const dispatch = useDispatch()
  const [exploreAssets, setExploreAssets] = useState()

  const exploreAssetData = useSelector((state) => state.explore.explore)

  useEffect(() => {
    dispatch(getExploreAssets({ page: 1, perPage: 4, isSold: false, isExpired: false }))
  }, [])

  useEffect(() => {
    exploreAssetData && setExploreAssets(exploreAssetData)
  }, [exploreAssetData])

  return (
    <>
      <div className="common-grid-section common-desc-padding">
        <Container fluid>
          <div className="common-grid-title">
            <div className="d-flex align-items-center justify-content-between">
              <h4>
                <FormattedMessage id="trendingNfts" />
              </h4>
              <Button className="white-border-btn">
                <FormattedMessage id="viewAll" />
              </Button>
            </div>
          </div>
          <div className="common-grid-list">
            <Row>
              {exploreAssets?.assetsOnSale?.map((asset, index) => (
                <AssetShow key={asset?.id} isForAuction={!!asset.auctionId} asset={asset} />
              ))}
            </Row>
          </div>
        </Container>
      </div>
    </>
  )
}

export default TrendingNft
