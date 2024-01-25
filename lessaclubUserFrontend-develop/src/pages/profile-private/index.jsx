import { getPrivateAssetsData } from 'modules/assets/redux/service'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import AssetShow from 'shared/components/asset-show'
import { appendParams, parseParams } from 'shared/utils'

const CustomPagination = React.lazy(() => import('shared/components/custom-pagination'))

const ProfilePrivate = () => {
  const userId = localStorage.getItem('userId')
  const { id } = useParams()
  const dispatch = useDispatch()
  const params = useRef(parseParams(location.search))

  const [assets, setAssets] = useState()
  const [requestParams, setRequestParams] = useState(getRequestParams())

  useEffect(() => {
    getPrivateAssets()
  }, [])

  function getRequestParams(e) {
    const data = e ? parseParams(e) : params.current
    return {
      userId: id || userId,
      page: data.page || 1,
      perPage: data.perPage || 12,
      isValid: true,
      isPrivate: true
    }
  }

  const getPrivateAssets = async () => {
    const response = await dispatch(getPrivateAssetsData(requestParams))
    if (response?.status === 200) {
      setAssets(response?.data?.result || [])
    }
  }

  const handlePageChange = (page) => {
    setRequestParams({ ...requestParams, page })
    appendParams({ page: page })
  }

  return (
    <>
      {
        assets?.ownedAssets?.length ? (
          assets.ownedAssets.map((asset) => <AssetShow
            key={asset.id}
            asset={asset}
            isForSale
            isCollected
            getAssets={getPrivateAssets}
          />)
        ) : (
          <h4 className="my-5">
            <FormattedMessage id="noDataFound" />
          </h4>
        )
      }

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

export default ProfilePrivate
