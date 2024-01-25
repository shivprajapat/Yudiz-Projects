import React, { Suspense } from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'

import AssetShow from 'shared/components/asset-show'
import { logoIcon } from 'assets/images'
import './style.scss'
import Loading from 'shared/components/loading'

const AuthLayout = ({ childComponent }) => {
  // TODO: static for now
  const asset = {
    id: 64,
    assetId: 68,
    asset: {
      id: 68,
      name: 'auction test',
      categoryId: null,
      description: 'auction test',
      currentOwnerId: null,
      size: 396642,
      currentPrice: null,
      brandName: null,
      fileName: 'Screenshot 2022-05-27 at 10.21.33 AM 1.png',
      fileType: 'png',
      fileNameWithTime: 'Screenshot 2022-05-27 at 10__1653930783562.21',
      quantity: null,
      awsUrl: 'https://lessaclubs3.s3.amazonaws.com/Screenshot%202022-05-27%20at%2010__1653930783562.21',
      isReported: null,
      availableStock: null,
      isDownloadable: null,
      purchaseCount: null,
      isBlockChainConfirmed: null,
      isExclusive: false,
      royaltyPercentage: '1.00',
      createdBy: 'ae9c1988-7c49-4776-82f6-05e6f3ed8b2f',
      totalEditionCount: 1,
      soldEditionCount: null,
      viewCount: null,
      trendingViewCount: null,
      shortDescription: 'auction test',
      donationPercentage: 1,
      isPhysical: false,
      createdAt: '2022-05-31T04:34:12.462Z',
      updatedAt: '2022-05-31T04:34:12.462Z'
    },
    ownerId: null,
    owner: null,
    sellingPrice: '1.00',
    lastSoldEdition: null,
    totalEditionCount: 1,
    isSold: false,
    creatorId: 'ae9c1988-7c49-4776-82f6-05e6f3ed8b2f',
    creator: {
      id: 'ae9c1988-7c49-4776-82f6-05e6f3ed8b2f',
      firstName: 'johnny',
      lastName: 'depp',
      email: 'johnnydepp@accubits.com',
      userName: 'Johnny_depp01',
      kycStatus: 3
    },
    isFirstSale: false,
    status: 0,
    isDropNeeded: false,
    blockchainNetwork: null,
    auctionMinimumPrice: '1.00',
    auctionNextBid: '1.00',
    networkSellingPrice: '0.00',
    isEdition: false,
    editionNumber: 1,
    auctionId: null,
    saleStartTime: '31/05/2022 10:00 am',
    saleEndTime: '03/06/2022 10:30 am',
    createdAt: '31/05/2022 04:34 am',
    updatedAt: '31/05/2022 04:34 am'
  }

  return (
    <>
      <div className="credentials-page d-flex align-items-stretch">
        <div className="credentials-left">
          <div className="cred-left-inner d-flex flex-column align-items-center">
            <img src={logoIcon} alt="logo-img" className="img-fluid logo-image d-block d-md-none" />
            <AssetShow isForAuction={!!asset.auctionId} asset={asset} />
            <div className="cred-left-desc text-center">
              <h5 className="text-capitalize">
                <span>
                  <FormattedMessage id="discover" />
                </span>
                <FormattedMessage id="rareCollections" />
                <span>
                  <FormattedMessage id="of" />
                </span>
                <br></br> <FormattedMessage id="artAndNFTs" />.
              </h5>
              <p>
                <FormattedMessage id="digitalMarketplaceForCryptoCollectiblesAndNon" />- <br></br>
                <FormattedMessage id="fungibleTokens" />
                <span>
                  <FormattedMessage id="nfts" />
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="credentials-right">
          <div className="cred-right-inner">
            <img src={logoIcon} alt="logo-img" className="img-fluid logo-image" />
            <div className="cred-form">
              <Suspense fallback={<Loading />}>{childComponent}</Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
AuthLayout.propTypes = {
  childComponent: PropTypes.node.isRequired
}
export default AuthLayout
