import React, { Suspense, useState } from 'react'
import { Button, Container, Row } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import './style.scss'
import AssetShow from 'shared/components/asset-show'
import PageHeader from 'shared/components/page-header'
import CategorySlider from 'pages/explore/components/category-slider'
import ExploreFilter from 'pages/explore/components/explore-filter'
import useExplore from './hooks/use-explore'
import { arrowBackIcon } from 'assets/images'

const CustomPagination = React.lazy(() => import('shared/components/custom-pagination'))

const Auction = () => {
  const [currentSelectedId, setCurrentSelectedId] = useState(null)

  const {
    exploreAuctions,
    handlePageChange,
    handleCategoryChange,
    handleFilterSubmit,
    handleSort,
    handleReset,
    selectedCategory,
    category,
    requestParams,
    params,
    id,
    navigate
  } = useExplore()

  return (
    <div>
      <div className="explore-page">
        <Container fluid>
          {id && (
            <div className="back-arrow-box m-3">
              <Button className="back-btn" onClick={() => navigate(-1)}>
                <img src={arrowBackIcon} alt="back" />
              </Button>
            </div>
          )}
          <PageHeader title={<FormattedMessage id={id ? 'dropAsset' : 'exploreAuction'} />} />
          <CategorySlider category={category} handleCategoryChange={handleCategoryChange} selectedCategory={selectedCategory} />
          <ExploreFilter handleFilterSubmit={handleFilterSubmit} handleSort={handleSort} handleReset={handleReset} params={params} />
          <div className="explore-page-grid-list">
            <Row>
              {exploreAuctions?.assetsOnSale?.length ? (
                exploreAuctions?.assetsOnSale?.map((asset) => (
                  <AssetShow
                    key={asset?.id}
                    asset={asset}
                    currentSelectedId={currentSelectedId}
                    setCurrentSelectedId={setCurrentSelectedId}
                  />
                ))
              ) : (
                <h4 className="d-flex align-items-center justify-content-center">No Auction found</h4>
              )}
            </Row>
          </div>
          <div>
            <Suspense fallback={<div />}>
              <CustomPagination
                currentPage={requestParams?.page}
                totalCount={exploreAuctions?.metaData?.totalItems}
                pageSize={20}
                onPageChange={handlePageChange}
                id="explore-filter"
              />
            </Suspense>
          </div>
        </Container>
      </div>
    </div>
  )
}
export default Auction
