import React from 'react'
import PropTypes from 'prop-types'

const OwnedAssetLinks = ({ assetDetails }) => {
  return (
    <div className="owned-asset-links">
      <ul>
        <li>
          <span>NFT number</span> <span>{assetDetails?.assetId}</span>
        </li>
        <li>
          <span>View on blockchain</span>
          <a href={assetDetails?.networkUrl} target="_blank" rel="noreferrer">
            {assetDetails?.networkUrl}
          </a>
        </li>
        <li>
          <span>View on IPFS</span>
          <a href={assetDetails?.ipfsUrl} target="_blank" rel="noreferrer">
            {assetDetails?.ipfsUrl}
          </a>
        </li>
      </ul>
    </div>
  )
}
OwnedAssetLinks.propTypes = {
  assetDetails: PropTypes.object
}

export default OwnedAssetLinks
