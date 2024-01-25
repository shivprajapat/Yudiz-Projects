import React, { Suspense, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Container, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import AssetShow from 'shared/components/asset-show'
import { getCreatorAssets } from 'modules/assets/redux/service'
import { FormattedMessage } from 'react-intl'

const CustomPagination = React.lazy(() => import('shared/components/custom-pagination'))

const MoreFromArtist = ({ creatorId }) => {
  const dispatch = useDispatch()

  const [requestParams, setRequestParams] = useState({ page: 1, pageSize: 12, isSold: false, isExpired: false })
  const [assets, setAssets] = useState()

  const creatorAssetsStore = useSelector((state) => state.asset.creatorAssets)

  useEffect(() => {
    if (creatorAssetsStore) {
      setAssets(creatorAssetsStore)
    }
  }, [creatorAssetsStore])

  useEffect(() => {
    if (creatorId) {
      dispatch(getCreatorAssets({ createdBy: creatorId, ...requestParams }))
    }
  }, [creatorId, requestParams])

  const handlePageChange = (page) => {
    setRequestParams({ ...requestParams, page })
  }

  return (
    <div className="artist-collection">
      <Container fluid>
        <div className="artist-coll-title">
          <h4>More from the Artist</h4>
        </div>
        <div className="artist-collection-list">
          <Row>
            {assets?.assetsOnSale?.length ? (
              assets.assetsOnSale.map((asset) => <AssetShow key={asset.id} asset={asset} />)
            ) : (
              <h4 className="my-5 d-flex align-items-center justify-content-center">
                <FormattedMessage id="noDataFound" />
              </h4>
            )}
          </Row>
        </div>
        <Suspense fallback={<div />}>
          <CustomPagination
            currentPage={requestParams?.page}
            totalCount={assets?.metaData?.totalItems}
            pageSize={12}
            onPageChange={handlePageChange}
          />
        </Suspense>
      </Container>
    </div>
  )
}
MoreFromArtist.propTypes = {
  creatorId: PropTypes.string
}
export default MoreFromArtist
