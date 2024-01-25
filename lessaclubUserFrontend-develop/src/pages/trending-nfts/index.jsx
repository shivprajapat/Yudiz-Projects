import React, { useEffect, useState } from 'react'
import { Container, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import AssetShow from 'shared/components/asset-show'
import { getTrendingNfts } from 'modules/assets/redux/service'

const CustomPagination = React.lazy(() => import('shared/components/custom-pagination'))

const TrendingNfts = () => {
  const dispatch = useDispatch()

  const [requestParams, setRequestParams] = useState({
    page: 1,
    perPage: 12,
    fetchTrendingNft: true,
    wishlistByLoggedInUser: true,
    isSold: false,
    isSaleInProgress: false,
    isExpired: false
  })
  const [assets, setAssets] = useState()

  const trendingNfts = useSelector((state) => state.asset.trendingNfts)

  useEffect(() => {
    trendingNfts && setAssets(trendingNfts)
  }, [trendingNfts])

  useEffect(() => {
    if (requestParams) {
      dispatch(getTrendingNfts(requestParams))
    }
  }, [requestParams])

  const onPageChange = (page) => {
    setRequestParams({ ...requestParams, page })
  }

  return (
    <>
      <section className="section-padding section-lr-m" id="trending-asset-list">
        <Container fluid>
          <h3 className="section-heading">Trending Nfts</h3>
          <Row>
            {assets?.assetsOnSale?.map((asset) => (
              <AssetShow key={asset?.id} isForAuction={!!asset.auctionId} asset={asset} isTrending />
            ))}
          </Row>
        </Container>
      </section>
      <CustomPagination
        currentPage={requestParams?.page}
        totalCount={assets?.metaData?.totalItems}
        pageSize={12}
        onPageChange={onPageChange}
        id="trending-asset-list"
      />
    </>
  )
}

export default TrendingNfts
