import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import './style.scss'
import DataTable from 'admin/shared/components/data-table'
import AssetItemRow from './asset-item-row'
import { adminGetAssets } from 'admin/modules/assetManagement/redux/service'
import { appendParams } from 'shared/utils'
import Drawer from 'admin/shared/components/drawer'
import AssetFilter from './asset-filter'
import { useSearchParams } from 'react-router-dom'

const AdminAssets = () => {
  const dispatch = useDispatch()

  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams()
  const [requestParams, setRequestParams] = useState({ page: 1, perPage: 10 })
  const [assetData, setAssetData] = useState()
  const [totalRecord, setTotalRecord] = useState(0)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const adminAssetStore = useSelector((state) => state.adminAssetManagement.getAdminAssets)

  const [columns, setColumns] = useState([
    { name: 'name', internalName: 'name', type: 0 },
    { name: 'Blockchain Network', internalName: 'blockchainNetwork', type: 0 },
    { name: 'filetype', internalName: 'filetype', type: 0 },
    { name: 'asset type', internalName: 'assetType', type: 0 },
    { name: 'approve/reject', internalName: 'approveReject', type: 0 }
  ])

  useEffect(() => {
    dispatch(adminGetAssets(requestParams))
  }, [requestParams])

  useEffect(() => {
    if (adminAssetStore?.assetManagement) {
      setAssetData(adminAssetStore?.assetManagement)
      setTotalRecord(adminAssetStore?.metaData?.totalItems)
    }
  }, [adminAssetStore])

  function handleHeaderEvent(name, value) {
    switch (name) {
      case 'rows':
        setRequestParams({ ...requestParams, perPage: Number(value) })
        break
      case 'search':
        setRequestParams({ ...requestParams, name: value })
        break
      case 'filter':
        setIsFilterOpen(value)
        break
      default:
        break
    }
  }

  const setSortType = (data, fieldName) => {
    return data.map((data) => {
      if (data.internalName === fieldName) {
        data.type = data.type === 1 ? -1 : 1
      } else {
        data.type = 0
      }
      return data
    })
  }

  function handleSort(field) {
    if (field.internalName === 'name') {
      setRequestParams({ ...requestParams, sortColumn: field.internalName, sortOrder: field.type === 1 ? -1 : 1 })
      const data = setSortType(columns, field.internalName)
      setColumns(data)
    }
  }

  function handlePageEvent(page) {
    setRequestParams({ ...requestParams, page: page })
  }

  const handleFilterChange = (data) => {
    let reqParams = { ...requestParams }

    if (data?.isPhysical === true || data?.isPhysical === false) {
      reqParams = { ...reqParams, isPhysical: data.isPhysical }
      appendParams({ isPhysical: data.isPhysical })
    }

    if (data?.createdFromDate) {
      reqParams = { ...reqParams, createdFrom: data.createdFromDate }
      appendParams({ createdFrom: data.createdFromDate })
    }

    if (data?.createdToDate) {
      reqParams = { ...reqParams, createdTo: data.createdToDate }
      appendParams({ createdTo: data.createdToDate })
    }

    if (data?.categoryId?.value) {
      reqParams = { ...reqParams, categoryId: data?.categoryId?.value }
      appendParams({ categoryId: data?.categoryId?.value })
    } else {
      reqParams = { ...reqParams, categoryId: '' }
      appendParams({ categoryId: '' })
    }

    if (data?.mediaType?.value) {
      reqParams = { ...reqParams, mediaType: data?.mediaType?.value }
      appendParams({ mediaType: data?.mediaType?.value })
    } else {
      reqParams = { ...reqParams, mediaType: '' }
      appendParams({ mediaType: '' })
    }

    if (data?.fileType?.value) {
      reqParams = { ...reqParams, fileType: data?.fileType?.value }
      appendParams({ fileType: data?.fileType?.value })
    } else {
      reqParams = { ...reqParams, fileType: '' }
      appendParams({ fileType: '' })
    }

    if (data?.currencyType?.value) {
      reqParams = { ...reqParams, currencyType: data?.currencyType?.value }
      appendParams({ currencyType: data?.currencyType?.value })
    } else {
      reqParams = { ...reqParams, currencyType: '' }
      appendParams({ currencyType: '' })
    }

    if (data?.blockchainNetwork?.value) {
      reqParams = { ...reqParams, blockchainNetwork: data?.blockchainNetwork?.value }
      appendParams({ blockchainNetwork: data?.blockchainNetwork?.value })
    } else {
      reqParams = { ...reqParams, blockchainNetwork: '' }
      appendParams({ blockchainNetwork: '' })
    }

    if (data?.isExclusive !== null) {
      reqParams = { ...reqParams, isExclusive: data.isExclusive }
      appendParams({ isExclusive: data.isExclusive })
    } else {
      reqParams = { ...reqParams, isExclusive: '' }
      appendParams({ isExclusive: '' })
    }

    setRequestParams(reqParams)
    setIsFilterOpen(!isFilterOpen)
  }

  useEffect(() => {
    if (window.performance) {
      if (performance.navigation.type === 1) {
        setSearchParams('')
      }
    }
  }, [])

  return (
    <>
      <div className="content-headers">
        <h2 className="admin-heading">Assets</h2>
      </div>

      <div className="assets-section">
        <DataTable
          className="asset-list"
          columns={columns}
          sortEvent={handleSort}
          totalRecord={totalRecord}
          header={{
            left: {
              rows: true
            },
            right: {
              search: true,
              filter: true
            }
          }}
          headerEvent={(name, value) => handleHeaderEvent(name, value)}
          pageChangeEvent={handlePageEvent}
          pagination={{ currentPage: requestParams.page, pageSize: requestParams.perPage }}
          actionColumn={true}
        >
          {!assetData || assetData.length === 0 ? (
            <div className="data-not-available-container">Sorry, no assets matches your query.</div>
          ) : (
            assetData?.map((asset, index) => {
              return <AssetItemRow key={asset.id} index={index} asset={asset} />
            })
          )}
        </DataTable>
        <Drawer className="drawer" isOpen={isFilterOpen} onClose={() => setIsFilterOpen(!isFilterOpen)} title="filter">
          <AssetFilter
            filterChange={handleFilterChange}
            defaultValue={requestParams}
            onReset
            requestParams={requestParams}
            setRequestParams={setRequestParams}
          />
        </Drawer>
      </div>
    </>
  )
}

export default AdminAssets
