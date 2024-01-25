import React, { Suspense, useEffect, useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { history } from 'App'
import AssetShow from 'shared/components/asset-show'
import { appendParams, parseParams } from 'shared/utils'
import { getWishlistAssets } from 'modules/wishlist/redux/service'

const CustomPagination = React.lazy(() => import('shared/components/custom-pagination'))

const ProfileWishlist = () => {
  const { id } = useParams()
  const userId = localStorage.getItem('userId')
  const dispatch = useDispatch()
  const params = useRef(parseParams(location.search))
  const isMounted = useRef(false)

  const [requestParams, setRequestParams] = useState(getRequestParams())
  const [assets, setAssets] = useState()

  const userAssets = useSelector((state) => state.wishlist.getWishlistAssets)

  useEffect(() => {
    userAssets && setAssets(userAssets)
  }, [userAssets])

  useEffect(() => {
    requestParams && dispatch(getWishlistAssets(requestParams))
  }, [requestParams])

  useEffect(() => {
    return history.listen((e) => {
      params.current = parseParams(e.search)
      setRequestParams(getRequestParams(e.search))
    })
  }, [history])

  useEffect(() => {
    if (isMounted.current) {
      if (id) {
        setRequestParams({ ...requestParams, page: 1, createdBy: id })
      } else {
        setRequestParams({ ...requestParams, page: 1, createdBy: userId })
      }
    } else isMounted.current = true
  }, [id])

  function getRequestParams(e) {
    const data = e ? parseParams(e) : params.current
    return {
      page: data.page || 1,
      perPage: data.perPage || 12,
      userId: userId
    }
  }

  const handlePageChange = (page) => {
    setRequestParams({ ...requestParams, page })
    appendParams({ page: page })
  }

  const handleWishlistAsset = (asset) => {
    setAssets((prev) => ({ ...prev, wishlist: prev?.wishlist.filter((selectedAsset) => selectedAsset.id !== asset.id) }))
  }

  return (
    <>
      {assets?.wishlist?.length ? (
        assets.wishlist.map((asset) => (
          <AssetShow
            key={asset.id}
            asset={asset}
            isForSale
            isForAuction={!!asset.auctionId}
            isWishlist
            handleWishlistAsset={handleWishlistAsset}
          />
        ))
      ) : (
        <h4 className="my-5">
          <FormattedMessage id="noDataFound" />
        </h4>
      )}

      <Suspense fallback={<div />}>
        <CustomPagination
          currentPage={assets?.metaData?.currentPage}
          totalCount={assets?.metaData?.totalItems}
          pageSize={12}
          onPageChange={handlePageChange}
          id="profile-tabs"
        />
      </Suspense>
    </>
  )
}

export default ProfileWishlist
