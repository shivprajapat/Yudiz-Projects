import React, { Suspense, useEffect, useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { history } from 'App'
import AssetShow from 'shared/components/asset-show'
import { getUserAssets } from 'modules/user/redux/service'
import { appendParams, parseParams } from 'shared/utils'
import { useUpdateEffect } from 'shared/hooks/use-update-effect'

const CustomPagination = React.lazy(() => import('shared/components/custom-pagination'))

const ProfileCreated = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const params = useRef(parseParams(location.search))

  const [requestParams, setRequestParams] = useState(getRequestParams())
  const [assets, setAssets] = useState()

  const userAssets = useSelector((state) => state.user.userAssets)

  useEffect(() => {
    userAssets && setAssets(userAssets)
  }, [userAssets])

  useEffect(() => {
    requestParams && dispatch(getUserAssets(requestParams))
  }, [requestParams])

  useEffect(() => {
    return history.listen((e) => {
      params.current = parseParams(e.search)
      setRequestParams(getRequestParams(e.search))
    })
  }, [history])

  function getRequestParams(e) {
    const data = e ? parseParams(e) : params.current
    return {
      createdBy: id || localStorage.getItem('userId'),
      page: data.page || 1,
      perPage: data.perPage || 12
    }
  }

  useUpdateEffect(() => {
    if (id) {
      setRequestParams({ ...requestParams, page: 1, userId: id })
    } else {
      setRequestParams({ ...requestParams, page: 1, userId: localStorage.getItem('userId') })
    }
  }, [id])

  const handlePageChange = (page) => {
    setRequestParams({ ...requestParams, page })
    appendParams({ page: page })
  }

  return (
    <>
      {assets?.assets?.length ? (
        assets.assets.map((asset, index) => <AssetShow key={index} asset={asset} isForSale isCreated isForAuction={!!asset.auctionId} />)
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

export default ProfileCreated
