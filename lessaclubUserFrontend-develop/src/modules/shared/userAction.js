import { getTimeDiff } from 'shared/utils'

/*
to get the button text on asset listing and asset details
conditions
1: if asset is drop
2: isOnSale is in ownedAsset and isSold is in assetOnSale then resell
3: if no auctionId and asset is fixed price then buy now
4: if auction and auction started with time condition then place bid
5: if auctionId is there and auction object is not there then place bid
6. If auction is expired, and nobody bought it, then it can be on resell.
*/
const getAction = (userId, object) => {
  if (object?.auction?.currentBidderId === userId) {
    return null
  }
  if ((userId === object?.seller?.id) && (object?.currentNftDrop?.isExpired)) {
    return 'Resell'
  }
  if (object?.isDropNeeded && (getTimeDiff(object?.currentNftDrop?.startTime) > 0 || getTimeDiff(object?.currentNftDrop?.endTime) < 0)) {
    return null
  }
  if (object?.asset?.currentLootBoxId || object?.asset?.currentMysteryBoxId) {
    return null
  }
  if ((!object?.isOnSale || object?.isSold) && userId === object?.owner?.id) {
    return 'Resell'
  }

  const isStockAvailable = object?.asset?.availableStock && object?.asset?.availableStock > 0 && object?.sellingPrice

  if (object?.auctionId && object?.auction?.isExpired && !object?.asset?.currentOwnerId && (userId === object?.sellerId) && isStockAvailable) {
    return 'Resell'
  }

  if (userId !== object?.sellerId && userId !== object?.owner?.id && isStockAvailable) {
    if (!object?.auctionId && !object?.fixedPricePayment) {
      return 'Buy Now'
    } else if (object?.auction?.statusName === 'Started' && getTimeDiff(object?.saleStartTime) <= 0) {
      return 'Place bid'
    } else if (!object?.auction && object?.auctionId) {
      return 'Place bid'
    } else if (object?.auction?.statusName === 'Failed to start') {
      return null // 'Restart auction' // need BE and FE support
    }
  }
}

const giftActionCondition = (userId, object) => {
  if (object?.isDropNeeded && (getTimeDiff(object?.currentNftDrop?.startTime) > 0 || getTimeDiff(object?.currentNftDrop?.endTime) < 0)) {
    return null
  }
  if ((!object?.isOnSale || object?.isSold) && userId === object?.owner?.id) {
    return 'Gift'
  }
}

export { getAction, giftActionCondition }
