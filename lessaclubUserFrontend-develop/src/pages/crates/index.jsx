import React, { Suspense } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import './style.scss'
import PageHeader from 'shared/components/page-header'
import LootBox from './components/loot-box'
import MysteryBox from './components/mystery-box'
import { allRoutes } from 'shared/constants/allRoutes'
import useMysteryBox from './hooks/use-mystery-box'
import useLootBox from './hooks/use-loot-box'

const CustomPagination = React.lazy(() => import('shared/components/custom-pagination'))

const Crates = () => {
  const { mysteryBoxes, handlePageChange, requestParams } = useMysteryBox()
  const { lootBoxes, handlePageChange: lootBoxHandlePageChange, requestParams: lootBoxRequestParams } = useLootBox()

  return (
    <section className="crates-page section-padding">
      <Container>
        <PageHeader
          title={<FormattedMessage id="crates" />}
          isAdminAction
          btnText="Create Loot/Mystery Box"
          route={allRoutes.createMysteryLootBox}
        />
        <div className="mastery-section">
          <h4 className="heading">Mystery Boxes</h4>
          <Row>
            {mysteryBoxes?.mysteryBox?.length > 0 ? (
              mysteryBoxes?.mysteryBox?.map((mysteryBox) => {
                if (!mysteryBox.isExpired && !mysteryBox.isSold) {
                  return (
                    <Col lg={4} md={6} key={mysteryBox.id}>
                      <MysteryBox
                        availableStock={mysteryBox.availableStock}
                        mysteryBoxId={mysteryBox.id}
                        name={mysteryBox.name}
                        price={mysteryBox.price}
                        thumbnailUrl={mysteryBox.thumbnailUrl}
                      />
                    </Col>
                  )
                } else {
                  return null
                }
              })
            ) : (
              <h4 className="d-flex align-items-center justify-content-center">No products found</h4>
            )}
          </Row>
          <div>
            <Suspense fallback={<div />}>
              <CustomPagination
                currentPage={requestParams?.page}
                totalCount={mysteryBoxes?.metaData?.totalItems}
                pageSize={3}
                onPageChange={handlePageChange}
              />
            </Suspense>
          </div>
        </div>
        <div className="lootbox-section">
          <h4 className="heading">Loot Boxes</h4>
          <Row>
            {lootBoxes?.lootBox?.length ? (
              lootBoxes?.lootBox?.map((lootBox) => {
                if (!lootBox.isExpired && !lootBox.isSold) {
                  return (
                    <Col lg={4} md={6} key={lootBox.id}>
                      <LootBox
                        lootBoxId={lootBox.id}
                        availableStock={lootBox.availableStock}
                        name={lootBox.name}
                        price={lootBox.price}
                        thumbnailUrl={lootBox.thumbnailUrl}
                        nuuCoinHints={lootBox.nuuCoinHints}
                        couponsHints={lootBox.couponsHints}
                        assetHints={lootBox.assetHints}
                        blockchainNetwork={lootBox.blockchainNetwork}
                      />
                    </Col>
                  )
                } else {
                  return null
                }
              })
            ) : (
              <h4 className="d-flex align-items-center justify-content-center">No products found</h4>
            )}
          </Row>
          <div>
            <Suspense fallback={<div />}>
              <CustomPagination
                currentPage={lootBoxRequestParams?.page}
                totalCount={lootBoxes?.metaData?.totalItems}
                pageSize={3}
                onPageChange={lootBoxHandlePageChange}
              />
            </Suspense>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default Crates
