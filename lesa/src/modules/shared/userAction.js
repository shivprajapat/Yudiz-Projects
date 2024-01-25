import { getTimeDiff } from 'shared/utils'

/*
to get the button text on asset listing and asset details
conditions
1: isOnSale is in ownedAsset and isSold is in assetOnSale then resell
2: if no auctionId and asset is fixed price then buy now
3: if auction and auction started with time condition then place bid
4: if auctionId is there and auction object is not there then place bid
*/
const getAction = (userId, object) => {
  if ((!object?.isOnSale || object?.isSold) && userId === object?.owner?.id) {
    return 'Resell'
  }
  if (userId !== object?.sellerId && userId !== object?.owner?.id) {
    if (!object?.auctionId && !object?.fixedPricePayment) {
      return 'Buy Now'
    } else if (object?.auction?.statusName === 'Started' && getTimeDiff(object?.saleStartTime) <= 0) {
      return 'Place bid'
    } else if (!object?.auction && object?.auctionId) {
      return 'Place bid'
    }
  }
}

export { getAction }
