import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import './style.scss'
import DataTable from 'admin/shared/components/data-table'
import { getCategories } from 'modules/category/redux/service'
import CategoryItemRow from './category-item-row'
import CategoryCreateModal from './category-create/CategoryCreateModal'

const AdminCategory = () => {
  const dispatch = useDispatch()

  const categoriesStore = useSelector((state) => state?.category?.categories)

  const [requestParams, setRequestParams] = useState({ page: 1, perPage: 10 })
  const [categoryData, setCategoryData] = useState()
  const [totalRecord, setTotalRecord] = useState(0)
  const [columns, setColumns] = useState([{ name: 'name', internalName: 'name', type: 0 }])
  const [showModal, setShowModal] = useState(false)

  function handleHeaderEvent(name, value) {
    switch (name) {
      case 'rows':
        setRequestParams({ ...requestParams, perPage: Number(value) })
        break
      case 'search':
        setRequestParams({ ...requestParams, name: value })
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

  const toggleCategoryCreateModal = () => {
    setShowModal((prev) => !prev)
  }

  useEffect(() => {
    dispatch(getCategories(requestParams))
  }, [requestParams])

  useEffect(() => {
    if (categoriesStore?.category) {
      setCategoryData(categoriesStore?.category)
      setTotalRecord(categoriesStore?.metaData?.totalItems)
    }
  }, [categoriesStore])

  return (
    <>
      <div className="content-headers">
        <h2 className="admin-heading">Categories</h2>
        <button className="mb-3" onClick={() => setShowModal(true)}>
          Create New Category
        </button>
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
              search: true
            }
          }}
          headerEvent={(name, value) => handleHeaderEvent(name, value)}
          pageChangeEvent={handlePageEvent}
          pagination={{ currentPage: requestParams.page, pageSize: requestParams.perPage }}
          actionColumn={true}
        >
          {!categoryData || categoryData.length === 0 ? (
            <div className="data-not-available-container">Sorry, no category matches your query.</div>
          ) : (
            categoryData?.map(({ id, name }, index) => {
              return (
                <CategoryItemRow key={id} index={index} name={name} id={id} page={requestParams.page} perPage={requestParams.perPage} />
              )
            })
          )}
        </DataTable>
      </div>

      <CategoryCreateModal
        title={'Create New Category'}
        show={showModal}
        handleClose={toggleCategoryCreateModal}
        page={requestParams.page}
        perPage={requestParams.perPage}
      />
    </>
  )
}

export default AdminCategory
